'use client'

import { useState, useMemo, useEffect, memo } from 'react'
import { Plus, Search, Edit, Trash2, RefreshCw, CheckSquare, Square, Trash } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import CategoryFormModal from '@/components/CategoryFormModal'

interface Category {
  _id: string
  name: string
  slug: string
  description: string
  image: string
  isActive: boolean
  isPermanent?: boolean
  createdAt: string
}



export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showFormModal, setShowFormModal] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'single' | 'bulk' | 'all', id?: string }>()
  const [deleting, setDeleting] = useState(false)



  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      } else {
        toast.error('Failed to fetch categories')
      }
    } catch (error) {
      toast.error('Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }



  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const query = searchQuery.toLowerCase()
    return categories.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.slug.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query)
    )
  }, [searchQuery, categories])


  const handleAddSuccess = (category: Category) => {
    setCategories(prev => [category, ...prev])
    setShowFormModal(false)
  }

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setModalMode('edit')
    setShowFormModal(true)
  }

  const handleUpdateSuccess = (category: Category) => {
    setCategories(prev => prev.map(c => 
      c._id === category._id ? category : c
    ))
    setShowFormModal(false)
    setSelectedCategory(null)
  }

  const handleDelete = async (id?: string) => {
    setDeleting(true)
    
    try {
      if (deleteTarget?.type === 'single' && id) {
        const response = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
        
        if (response.ok) {
          setCategories(prev => prev.filter(item => item._id !== id))
          toast.success('Category deleted successfully')
        } else {
          const errorData = await response.json()
          toast.error(errorData.error || 'Failed to delete category')
        }
      } else if (deleteTarget?.type === 'bulk') {
        const response = await fetch('/api/admin/categories', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoryIds: selectedItems })
        })
        
        if (response.ok) {
          setCategories(prev => prev.filter(item => !selectedItems.includes(item._id)))
          setSelectedItems([])
          toast.success(`${selectedItems.length} categories deleted successfully`)
        } else {
          const errorData = await response.json()
          toast.error(errorData.error || 'Failed to delete categories')
        }
      } else if (deleteTarget?.type === 'all') {
        const allItemIds = categories.map(item => item._id)
        const response = await fetch('/api/admin/categories', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoryIds: allItemIds })
        })
        
        if (response.ok) {
          setCategories([])
          setSelectedItems([])
          toast.success(`All ${categories.length} categories deleted successfully`)
        } else {
          const errorData = await response.json()
          toast.error(errorData.error || 'Failed to delete all categories')
        }
      }
    } catch (error) {
      toast.error('Failed to delete category(s)')
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleSelectItem = (id: string) => {
    const category = categories.find(c => c._id === id)
    if (category?.isPermanent) return
    
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    const nonPermanentCategories = categories.filter(c => !c.isPermanent)
    setSelectedItems(selectedItems.length === nonPermanentCategories.length ? [] : nonPermanentCategories.map(item => item._id))
  }

  const openDeleteDialog = (type: 'single' | 'bulk' | 'all', id?: string) => {
    setDeleteTarget({ type, id })
    setShowDeleteDialog(true)
  }

  const getDeleteMessage = () => {
    if (deleteTarget?.type === 'single') return 'This action cannot be undone.'
    if (deleteTarget?.type === 'bulk') return `This will permanently delete ${selectedItems.length} selected categories.`
    if (deleteTarget?.type === 'all') return `This will permanently delete all ${categories.length} categories.`
    return ''
  }



  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Categories</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage jewelry categories • {categories.length} total</p>
        </div>
        <div className="flex gap-2">

          <button
            onClick={fetchCategories}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-gray-500 text-white px-3 py-2 rounded-xl shadow hover:shadow-xl transition-all font-semibold disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            title="Refresh categories"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setModalMode('add')
              setShowFormModal(true)
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black px-4 py-2 rounded-xl shadow hover:shadow-xl transition-all font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search categories by name or slug..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/90 dark:bg-[#1e1e1e]/90 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* Bulk Actions */}
      {filteredCategories.length > 0 && (
        <div className="flex items-center justify-between bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-lg p-2.5">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              disabled={deleting}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-[#d4af37] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedItems.length === filteredCategories.length ? (
                <CheckSquare className="w-3.5 h-3.5" />
              ) : (
                <Square className="w-3.5 h-3.5" />
              )}
              {selectedItems.length === filteredCategories.length ? 'Deselect' : 'Select All'}
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
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            )}
            {filteredCategories.length > 0 && (
              <button
                onClick={() => openDeleteDialog('all')}
                disabled={deleting}
                className="inline-flex items-center gap-1 px-2 py-1.5 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash className="w-3 h-3" />
                Delete All
              </button>
            )}
          </div>
        </div>
      )}

      {/* Categories Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mr-3"></div>
          <span className="text-gray-600 dark:text-gray-400">Loading categories...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredCategories.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              {searchQuery ? `No categories found matching "${searchQuery}"` : 'No categories found. Add your first category to get started.'}
            </div>
          ) : (
            filteredCategories.map((category) => {
              const isSelected = selectedItems.includes(category._id)
              return (
                <div key={category._id} className={`rounded-xl border bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm overflow-hidden transition-all group hover:shadow-lg ${
                  isSelected 
                    ? 'border-[#d4af37] ring-2 ring-[#d4af37]/20' 
                    : 'border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40'
                }`}>
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-1.5 left-1.5">
                      {category.isPermanent ? (
                        <div className="bg-[#d4af37] text-black px-2 py-0.5 rounded text-xs font-bold">
                          PERMANENT
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSelectItem(category._id)}
                          className="bg-black/50 text-white p-0.5 rounded hover:bg-black/70 transition-colors cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-3 h-3" />
                          ) : (
                            <Square className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-1 bg-black/50 text-white hover:bg-blue-500 rounded transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      {!category.isPermanent && (
                        <button
                          onClick={() => openDeleteDialog('single', category._id)}
                          className="p-1 bg-black/50 text-white hover:bg-red-500 rounded transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="absolute bottom-1.5 left-1.5 right-1.5">
                      <h3 className="text-white font-semibold text-sm truncate">{category.name}</h3>
                      <p className="text-white/80 text-xs font-mono truncate">/{category.slug}</p>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 min-h-[2.5rem]">
                      {category.description || 'No description provided'}
                    </p>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      <CategoryFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false)
          setSelectedCategory(null)
        }}
        mode={modalMode}
        category={selectedCategory}
        onSuccess={handleAddSuccess}
        onUpdate={handleUpdateSuccess}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          if (!deleting) {
            setShowDeleteDialog(false)
            setDeleteTarget(undefined)
          }
        }}
        onConfirm={() => handleDelete(deleteTarget?.id)}
        title={`Delete ${deleteTarget?.type === 'single' ? 'Category' : deleteTarget?.type === 'bulk' ? 'Selected Categories' : 'All Categories'}`}
        message={getDeleteMessage()}
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        type="danger"
      />
    </div>
  )
}