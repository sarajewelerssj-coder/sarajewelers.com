import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Category from '@/models/Category'

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await context.params
    const { name, description, image, isActive } = await request.json()
    
    const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
    
    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug, description, image, isActive },
      { new: true }
    )
    
    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, category })
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: 'Category with this name already exists' }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await context.params
    
    const category = await Category.findById(id)
    
    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 })
    }
    
    if (category.isPermanent) {
      return NextResponse.json({ success: false, error: 'Cannot delete permanent category' }, { status: 400 })
    }
    
    await Category.findByIdAndDelete(id)
    
    return NextResponse.json({ success: true, message: 'Category deleted successfully' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 })
  }
}