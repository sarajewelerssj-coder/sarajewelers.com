import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const queryTerm = searchParams.get('q')
    const isNew = searchParams.get('isNew') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '1000000')

    const query: any = { status: 'active' }

    if (category) {
      query.categories = { $in: [category] }
    }

    if (isNew) {
      query.isNewProduct = true
    }

    if (queryTerm) {
      query.$text = { $search: queryTerm }
    }

    if (minPrice || maxPrice) {
      query.price = { $gte: minPrice, $lte: maxPrice }
    }

    // Fetch products
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    // Map database structure to frontend structure
    const mappedProducts = (products as any[]).map((product: any) => ({
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      category: product.categories && product.categories.length > 0 ? product.categories[0] : 'Uncategorized',
      categories: product.categories || [],
      price: product.price,
      oldPrice: product.oldPrice,
      discount: product.discount,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      isNew: product.isNewProduct || false,
      isFeatured: product.isFeatured || false,
      images: product.images && product.images.length > 0 
        ? product.images.map((img: any) => img.url)
        : ["/placeholder.svg?height=600&width=600"],
      frontImage: product.images?.find((img: any) => img.type === 'front')?.url || product.images?.[0]?.url || "/placeholder.svg",
      backImage: product.images?.find((img: any) => img.type === 'back')?.url || product.images?.[1]?.url || product.images?.[0]?.url || "/placeholder.svg",
      description: product.description,
      longDescription: product.longDescription,
      variations: product.variations || {},
      specifications: product.specifications || {},
      reviews: product.reviews || []
    }))

    return NextResponse.json({ success: true, products: mappedProducts })
  } catch (error) {
    console.error('Error fetching public products:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 })
  }
}
