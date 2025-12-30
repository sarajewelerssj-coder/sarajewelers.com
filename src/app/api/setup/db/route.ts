import { NextRequest, NextResponse } from 'next/server'
import { initializeDatabase } from '@/lib/dbInit'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token') || request.headers.get('x-setup-token')
    
    const secureToken = process.env.SETUP_TOKEN
    
    if (!secureToken) {
      return NextResponse.json({ 
        error: 'SETUP_TOKEN is not configured on the server. Please add it to your environment variables.' 
      }, { status: 500 })
    }

    if (token !== secureToken) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 })
    }

    console.log('[Setup Service] 🛠️  Manual database seeding triggered via API')
    await initializeDatabase()

    return NextResponse.json({ 
      success: true, 
      message: 'Database initialization and seeding completed successfully.' 
    })
  } catch (error: any) {
    console.error('[Setup Service] ❌ Setup failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Database setup failed', 
      details: error.message 
    }, { status: 500 })
  }
}
