import { proxy as adminGuard } from './admin-guard'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  return await adminGuard(request)
}

export const config = {
  matcher: [
    /*
     * Match all admin specific paths
     */
    '/sara-admin/:path*',
    '/api/admin/:path*',
  ],
}
