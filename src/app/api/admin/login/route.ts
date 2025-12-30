import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { dbConnect } from '@/lib/mongodb'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    await dbConnect()

    // Find user
    const user = await User.findOne({ email })

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Check if user is admin
    if (user.role !== 'admin' && user.role !== 'sub-admin') {
      return NextResponse.json({ error: 'Access denied. Admin rights required.' }, { status: 403 })
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id.toString(), 
        email: user.email,
        role: user.role
      },
      process.env.NEXTAUTH_SECRET || 'demo-secret-key',
      { expiresIn: '7d' }
    )

    // Set HTTP-only cookie
    const response = NextResponse.json({ 
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response

  } catch (error) {
    console.error('Admin Login Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}