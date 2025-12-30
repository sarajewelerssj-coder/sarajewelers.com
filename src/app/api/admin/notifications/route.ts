import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import AdminNotification from '@/models/AdminNotification'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const notifications = await AdminNotification.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean()

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id } = await request.json()
    await connectDB()
    
    if (id === 'all') {
      await AdminNotification.updateMany({ isRead: false }, { isRead: true })
    } else {
      await AdminNotification.findByIdAndUpdate(id, { isRead: true })
    }

    return NextResponse.json({ message: 'Notification marked as read' })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
  }
}
