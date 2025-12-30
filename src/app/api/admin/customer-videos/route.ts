import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import CustomerVideo from '@/models/CustomerVideo'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function GET() {
  try {
    await connectDB()
    
    const videos = await CustomerVideo.find().sort({ position: 1, createdAt: -1 }).lean()
    
    return NextResponse.json(videos)
  } catch (error) {
    console.error('Error fetching customer videos:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const data = await request.json()
    
    // Get the highest position and increment
    const lastVideo = await CustomerVideo.findOne().sort({ position: -1 })
    const position = lastVideo ? lastVideo.position + 1 : 1
    
    const video = new CustomerVideo({
      ...data,
      position
    })
    
    await video.save()
    
    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error('Error creating customer video:', error)
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    
    const { videos } = await request.json()
    
    // Update positions and other properties for multiple videos
    const updatePromises = videos.map((video: any, index: number) =>
      CustomerVideo.findByIdAndUpdate(
        video._id, 
        { 
          position: index + 1,
          isActive: video.isActive,
          url: video.url,
          cloudinaryId: video.cloudinaryId
        },
        { new: true }
      )
    )
    
    await Promise.all(updatePromises)
    
    return NextResponse.json({ message: 'Videos updated successfully' })
  } catch (error) {
    console.error('Error updating videos:', error)
    return NextResponse.json({ error: 'Failed to update videos' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    
    const { videoIds } = await request.json()
    
    // Get videos to delete from Cloudinary
    const videos = await CustomerVideo.find({ _id: { $in: videoIds } })
    
    // Delete from Cloudinary
    const cloudinaryPromises = videos.map(async (video) => {
      try {
        const result = await cloudinary.uploader.destroy(video.cloudinaryId, { resource_type: 'video' })
        console.log('Video deleted from Cloudinary:', video.cloudinaryId, result)
        return result
      } catch (error) {
        console.error('Cloudinary delete error for:', video.cloudinaryId, error)
        return null
      }
    })
    
    await Promise.all(cloudinaryPromises)
    
    // Delete from database
    await CustomerVideo.deleteMany({ _id: { $in: videoIds } })
    
    return NextResponse.json({ message: 'Videos deleted successfully' })
  } catch (error) {
    console.error('Error deleting videos:', error)
    return NextResponse.json({ error: 'Failed to delete videos' }, { status: 500 })
  }
}