import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import CustomerVideo from '@/models/CustomerVideo'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    
    const { id } = await params
    const video = await CustomerVideo.findById(id)
    
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Delete from Cloudinary first
    try {
      await cloudinary.uploader.destroy(video.cloudinaryId, { resource_type: 'video' })
      console.log('Video deleted from Cloudinary:', video.cloudinaryId)
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError)
    }

    // Delete from database
    await CustomerVideo.findByIdAndDelete(id)

    return NextResponse.json({ message: 'Video deleted successfully' })
  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 })
  }
}