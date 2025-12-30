import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import CustomerVideo from '@/models/CustomerVideo'

export async function GET() {
  try {
    await connectDB()
    
    // Only fetch active videos, sorted by position
    const videos = await CustomerVideo.find({ isActive: true })
      .sort({ position: 1, createdAt: -1 })
      .lean()
    
    return NextResponse.json(videos)
  } catch (error) {
    console.error('Error fetching customer videos:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}