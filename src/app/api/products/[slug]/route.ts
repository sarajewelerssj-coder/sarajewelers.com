import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'

import mongoose from 'mongoose'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB()
    const { slug } = await params

    const isObjectId = mongoose.isValidObjectId(slug)
    const query = {
        status: 'active',
        $or: [
            { slug: slug },
            ...(isObjectId ? [{ _id: slug }] : [])
        ]
    }

    const product = await Product.findOne(query).lean() as any

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    // Map database structure to frontend structure
    const mappedProduct = {
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      category: product.categories && product.categories.length > 0 ? product.categories[0] : 'Uncategorized',
      categories: product.categories || [],
      price: product.price,
      oldPrice: product.oldPrice,
      discount: product.discount,
      stock: product.stock,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      isNew: product.isNewProduct || false,
      isFeatured: product.isFeatured || false,
      images: product.images && product.images.length > 0 
        ? product.images.map((img: any) => img.url)
        : ["/placeholder.svg?height=600&width=600"],
      rawImages: product.images || [], // Useful for finding front/back types
      description: product.description,
      longDescription: product.longDescription,
      variations: product.variations || {},
      specifications: product.specifications || {},
      reviews: product.reviews || []
    }

    return NextResponse.json({ success: true, product: mappedProduct })
  } catch (error) {
    console.error('Error fetching public product:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 })
  }
}
