import mongoose from 'mongoose'

const EmailTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  placeholders: {
    type: [String],
    default: [],
  },
  type: {
    type: String,
    enum: ['system', 'marketing'],
    default: 'marketing',
  }
}, {
  timestamps: true,
})

export default mongoose.models.EmailTemplate || mongoose.model('EmailTemplate', EmailTemplateSchema)
