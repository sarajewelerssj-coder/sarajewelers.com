import { MongoClient } from 'mongodb'
import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const dbName = process.env.MONGODB_DB || 'sara_jewelers_demo'

// MongoDB Client
let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

// Mongoose Connection
let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName,
      maxPoolSize: 10,
    }

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log('✨ MongoDB Connected via Mongoose')
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error('❌ Mongoose connection error:', e)
    throw e
  }

  return cached.conn
}

export { clientPromise, dbConnect }
export const connectDB = dbConnect
export default dbConnect