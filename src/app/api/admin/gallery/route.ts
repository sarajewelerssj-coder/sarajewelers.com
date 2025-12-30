import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Gallery from '@/models/Gallery'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || ''
    const type = searchParams.get('type') || ''

    const query: any = {}
    if (category) query.category = category
    if (type) query.type = type

    const gallery = await Gallery.find(query).sort({ createdAt: -1 }).lean()

    return NextResponse.json(gallery)
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { url, publicId, name, type, category } = body

    if (!url || !publicId) {
      return NextResponse.json({ error: 'URL and publicId are required' }, { status: 400 })
    }

    const galleryItem = new Gallery({
      name: name || 'Untitled',
      url,
      publicId,
      type: type || 'image',
      category: category || 'general'
    })

    await galleryItem.save()

    return NextResponse.json(galleryItem, { status: 201 })
  } catch (error) {
    console.error('Error creating gallery item:', error)
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { itemIds } = body

    if (!itemIds || !Array.isArray(itemIds)) {
      return NextResponse.json({ error: 'Item IDs array is required' }, { status: 400 })
    }

    // Get all items to delete
    const items = await Gallery.find({ _id: { $in: itemIds } })
    
    // Delete from Cloudinary (handle both images and videos)
    for (const item of items) {
      try {
        if (item.type === 'video') {
          // For videos, specify resource_type as video
          await cloudinary.uploader.destroy(item.publicId, {
            resource_type: 'video'
          })
        } else {
          // For images, use default (image) resource_type
          await cloudinary.uploader.destroy(item.publicId)
        }
        console.log(`Deleted ${item.type} from Cloudinary:`, item.publicId)
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError)
      }
    }

    // Delete from database
    await Gallery.deleteMany({ _id: { $in: itemIds } })

    return NextResponse.json({ message: `${items.length} items deleted successfully` })
  } catch (error) {
    console.error('Error deleting gallery items:', error)
    return NextResponse.json({ error: 'Failed to delete gallery items' }, { status: 500 })
  }
}