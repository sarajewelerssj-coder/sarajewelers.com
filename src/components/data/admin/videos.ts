export type CustomerVideo = {
  id: string
  title: string
  url: string
  thumbnail?: string
  sequence: number
  uploadedAt: Date
  duration?: number
}

export let customerVideos: CustomerVideo[] = [
  {
    id: 'v1',
    title: 'Customer Review 1',
    url: '/videos/review1.mp4',
    sequence: 1,
    uploadedAt: new Date('2025-10-01')
  },
  {
    id: 'v2',
    title: 'Customer Review 2',
    url: '/videos/review2.mp4',
    sequence: 2,
    uploadedAt: new Date('2025-10-15')
  }
]

export const addVideo = (video: Omit<CustomerVideo, 'id' | 'uploadedAt'>) => {
  const newVideo: CustomerVideo = {
    ...video,
    id: `v${Date.now()}`,
    uploadedAt: new Date()
  }
  customerVideos.push(newVideo)
  return newVideo
}

export const updateVideoSequence = (videoId: string, newSequence: number) => {
  const video = customerVideos.find(v => v.id === videoId)
  if (video) {
    video.sequence = newSequence
  }
  // Sort videos by sequence
  customerVideos.sort((a, b) => a.sequence - b.sequence)
}

export const deleteVideo = (videoId: string) => {
  customerVideos = customerVideos.filter(v => v.id !== videoId)
  // Renumber sequences
  customerVideos.forEach((video, index) => {
    video.sequence = index + 1
  })
}

export const reorderVideos = (newOrder: string[]) => {
  newOrder.forEach((videoId, index) => {
    const video = customerVideos.find(v => v.id === videoId)
    if (video) {
      video.sequence = index + 1
    }
  })
  customerVideos.sort((a, b) => a.sequence - b.sequence)
}

