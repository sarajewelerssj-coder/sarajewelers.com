import mongoose from 'mongoose'

const GallerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], required: true },
  category: { type: String, enum: ['rings', 'necklaces', 'earrings', 'bracelets', 'pendants', 'chains', 'bangles', 'anklets', 'chokers', 'watches', 'brooches', 'cufflinks', 'tiepins', 'charms', 'sets', 'general'], default: 'general' }
}, {
  timestamps: true
})

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema)