import mongoose from 'mongoose'

const CustomDesignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  stoneType: { type: String, required: true },
  jewelryTypes: [{ type: String, required: true }],
  metalType: { type: String, required: true },
  budget: { type: String, required: true },
  comments: { type: String },
  images: [{ type: String }], // Array of Cloudinary URLs
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'contacted', 'completed', 'cancelled'], 
    default: 'pending' 
  }
}, {
  timestamps: true
})

export default mongoose.models.CustomDesign || mongoose.model('CustomDesign', CustomDesignSchema)
