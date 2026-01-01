import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import { deleteFromCloudinary } from '@/lib/cloudinary'
import { ensureUniqueSlug } from '@/lib/slug-utils'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    
    const { id } = await params
    const product = await Product.findById(id).lean()
    console.log(`DEBUG: Fetched product data for ID ${id}:`, JSON.stringify(product, null, 2))
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    
    const { id } = await params
    const data = await request.json()
    console.log(`DEBUG: Received product update for ID ${id}:`, JSON.stringify(data, null, 2))
    
    // Generate slug if name changed
    // Generate slug if name changed or slug provided
    if (data.name || data.slug) {
      let slug = data.slug
      if (!slug && data.name) {
        slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }
      
      // Ensure slug is unique, excluding current product ID
      if (slug) {
        data.slug = await ensureUniqueSlug(Product, slug, id)
      }
    }

    // Note: We do NOT auto-calculate prices - admin has full control
    // Price, oldPrice, and discount are saved exactly as provided

    const product = await Product.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
    console.log('DEBUG: Updated product result:', JSON.stringify(product, null, 2))

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Error updating product:', error)
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return NextResponse.json({ error: `${field} already exists` }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    
    const { id } = await params
    // First find the product to get image IDs
    const product = await Product.findById(id)
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      try {
        const deletePromises = product.images.map((image: any) => {
          if (image.id) { // Ensure public_id exists
             return deleteFromCloudinary(image.id)
          }
           return Promise.resolve()
        })
        await Promise.all(deletePromises)
      } catch (cloudinaryError) {
        console.error('Error deleting images from Cloudinary:', cloudinaryError)
        // We continue with product deletion even if image deletion fails, 
        // but verify this behavior with user if strict consistency is needed.
      }
    }

    // Delete the product
    await Product.findByIdAndDelete(id)

    return NextResponse.json({ message: 'Product and associated images deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}