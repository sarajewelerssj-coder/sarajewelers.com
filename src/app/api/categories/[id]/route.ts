import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Category from '@/models/Category'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const { name, description, image } = await request.json()
    
    const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
    
    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug, description, image },
      { new: true }
    )
    
    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, category })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    
    const category = await Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    )
    
    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, message: 'Category deleted successfully' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 })
  }
}