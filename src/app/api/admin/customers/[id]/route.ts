import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'
import Product from '@/models/Product'
import { isValidObjectId } from 'mongoose'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()

    let customer: any = null
    let email: string | null = null

    // 1. Try to find user by ID
    if (isValidObjectId(id)) {
      customer = await User.findById(id).lean()
      if (customer) {
        email = customer.email
      }
    }

    // 2. If not found or ID is an email (for guests)
    if (!customer) {
      const decodedId = decodeURIComponent(id)
      customer = await User.findOne({ email: decodedId }).lean()
      email = customer ? customer.email : decodedId
    }

    // 3. Fetch all orders for this customer
    const orders = await Order.find({
      $or: [
        { userId: id },
        { 'customer.email': email }
      ]
    }).sort({ createdAt: -1 }).lean()

    // 4. Fetch all reviews by this customer across all products
    const productsWithReviews = await Product.find({
      $or: [
        { 'reviews.userId': id },
        { 'reviews.userEmail': email }
      ]
    }).lean()

    const customerReviews = productsWithReviews.flatMap((p: any) => 
      p.reviews
        .filter((r: any) => r.userId === id || r.userEmail === email)
        .map((r: any) => ({
          ...r,
          productId: p._id.toString(),
          productName: p.name,
          productImage: p.images?.find((img: any) => img.type === 'front')?.url || p.images?.[0]?.url
        }))
    )

    // Construct unified customer object
    const result = {
      profile: customer || {
        name: orders[0]?.customer?.firstName ? `${orders[0].customer.firstName} ${orders[0].customer.lastName || ''}`.trim() : 'Guest',
        email: email,
        phone: orders[0]?.customer?.phone || 'N/A',
        id: id
      },
      orders: orders.map((o: any) => ({
        id: o._id.toString(),
        total: o.total,
        status: o.orderStatus,
        createdAt: o.createdAt,
        items: o.items
      })),
      reviews: customerReviews,
      summary: {
        totalOrders: orders.length,
        totalSpent: orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0),
        totalReviews: customerReviews.length,
        firstOrderDate: orders[orders.length - 1]?.createdAt,
        lastOrderDate: orders[0]?.createdAt
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching customer details:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
