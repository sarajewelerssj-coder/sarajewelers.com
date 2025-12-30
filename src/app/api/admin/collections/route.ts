import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Collection from '@/models/Collection'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const collections = await Collection.find({}).lean()
    
    // If no collections exist, initialize them (first time)
    if (collections.length === 0) {
      const initialCollections = [
        { id: 'feature', name: 'Feature Products', type: 'feature', products: [], categories: [] },
        { id: 'gifts', name: 'Gifts Collection', type: 'gifts', products: [], categories: [] },
        { id: 'shop-by-category', name: 'Shop by Category', type: 'shop-by-category', products: [], categories: [] }
      ]
      await Collection.insertMany(initialCollections)
      return NextResponse.json({ success: true, collections: initialCollections })
    }

    return NextResponse.json({ success: true, collections })
  } catch (error) {
    console.error('Error fetching admin collections:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch collections' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const data = await request.json()
    const { id, products, categories } = data

    // Debug logging
    console.log(`[Collection API] Updating collection ${id}`)
    if (products && products.length > 0) {
       console.log(`[Collection API] First product image sample: ${products[0].image}`)
    }

    const collection = await Collection.findOneAndUpdate(
      { id },
      { $set: { products, categories } },
      { new: true, upsert: true }
    )
    
    console.log('[Collection API] Saved collection:', JSON.stringify(collection, null, 2))

    return NextResponse.json({ success: true, collection })
  } catch (error) {
    console.error('Error updating admin collection:', error)
    return NextResponse.json({ success: false, error: 'Failed to update collection' }, { status: 500 })
  }
}
