import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { dbConnect } from '@/lib/mongodb'
import Order from '@/models/Order'
import Product from '@/models/Product'
import AdminNotification from '@/models/AdminNotification'
import Settings from '@/models/Settings'
import EmailTemplate from '@/models/EmailTemplate'
import { sendEmail } from '@/lib/email'
import { OrderSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    await dbConnect()
    
    const body = await request.json()
    
    // Zod Validation
    const validation = OrderSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 })
    }

    const { customer, items, subtotal, paymentScreenshot } = validation.data

    // Fetch Global Shipping Settings
    let storeSettings = await Settings.findOne()
    if (!storeSettings) {
      storeSettings = await Settings.create({ standardShippingFee: 0, freeShippingThreshold: 0 })
    }

    const calculatedShipping = subtotal >= storeSettings.freeShippingThreshold ? 0 : storeSettings.standardShippingFee
    const calculatedTotal = subtotal + calculatedShipping

    const newOrder = new Order({
      userId: (session.user as any).id || session.user.email,
      customer,
      items,
      subtotal,
      shipping: calculatedShipping,
      total: calculatedTotal,
      paymentScreenshot,
      paymentMethod: 'bank_transfer',
      paymentStatus: 'pending',
      orderStatus: 'processing'
    })

    await newOrder.save()

    // Real-time stock deduction and sold count increment
    for (const item of items) {
      try {
        await Product.findByIdAndUpdate(item.id, {
          $inc: { 
            stock: -Number(item.quantity),
            sold: Number(item.quantity)
          }
        })
      } catch (err) {
        console.error(`Failed to deduct stock for product ${item.id}:`, err)
        // We continue with other items even if one fails
      }
    }

    // Create Admin Notification
    try {
      await AdminNotification.create({
        title: 'New Order Placed',
        message: `A new order has been placed by ${customer.firstName} ${customer.lastName} for $${calculatedTotal.toFixed(2)}.`,
        type: 'order',
        link: `/sara-admin/dashboard/orders/${newOrder._id}`,
        isRead: false
      })
    } catch (notificationErr) {
      console.error('Failed to create admin notification:', notificationErr)
    }

    // Send Order Confirmation Email
    try {
      const template = await EmailTemplate.findOne({ name: 'order_confirmation' })
      if (template) {
        let emailHtml = template.body
          .replace(/{{name}}/g, customer.firstName)
          .replace(/{{orderId}}/g, newOrder._id.toString())
          .replace(/{{total}}/g, calculatedTotal.toFixed(2))

        await sendEmail({
          to: customer.email,
          subject: template.subject.replace(/{{orderId}}/g, newOrder._id.toString()),
          html: emailHtml
        })
      }
    } catch (emailErr) {
      console.error('Failed to send order confirmation email:', emailErr)
    }

    return NextResponse.json({ 
      message: 'Order placed successfully', 
      orderId: newOrder._id 
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    await dbConnect()
    
    const userId = (session.user as any).id || session.user.email
    
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(orders)
    
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
