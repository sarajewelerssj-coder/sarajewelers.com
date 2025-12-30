'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

export default function ConfigNotification() {
  useEffect(() => {
    // Check if running in demo mode
    const isDemoMode = !process.env.NEXT_PUBLIC_MONGODB_URI
    
    if (isDemoMode) {
      toast.info('Demo Mode', {
        description: 'App is running in demo mode. Some features may be limited.',
        duration: 5000,
      })
    }
  }, [])

  return null
}