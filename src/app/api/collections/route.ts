import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Collection from '@/models/Collection'
import Product from '@/models/Product'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    let query: any = { isActive: true }
    if (type) query.type = type

    const collections = await Collection.find(query).lean()

    // For products in collections, we might want to fetch full product details
    const populatedCollections = await Promise.all(collections.map(async (col: any) => {
      if (col.type === 'shop-by-category') return col

      const productIds = col.products.map((p: any) => p.productId)
      const products = await Product.find({ _id: { $in: productIds }, status: 'active' }).lean() as any[]

      // Map back to maintain order and structure
      const fullProducts = col.products.map((cp: any) => {
        const fullProd = products.find((p: any) => p._id.toString() === cp.productId.toString())
        if (!fullProd) return null
        
        return {
          id: fullProd._id.toString(),
          name: fullProd.name,
          price: fullProd.price,
          oldPrice: fullProd.oldPrice,
          discount: fullProd.discount,
          rating: fullProd.rating || 0,
          reviewCount: fullProd.reviewCount || 0,
          isNew: fullProd.isNewProduct || false,
          images: fullProd.images && fullProd.images.length > 0
            ? fullProd.images.map((img: any) => img.url)
            : ["/placeholder.svg"],
          category: fullProd.categories?.[0] || 'Uncategorized'
        }
      }).filter(Boolean)

      return { ...col, fullProducts }
    }))

    return NextResponse.json({ success: true, collections: populatedCollections })
  } catch (error) {
    console.error('Error fetching public collections:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch collections' }, { status: 500 })
  }
}
