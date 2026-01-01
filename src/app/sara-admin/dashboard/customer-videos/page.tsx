'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Eye, EyeOff, UploadCloud, CheckSquare, Square, Trash, Edit3, Play, X, RefreshCw, Plus, Search, Filter, Share2, LayoutGrid, List, Video, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { uploadFileAction } from "@/app/actions/media-actions"
import { toast } from 'sonner'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface CustomerVideo {
  _id: string
  url: string
  cloudinaryId: string
  position: number
  isActive: boolean
  createdAt: string
}

export default function CustomerVideosPage() {
  const [videos, setVideos] = useState<CustomerVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [bulkUploading, setBulkUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0, percentage: 0 })
  const [currentFileName, setCurrentFileName] = useState('')
  const [selectedVideos, setSelectedVideos] = useState<string[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'single' | 'bulk' | 'all', id?: string }>()
  const [deleting, setDeleting] = useState(false)
  const [deleteProgress, setDeleteProgress] = useState({ current: 0, total: 0, status: '' })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bulkFileInputRef = useRef<HTMLInputElement>(null)
  const [editingPosition, setEditingPosition] = useState<string | null>(null)
  const [newPosition, setNewPosition] = useState('')
  const [previewVideo, setPreviewVideo] = useState<string | null>(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/customer-videos')
      if (response.ok) {
        const data = await response.json()
        setVideos(data)
      } else {
        toast.error('Failed to fetch videos')
      }
    } catch (error) {
      toast.error('Failed to fetch videos')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (files: FileList, isBulk = false) => {
    const fileArray = Array.from(files)
    const MAX_SIZE = 30 * 1024 * 1024 // 30MB

    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('video/')) {
        toast.error(`${file.name} is not a video file`)
        return false
      }
      if (file.size > MAX_SIZE) {
        toast.error(`${file.name} exceeds the 30MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = ''
      if (bulkFileInputRef.current) bulkFileInputRef.current.value = ''
      return
    }

    if (isBulk) {
      setBulkUploading(true)
      setBulkProgress({ current: 0, total: validFiles.length, percentage: 0 })
    } else {
      setUploading(true)
      setUploadProgress(0)
      setCurrentFileName(validFiles[0].name)
    }

    const results = []
    let failureCount = 0
    
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i]
      
      try {
        if (isBulk) {
          setBulkProgress(prev => ({ 
            ...prev, 
            current: i + 1,
            percentage: Math.round(((i + 1) / validFiles.length) * 100)
          }))
        } else {
          setCurrentFileName(file.name)
        }

        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        uploadFormData.append('folder', 'sara-jewelers/customer-videos')

        if (!isBulk) {
          const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
              const newProgress = prev + Math.random() * 15
              return newProgress > 90 ? 90 : newProgress
            })
          }, 200)

          const result = await uploadFileAction(uploadFormData)

          clearInterval(progressInterval)
          setUploadProgress(95)

          if (result.success) {
            const videoResponse = await fetch('/api/admin/customer-videos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                url: result.url,
                cloudinaryId: result.id
              })
            })

            if (videoResponse.ok) {
              setUploadProgress(100)
              results.push(await videoResponse.json())
            } else {
              const errorText = await videoResponse.text()
              throw new Error(errorText || 'Failed to save video details')
            }
          } else {
            throw new Error(result.error || 'Upload failed')
          }
        } else {
          const result = await uploadFileAction(uploadFormData)

          if (result.success) {
            const videoResponse = await fetch('/api/admin/customer-videos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                url: result.url,
                cloudinaryId: result.id
              })
            })

            if (videoResponse.ok) {
              results.push(await videoResponse.json())
            } else {
              const errorText = await videoResponse.text()
              throw new Error(errorText || 'Failed to save video details')
            }
          } else {
            throw new Error(result.error || 'Upload failed')
          }
        }
      } catch (error: any) {
        console.error(`Error uploading ${file.name}:`, error)
        toast.error(`Failed to upload ${file.name}: ${error.message}`)
        failureCount++
      }
    }

    if (results.length > 0) {
      toast.success(`${results.length} video(s) uploaded successfully!`)
      fetchVideos()
    }

    if (failureCount > 0) {
      toast.error(`${failureCount} video(s) failed to upload.`)
    }

    if (isBulk) {
      setBulkUploading(false)
      setBulkProgress({ current: 0, total: 0, percentage: 0 })
    } else {
      setUploading(false)
      setUploadProgress(0)
      setCurrentFileName('')
    }

    if (fileInputRef.current) fileInputRef.current.value = ''
    if (bulkFileInputRef.current) bulkFileInputRef.current.value = ''
  }

  const handleEditPosition = (videoId: string, currentPosition: number) => {
    setEditingPosition(videoId)
    setNewPosition(currentPosition.toString())
  }

  const handleSavePosition = async (videoId: string) => {
    const targetPosition = parseInt(newPosition)
    if (isNaN(targetPosition) || targetPosition < 1) {
      toast.error('Position must be a number greater than 0')
      return
    }

    const currentVideo = videos.find(v => v._id === videoId)
    if (!currentVideo) return

    const existingVideo = videos.find(v => v.position === targetPosition && v._id !== videoId)
    
    let updatedVideos = [...videos]
    
    if (existingVideo) {
      updatedVideos = videos.map(v => {
        if (v._id === videoId) return { ...v, position: targetPosition }
        if (v._id === existingVideo._id) return { ...v, position: currentVideo.position }
        return v
      })
    } else {
      updatedVideos = videos.map(v => 
        v._id === videoId ? { ...v, position: targetPosition } : v
      )
    }

    try {
      const response = await fetch('/api/admin/customer-videos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videos: updatedVideos })
      })
      
      if (response.ok) {
        setVideos(updatedVideos.sort((a, b) => a.position - b.position))
        toast.success('Position updated successfully')
      } else {
        throw new Error('Failed to update position')
      }
    } catch (error) {
      toast.error('Failed to update position')
    }
    
    setEditingPosition(null)
    setNewPosition('')
  }

  const handleCancelEdit = () => {
    setEditingPosition(null)
    setNewPosition('')
  }

  const handleBulkToggleStatus = async (makeActive: boolean) => {
    const updatedVideos = videos.map(v => 
      selectedVideos.includes(v._id) ? { ...v, isActive: makeActive } : v
    )

    try {
      const response = await fetch('/api/admin/customer-videos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videos: updatedVideos })
      })

      if (response.ok) {
        setVideos(updatedVideos)
        toast.success(`${selectedVideos.length} video(s) ${makeActive ? 'shown' : 'hidden'} successfully`)
      } else {
        throw new Error('Failed to update status')
      }
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleToggleStatus = async (id: string) => {
    const video = videos.find(v => v._id === id)
    if (!video) return

    const updatedVideos = videos.map(v => 
      v._id === id ? { ...v, isActive: !v.isActive } : v
    )

    try {
      const response = await fetch('/api/admin/customer-videos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videos: updatedVideos })
      })

      if (response.ok) {
        setVideos(updatedVideos)
        toast.success('Video status updated successfully')
      } else {
        throw new Error('Failed to update status')
      }
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id?: string) => {
    setDeleting(true)
    
    try {
      if (deleteTarget?.type === 'single' && id) {
        setDeleteProgress({ current: 1, total: 1, status: 'Deleting video from cloud storage...' })
        
        const response = await fetch(`/api/admin/customer-videos/${id}`, { method: 'DELETE' })
        if (response.ok) {
          setDeleteProgress({ current: 1, total: 1, status: 'Removing from database...' })
          setVideos(prev => prev.filter(v => v._id !== id))
          toast.success('Video deleted successfully')
        } else {
          toast.error('Failed to delete video')
        }
      } else if (deleteTarget?.type === 'bulk') {
        const total = selectedVideos.length
        setDeleteProgress({ current: 0, total, status: 'Preparing bulk deletion...' })
        
        setDeleteProgress({ current: 0, total, status: 'Deleting videos from cloud storage...' })
        
        const response = await fetch('/api/admin/customer-videos', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoIds: selectedVideos })
        })
        
        if (response.ok) {
          setDeleteProgress({ current: total, total, status: 'Updating database...' })
          setVideos(prev => prev.filter(v => !selectedVideos.includes(v._id)))
          setSelectedVideos([])
          toast.success(`${selectedVideos.length} video(s) deleted successfully`)
        } else {
          toast.error('Failed to delete videos')
        }
      } else if (deleteTarget?.type === 'all') {
        const allVideoIds = videos.map(v => v._id)
        const total = allVideoIds.length
        setDeleteProgress({ current: 0, total, status: 'Preparing to delete all videos...' })
        
        setDeleteProgress({ current: 0, total, status: 'Deleting all videos from cloud storage...' })
        
        const response = await fetch('/api/admin/customer-videos', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoIds: allVideoIds })
        })
        
        if (response.ok) {
          setDeleteProgress({ current: total, total, status: 'Clearing database...' })
          setVideos([])
          setSelectedVideos([])
          toast.success(`All ${videos.length} video(s) deleted successfully`)
        } else {
          toast.error('Failed to delete all videos')
        }
      }
    } catch (error) {
      toast.error('Failed to delete video(s)')
    } finally {
      setDeleting(false)
      setDeleteProgress({ current: 0, total: 0, status: '' })
      setShowDeleteDialog(false)
      setDeleteTarget(undefined)
    }
  }

  const handleSelectVideo = (id: string) => {
    setSelectedVideos(prev => 
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    setSelectedVideos(selectedVideos.length === videos.length ? [] : videos.map(v => v._id))
  }

  const openDeleteDialog = (type: 'single' | 'bulk' | 'all', id?: string) => {
    setDeleteTarget({ type, id })
    setShowDeleteDialog(true)
  }

  const getDeleteMessage = () => {
    if (deleteTarget?.type === 'single') return 'This action cannot be undone.'
    if (deleteTarget?.type === 'bulk') return `This will permanently delete ${selectedVideos.length} selected video(s).`
    if (deleteTarget?.type === 'all') return `This will permanently delete all ${videos.length} video(s).`
    return ''
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Customer Videos</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage customer testimonial videos • {videos.length} total • 
            <span className="text-emerald-600 dark:text-emerald-400">{videos.filter(v => v.isActive).length} active</span> • 
            <span className="text-gray-600 dark:text-gray-400">{videos.filter(v => !v.isActive).length} hidden</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchVideos}
            disabled={uploading || bulkUploading || deleting || loading}
            className="inline-flex items-center gap-2 bg-gray-500 text-white px-3 py-2 rounded-xl shadow hover:shadow-xl transition-all font-semibold disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            title="Refresh videos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || bulkUploading || deleting}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black px-4 py-2 rounded-xl shadow hover:shadow-xl transition-all font-semibold disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {uploading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
          <button 
            onClick={() => bulkFileInputRef.current?.click()}
            disabled={uploading || bulkUploading || deleting}
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl shadow hover:shadow-xl transition-all font-semibold disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {bulkUploading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{bulkProgress.current}/{bulkProgress.total}</span>
              </div>
            ) : (
              <UploadCloud className="w-4 h-4" />
            )}
            {bulkUploading ? `${bulkProgress.percentage}%` : 'Bulk Upload'}
          </button>
        </div>
      </div>

      {videos.length > 0 && (
        <div className="flex items-center justify-between bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-xl p-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              disabled={uploading || bulkUploading || deleting}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-[#d4af37] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedVideos.length === videos.length ? (
                <CheckSquare className="w-3.5 h-3.5" />
              ) : (
                <Square className="w-3.5 h-3.5" />
              )}
              {selectedVideos.length === videos.length ? 'Deselect' : 'Select All'}
            </button>
            {selectedVideos.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                {selectedVideos.length}
              </span>
            )}
          </div>
          <div className="flex gap-1.5">
            {selectedVideos.length > 0 && (
              <>
                <button
                  onClick={() => handleBulkToggleStatus(true)}
                  className="inline-flex items-center gap-1 px-2 py-1.5 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium hover:bg-emerald-200 transition-all cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  Show
                </button>
                <button
                  onClick={() => handleBulkToggleStatus(false)}
                  className="inline-flex items-center gap-1 px-2 py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-200 transition-all cursor-pointer"
                >
                  <EyeOff className="w-3 h-3" />
                  Hide
                </button>
                <button
                  onClick={() => openDeleteDialog('bulk')}
                  disabled={deleting}
                  className="inline-flex items-center gap-1 px-2 py-1.5 bg-rose-100 text-rose-700 rounded-md text-xs font-medium hover:bg-rose-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting && deleteTarget?.type === 'bulk' ? (
                    <div className="animate-spin rounded-full h-3 w-3 border border-rose-700 border-t-transparent"></div>
                  ) : (
                    <Trash2 className="w-3 h-3" />
                  )}
                  Delete
                </button>
              </>
            )}
            {videos.length > 0 && (
              <button
                onClick={() => openDeleteDialog('all')}
                disabled={deleting}
                className="inline-flex items-center gap-1 px-2 py-1.5 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting && deleteTarget?.type === 'all' ? (
                  <div className="animate-spin rounded-full h-3 w-3 border border-red-700 border-t-transparent"></div>
                ) : (
                  <Trash className="w-3 h-3" />
                )}
                Delete All
              </button>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files, false)}
        className="hidden"
      />
      <input
        ref={bulkFileInputRef}
        type="file"
        accept="video/*"
        multiple
        onChange={(e) => e.target.files && handleFileUpload(e.target.files, true)}
        className="hidden"
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mr-3"></div>
          <span className="text-gray-600 dark:text-gray-400">Loading videos...</span>
        </div>
      ) : videos.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-12 text-center">
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No videos uploaded</h3>
          <p className="text-gray-500 dark:text-gray-400">Upload your first customer video to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div 
              key={video._id} 
              className={`rounded-2xl border bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] ${
                selectedVideos.includes(video._id) 
                  ? 'border-[#d4af37] ring-2 ring-[#d4af37]/20' 
                  : 'border-gray-100 dark:border-gray-800'
              }`}
            >
              <div className="relative aspect-video bg-gray-100 dark:bg-[#2a2a2a] group">
                <video 
                  src={video.url}
                  className="w-full h-full object-cover"
                  muted
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={() => setPreviewVideo(video.url)}
                    className="bg-gradient-to-br from-white to-gray-100 rounded-full p-4 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-2xl border border-white/20 cursor-pointer hover:scale-110"
                  >
                    <Play className="w-10 h-10 text-gray-800 ml-1" fill="currentColor" />
                  </button>
                  <div className="absolute inset-0 rounded-xl border-2 border-[#d4af37]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  {editingPosition === video._id ? (
                    <div className="flex items-center gap-1 bg-black/70 rounded-lg p-1">
                      <input
                        type="number"
                        value={newPosition}
                        onChange={(e) => setNewPosition(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSavePosition(video._id)}
                        className="w-12 h-6 text-xs text-center bg-white text-black rounded border-0 outline-0"
                        min="1"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSavePosition(video._id)}
                        className="text-green-400 hover:text-green-300 p-0.5 cursor-pointer"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-red-400 hover:text-red-300 p-0.5 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm flex items-center gap-1">
                      #{video.position}
                      <button
                        onClick={() => handleEditPosition(video._id, video.position)}
                        className="text-yellow-400 hover:text-yellow-300 ml-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => handleSelectVideo(video._id)}
                    className="bg-black/50 text-white p-1 rounded hover:bg-black/70 transition-colors cursor-pointer"
                  >
                    {selectedVideos.includes(video._id) ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span>Uploaded: {new Date(video.createdAt).toLocaleDateString()}</span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                    video.isActive 
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-gray-500/15 text-gray-600 dark:text-gray-400'
                  }`}>
                    {video.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(video._id)}
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                      video.isActive
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25'
                    }`}
                  >
                    {video.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {video.isActive ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => openDeleteDialog('single', video._id)}
                    disabled={deleting}
                    className="p-2 text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting && deleteTarget?.type === 'single' && deleteTarget?.id === video._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-400"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress Modal */}
      {(uploading || bulkUploading || deleting) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 w-full max-w-md mx-4 border border-gray-100 dark:border-gray-800 shadow-2xl">
            {uploading && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Uploading Video</h3>
                  <span className="text-lg font-bold text-[#d4af37]">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] h-3 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {currentFileName}
                </p>
              </div>
            )}
            
            {bulkUploading && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Bulk Upload</h3>
                  <span className="text-lg font-bold text-blue-600">{bulkProgress.current}/{bulkProgress.total}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${bulkProgress.percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {bulkProgress.current > 0 ? `Processing video ${bulkProgress.current} of ${bulkProgress.total}` : 'Preparing upload...'}
                </p>
              </div>
            )}
            
            {deleting && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Deleting Videos</h3>
                  <span className="text-lg font-bold text-red-500">
                    {deleteProgress.total > 1 ? `${deleteProgress.current}/${deleteProgress.total}` : 'Processing...'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-red-400 to-red-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: deleteProgress.total > 0 ? `${(deleteProgress.current / deleteProgress.total) * 100}%` : '50%' }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {deleteProgress.status}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md cursor-pointer"
          onClick={() => setPreviewVideo(null)}
        >
          <div className="relative w-full max-w-3xl mx-4 px-4 sm:px-6 animate-in fade-in zoom-in duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setPreviewVideo(null)
              }}
              className="absolute -top-12 sm:-top-16 right-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3 text-white hover:text-gray-200 transition-all cursor-pointer group"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-200" />
            </button>
            <div 
              className="relative bg-gradient-to-br from-gray-900 to-black rounded-xl sm:rounded-2xl p-1 sm:p-2 shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <video 
                src={previewVideo}
                className="w-full aspect-video rounded-lg sm:rounded-xl shadow-inner cursor-default"
                controls
                autoPlay
                style={{
                  filter: 'contrast(1.1) saturate(1.1)',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3), 0 0 40px rgba(0,0,0,0.5)'
                }}
              />
              <div className="absolute inset-0 rounded-lg sm:rounded-xl pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-0.5 sm:h-1 bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] rounded-t-lg sm:rounded-t-xl opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-full h-0.5 sm:h-1 bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] rounded-b-lg sm:rounded-b-xl opacity-60"></div>
              </div>
            </div>
            <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-xs sm:text-sm font-medium">
              Click outside to close
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        isLoading={deleting}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => handleDelete(deleteTarget?.id)}
        title={`Delete ${deleteTarget?.type === 'single' ? 'Video' : deleteTarget?.type === 'bulk' ? 'Selected Videos' : 'All Videos'}`}
        message={getDeleteMessage()}
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}