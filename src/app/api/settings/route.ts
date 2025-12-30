import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/mongodb'
import Settings from '@/models/Settings'

export async function GET() {
  try {
    await dbConnect()
    const settings: any = await Settings.findOne().lean()
    
    return NextResponse.json({
      companyName: settings?.companyName || 'Sara Jewelers',
      companyLogo: settings?.companyLogo || '',
      freeShippingThreshold: settings?.freeShippingThreshold || 0
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}
