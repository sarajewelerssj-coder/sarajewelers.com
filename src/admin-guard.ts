import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const ADMIN_PREFIX = '/sara-admin'
const ADMIN_API_PREFIX = '/api/admin'
const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'demo-secret-key')

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Protect Admin Pages
  if (pathname.startsWith(ADMIN_PREFIX)) {
    // Allow access to the admin login page itself
    if (pathname === '/sara-admin' || pathname === '/sara-admin/') {
      return NextResponse.next()
    }

    // Check for admin token for dashboard and other protected routes
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      const url = new URL('/sara-admin', request.url)
      return NextResponse.redirect(url)
    }

    try {
      await jwtVerify(token, SECRET)
      return NextResponse.next()
    } catch (error) {
       // Token invalid or expired - redirect to login
       const url = new URL('/sara-admin', request.url)
       return NextResponse.redirect(url)
    }
  }

  // 2. Protect Admin APIs
  if (pathname.startsWith(ADMIN_API_PREFIX)) {
    // Exclude the login API itself
    if (pathname === '/api/admin/login') {
      return NextResponse.next()
    }

    const token = request.cookies.get('admin-token')?.value

    // Allow GET /api/admin/settings for everyone (needed for shipping fees)
    if (pathname === '/api/admin/settings' && request.method === 'GET') {
      return NextResponse.next()
    }

    // Allow POST /api/admin/upload for everyone (needed for transaction screenshots)
    if (pathname === '/api/admin/upload' && request.method === 'POST') {
      return NextResponse.next()
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 })
    }

    try {
      await jwtVerify(token, SECRET)
      return NextResponse.next()
    } catch (error) {
       return NextResponse.json({ error: 'Unauthorized: Session expired' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/sara-admin/:path*', '/api/admin/:path*'],
}
