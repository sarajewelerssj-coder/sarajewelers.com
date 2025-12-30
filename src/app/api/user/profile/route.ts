import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { dbConnect } from '@/lib/mongodb'
import User from '@/models/User'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    await dbConnect()
    
    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
    
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}
