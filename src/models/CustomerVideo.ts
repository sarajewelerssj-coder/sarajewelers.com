import mongoose from 'mongoose'

const CustomerVideoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  cloudinaryId: { type: String, required: true },
  position: { type: Number, required: true, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
})

export default mongoose.models.CustomerVideo || mongoose.model('CustomerVideo', CustomerVideoSchema)