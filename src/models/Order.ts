import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  items: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String },
      selectedVariations: { type: Map, of: String }
    }
  ],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  orderStatus: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  },
  paymentMethod: { type: String, default: 'bank_transfer' },
  paymentScreenshot: { type: String }, // Cloudinary URL
  trackingId: { type: String },
  carrier: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)
