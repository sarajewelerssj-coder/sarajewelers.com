import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Gallery from '@/models/Gallery'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params
    const galleryItem = await Gallery.findById(id)
    if (!galleryItem) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
    }

    console.log('Deleting item:', galleryItem.name, 'PublicId:', galleryItem.publicId)

    // Delete from Cloudinary (handle both images and videos)
    try {
      let cloudinaryResult
      if (galleryItem.type === 'video') {
        // For videos, specify resource_type as video
        cloudinaryResult = await cloudinary.uploader.destroy(galleryItem.publicId, {
          resource_type: 'video'
        })
      } else {
        // For images, use default (image) resource_type
        cloudinaryResult = await cloudinary.uploader.destroy(galleryItem.publicId)
      }
      console.log('Cloudinary deletion result:', cloudinaryResult)
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError)
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    await Gallery.findByIdAndDelete(id)

    return NextResponse.json({ message: 'Gallery item deleted successfully' })
  } catch (error) {
    console.error('Error deleting gallery item:', error)
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params
    const body = await request.json()
    const { name, category } = body

    console.log('Updating item:', id, 'with data:', { name, category })

    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 })
    }

    const updatedItem = await Gallery.findByIdAndUpdate(
      id,
      { name, category },
      { new: true, runValidators: true }
    )

    if (!updatedItem) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
    }

    console.log('Updated item:', updatedItem)
    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Error updating gallery item:', error)
    return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 })
  }
}