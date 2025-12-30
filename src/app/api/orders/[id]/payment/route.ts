import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { dbConnect } from '@/lib/mongodb'
import Order from '@/models/Order'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { paymentScreenshot } = await req.json()
    if (!paymentScreenshot) {
      return NextResponse.json({ error: 'Payment screenshot is required' }, { status: 400 })
    }

    await dbConnect()

    const order = await Order.findById(id)
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if the order belongs to the user
    if (!session.user || (order.userId !== (session.user as any).id && order.userId !== session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Update the order with new payment info and set status back to pending
    order.paymentScreenshot = paymentScreenshot
    order.paymentStatus = 'pending'
    await order.save()

    return NextResponse.json({ message: 'Payment re-submitted successfully' })
  } catch (error) {
    console.error('Error re-submitting payment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
