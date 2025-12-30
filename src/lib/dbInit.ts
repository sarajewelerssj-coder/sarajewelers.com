import { dbConnect } from './mongodb'
import User from '@/models/User'
import EmailTemplate from '@/models/EmailTemplate'
import Settings from '@/models/Settings'
import Category from '@/models/Category'
import bcrypt from 'bcryptjs'

// This function will now be called manually via a secure API route for seeding/init
export async function initializeDatabase() {
  return performInitialization()
}

async function performInitialization() {
  try {
    console.log('[DB Init] 🚀 Starting database initialization check...')
    await dbConnect()
    
    // Ensure vital models are initialized (indexes, etc)
    await Promise.all([
      User.init(),
      EmailTemplate.init(),
      Settings.init(),
      Category.init()
    ])

    // ATOMIC LOCK: Only one process can move from dbSeeded: 'false' to 'true'
    const lock = await Settings.findOneAndUpdate(
      { dbSeeded: { $nin: ['true', 'initializing'] } },
      { $set: { dbSeeded: 'initializing' } },
      { new: true, upsert: false }
    )

    if (!lock) {
      // If no lock was found, check if it's already true
      const settings = await Settings.findOne({ dbSeeded: 'true' })
      if (settings) {
        console.log('[DB Init] ℹ️  Database already seeded, skipping')
        return
      }
      // If it's 'initializing', we skip and let the winner finish
      console.log('[DB Init] ℹ️  Initialization already in progress or complete, skipping')
      return
    }

    console.log('[DB Init] 🔨 First-time initialization starting...')
    
    await Promise.all([
      createAdminAccount(),
      seedEmailTemplates(),
      seedSettingsInternal(),
      seedCategories()
    ])

    // Finalize the lock
    await Settings.findOneAndUpdate({}, { dbSeeded: 'true' })
    
    console.log('[DB Init] ✅ Database initialization complete!')
  } catch (error) {
    console.error('[DB Init] ❌ Initialization failed:', error)
    // Attempt to reset lock on failure so it can retry
    await Settings.findOneAndUpdate({ dbSeeded: 'initializing' }, { dbSeeded: 'false' })
    
    throw error
  }
}

async function seedSettingsInternal() {
  try {
    const data = {
      companyName: process.env.COMPANY_NAME || 'Sara Jewelers',
      companyLogo: process.env.NEXT_PUBLIC_LOGO_URL || 'https://sarajeweler.com/logo.webp',
      contactEmail: process.env.EMAIL_USER || 'S.wcollections2@gmail.com',
    }
    
    // Always update/upsert initial settings
    await Settings.findOneAndUpdate({}, { $setOnInsert: data }, { upsert: true })
    console.log('[DB Init] ✅ Initial settings ensured')
  } catch (error) {
    console.error('[DB Init] Failed to seed initial settings:', error)
  }
}

async function createAdminAccount() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@sarajewelers.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123'
    const adminName = process.env.ADMIN_NAME || 'Admin'
    
    // Use findOneAndUpdate with $setOnInsert for idempotent creation
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    
    const result = await User.findOneAndUpdate(
      { email: adminEmail },
      { 
        $setOnInsert: {
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: 'admin',
          isVerified: true,
          provider: 'credentials'
        }
      },
      { upsert: true, new: true, rawResult: true }
    )
    
    if (result.lastErrorObject?.updatedExisting) {
      console.log('[DB Init] ℹ️  Admin account already exists')
    } else {
      console.log(`[DB Init] ✅ Admin account created: ${adminEmail}`)
    }
  } catch (error) {
    if ((error as any).code === 11000) {
      console.log('[DB Init] ℹ️  Admin account collision handled')
    } else {
      console.error('[DB Init] Failed to create admin:', error)
    }
  }
}

async function seedEmailTemplates() {
  try {
    const templates = [
      {
        name: 'welcome_greetings',
        subject: 'Welcome to {{companyName}} - Your Luxury Journey Begins',
        body: '<h1>✨ Welcome to {{companyName}}!</h1>\n<p>Hi <strong>{{name}}</strong>,</p>\n<p>Thank you for joining our exclusive family of fine jewelry enthusiasts. We\'re absolutely thrilled to have you with us and excited to accompany you on your journey to finding the perfect piece.</p>\n<div class="divider"></div>\n<p style="text-align: center; font-size: 17px; color: #666;">Explore our curated collections of timeless elegance and contemporary masterpieces, each piece crafted with exceptional artistry.</p>\n<div style="text-align: center;">\n  <a href="https://sarajewelers.com/shop" class="button-gold">Discover Collections</a>\n</div>\n<div class="info-box">\n  <p><strong>🎁 Welcome Gift:</strong> Enjoy exclusive member pricing on your first purchase!</p>\n  <p><strong>💎 Premium Service:</strong> Complimentary consultation with our jewelry experts</p>\n</div>\n<p>If you have any questions, our dedicated team is always here to help you find perfection.</p>\n<p>Best Regards,<br/><strong>The {{companyName}} Team</strong></p>',
        placeholders: ['name', 'companyName'],
        type: 'system'
      },
      {
        name: 'email_verification',
        subject: 'Verification Code: {{otp}}',
        body: '<h1>🔐 Verify Your Account</h1>\n<p>Hi <strong>{{name}}</strong>,</p>\n<p>Welcome to {{companyName}}! Please use the verification code below to complete your account setup and unlock exclusive benefits.</p>\n<div class="otp-container">\n  <span class="otp-label">Your Verification Code</span>\n  <span class="otp-code">{{otp}}</span>\n  <div class="otp-validity">⏱ Valid for 10 minutes</div>\n</div>\n<p style="background: #fff9e6; padding: 15px; border-radius: 10px; border-left: 3px solid #d4af37; font-size: 14px;">\n  <strong>🛡️ Security Note:</strong> If you didn\'t request this code, please ignore this email. Your account security is our top priority.\n</p>\n<p>Once verified, you\'ll have full access to your account and exclusive member benefits.</p>\n<p>Stay Secure,<br/><strong>{{companyName}} Security Team</strong></p>',
        placeholders: ['name', 'otp', 'companyName'],
        type: 'system'
      },
      {
        name: 'password_reset',
        subject: 'Password Reset Code - {{companyName}} Security',
        body: '<h1>🔒 Password Reset Request</h1>\n<p>Hi <strong>{{name}}</strong>,</p>\n<p>We received a request to reset your password for your {{companyName}} account. Use the verification code below to create a new password:</p>\n<div class="otp-container">\n  <span class="otp-label">Password Reset Code</span>\n  <span class="otp-code">{{otp}}</span>\n  <div class="otp-validity">⏱ Expires in 10 minutes</div>\n</div>\n<div style="background: #fef2f2; padding: 18px; border-radius: 10px; border-left: 3px solid #dc2626; margin: 25px 0;">\n  <p style="margin: 0; font-size: 14px; color: #991b1b;"><strong>🛡️ Security Alert:</strong> If you didn\'t request this password reset, please ignore this email and ensure your account is secure. Your password will not be changed.</p>\n</div>\n<p>For your security:</p>\n<ul style="color: #666; font-size: 15px; line-height: 1.8;">\n  <li>Never share your verification code with anyone</li>\n  <li>We\'ll never ask for your password via email</li>\n  <li>Create a strong, unique password for your account</li>\n</ul>\n<p>Stay Secure,<br/><strong>{{companyName}} Security Team</strong></p>',
        placeholders: ['name', 'otp', 'companyName'],
        type: 'system'
      }
    ]

    // Idempotent bulk operation
    const operations = templates.map(t => ({
      updateOne: {
        filter: { name: t.name },
        update: { $set: t },
        upsert: true
      }
    }))
    
    await EmailTemplate.bulkWrite(operations)
    console.log(`[DB Init] ✅ Seeded/Updated ${templates.length} email templates`)
  } catch (error) {
    console.error('[DB Init] Failed to seed templates:', error)
  }
}

async function seedCategories() {
  const permanentCategories = [
    {
      name: 'Engagement Rings',
      slug: 'engagement-rings',
      description: 'Beautiful engagement rings to celebrate your love story',
      image: '/images/categories/Engangement rings.webp',
      isPermanent: true,
      isActive: true
    },
    {
      name: 'Fine Jewelry',
      slug: 'fine-jewelry',
      description: 'Exquisite fine jewelry pieces crafted with precision',
      image: '/images/categories/fine jewelery.webp',
      isPermanent: true,
      isActive: true
    },
    {
      name: 'Pendants & Necklaces',
      slug: 'pendants-necklaces',
      description: 'Elegant necklaces and pendants for every occasion',
      image: '/images/categories/neckleses.webp',
      isPermanent: true,
      isActive: true
    },
    {
      name: 'Earrings',
      slug: 'earrings',
      description: 'Stunning earrings to complement your style',
      image: '/images/categories/earrings.webp',
      isPermanent: true,
      isActive: true
    },
    {
      name: 'Bracelets',
      slug: 'bracelets',
      description: 'Beautiful bracelets for elegant wrists',
      image: '/images/categories/braclet.webp',
      isPermanent: true,
      isActive: true
    },
    {
      name: 'Fashion Rings',
      slug: 'fashion-rings',
      description: 'Fashionable rings for every style',
      image: '/images/categories/Wedding rings.webp',
      isPermanent: true,
      isActive: true
    },
  ]

  try {
    const operations = permanentCategories.map(c => ({
      updateOne: {
        filter: { slug: c.slug },
        update: { $set: c },
        upsert: true
      }
    }))
    
    await Category.bulkWrite(operations)
    console.log(`[DB Init] ✅ Seeded/Updated ${permanentCategories.length} categories`)
  } catch (error) {
    console.error('[DB Init] Failed to seed categories:', error)
  }
}

// seedSettings call was moved to seedSettingsInternal



