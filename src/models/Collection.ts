import mongoose, { Schema, Document } from 'mongoose'

export interface ICollection extends Document {
  id: string
  name: string
  type: 'feature' | 'gifts' | 'shop-by-category'
  products: {
    productId: mongoose.Types.ObjectId | string
    productName: string
    sku: string
    price: number
    image?: string
  }[]
  categories: {
    categoryId: mongoose.Types.ObjectId | string
    categoryName: string
    slug: string
    description?: string
    image: string
  }[]
  isActive: boolean
}

const CollectionSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['feature', 'gifts', 'shop-by-category'] 
  },
  products: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    sku: { type: String },
    price: { type: Number },
    image: { type: String }
  }],
  categories: [{
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    categoryName: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

// Force model recompilation in dev to ensure schema updates are applied
if (process.env.NODE_ENV === 'development' && mongoose.models.Collection) {
  delete mongoose.models.Collection
}

export default mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema)
