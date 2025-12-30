'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Eye, UploadCloud, CheckSquare, Square, Trash, Edit3, Play, X, Image as ImageIcon, Video, Tag, FolderOpen, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { uploadFileAction } from "@/app/actions/media-actions"
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface GalleryItem {
  _id: string
  name: string
  url: string
  publicId: string
  type: 'image' | 'video'
  category: string
  createdAt: string
}

const CATEGORIES = [
  'general', 'rings', 'necklaces', 'earrings', 'bracelets', 'pendants', 
  'chains', 'bangles', 'anklets', 'chokers', 'watches', 'brooches', 
  'cufflinks', 'tiepins', 'charms', 'sets'
]

const getThumbnailUrl = (url: string, type: 'image' | 'video') => {
  if (type === 'video') return url
  if (url.includes('cloudinary.com') && !url.includes('upload/w_')) {
    return url.replace('/upload/', '/upload/w_400,c_fill,g_auto,q_auto,f_auto/')
  }
  return url
}

export default function GalleryUploadPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [bulkUploading, setBulkUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0, percentage: 0 })
  const [currentFileName, setCurrentFileName] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'single' | 'bulk' | 'all', id?: string }>()
  const [deleting, setDeleting] = useState(false)
  const [deleteProgress, setDeleteProgress] = useState({ current: 0, total: 0, status: '' })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bulkFileInputRef = useRef<HTMLInputElement>(null)
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', category: '' })

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  const fetchGalleryItems = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterCategory !== 'all') params.append('category', filterCategory)
      if (filterType !== 'all') params.append('type', filterType)
      
      const response = await fetch(`/api/admin/gallery?${params}`)
      if (response.ok) {
        const data = await response.json()
        setGalleryItems(data)
      } else {
        toast.error('Failed to fetch gallery items')
      }
    } catch (error) {
      toast.error('Failed to fetch gallery items')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (files: FileList, isBulk = false) => {
    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast.error(`${file.name} is not a valid image or video file`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    if (isBulk) {
      setBulkUploading(true)
      setBulkProgress({ current: 0, total: validFiles.length, percentage: 0 })
    } else {
      setUploading(true)
      setUploadProgress(0)
      setCurrentFileName(validFiles[0].name)
    }

    try {
      if (!isBulk) {
        setUploading(true)
        setUploadProgress(0)
        const file = validFiles[0]
        setCurrentFileName(file.name)

        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const newProgress = prev + Math.random() * 15
            return newProgress > 90 ? 90 : newProgress
          })
        }, 200)

        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        uploadFormData.append('folder', 'sara-jewelers/gallery')

        const result = await uploadFileAction(uploadFormData)
        clearInterval(progressInterval)
        setUploadProgress(95)

        if (result.success) {
          const galleryResponse = await fetch('/api/admin/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: file.name,
              url: result.url,
              publicId: result.publicId,
              type: result.isVideo ? 'video' : 'image',
              category: 'general'
            })
          })

          if (galleryResponse.ok) {
            setUploadProgress(100)
            const newItem = await galleryResponse.json()
            setGalleryItems(prev => [newItem, ...prev])
            toast.success('File uploaded successfully!')
          }
        }
      } else {
        setBulkUploading(true)
        const total = validFiles.length
        let completed = 0
        setBulkProgress({ current: 0, total, percentage: 0 })

        // Process in chunks of 5 for optimal performance without overloading
        const chunkSize = 5
        for (let i = 0; i < total; i += chunkSize) {
          const chunk = validFiles.slice(i, i + chunkSize)
          const chunkPromises = chunk.map(async (file) => {
            try {
              const uploadFormData = new FormData()
              uploadFormData.append('file', file)
              uploadFormData.append('folder', 'sara-jewelers/gallery')

              const result = await uploadFileAction(uploadFormData)
              if (result.success) {
                const galleryResponse = await fetch('/api/admin/gallery', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: file.name,
                    url: result.url,
                    publicId: result.publicId,
                    type: result.isVideo ? 'video' : 'image',
                    category: 'general'
                  })
                })

                if (galleryResponse.ok) {
                  const newItem = await galleryResponse.json()
                  completed++
                  setBulkProgress({
                    current: completed,
                    total,
                    percentage: Math.round((completed / total) * 100)
                  })
                  setGalleryItems(prev => [newItem, ...prev])
                  return true
                }
              }
            } catch (err) {
              console.error(`Failed to upload ${file.name}:`, err)
            }
            completed++ // Still increment to keep progress moving
            setBulkProgress(prev => ({ ...prev, current: completed, percentage: Math.round((completed / total) * 100) }))
            return false
          })
          await Promise.all(chunkPromises)
        }
        toast.success(`Bulk upload of ${total} files completed!`)
      }
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      if (isBulk) {
        setBulkUploading(false)
        setBulkProgress({ current: 0, total: 0, percentage: 0 })
      } else {
        setUploading(false)
        setUploadProgress(0)
        setCurrentFileName('')
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = ''
    if (bulkFileInputRef.current) bulkFileInputRef.current.value = ''
  }

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item._id)
    // Extract name without extension
    const nameWithoutExt = item.name.replace(/\.[^/.]+$/, '')
    setEditForm({
      name: nameWithoutExt,
      category: item.category
    })
  }

  const handleSaveEdit = async () => {
    if (!editingItem) return

    // Validate inputs
    if (!editForm.name.trim()) {
      toast.error('Name is required')
      return
    }
    if (!editForm.category) {
      toast.error('Category is required')
      return
    }

    try {
      // Find current item to get original extension
      const currentItem = galleryItems.find(item => item._id === editingItem)
      if (!currentItem) return

      // Extract original extension
      const originalExt = currentItem.name.match(/\.[^/.]+$/)?.[0] || ''
      const newNameWithExt = editForm.name.trim() + originalExt
      
      console.log('Saving edit for item:', editingItem, 'new name:', newNameWithExt)
      
      const response = await fetch(`/api/admin/gallery/${editingItem}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newNameWithExt,
          category: editForm.category
        })
      })
      
      if (response.ok) {
        const updatedItem = await response.json()
        console.log('Update successful:', updatedItem)
        
        // Update state immediately for real-time display
        setGalleryItems(prev => prev.map(item => 
          item._id === editingItem ? updatedItem : item
        ))
        toast.success('Item updated successfully')
        
        setEditingItem(null)
        setEditForm({ name: '', category: '' })
      } else {
        const errorData = await response.json()
        console.error('Update failed:', errorData)
        toast.error(errorData.error || 'Failed to update item')
      }
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update item')
    }
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setEditForm({ name: '', category: '' })
  }

  const handleDelete = async (id?: string) => {
    setDeleting(true)
    
    try {
      if (deleteTarget?.type === 'single' && id) {
        console.log('Deleting single item:', id)
        setDeleteProgress({ current: 1, total: 1, status: 'Deleting item from cloud storage...' })
        
        const response = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
        
        if (response.ok) {
          setDeleteProgress({ current: 1, total: 1, status: 'Removing from database...' })
          setGalleryItems(prev => prev.filter(item => item._id !== id))
          toast.success('Item deleted successfully')
          console.log('Single item deleted successfully')
        } else {
          const errorData = await response.json()
          console.error('Delete failed:', errorData)
          toast.error(errorData.error || 'Failed to delete item')
        }
      } else if (deleteTarget?.type === 'bulk') {
        console.log('Deleting bulk items:', selectedItems)
        const total = selectedItems.length
        setDeleteProgress({ current: 0, total, status: 'Preparing bulk deletion...' })
        
        const response = await fetch('/api/admin/gallery', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemIds: selectedItems })
        })
        
        if (response.ok) {
          setDeleteProgress({ current: total, total, status: 'Updating database...' })
          setGalleryItems(prev => prev.filter(item => !selectedItems.includes(item._id)))
          setSelectedItems([])
          toast.success(`${selectedItems.length} item(s) deleted successfully`)
          console.log('Bulk items deleted successfully')
        } else {
          const errorData = await response.json()
          console.error('Bulk delete failed:', errorData)
          toast.error(errorData.error || 'Failed to delete items')
        }
      } else if (deleteTarget?.type === 'all') {
        const allItemIds = galleryItems.map(item => item._id)
        console.log('Deleting all items:', allItemIds.length)
        const total = allItemIds.length
        setDeleteProgress({ current: 0, total, status: 'Preparing to delete all items...' })
        
        const response = await fetch('/api/admin/gallery', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemIds: allItemIds })
        })
        
        if (response.ok) {
          setDeleteProgress({ current: total, total, status: 'Clearing database...' })
          setGalleryItems([])
          setSelectedItems([])
          toast.success(`All ${galleryItems.length} item(s) deleted successfully`)
          console.log('All items deleted successfully')
        } else {
          const errorData = await response.json()
          console.error('Delete all failed:', errorData)
          toast.error(errorData.error || 'Failed to delete all items')
        }
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete item(s)')
    } finally {
      setDeleting(false)
      setDeleteProgress({ current: 0, total: 0, status: '' })
      setShowDeleteDialog(false)
    }
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    setSelectedItems(selectedItems.length === galleryItems.length ? [] : galleryItems.map(item => item._id))
  }

  const openDeleteDialog = (type: 'single' | 'bulk' | 'all', id?: string) => {
    setDeleteTarget({ type, id })
    setShowDeleteDialog(true)
  }

  const getDeleteMessage = () => {
    if (deleteTarget?.type === 'single') return 'This action cannot be undone.'
    if (deleteTarget?.type === 'bulk') return `This will permanently delete ${selectedItems.length} selected item(s).`
    if (deleteTarget?.type === 'all') return `This will permanently delete all ${galleryItems.length} item(s).`
    return ''
  }

  const filteredItems = galleryItems.filter(item => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false
    if (filterType !== 'all' && item.type !== filterType) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Gallery Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Upload and manage gallery images & videos • {galleryItems.length} total • 
            <span className="text-blue-600 dark:text-blue-400">{galleryItems.filter(item => item.type === 'image').length} images</span> • 
            <span className="text-purple-600 dark:text-purple-400">{galleryItems.filter(item => item.type === 'video').length} videos</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchGalleryItems}
            disabled={uploading || bulkUploading || deleting || loading}
            className="inline-flex items-center gap-2 bg-gray-500 text-white px-3 py-2 rounded-xl shadow hover:shadow-xl transition-all font-semibold disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            title="Refresh gallery"
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
            {uploading ? 'Uploading...' : 'Upload'}
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

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-gray-500" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-gray-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
        </div>
      </div>

      {filteredItems.length > 0 && (
        <div className="flex items-center justify-between bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-xl p-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              disabled={uploading || bulkUploading || deleting}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-[#d4af37] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedItems.length === filteredItems.length ? (
                <CheckSquare className="w-3.5 h-3.5" />
              ) : (
                <Square className="w-3.5 h-3.5" />
              )}
              {selectedItems.length === filteredItems.length ? 'Deselect' : 'Select All'}
            </button>
            {selectedItems.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                {selectedItems.length}
              </span>
            )}
          </div>
          <div className="flex gap-1.5">
            {selectedItems.length > 0 && (
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
            )}
            {filteredItems.length > 0 && (
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
        accept="image/*,video/*"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files, false)}
        className="hidden"
      />
      <input
        ref={bulkFileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={(e) => e.target.files && handleFileUpload(e.target.files, true)}
        className="hidden"
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mr-3"></div>
          <span className="text-gray-600 dark:text-gray-400">Loading gallery...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-12 text-center">
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No items found</h3>
          <p className="text-gray-500 dark:text-gray-400">Upload your first image or video to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item._id} 
              className={`rounded-2xl border bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] ${
                selectedItems.includes(item._id) 
                  ? 'border-[#d4af37] ring-2 ring-[#d4af37]/20' 
                  : 'border-gray-100 dark:border-gray-800'
              }`}
            >
              <div className="relative aspect-video bg-gray-100 dark:bg-[#2a2a2a] group">
                {item.type === 'image' ? (
                  <img 
                    src={getThumbnailUrl(item.url, item.type)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <video 
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="bg-gradient-to-br from-white to-gray-100 rounded-full p-4 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-2xl border border-white/20 cursor-pointer hover:scale-110"
                  >
                    {item.type === 'video' ? (
                      <Play className="w-10 h-10 text-gray-800 ml-1" fill="currentColor" />
                    ) : (
                      <Eye className="w-10 h-10 text-gray-800" />
                    )}
                  </button>
                </div>
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <div className="bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm flex items-center gap-1">
                    {item.type === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                    {item.category}
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => handleSelectItem(item._id)}
                    className="bg-black/50 text-white p-1 rounded hover:bg-black/70 transition-colors cursor-pointer"
                  >
                    {selectedItems.includes(item._id) ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="p-4">
                {editingItem === item._id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none"
                      placeholder="Enter name (extension will be preserved)"
                      required
                      minLength={1}
                      maxLength={100}
                    />
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none"
                      required
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-600 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span className="truncate">{item.name}</span>
                      <span className="text-xs">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/15 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-semibold hover:bg-blue-500/25 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteDialog('single', item._id)}
                        disabled={deleting}
                        className="p-2 text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleting && deleteTarget?.type === 'single' && deleteTarget?.id === item._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-400"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </>
                )}
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Uploading</h3>
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
                  {bulkProgress.current > 0 ? `Processing item ${bulkProgress.current} of ${bulkProgress.total}` : 'Preparing upload...'}
                </p>
              </div>
            )}
            
            {deleting && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Deleting</h3>
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

      {/* Preview Modal */}
      {previewItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md cursor-pointer"
          onClick={() => setPreviewItem(null)}
        >
          <div className="relative w-full max-w-3xl mx-4 px-4 sm:px-6 animate-in fade-in zoom-in duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setPreviewItem(null)
              }}
              className="absolute -top-12 sm:-top-16 right-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3 text-white hover:text-gray-200 transition-all cursor-pointer group"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-200" />
            </button>
            <div 
              className="relative bg-gradient-to-br from-gray-900 to-black rounded-xl sm:rounded-2xl p-1 sm:p-2 shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {previewItem.type === 'image' ? (
                <img 
                  src={previewItem.url}
                  alt={previewItem.name}
                  className="w-full aspect-video rounded-lg sm:rounded-xl shadow-inner cursor-default"
                  style={{
                    filter: 'contrast(1.1) saturate(1.1)',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3), 0 0 40px rgba(0,0,0,0.5)'
                  }}
                />
              ) : (
                <video 
                  src={previewItem.url}
                  className="w-full aspect-video rounded-lg sm:rounded-xl shadow-inner cursor-default"
                  controls
                  autoPlay
                  style={{
                    filter: 'contrast(1.1) saturate(1.1)',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3), 0 0 40px rgba(0,0,0,0.5)'
                  }}
                />
              )}
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
        onClose={() => {
          if (!deleting) {
            setShowDeleteDialog(false)
            setDeleteTarget(undefined)
          }
        }}
        onConfirm={() => handleDelete(deleteTarget?.id)}
        title={`Delete ${deleteTarget?.type === 'single' ? 'Item' : deleteTarget?.type === 'bulk' ? 'Selected Items' : 'All Items'}`}
        message={getDeleteMessage()}
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        type="danger"
      />
    </div>
  )
}
