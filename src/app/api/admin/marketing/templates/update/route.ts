import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/mongodb'
import EmailTemplate from '@/models/EmailTemplate'

// Force update all email templates to new versions
export async function POST() {
  try {
    await dbConnect()
    
    // Delete all existing templates
    await EmailTemplate.deleteMany({})
    
    // Insert new templates
    const newTemplates = [
      {
        name: 'welcome_greetings',
        subject: 'Welcome to {{companyName}} - Your Luxury Journey Begins',
        body: '<h1>✨ Welcome to {{companyName}}!</h1>\n<p>Hi <strong>{{name}}</strong>,</p>\n<p>Thank you for joining our exclusive family of fine jewelry enthusiasts. We\'re absolutely thrilled to have you with us and excited to accompany you on your journey to finding the perfect piece.</p>\n<div class="divider"></div>\n<p style="text-align: center; font-size: 17px; color: #666;">Explore our curated collections of timeless elegance and contemporary masterpieces, each piece crafted with exceptional artistry.</p>\n<div style="text-align: center;">\n  <a href="https://sarajewelers.com/shop" class="button-gold">Discover Collections</a>\n</div>\n<div class="info-box">\n  <p><strong>🎁 Welcome Gift:</strong> Enjoy exclusive member pricing on your first purchase!</p>\n  <p><strong>💎 Premium Service:</strong> Complimentary consultation with our jewelry experts</p>\n</div>\n<p>If you have any questions, our dedicated team is always here to help you find perfection.</p>\n<p>Best Regards,<br/><strong>The {{companyName}} Team</strong></p>',
        placeholders: ['name', 'companyName'],
        type: 'system'
      },
      {
        name: 'order_confirmation',
        subject: 'Order Confirmed #{{orderId}} - {{companyName}}',
        body: '<h1>🎉 Order Confirmed!</h1>\n<p>Hi <strong>{{name}}</strong>,</p>\n<p>We\'ve received your order <strong class="highlight">#{{orderId}}</strong> and are preparing it with the utmost care and attention to detail.</p>\n<div class="info-box">\n  <p><strong>Order Number:</strong> #{{orderId}}</p>\n  <p><strong>Order Total:</strong> <span class="highlight">${{total}}</span></p>\n  <p><strong>Status:</strong> <span style="color: #10b981; font-weight: 700;">✓ Processing</span></p>\n  <p><strong>Estimated Delivery:</strong> {{deliveryDate}}</p>\n</div>\n<p>Your order is being carefully prepared by our skilled artisans. We\'ll notify you as soon as it ships!</p>\n<div style="text-align: center;">\n  <a href="https://sarajewelers.com/account/orders/{{orderId}}" class="button">Track Your Order</a>\n</div>\n<p style="text-align: center; font-size: 14px; color: #888; margin-top: 25px;">Thank you for choosing {{companyName}}. Each piece tells a story of timeless elegance.</p>',
        placeholders: ['name', 'orderId', 'total', 'deliveryDate', 'companyName'],
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
        name: 'new_product_offer',
        subject: '✨ {{productName}} - Exclusive New Arrival at {{companyName}}',
        body: '<h1>💎 Introducing Our Latest Masterpiece</h1>\n<p>Hi <strong>{{name}}</strong>,</p>\n<p>We\'re absolutely thrilled to unveil <strong class="highlight">{{productName}}</strong>, a stunning addition to our collection, crafted with exceptional artistry just for you.</p>\n<div class="divider"></div>\n<div style="text-align: center; margin: 30px 0;">\n  <img src="{{productImage}}" alt="{{productName}}" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);" />\n</div>\n<div style="text-align: center; margin: 25px 0;">\n  <div style="font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">Exclusive Price</div>\n  <div class="price-tag">{{productPrice}}</div>\n</div>\n<div class="info-box">\n  <p><strong>🎁 Launch Special:</strong> Limited time exclusive pricing for our valued members</p>\n  <p><strong>⭐ Premium Quality:</strong> Meticulously crafted with authentic materials</p>\n  <p><strong>🚀 Limited Stock:</strong> Reserve yours before it\'s gone</p>\n</div>\n<p>Each piece in our collection is designed to capture elegance and timeless beauty. From classic designs to contemporary styles, there\'s something extraordinary waiting for you.</p>\n<div style="text-align: center; margin: 35px 0;">\n  <a href="{{productLink}}" class="button-gold">View This Masterpiece</a>\n</div>\n<p style="text-align: center; color: #999; font-size: 14px;">Don\'t miss this exclusive opportunity. Shop online or visit our showroom today!</p>\n<p>With premium regards,<br/><strong>The {{companyName}} Collection Team</strong></p>',
        placeholders: ['name', 'productName', 'productImage', 'productPrice', 'productLink', 'companyName'],
        type: 'marketing'
      },
      {
        name: 'review_request',
        subject: '💎 Share Your {{companyName}} Experience - Order #{{orderId}}',
        body: '<h1>⭐ We\'d Love Your Feedback!</h1>\n<p>Hi <strong>{{name}}</strong>,</p>\n<p>Thank you for choosing {{companyName}}. We hope you\'re absolutely in love with your <strong>{{productName}}</strong>!</p>\n<div style="text-align: center; margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #fffef5 0%, #fffbeb 100%); border-radius: 14px;">\n  <div style="font-size: 48px; margin-bottom: 10px;">⭐⭐⭐⭐⭐</div>\n  <div style="font-size: 16px; color: #666; font-weight: 600;">How would you rate your experience?</div>\n</div>\n<p>Your opinion means the world to us! We strive for perfection in every piece and every interaction. Would you mind taking a moment to share your experience?</p>\n<div class="info-box">\n  <p><strong>Order Number:</strong> #{{orderId}}</p>\n  <p><strong>Product:</strong> {{productName}}</p>\n</div>\n<p>Your honest feedback helps us maintain our standard of excellence and helps other jewelry enthusiasts make confident purchasing decisions.</p>\n<div style="text-align: center; margin: 35px 0;">\n  <a href="{{reviewLink}}" class="button-gold">Write Your Review</a>\n</div>\n<p style="text-align: center; font-size: 14px; color: #888;">As a thank you, you\'ll receive bonus loyalty points upon review submission! 🎁</p>\n<p>Thank you for being part of our story,<br/><strong>{{companyName}} Customer Care</strong></p>',
        placeholders: ['name', 'productName', 'orderId', 'reviewLink', 'companyName'],
        type: 'marketing'
      },
      {
        name: 'payment_reminder',
        subject: '⚠️ Action Required: Complete Payment for Order #{{orderId}}',
        body: '<h1>💳 Payment Pending</h1>\n<p>Hi <strong>{{name}}</strong>,</p>\n<p>This is a gentle reminder that we haven\'t received payment for your order <strong class="highlight">#{{orderId}}</strong> yet.</p>\n<div class="info-box" style="border-left-color: #f59e0b; background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);">\n  <p><strong>Order Number:</strong> #{{orderId}}</p>\n  <p><strong>Total Due:</strong> <span class="highlight" style="font-size: 24px;">${{total}}</span></p>\n  <p><strong>Payment Deadline:</strong> <span style="color: #f59e0b; font-weight: 700;">{{dueDate}}</span></p>\n  <p><strong>Status:</strong> <span style="color: #f59e0b; font-weight: 700;">⏳ Awaiting Payment</span></p>\n</div>\n<p>To secure your items and ensure timely delivery, please complete your bank transfer and upload the receipt using the link below:</p>\n<div style="text-align: center; margin: 35px 0;">\n  <a href="{{paymentLink}}" class="button" style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white !important; box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);">Complete Payment Now</a>\n</div>\n<div style="background: #fef3c7; padding: 20px; border-radius: 12px; border: 1px solid #fde047; margin: 25px 0;">\n  <p style="margin: 0; font-size: 14px; color: #854d0e;"><strong>⚡ Important:</strong> Orders with pending payments may be canceled after the deadline to free up inventory for other customers.</p>\n</div>\n<p>If you\'ve already sent the payment, please disregard this message. Our team is working to verify all transactions.</p>\n<p style="font-size: 14px; color: #888; margin-top: 25px;"><strong>Need help?</strong> Our payment support team is ready to assist you with any questions.</p>\n<p>Best Regards,<br/><strong>{{companyName}} Sales Team</strong></p>',
        placeholders: ['name', 'orderId', 'total', 'dueDate', 'paymentLink', 'companyName'],
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
    
    await EmailTemplate.insertMany(newTemplates)
    
    return NextResponse.json({ 
      success: true, 
      message: 'All email templates updated successfully!',
      count: newTemplates.length 
    })
  } catch (error) {
    console.error('Template Update Error:', error)
    return NextResponse.json({ error: 'Failed to update templates' }, { status: 500 })
  }
}
