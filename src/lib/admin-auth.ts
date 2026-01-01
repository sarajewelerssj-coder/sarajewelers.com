import bcrypt from 'bcryptjs'
import { dbConnect } from './mongodb'
import User from '../models/User'

export async function ensureDefaultAdmin() {
  try {
    await dbConnect()
    
    // Create default admin if none exists
    const adminCount = await User.countDocuments({ role: { $in: ['admin', 'sub-admin'] } })
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'sara123123', 12)
      await User.create({
        name: process.env.DEFAULT_ADMIN_NAME || 'Sara Jewelers',
        email: process.env.NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL || 'admin@sarajeweler.com',
        password: hashedPassword,
        role: 'admin', // Main admin role with full permissions
        isVerified: true,
      })
      console.log('✅ Default admin created successfully')
    }
  } catch (error) {
    console.error('Failed to create default admin:', error)
  }
}