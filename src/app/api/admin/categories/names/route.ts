import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Category from '@/models/Category'

export async function GET() {
  try {
    await connectDB()
    
    // Fetch all active categories (both seed and user-created)
    const categories = await Category.find({ isActive: true }).select('name').sort({ name: 1 })
    const categoryNames = categories.map(cat => cat.name)
    return NextResponse.json({ categories: categoryNames })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch category names' }, { status: 500 })
  }
}