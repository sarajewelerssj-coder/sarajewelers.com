import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  image: {
    type: String,
  },
  imagePublicId: {
    type: String,
  },
  provider: {
    type: String,
    default: 'google',
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  verificationOtp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otpAttempts: {
    type: Number,
    default: 0,
  },
  lastOtpAttempt: {
    type: Date,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'sub-admin'],
    default: 'user',
  },
}, {
  timestamps: true,
})

export default mongoose.models.User || mongoose.model('User', UserSchema)