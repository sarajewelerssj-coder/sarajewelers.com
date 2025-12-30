import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as any
    const folder = formData.get('folder') as string || 'sara-jewelers'

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No valid file provided' }, { status: 400 })
    }

    // Server-side size limit: 40MB
    const MAX_SIZE = 40 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      console.warn(`WARNING: File too large for API route: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`)
      return NextResponse.json({ error: `File too large. Maximum size is 40MB.` }, { status: 400 })
    }

    console.log(`DEBUG: Uploading file: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB, Type: ${file.type} to folder: ${folder}`)
    
    const uploadResult = await uploadToCloudinary(file, folder)
    console.log(`DEBUG: Successfully uploaded ${file.name} to Cloudinary as ${uploadResult.publicId}`)

    return NextResponse.json({
      id: uploadResult.publicId,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      type: uploadResult.type,
      name: file.name,
      isVideo: uploadResult.type === 'video'
    })
  } catch (error: any) {
    console.error('CRITICAL: Error uploading file:', error)
    return NextResponse.json({ 
      error: 'Failed to upload file', 
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}