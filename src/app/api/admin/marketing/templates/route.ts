import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/mongodb'
import EmailTemplate from '@/models/EmailTemplate'

export async function GET() {
  try {
    await dbConnect()
    
    let templates = await EmailTemplate.find({})
    
    // Migration: Remove deprecated templates
    const deprecated = ['email_verification', 'password_reset']
    const hasDeprecated = templates.some(t => deprecated.includes(t.name))
    
    if (hasDeprecated) {
      await EmailTemplate.deleteMany({ name: { $in: deprecated } })
      templates = templates.filter(t => !deprecated.includes(t.name))
    }
    
    // Migration: Add defaults if missing or empty
    if (templates.length === 0) {
      const defaults = [
        {
          name: 'welcome_greetings',
          subject: 'Welcome to {{companyName}} - Your Luxury Journey Begins',
          body: `<h1>✨ Welcome to {{companyName}}!</h1>
<p>Hi <strong>{{name}}</strong>,</p>
<p>Thank you for joining our exclusive family of fine jewelry enthusiasts. We're absolutely thrilled to have you with us and excited to accompany you on your journey to finding the perfect piece.</p>
<div class="divider"></div>
<p style="text-align: center; font-size: 17px; color: #666;">Explore our curated collections of timeless elegance and contemporary masterpieces, each piece crafted with exceptional artistry.</p>
<div style="text-align: center;">
  <a href="https://sarajeweler.com/products/" class="button-gold">Discover Collections</a>
</div>
<div class="info-box">
  <p><strong>🎁 Welcome Gift:</strong> Enjoy exclusive member pricing on your first purchase!</p>
  <p><strong>💎 Premium Service:</strong> Complimentary consultation with our jewelry experts</p>
</div>
<p>If you have any questions, our dedicated team is always here to help you find perfection.</p>
<p>Best Regards,<br/><strong>The {{companyName}} Team</strong></p>`,
          placeholders: ['name', 'companyName'],
          type: 'system'
        },
        {
          name: 'product_offer',
          subject: 'Special Offer: {{productName}} for You',
          body: `<h1>✨ A Special Offer Just for You</h1>
<p>Hi <strong>{{name}}</strong>,</p>
<p>We noticed you might be interested in our exquisite <strong class="highlight">{{productName}}</strong>. Because we value your taste, we've prepared a special offer.</p>
<p>For a limited time, we invite you to make this masterpiece yours.</p>
<div style="text-align: center; margin: 30px 0;">
  <img src="{{productImage}}" alt="{{productName}}" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);" />
</div>
<div class="info-box">
  <p><strong>💎 Product:</strong> {{productName}}</p>
  <p><strong>✨ Exclusive Detail:</strong> Handcrafted perfection.</p>
</div>
<div style="text-align: center; margin: 35px 0;">
  <a href="{{productLink}}" class="button-gold">View Exclusive Offer</a>
</div>
<p style="text-align: center; font-size: 14px; color: #888;">This offer is available for a limited time.</p>
<p>Warmly,<br/><strong>The {{companyName}} Team</strong></p>`,
          placeholders: ['name', 'productName', 'productImage', 'productLink', 'companyName'],
          type: 'system'
        },
        {
          name: 'order_confirmation',
          subject: 'Order Confirmed #{{orderId}} - {{companyName}}',
          body: `<h1>🎉 Order Confirmed!</h1>
<p>Hi <strong>{{name}}</strong>,</p>
<p>We've received your order <strong class="highlight">#{{orderId}}</strong> and are preparing it with the utmost care and attention to detail.</p>
<div class="info-box">
  <p><strong>Order Number:</strong> #{{orderId}}</p>
  <p><strong>Order Total:</strong> <span class="highlight">\${{total}}</span></p>
  <p><strong>Status:</strong> <span style="color: #10b981; font-weight: 700;">✓ Processing</span></p>
  <p><strong>Estimated Delivery:</strong> {{deliveryDate}}</p>
</div>
<p>Your order is being carefully prepared by our skilled artisans. We'll notify you as soon as it ships!</p>
<div style="text-align: center;">
  <a href="https://sarajeweler.com/account/orders/{{orderId}}" class="button">Track Your Order</a>
</div>
<p style="text-align: center; font-size: 14px; color: #888; margin-top: 25px;">Thank you for choosing {{companyName}}. Each piece tells a story of timeless elegance.</p>`,
          placeholders: ['name', 'orderId', 'total', 'deliveryDate', 'companyName'],
          type: 'system'
        },
        {
          name: 'review_request',
          subject: '💎 Share Your {{companyName}} Experience - Order #{{orderId}}',
          body: `<h1>⭐ We'd Love Your Feedback!</h1>
<p>Hi <strong>{{name}}</strong>,</p>
<p>Thank you for choosing {{companyName}}. We hope you're absolutely in love with your <strong>{{productName}}</strong>!</p>
<div style="text-align: center; margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #fffef5 0%, #fffbeb 100%); border-radius: 14px;">
  <div style="font-size: 48px; margin-bottom: 10px;">⭐⭐⭐⭐⭐</div>
  <div style="font-size: 16px; color: #666; font-weight: 600;">How would you rate your experience?</div>
</div>
<p>Your opinion means the world to us! We strive for perfection in every piece and every interaction. Would you mind taking a moment to share your experience?</p>
<div class="info-box">
  <p><strong>Order Number:</strong> #{{orderId}}</p>
  <p><strong>Product:</strong> {{productName}}</p>
</div>
<p>Your honest feedback helps us maintain our standard of excellence and helps other jewelry enthusiasts make confident purchasing decisions.</p>
<div style="text-align: center; margin: 35px 0;">
  <a href="{{reviewLink}}" class="button-gold">Write Your Review</a>
</div>
<p style="text-align: center; font-size: 14px; color: #888;">As a thank you, you'll receive bonus loyalty points upon review submission! 🎁</p>
<p>Thank you for being part of our story,<br/><strong>{{companyName}} Customer Care</strong></p>`,
          placeholders: ['name', 'productName', 'orderId', 'reviewLink', 'companyName'],
          type: 'marketing'
        },
        {
          name: 'payment_reminder',
          subject: '⚠️ Action Required: Complete Payment for Order #{{orderId}}',
          body: `<h1>💳 Payment Pending</h1>
<p>Hi <strong>{{name}}</strong>,</p>
<p>This is a gentle reminder that we haven't received payment for your order <strong class="highlight">#{{orderId}}</strong> yet.</p>
<div class="info-box" style="border-left-color: #f59e0b; background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);">
  <p><strong>Order Number:</strong> #{{orderId}}</p>
  <p><strong>Total Due:</strong> <span class="highlight" style="font-size: 24px;">\${{total}}</span></p>
  <p><strong>Payment Deadline:</strong> <span style="color: #f59e0b; font-weight: 700;">{{dueDate}}</span></p>
  <p><strong>Status:</strong> <span style="color: #f59e0b; font-weight: 700;">⏳ Awaiting Payment</span></p>
</div>
<p>To secure your items and ensure timely delivery, please complete your bank transfer and upload the receipt using the link below:</p>
<div style="text-align: center; margin: 35px 0;">
  <a href="{{paymentLink}}" class="button" style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white !important; box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);">Complete Payment Now</a>
</div>
<div style="background: #fef3c7; padding: 20px; border-radius: 12px; border: 1px solid #fde047; margin: 25px 0;">
  <p style="margin: 0; font-size: 14px; color: #854d0e;"><strong>⚡ Important:</strong> Orders with pending payments may be canceled after the deadline to free up inventory for other customers.</p>
</div>
<p>If you've already sent the payment, please disregard this message. Our team is working to verify all transactions.</p>
<p style="font-size: 14px; color: #888; margin-top: 25px;"><strong>Need help?</strong> Our payment support team is ready to assist you with any questions.</p>
<p>Best Regards,<br/><strong>{{companyName}} Sales Team</strong></p>`,
          placeholders: ['name', 'orderId', 'total', 'dueDate', 'paymentLink', 'companyName'],
          type: 'system'
        }
      ]
      await EmailTemplate.insertMany(defaults)
      return NextResponse.json(defaults)
      
    } else {
        // Ensure product_offer exists
        const hasProductOffer = templates.some(t => t.name === 'product_offer')
        if (!hasProductOffer) {
            const productOffer = {
                name: 'product_offer',
                subject: 'Special Offer: {{productName}} for You',
                body: `<h1>✨ A Special Offer Just for You</h1>
<p>Hi <strong>{{name}}</strong>,</p>
<p>We noticed you might be interested in our exquisite <strong class="highlight">{{productName}}</strong>. Because we value your taste, we've prepared a special offer.</p>
<p>For a limited time, we invite you to make this masterpiece yours.</p>
<div style="text-align: center; margin: 30px 0;">
  <img src="{{productImage}}" alt="{{productName}}" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);" />
</div>
<div class="info-box">
  <p><strong>💎 Product:</strong> {{productName}}</p>
  <p><strong>✨ Exclusive Detail:</strong> Handcrafted perfection.</p>
</div>
<div style="text-align: center; margin: 35px 0;">
  <a href="{{productLink}}" class="button-gold">View Exclusive Offer</a>
</div>
<p style="text-align: center; font-size: 14px; color: #888;">This offer is available for a limited time.</p>
<p>Warmly,<br/><strong>The {{companyName}} Team</strong></p>`,
                placeholders: ['name', 'productName', 'productImage', 'productLink', 'companyName'],
                type: 'system'
            }
            const newTemplate = await EmailTemplate.create(productOffer)
            templates.push(newTemplate)
        }
        
        // Ensure welcome_greetings is updated to /products/ for system templates
        const welcomeTemplate = templates.find(t => t.name === 'welcome_greetings' && t.type === 'system')
        if (welcomeTemplate && welcomeTemplate.body.includes('sarajeweler.com/shop')) {
             welcomeTemplate.body = welcomeTemplate.body.replace('sarajeweler.com/shop', 'sarajeweler.com/products')
            await EmailTemplate.findByIdAndUpdate(welcomeTemplate._id, { body: welcomeTemplate.body })
        }
    }
    
    return NextResponse.json(templates)
  } catch (error) {
    console.error('Failed to fetch templates:', error)
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    await dbConnect()
    
    const template = await EmailTemplate.create(data)
    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...data } = await req.json()
    await dbConnect()
    
    // Protect system template names
    const existing = await EmailTemplate.findById(id)
    if (existing?.type === 'system') {
       delete data.name // Cannot change name of system templates
    }

    const template = await EmailTemplate.findByIdAndUpdate(id, data, { new: true })
    return NextResponse.json(template)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    await dbConnect()
    const template = await EmailTemplate.findById(id)
    
    if (template?.type === 'system') {
      return NextResponse.json({ error: 'System templates cannot be deleted' }, { status: 403 })
    }

    await EmailTemplate.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
  }
}
