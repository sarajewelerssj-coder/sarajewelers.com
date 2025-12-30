import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/mongodb'
import Settings from '@/models/Settings'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    await dbConnect()
    let settings = await Settings.findOne()
    
    if (!settings) {
      // Create default settings if they don't exist
      settings = await Settings.create({
        standardShippingFee: 0,
        freeShippingThreshold: 0,
        companyName: 'Sara Jewelers',
        companyLogo: '/logo.webp'
      })
    }
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { standardShippingFee, freeShippingThreshold, companyName, companyLogo } = await req.json()
    await dbConnect()

    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings()
    }

    if (standardShippingFee !== undefined) settings.standardShippingFee = Number(standardShippingFee)
    if (freeShippingThreshold !== undefined) settings.freeShippingThreshold = Number(freeShippingThreshold)
    if (companyName) settings.companyName = companyName
    if (companyLogo) settings.companyLogo = companyLogo
    
    settings.updatedAt = new Date()

    await settings.save()

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { deleteLogo } = body

    if (deleteLogo) {
      await dbConnect()
      const settings = await Settings.findOne()
      
      if (settings?.companyLogo) {
        // Extract public ID from Cloudinary URL and delete from Cloudinary
        const urlParts = settings.companyLogo.split('/')
        const publicIdWithExt = urlParts[urlParts.length - 1]
        const publicId = publicIdWithExt.split('.')[0]
        
        try {
          const { deleteFromCloudinary } = await import('@/lib/cloudinary')
          await deleteFromCloudinary(publicId)
        } catch (error) {
          console.error('Failed to delete from Cloudinary:', error)
        }
        
        // Update database to remove logo
        settings.companyLogo = ''
        await settings.save()
      }
      
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid operation' }, { status: 400 })
  } catch (error) {
    console.error('Settings PATCH Error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
