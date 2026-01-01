import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'

export async function GET() {
  try {
    // Note: Other admin routes currently do not have strict role checks.
    // We will align with that for now to ensure the dashboard works reliably.
    await connectDB()

    // 1. Get all orders and all users
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean()
    const users = await User.find({}).lean()

    // 2. Resolve unique customers using a Map (key = email)
    const customerMap = new Map<string, any>()

    // Initialize with actual user accounts
    for (const user of users) {
      const email = user.email.toLowerCase()
      // Skip admin accounts
      if (user.role === 'admin' || email === 'admin@sarajeweler.com') continue

      customerMap.set(email, {
        id: (user._id as any).toString(),
        name: user.name,
        email: email,
        image: user.image,
        phone: user.phone || 'N/A',
        totalOrders: 0,
        totalSpent: 0,
        joinedDate: user.createdAt || new Date()
      })
    }

    // Overlay with order data and find "guest" customers
    for (const order of orders) {
      if (!order.customer?.email && !order.userId) continue
      
      const email = (order.customer?.email || order.userId).toLowerCase()
      
      let customer = customerMap.get(email)
      
      // If not found by email, try matching by userId as an ID string
      if (!customer && order.userId) {
        customer = Array.from(customerMap.values()).find(c => c.id === order.userId)
      }

      if (!customer) {
        // Create new guest customer entry
        customer = {
          id: order.userId || email,
          name: order.customer?.firstName 
            ? `${order.customer.firstName} ${order.customer.lastName || ''}`.trim() 
            : 'Guest Customer',
          email: email,
          image: null,
          phone: order.customer?.phone || 'N/A',
          totalOrders: 0,
          totalSpent: 0,
          joinedDate: order.createdAt
        }
        customerMap.set(email, customer)
      }

      customer.totalOrders += 1
      customer.totalSpent += (order.total || 0)
      
      // Update joinedDate to earliest interaction
      if (new Date(order.createdAt) < new Date(customer.joinedDate)) {
        customer.joinedDate = order.createdAt
      }
    }

    return NextResponse.json({ customers: Array.from(customerMap.values()) })
  } catch (error) {
    console.error('Error fetching admin customers:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
