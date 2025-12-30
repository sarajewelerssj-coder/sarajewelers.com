'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { uploadFileAction } from "@/app/actions/media-actions"

interface Category {
  _id: string
  name: string
  slug: string
  description: string
  image: string
  isActive: boolean
  createdAt: string
}

interface GalleryItem {
  _id: string
  name: string
  url: string
  type: 'image' | 'video'
  category: string
  createdAt?: string
}

interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'add' | 'edit'
  category?: Category | null
  onSuccess: (category: Category) => void
  onUpdate: (category: Category) => void
}

const STORAGE_KEY = 'sara-admin-category-form-draft'

export default function CategoryFormModal({
  isOpen,
  onClose,
  mode,
  category,
  onSuccess,
  onUpdate
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState({ name: '', description: '', image: '' })
  const [uploading, setUploading] = useState(false)
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [galleryLoading, setGalleryLoading] = useState(false)
  const [gallerySearch, setGallerySearch] = useState('')
  const [galleryFilter, setGalleryFilter] = useState('all')
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('all')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const CATEGORIES = [
    'general', 'rings', 'necklaces', 'earrings', 'bracelets', 'pendants', 
    'chains', 'bangles', 'anklets', 'chokers', 'watches', 'brooches', 
    'cufflinks', 'tiepins', 'charms', 'sets'
  ]

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && category) {
        setFormData({
          name: category.name,
          description: category.description,
          image: category.image
        })
      } else if (mode === 'add') {
        loadFromLocalStorage()
      }
    }
  }, [isOpen, mode, category])

  useEffect(() => {
    if (!isOpen || mode !== 'add') return
    
    const timeoutId = setTimeout(() => {
      saveToLocalStorage()
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [formData.name, formData.description, formData.image, isOpen, mode])

  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        const parsed = JSON.parse(savedData)
        setFormData(parsed)
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
  }

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  const clearLocalStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a category name')
      return
    }
    if (!formData.image) {
      toast.error('Please select an image')
      return
    }

    try {
      if (mode === 'add') {
        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            description: formData.description.trim(),
            image: formData.image
          })
        })

        if (response.ok) {
          const data = await response.json()
          onSuccess(data.category)
          handleClose()
          toast.success('Category added successfully!')
        } else {
          const error = await response.json()
          toast.error(error.error || 'Failed to add category')
        }
      } else if (mode === 'edit' && category) {
        const response = await fetch(`/api/admin/categories/${category._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            description: formData.description.trim(),
            image: formData.image
          })
        })

        if (response.ok) {
          const data = await response.json()
          onUpdate(data.category)
          handleClose()
          toast.success('Category updated successfully!')
        } else {
          const error = await response.json()
          toast.error(error.error || 'Failed to update category')
        }
      }
    } catch (error) {
      toast.error(`Failed to ${mode} category`)
    }
  }

  const handleClose = () => {
    setFormData({ name: '', description: '', image: '' })
    if (mode === 'add') {
      clearLocalStorage()
    }
    onClose()
  }

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('folder', 'sara-jewelers/categories')

      const result = await uploadFileAction(uploadFormData)

      if (result.success) {
        setFormData(prev => ({ ...prev, image: result.url || '' }))
        toast.success('Image uploaded successfully!')
      } else {
        toast.error(result.error || 'Failed to upload image')
      }
    } catch (error) {
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const fetchGalleryItems = async () => {
    try {
      setGalleryLoading(true)
      const response = await fetch('/api/admin/gallery')
      if (response.ok) {
        const data = await response.json()
        setGalleryItems(data || [])
      }
    } catch (error) {
      console.error('Failed to fetch gallery items:', error)
    } finally {
      setGalleryLoading(false)
    }
  }

  const openGalleryModal = () => {
    fetchGalleryItems()
    setShowGalleryModal(true)
  }

  const selectFromGallery = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl }))
    setShowGalleryModal(false)
    toast.success('Image selected from gallery!')
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 w-full mx-4 border border-gray-100 dark:border-gray-800 shadow-2xl max-w-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {mode === 'add' ? 'Add New Category' : 'Edit Category'}
            </h3>
            <button 
              onClick={handleClose} 
              className="p-1 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100 placeholder-gray-400"
                placeholder="e.g., Engagement Rings"
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100 resize-none placeholder-gray-400"
                placeholder="Brief description of the category"
                rows={3}
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category Image *
              </label>
              {formData.image ? (
                <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img src={formData.image} alt="Preview" className="w-full h-40 object-cover" />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex flex-col items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-[#d4af37] transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed bg-gray-50 dark:bg-[#2a2a2a]"
                  >
                    {uploading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#d4af37]"></div>
                    ) : (
                      <Upload className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                      {uploading ? 'Uploading...' : 'Upload'}
                    </span>
                  </button>
                  <button
                    onClick={openGalleryModal}
                    className="flex flex-col items-center justify-center gap-2 px-4 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-xs text-center">Gallery</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSubmit}
                disabled={!formData.name.trim() || !formData.image}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {mode === 'add' ? 'Add Category' : 'Update Category'}
              </button>
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-[#333] transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Selection Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 w-full mx-4 border border-gray-100 dark:border-gray-800 shadow-2xl max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Select Image from Gallery</h3>
              <button 
                onClick={() => setShowGalleryModal(false)} 
                className="p-1 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-3 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-xl p-4">
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search gallery by name..."
                    value={gallerySearch}
                    onChange={(e) => setGallerySearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  />
                </div>
                <select
                  value={galleryCategoryFilter}
                  onChange={(e) => setGalleryCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
                <select
                  value={galleryFilter}
                  onChange={(e) => setGalleryFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                >
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                </select>
              </div>

              {/* Gallery Grid */}
              {galleryLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mr-3"></div>
                  <span className="text-gray-600 dark:text-gray-400">Loading gallery...</span>
                </div>
              ) : (() => {
                const filteredItems = galleryItems.filter(item => {
                  const matchesSearch = item.name.toLowerCase().includes(gallerySearch.toLowerCase())
                  const matchesType = galleryFilter === 'all' || item.type === galleryFilter
                  const matchesCategory = galleryCategoryFilter === 'all' || item.category === galleryCategoryFilter
                  return matchesSearch && matchesType && matchesCategory
                })

                if (filteredItems.length === 0) {
                  return (
                    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-12 text-center">
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No items found</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {galleryItems.length === 0 
                          ? 'Upload your first image or video to get started' 
                          : 'Try adjusting your search or filter'}
                      </p>
                    </div>
                  )
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[500px] overflow-y-auto pr-2">
                    {filteredItems.map((item) => (
                      <div 
                        key={item._id} 
                        onClick={() => selectFromGallery(item.url)}
                        className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer hover:border-[#d4af37]/40"
                      >
                        <div className="relative aspect-video bg-gray-100 dark:bg-[#2a2a2a]">
                          <img 
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 flex items-center gap-1">
                            <div className="bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" />
                              {item.category}
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <span className="truncate font-medium">{item.name}</span>
                            <span className="text-xs">{new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
        className="hidden"
      />
    </>
  )
}