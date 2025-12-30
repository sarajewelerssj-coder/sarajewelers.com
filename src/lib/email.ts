import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
}

const BRAND_COLOR = '#d4af37'
const LOGO_URL = process.env.NEXT_PUBLIC_LOGO_URL || 'https://sarajeweler.com/logo.webp'

const getWrappedHtml = (content: string, title: string, logo: string = '/logo.webp', companyName: string = 'Sara Jewelers') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body { 
      font-family: 'Outfit', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.7; 
      color: #333333; 
      margin: 0; 
      padding: 0; 
      background: linear-gradient(135deg, #f5f7fa 0%, #f0f0f0 100%);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background: linear-gradient(135deg, #f5f7fa 0%, #f0f0f0 100%);
      padding: 50px 20px;
    }
    .main-card {
      max-width: 600px;
      margin: 0 auto;
      background: linear-gradient(to bottom, #ffffff 0%, #fafafa 100%);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
      border: 1px solid rgba(212, 175, 55, 0.1);
    }
    .header {
      padding: 40px 30px;
      text-align: center;
      background: linear-gradient(135deg, #ffffff 0%, #fffef9 100%);
      border-bottom: 2px solid #f8f8f8;
      position: relative;
    }
    .header::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, transparent, #d4af37, transparent);
      border-radius: 2px;
    }
    .logo {
      max-width: 140px;
      height: auto;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.05));
    }
    .content {
      padding: 45px 40px;
      background: #ffffff;
    }
    .footer {
      padding: 35px 30px;
      text-align: center;
      background: linear-gradient(to bottom, #fafafa 0%, #f5f5f5 100%);
      border-top: 1px solid #eeeeee;
      color: #888888;
      font-size: 13px;
    }
    h1 {
      color: #1a1a1a;
      font-size: 28px;
      margin-bottom: 15px;
      font-weight: 700;
      text-align: center;
      letter-spacing: -0.5px;
    }
    h2 {
      color: #2a2a2a;
      font-size: 20px;
      margin-bottom: 12px;
      font-weight: 600;
      letter-spacing: -0.3px;
    }
    p {
      margin-bottom: 16px;
      font-size: 16px;
      color: #555555;
      line-height: 1.8;
    }
    .otp-container {
      margin: 35px 0;
      text-align: center;
      padding: 30px 20px;
      background: linear-gradient(135deg, #fffef5 0%, #fffbeb 100%);
      border: 2px solid #f4e5be;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(212, 175, 55, 0.12);
    }
    .otp-label {
      font-size: 11px;
      text-transform: uppercase;
      color: #a0a0a0;
      letter-spacing: 3px;
      margin-bottom: 15px;
      font-weight: 700;
      display: block;
    }
    .otp-code {
      font-size: 48px;
      font-weight: 900;
      letter-spacing: 14px;
      color: #d4af37;
      margin: 10px 0;
      font-family: 'Courier New', monospace;
      text-shadow: 0 2px 4px rgba(212, 175, 55, 0.2);
      display: block;
    }
    .otp-validity {
      font-size: 12px;
      color: #999;
      margin-top: 12px;
      font-weight: 500;
    }
    .button {
      display: inline-block;
      padding: 16px 40px;
      background: linear-gradient(135deg, #000000 0%, #2a2a2a 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 700;
      font-size: 15px;
      margin: 25px 0;
      text-align: center;
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .button-gold {
      background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
      color: #000000 !important;
      box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3);
    }
    .info-box {
      background: linear-gradient(135deg, #f9f9f9 0%, #f5f5f5 100%);
      padding: 25px;
      border-radius: 14px;
      margin: 25px 0;
      border-left: 4px solid #d4af37;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .info-box p {
      margin-bottom: 8px;
      font-size: 15px;
    }
    .info-box strong {
      color: #1a1a1a;
      font-weight: 700;
    }
    .highlight {
      color: #d4af37;
      font-weight: 700;
    }
    .price-tag {
      font-size: 32px;
      font-weight: 800;
      color: #1a1a1a;
      margin: 20px 0;
      text-align: center;
      display: block;
    }
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
      margin: 30px 0;
    }
    .luxury-text {
      color: #d4af37;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-size: 11px;
      margin-top: 10px;
    }
    .footer-links {
      margin-top: 15px;
      font-size: 12px;
    }
    .footer-links a {
      color: #666;
      text-decoration: none;
      margin: 0 8px;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 25px !important;
      }
      .header {
        padding: 30px 20px !important;
      }
      h1 {
        font-size: 24px !important;
      }
      .otp-code {
        font-size: 36px !important;
        letter-spacing: 10px !important;
      }
      .button {
        padding: 14px 30px !important;
        font-size: 14px !important;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      <div class="header">
        <img src="${logo.startsWith('http') ? logo : 'https://sarajeweler.com/logo.webp'}" alt="${companyName}" class="logo">
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p style="margin: 0; margin-bottom: 5px;">&copy; ${new Date().getFullYear()} ${companyName}. All Rights Reserved.</p>
        <div class="luxury-text">Luxury Jewellery & Timepieces</div>
        <div class="footer-links">
          <a href="https://sarajeweler.com">Visit Store</a> • 
          <a href="mailto:contact@sarajeweler.com">Contact Us</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`

import EmailTemplate from '@/models/EmailTemplate'
import EmailQueue from '@/models/EmailQueue'
import Settings from '@/models/Settings'
import { dbConnect } from './mongodb'

export async function sendEmail({ to, subject, html }: EmailOptions) {
  await dbConnect()
  let settings = await Settings.findOne()
  
  // Prioritize settings logo, then env, then default hosted one
  const logoUrl = settings?.companyLogo || process.env.NEXT_PUBLIC_LOGO_URL || 'https://sarajeweler.com/logo.webp'
  const companyName = settings?.companyName || 'Sara Jewelers'

  const mailOptions = {
    from: `"${companyName}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: getWrappedHtml(html, subject, logoUrl, companyName),
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent: ' + info.response)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email Error:', error)
    throw error
  }
}

interface OTPOptions {
  to: string
  name: string
  otp: string
  templateName: 'email_verification' | 'password_reset'
}

/**
 * Standardized function to send OTP emails using database templates
 */
export async function sendOTP({ to, name, otp, templateName }: OTPOptions) {
  await dbConnect()
  
  try {
    let template = await EmailTemplate.findOne({ name: templateName })
    
    // Fetch company name from settings
    const settings = await Settings.findOne()
    const companyName = settings?.companyName || 'Sara Jewelers'
    
    // Fallbacks if template is missing from DB
    if (!template) {
      if (templateName === 'password_reset') {
        template = {
          subject: `Reset Your Password - ${companyName}`,
          body: `<h1>Password Reset Request</h1><p>Hi {{name}},</p><p>Use the code below to reset your password:</p><div class="otp-container"><div class="otp-code">{{otp}}</div></div>`
        }
      } else {
        template = {
          subject: 'Verification Code: {{otp}}',
          body: `<h1>Verify Your Account</h1><p>Hi {{name}},</p><p>Use the code below to verify your account:</p><div class="otp-container"><div class="otp-code">{{otp}}</div></div>`
        }
      }
    }

    const html = template.body
      .replace(/{{name}}/g, name)
      .replace(/{{otp}}/g, otp)
      .replace(/{{companyName}}/g, companyName)

    const subject = template.subject
      .replace(/{{otp}}/g, otp)
      .replace(/{{companyName}}/g, companyName)

    return await sendEmail({ to, subject, html })
  } catch (error) {
    console.error(`Failed to send ${templateName} email:`, error)
    throw error
  }
}

/**
 * Sends a luxury-themed greetings email to new Google users
 */
export async function sendGreetingsEmail(to: string, name: string) {
  await dbConnect()
  try {
    const settings = await Settings.findOne()
    const companyName = settings?.companyName || 'Sara Jewelers'
    
    const subject = `Welcome to the World of Luxury, ${name}!`
    const html = `
      <div style="text-align: center;">
        <h1 style="color: #d4af37; font-size: 32px; margin-bottom: 20px;">Welcome to ${companyName}</h1>
        <p style="font-size: 18px; color: #333; margin-bottom: 25px;">We're delighted to have you join our exclusive community of jewelry enthusiasts.</p>
        <div class="divider"></div>
        <p style="font-size: 16px; color: #555; line-height: 1.8;">
          At ${companyName}, we believe that every piece of jewelry tells a story. 
          By continuing with Google, you've gained access to our premium collections, 
          exclusive designs, and personalized shopping experience.
        </p>
        <div style="margin: 40px 0;">
          <a href="${process.env.NEXTAUTH_URL || 'https://sarajeweler.com'}" class="button button-gold">Start Exploring Our Collections</a>
        </div>
        <div class="info-box">
          <p><strong>What's Next?</strong></p>
          <p>• Browse our exquisite <a href="${process.env.NEXTAUTH_URL}/categories/engagement-rings" style="color: #d4af37;">Engagement Rings</a></p>
          <p>• Discover our <a href="${process.env.NEXTAUTH_URL}/categories/fine-jewelry" style="color: #d4af37;">Fine Jewelry</a></p>
          <p>• Create something unique in our <a href="${process.env.NEXTAUTH_URL}/custom-design" style="color: #d4af37;">Design Studio</a></p>
        </div>
        <p style="font-size: 14px; color: #888; margin-top: 30px;">
          If you have any questions, our concierge team is always here to help.
        </p>
      </div>
    `

    return await sendEmail({ to, subject, html })
  } catch (error) {
    console.error('Failed to send greetings email:', error)
    // Don't throw error to avoid blocking the login flow
  }
}

/**
 * Persists emails to the database queue and begins processing.
 */
export async function sendBulkEmails(emails: { to: string, subject: string, body: string }[], delayMs: number = 3000) {
  await dbConnect()
  
  // 1. Persist all tasks to DB
  const queueItems = emails.map(email => ({
    to: email.to,
    subject: email.subject,
    body: email.body,
    status: 'pending'
  }))
  
  await EmailQueue.insertMany(queueItems)
  console.log(`[Queue] Added ${emails.length} items to database queue.`)

  // 2. Trigger processing loop (fire and forget)
  processEmailQueue(delayMs).catch(err => console.error('[Queue Processor Error]:', err))

  return { success: true, count: emails.length }
}

/**
 * Background-style loop that processes pending items in the database queue one by one.
 */
export async function processEmailQueue(delayMs: number = 3000) {
  await dbConnect()
  
  // Find a pending item
  const item = await EmailQueue.findOneAndUpdate(
    { status: 'pending', scheduledAt: { $lte: new Date() } },
    { status: 'processing' },
    { sort: { scheduledAt: 1 }, new: true }
  )

  if (!item) {
    console.log('[Queue] No pending emails to process.')
    return
  }

  console.log(`[Queue] Processing email to ${item.to}...`)

  try {
    const wrappedBody = item.body.replace(/\n/g, '<br/>')
    await sendEmail({
      to: item.to,
      subject: item.subject,
      html: wrappedBody
    })

    await EmailQueue.findByIdAndUpdate(item._id, { 
      status: 'sent', 
      sentAt: new Date(),
      attempts: item.attempts + 1 
    })
    
    console.log(`[Queue] Successfully sent to ${item.to}`)
  } catch (error) {
    console.error(`[Queue] Failed to send to ${item.to}:`, error)
    
    const nextAttempt = new Date()
    nextAttempt.setMinutes(nextAttempt.getMinutes() + 5) // Retry in 5 mins

    await EmailQueue.findByIdAndUpdate(item._id, { 
      status: item.attempts >= 3 ? 'failed' : 'pending', // Max 3 retires
      attempts: item.attempts + 1,
      lastError: String(error),
      scheduledAt: nextAttempt
    })
  }

  // Mandatory delay before next item
  await new Promise(resolve => setTimeout(resolve, delayMs))

  // Recursive call to process next item
  return processEmailQueue(delayMs)
}
