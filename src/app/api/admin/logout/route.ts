import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    })
    
    // Clear the admin token cookie
    response.cookies.set('admin-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/'
    })
    
    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Logout failed' }, 
      { status: 500 }
    )
  }
}