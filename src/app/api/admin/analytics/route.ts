import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/mongodb'
import Order from '@/models/Order'
import Product from '@/models/Product'
import User from '@/models/User'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    // Get date range from query params (default to last 30 days)
    const { searchParams } = new URL(req.url)
    const range = searchParams.get('range') || '30' // days
    const daysAgo = parseInt(range)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysAgo)

    // Fetch all orders within date range
    const orders = await Order.find({
      createdAt: { $gte: startDate }
    }).lean()

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)

    // Order statistics by status - FIX: Use orderStatus field
    const orderStats = {
      total: orders.length,
      pending: orders.filter(o => o.paymentStatus === 'pending').length,
      processing: orders.filter(o => o.orderStatus === 'processing').length,
      shipped: orders.filter(o => o.orderStatus === 'shipped').length,
      delivered: orders.filter(o => o.orderStatus === 'delivered').length,
      cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
    }

    // Revenue trend data (daily for last 7 days, weekly for longer periods)
    const revenueByDay: any[] = []
    for (let i = Math.min(daysAgo, 7) - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)
      
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt)
        return orderDate >= date && orderDate < nextDay
      })
      
      revenueByDay.push({
        date: date.toISOString().split('T')[0],
        revenue: dayOrders.reduce((sum, o) => sum + (o.total || 0), 0),
        orders: dayOrders.length
      })
    }

    // Get total customers (non-admin users) and products
    const totalCustomers = await User.countDocuments({ role: { $in: ['user', null] } })
    const totalProducts = await Product.countDocuments()
    const activeProducts = await Product.countDocuments({ status: 'active' })

    // Get recent orders (last 5) - FIX: Sort properly
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    // Calculate growth percentages (compare with previous period)
    const prevStartDate = new Date(startDate)
    prevStartDate.setDate(prevStartDate.getDate() - daysAgo)
    
    const prevOrders = await Order.find({
      createdAt: { $gte: prevStartDate, $lt: startDate }
    }).lean()
    
    const prevRevenue = prevOrders.reduce((sum, order) => sum + (order.total || 0), 0)
    const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0
    const ordersGrowth = prevOrders.length > 0 ? ((orders.length - prevOrders.length) / prevOrders.length) * 100 : 0

    return NextResponse.json({
      totalRevenue,
      revenueGrowth: parseFloat(revenueGrowth.toFixed(1)),
      orderStats,
      ordersGrowth: parseFloat(ordersGrowth.toFixed(1)),
      totalCustomers,
      totalProducts,
      activeProducts,
      revenueByDay,
      recentOrders: recentOrders.map(order => ({
        id: order._id?.toString() || '',
        orderNumber: order.orderNumber || order._id?.toString().slice(-8) || 'N/A',
        customer: (order.customer?.firstName || '') + ' ' + (order.customer?.lastName || '') || 'Guest',
        total: order.total || 0,
        status: order.orderStatus || 'processing', // FIX: Use orderStatus
        createdAt: order.createdAt
      }))
    })
  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
