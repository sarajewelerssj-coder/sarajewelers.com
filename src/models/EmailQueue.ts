import mongoose from 'mongoose'

const EmailQueueSchema = new mongoose.Schema({
  to: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'sent', 'failed'],
    default: 'pending',
  },
  attempts: {
    type: Number,
    default: 0,
  },
  lastError: {
    type: String,
  },
  scheduledAt: {
    type: Date,
    default: Date.now,
  },
  sentAt: {
    type: Date,
  },
}, {
  timestamps: true,
})

// Index for efficient polling
EmailQueueSchema.index({ status: 1, scheduledAt: 1 })

export default mongoose.models.EmailQueue || mongoose.model('EmailQueue', EmailQueueSchema)
