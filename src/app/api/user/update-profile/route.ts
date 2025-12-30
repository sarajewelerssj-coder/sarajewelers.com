import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { dbConnect } from '@/lib/mongodb'
import User from '@/models/User'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    await dbConnect()
    
    const data = await request.json()
    const { name, image, imagePublicId, phone, address, city, zipCode } = data
    
    // Use email to find the user as it's unique
    const userEmail = session.user.email
    
    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found in session' }, { status: 400 })
    }

    const currentUser = await User.findOne({ email: userEmail })
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // If image is being changed or removed, delete the old one from Cloudinary
    if (image !== undefined && currentUser.imagePublicId && currentUser.imagePublicId !== imagePublicId) {
       const { deleteFromCloudinary } = await import('@/lib/cloudinary')
       try {
         await deleteFromCloudinary(currentUser.imagePublicId)
       } catch (e) {
         console.error('Failed to delete old image from Cloudinary:', e)
       }
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { 
        ...(name && { name }),
        ...(image !== undefined && { image, imagePublicId: imagePublicId || "" }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(zipCode !== undefined && { zipCode }),
      },
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        phone: updatedUser.phone,
        address: updatedUser.address,
        city: updatedUser.city,
        zipCode: updatedUser.zipCode
      }
    })
    
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
