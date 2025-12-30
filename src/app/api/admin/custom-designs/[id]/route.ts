import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import CustomDesign from '@/models/CustomDesign'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const design = await CustomDesign.findById(id).lean()
    
    if (!design) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    return NextResponse.json(design)
  } catch (error) {
    console.error('Error fetching custom design:', error)
    return NextResponse.json({ error: 'Failed to fetch request' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const data = await request.json()
    
    const design = await CustomDesign.findByIdAndUpdate(id, data, { new: true })
    
    if (!design) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    return NextResponse.json(design)
  } catch (error) {
    console.error('Error updating custom design:', error)
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    
    const design = await CustomDesign.findByIdAndDelete(id)
    
    if (!design) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Request deleted successfully' })
  } catch (error) {
    console.error('Error deleting custom design:', error)
    return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 })
  }
}
