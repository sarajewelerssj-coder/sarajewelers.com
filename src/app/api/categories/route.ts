import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Category from '@/models/Category'

export async function GET() {
  try {
    await connectDB()
    const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, categories })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { name, description, image } = await request.json()
    
    const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
    
    const category = await Category.create({
      name,
      slug,
      description,
      image
    })
    
    return NextResponse.json({ success: true, category })
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: 'Category with this name already exists' }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    const { categoryIds } = await request.json()
    
    if (!categoryIds || !Array.isArray(categoryIds)) {
      return NextResponse.json({ success: false, error: 'Category IDs array is required' }, { status: 400 })
    }
    
    await Category.updateMany(
      { _id: { $in: categoryIds } },
      { isActive: false }
    )
    
    return NextResponse.json({ success: true, message: `${categoryIds.length} categories deleted successfully` })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete categories' }, { status: 500 })
  }
}