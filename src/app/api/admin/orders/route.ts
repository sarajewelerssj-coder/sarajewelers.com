import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/mongodb'
import Order from '@/models/Order'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    const query: any = {}
    
    if (search) {
      query.$or = [
        { 'customer.firstName': { $regex: search, $options: 'i' } },
        { 'customer.lastName': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { _id: search.length === 24 ? search : undefined }
      ].filter(Boolean)
    }
    
    if (status) {
      query.orderStatus = status
    }

    const skip = (page - 1) * limit
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Order.countDocuments(query)

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching admin orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
