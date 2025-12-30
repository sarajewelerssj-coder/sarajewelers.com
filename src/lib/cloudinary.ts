import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadToCloudinary = async (file: File, folder: string = 'sara-jewelers') => {
  const buffer = Buffer.from(await file.arrayBuffer())
  const mimeType = file.type || 'image/jpeg'
  const isVideo = mimeType.startsWith('video/')

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: isVideo ? 'video' : 'image',
        transformation: !isVideo ? [
          { width: 1200, height: 1200, crop: 'limit', quality: 'auto' }
        ] : undefined
      },
      (error, result) => {
        if (error) return reject(error)
        if (!result) return reject(new Error('Upload failed: no result'))
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          type: isVideo ? 'video' : 'image'
        })
      }
    )

    uploadStream.end(buffer)
  }) as Promise<{ url: string; publicId: string; type: 'video' | 'image' }>
}

export const deleteFromCloudinary = async (publicId: string) => {
  return await cloudinary.uploader.destroy(publicId)
}

export default cloudinary