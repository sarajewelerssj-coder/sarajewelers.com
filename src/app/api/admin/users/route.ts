import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    await dbConnect()
    const admins = await User.find({ role: 'admin' }).select('-password').lean()
    return NextResponse.json(admins)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    await dbConnect()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'sub-admin', // Sub-admins can access dashboard but cannot delete users
      isVerified: true, // Internal admins are auto-verified
    })

    const { password: _, ...adminWithoutPassword } = newAdmin.toObject()
    return NextResponse.json(adminWithoutPassword, { status: 201 })
  } catch (error) {
    console.error('Create Admin Error:', error)
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userIdToDelete = searchParams.get('id')
    
    if (!userIdToDelete) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    await dbConnect()

    // Get the user making the request from the session
    const { getServerSession } = await import('next-auth')
    const { authOptions } = await import('@/lib/auth')
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get requesting user's role
    const requestingUser = await User.findOne({ email: session.user.email })
    
    // Only users with 'admin' role (main admin) can delete users
    if (requestingUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Only the main administrator can delete users' }, { status: 403 })
    }

    // Prevent self-deletion
    if (requestingUser._id.toString() === userIdToDelete) {
      return NextResponse.json({ error: 'You cannot delete yourself' }, { status: 400 })
    }

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(userIdToDelete)
    
    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete Admin Error:', error)
    return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 })
  }
}
