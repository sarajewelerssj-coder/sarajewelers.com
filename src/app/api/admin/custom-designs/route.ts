import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import CustomDesign from '@/models/CustomDesign'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    const query: any = {}
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { stoneType: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (status) query.status = status

    const skip = (page - 1) * limit
    
    const designs = await CustomDesign.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await CustomDesign.countDocuments(query)

    return NextResponse.json({
      designs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching custom designs:', error)
    return NextResponse.json({ error: 'Failed to fetch custom designs' }, { status: 500 })
  }
}
