'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Search, Eye, Edit, Trash2, Star, Gift, Loader2, RotateCcw, Copy, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface Product {
  _id: string
  name: string
  sku: string
  category: string
  productType: string
  price: number
  stock: number
  status: 'active' | 'draft' | 'archived'
  isNewProduct: boolean
  isFeatured: boolean
  createdAt: string
  images: { id: string, url: string, type: string }[]
}

export default function ProductsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [searchQuery, pagination.page])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchQuery && { search: searchQuery })
      })
      
      const response = await fetch(`/api/admin/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
        setPagination(prev => ({ ...prev, ...data.pagination }))
      } else {
        toast.error('Failed to fetch products')
      }
    } catch (error) {
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const handleDuplicate = async (product: Product) => {
    try {
      setLoading(true)
      // Fetch full product details to ensure we have everything
      const res = await fetch(`/api/admin/products/${product._id}`)
      if (!res.ok) throw new Error('Failed to fetch details')
      const fullProduct = await res.json()

      // Create duplicate data - keep same name, description, etc.
      const duplicateData = {
        ...fullProduct,
        // Keep the same name, description, and all content
        sku: `${fullProduct.sku}-COPY-${Math.floor(Math.random() * 1000)}`, // Only change SKU for uniqueness
        status: 'draft',
        _id: undefined, // Remove ID to create new
        createdAt: undefined,
        updatedAt: undefined
      }

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicateData)
      })

      if (response.ok) {
        toast.success('Product duplicated! Check the top of the list.')
        // Reset to page 1 to see the newly duplicated product at the top
        setPagination(prev => ({ ...prev, page: 1 }))
        fetchProducts()
      } else {
        const err = await response.json()
        toast.error(err.error || 'Failed to duplicate product')
      }
    } catch (error) {
      toast.error('Failed to duplicate product')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteProductId) return
    
    try {
      const response = await fetch(`/api/admin/products/${deleteProductId}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Product deleted successfully')
        fetchProducts()
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      toast.error('Failed to delete product')
    } finally {
      setShowDeleteDialog(false)
      setDeleteProductId(null)
    }
  }

  const openDeleteDialog = (id: string) => {
    setDeleteProductId(id)
    setShowDeleteDialog(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Products</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your product inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchProducts()}
            className="p-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
            title="Refresh List"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <Link href="/sara-admin/dashboard/products/add">
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black px-4 py-2 rounded-xl shadow hover:shadow-xl transition-all font-semibold cursor-pointer">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products by name, SKU, or category..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-3 bg-white/90 dark:bg-[#1e1e1e]/90 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-[#2a2a2a]/50">
                <th className="p-4 font-semibold">Image</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">SKU</th>
                <th className="p-4 font-semibold">Tags</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading products...
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    {searchQuery ? `No products found matching "${searchQuery}"` : 'No products found'}
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-[#2a2a2a]/30 transition-colors">
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#2a2a2a]">
                        {p.images?.find(img => img.type === 'front')?.url ? (
                          <img 
                            src={p.images.find(img => img.type === 'front')?.url} 
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-900 dark:text-gray-100 font-medium">
                      <div className="flex flex-col">
                        <span>{p.name}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-tighter sm:hidden">{p.sku}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700 dark:text-gray-300 font-mono text-xs hidden sm:table-cell">{p.sku}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {p.isFeatured && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
                            <Star className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                        {p.isNewProduct && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                            New
                          </span>
                        )}
                        {!p.isFeatured && !p.isNewProduct && (
                          <span className="text-xs text-gray-400 dark:text-gray-500">None</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-900 dark:text-gray-100 font-semibold">${p.price.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${p.stock > 10 ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : p.stock > 0 ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' : 'bg-red-500/15 text-red-600 dark:text-red-400'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${p.status === 'active' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : p.status === 'draft' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' : 'bg-gray-500/15 text-gray-600 dark:text-gray-400'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/sara-admin/dashboard/products/${p._id}`}
                          className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-[#d4af37] hover:bg-[#d4af37]/10 rounded-lg transition-colors cursor-pointer" 
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDuplicate(p)}
                          className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer" 
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <Link 
                          href={`/sara-admin/dashboard/products/${p._id}/edit`}
                          className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer" 
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => openDeleteDialog(p._id)}
                          className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && products.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#2a2a2a]/50 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {products.length} of {pagination.total} products
            </div>
            {pagination.pages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}
