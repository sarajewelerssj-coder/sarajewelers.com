
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string, reviewId: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add proper Admin role check here. 
    // For now assuming if they are hitting this endpoint from admin dashboard they are admin, 
    // but in production middleware should handle this.

    await connectDB()
    const { slug, reviewId } = await params

    const product = await Product.findOne({ slug })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Filter out the review
    const initialLength = product.reviews.length
    product.reviews = product.reviews.filter((review: any) => review._id.toString() !== reviewId)

    if (product.reviews.length === initialLength) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Recalculate rating and review count
    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0)
      product.reviewCount = product.reviews.length
      product.rating = totalRating / product.reviewCount
    } else {
      product.reviewCount = 0
      product.rating = 0
    }

    await product.save()

    // Map database structure to frontend structure before returning
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
      rawImages: product.images || [],
      description: product.description,
      longDescription: product.longDescription,
      variations: product.variations || {},
      specifications: product.specifications || {},
      reviews: product.reviews || []
    }

    return NextResponse.json({ message: 'Review deleted successfully', product: mappedProduct })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}
