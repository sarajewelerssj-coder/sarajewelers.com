import mongoose from 'mongoose'

const ProductImageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['front', 'back', 'gallery'], required: true },
  alt: { type: String },
  isVideo: { type: Boolean, default: false }
})

const ProductReviewSchema = new mongoose.Schema({
  userId: String,
  userEmail: String,
  author: String,
  date: String,
  rating: Number,
  title: String,
  content: String
})

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sku: { type: String, required: true, unique: true },
  categories: [{ type: String, required: true }],
  description: { type: String, required: true },
  longDescription: String,
  price: { type: Number, required: true },
  oldPrice: Number,
  discount: { type: Number, default: 0 },
  shippingPrice: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  sold: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'draft' },
  productType: { type: String },
  images: [ProductImageSchema],
  variations: { type: mongoose.Schema.Types.Mixed, default: {} },
  specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
  isNewProduct: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  reviews: [ProductReviewSchema]
}, {
  timestamps: true,
  suppressReservedKeysWarning: true
})

// Text index for optimized search
ProductSchema.index({ 
  name: 'text', 
  description: 'text', 
  categories: 'text' 
}, {
  weights: {
    name: 10,
    categories: 5,
    description: 1
  },
  name: 'product_search_index'
})

// Generate slug from name before saving
ProductSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }
  next()
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)