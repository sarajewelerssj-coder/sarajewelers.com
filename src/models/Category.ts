import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPermanent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export default mongoose.models.Category || mongoose.model('Category', CategorySchema)