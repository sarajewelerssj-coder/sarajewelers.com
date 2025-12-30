'use server'

import { uploadToCloudinary } from '@/lib/cloudinary'

export async function uploadFileAction(formData: FormData) {
  try {
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'sara-jewelers'

    if (!file || !(file instanceof File)) {
      return { success: false, error: 'No valid file provided' }
    }

    // Server-side size limit handled by Next.js configuration (50MB)
    // and can be further checked here if needed
    
    console.log(`[Server Action] 📤 Uploading: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB, Type: ${file.type}`)
    
    const result = await uploadToCloudinary(file, folder)
    
    return {
      success: true,
      id: result.publicId,
      url: result.url,
      publicId: result.publicId,
      type: result.type,
      name: file.name,
      isVideo: result.type === 'video'
    }
  } catch (error: any) {
    console.error('[Server Action] ❌ Upload failed:', error)
    return { 
      success: false, 
      error: 'Failed to upload file', 
      details: error.message || 'Unknown error'
    }
  }
}
