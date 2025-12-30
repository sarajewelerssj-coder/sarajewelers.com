import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/mongodb'
import Order from '@/models/Order'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await params
    const order = await Order.findById(id).lean()
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order details:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await params
    const data = await request.json()
    
    // Allow updating status and paymentStatus
    const oldOrder = await Order.findById(id)
    
    const order = await Order.findByIdAndUpdate(id, { 
      ...data,
      updatedAt: Date.now()
    }, { new: true })
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Trigger email if status changed to shipped or forced
    if ((data.orderStatus === 'shipped' && oldOrder.orderStatus !== 'shipped') || (data.orderStatus === 'shipped' && data.notifyCustomer)) {
      try {
        const { sendEmail } = await import('@/lib/email')
        const EmailTemplate = (await import('@/models/EmailTemplate')).default
        
        let template = await EmailTemplate.findOne({ name: 'order_shipped' })
        
        // Fallback default template if not found in DB
        if (!template) {
          template = {
            subject: 'Your Order #{{orderId}} has been Shipped!',
            body: `
              <h1>Great News, {{name}}!</h1>
              <p>Your order #{{orderId}} has been shipped.</p>
              <p><strong>Tracking Details:</strong></p>
              <p>Carrier: {{carrier}}</p>
              <p>Tracking Number: {{trackingId}}</p>
              <br/>
              <p>Track your package here: <a href="https://www.google.com/search?q={{carrier}}+{{trackingId}}">Track Package</a></p>
              <p>Thank you for shopping with Sara Jewelers.</p>
            `
          }
        }
        
        if (template) {
          let body = template.body
            .replace(/{{name}}/g, order.customer.firstName)
            .replace(/{{orderId}}/g, order._id)
            .replace(/{{trackingId}}/g, data.trackingId || 'N/A')
            .replace(/{{carrier}}/g, data.carrier || 'Standard Shipping')
            
          let subject = template.subject
            .replace(/{{orderId}}/g, order._id.toString().slice(-6))
            
          await sendEmail({
            to: order.customer.email,
            subject,
            html: body
          })
        }
      } catch (emailError) {
        console.error('Failed to send shipping email:', emailError)
      }
    }

    // Trigger email for payment status change
    if (data.paymentStatus && data.paymentStatus !== oldOrder.paymentStatus) {
      try {
        const { sendEmail } = await import('@/lib/email')
        
        let subject = ''
        let body = ''
        
        if (data.paymentStatus === 'approved') {
          subject = `Payment Confirmed - Order #${order._id.toString().slice(-6)}`
          body = `
            <h1>Payment Confirmed!</h1>
            <p>Hi ${order.customer.firstName},</p>
            <p>We have successfully verified your payment for order #${order._id}.</p>
            <p>Your order is now being processed and we will notify you once it has been shipped.</p>
            <p>Thank you for choosing Sara Jewelers!</p>
          `
        } else if (data.paymentStatus === 'rejected') {
          subject = `⚠️ URGENT: Payment Verification Failed - Order #${order._id.toString().slice(-6)}`
          body = `
            <div style="border: 2px solid #ef4444; padding: 20px; border-radius: 12px; background-color: #fef2f2;">
              <h1 style="color: #ef4444; margin-top: 0;">Payment Rejected</h1>
              <p>Hi <strong>${order.customer.firstName}</strong>,</p>
              <p>We're sorry, but we could not verify the payment proof you uploaded for order <strong>#${order._id}</strong>.</p>
              <p style="font-weight: bold; color: #b91c1c;">Your order is currently on hold and will not be processed until a valid payment is confirmed.</p>
              <div style="margin: 25px 0;">
                <p><strong>Next Steps:</strong></p>
                <ol>
                  <li>Log in to your account</li>
                  <li>Go to your order history</li>
                  <li>Re-upload a clear, valid transaction receipt or screenshot</li>
                </ol>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL}/account?tab=orders" style="background-color: #d4af37; color: black; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Re-upload Proof Now</a>
              </div>
              <div style="border-top: 1px solid #fee2e2; pt-20; margin-top: 20px;">
                <p><strong>Need Help?</strong></p>
                <p>If you're having trouble, please contact our support immediately:</p>
                <p>📞 Call Us: <a href="tel:6098559100">609-855-9100</a></p>
                <p>📧 Email: <a href="mailto:contact@sarajeweler.com">contact@sarajeweler.com</a></p>
              </div>
            </div>
          `
        }
        
        if (subject && body) {
          await sendEmail({
            to: order.customer.email,
            subject,
            html: body
          })
        }
      } catch (emailError) {
        console.error('Failed to send payment status email:', emailError)
      }
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await params
    
    const order = await Order.findByIdAndDelete(id)
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}
