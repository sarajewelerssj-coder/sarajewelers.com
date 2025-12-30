import mongoose from 'mongoose'

const SettingsSchema = new mongoose.Schema({
  standardShippingFee: {
    type: Number,
    required: true,
    default: 0
  },
  freeShippingThreshold: {
    type: Number,
    required: true,
    default: 0
  },
  companyName: {
    type: String,
    default: 'Sara Jewelers'
  },
  companyLogo: {
    type: String,
    default: '/logo.webp'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  dbSeeded: {
    type: String,
    default: 'false'
  }
}, {
  timestamps: true
})

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema)
