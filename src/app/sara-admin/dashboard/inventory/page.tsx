'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, AlertTriangle, Edit2, Save, X, Loader2, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [stockValue, setStockValue] = useState('')
  const [priceValue, setPriceValue] = useState('')
  const [oldPriceValue, setOldPriceValue] = useState('')
  const [discountValue, setDiscountValue] = useState('')
  const [statusValue, setStatusValue] = useState<'active' | 'draft' | 'archived'>('active')

  // Initial Fetch
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async (pageNum = 1, append = false) => {
    try {
      const res = await fetch(`/api/admin/products?page=${pageNum}&limit=20`)
      const data = await res.json()
      
      if (data.products) {
        if (append) {
          setProducts(prev => [...prev, ...data.products])
        } else {
          setProducts(data.products)
        }
        setHasMore(data.pagination.page < data.pagination.pages)
        setPage(data.pagination.page)
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error)
      toast.error('Failed to load inventory')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true)
      fetchProducts(page + 1, true)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        fetchSearch(searchQuery)
      } else if (!loading && products.length === 0) {
        setPage(1)
        setLoading(true)
        fetchProducts(1, false)
      } else if (!searchQuery && products.length > 0) {
           setPage(1)
           fetchProducts(1, false)
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const fetchSearch = async (query: string) => {
      setLoading(true)
      try {
          const res = await fetch(`/api/admin/products?search=${encodeURIComponent(query)}&limit=100`)
          const data = await res.json()
          setProducts(data.products || [])
          setHasMore(false)
      } catch (error) {
          toast.error("Search failed")
      } finally {
          setLoading(false)
      }
  }

  const inventoryItems = useMemo(() => {
      return products.map(p => ({
          id: p._id,
          sku: p.sku || 'N/A',
          product: p.name,
          price: p.price || 0,
          oldPrice: p.oldPrice || 0,
          discount: p.discount || 0,
          stock: p.stock || 0,
          sold: p.sold || 0,
          threshold: 5,
          image: p.images?.[0]?.url,
          status: p.status || 'draft'
      }))
  }, [products])

  const lowStockItems = useMemo(() => {
    return inventoryItems.filter(item => item.stock <= item.threshold)
  }, [inventoryItems])

  const getStockStatus = (stock: number, threshold: number) => {
    if (stock === 0) return 'out'
    if (stock <= threshold) return 'low'
    return 'good'
  }

  const handleEditProduct = (item: any) => {
    setEditingId(item.id)
    setStockValue(item.stock.toString())
    setPriceValue(item.price.toString())
    setOldPriceValue(item.oldPrice.toString())
    setDiscountValue(item.discount.toString())
    setStatusValue(item.status)
  }

  const handleSaveUpdates = async (id: string) => {
    const newStock = parseInt(stockValue)
    const newPrice = parseFloat(priceValue)
    const newOldPrice = parseFloat(oldPriceValue)
    const newDiscount = parseInt(discountValue)

    if (isNaN(newStock) || newStock < 0) return toast.error('Invalid stock')
    if (isNaN(newPrice) || newPrice < 0) return toast.error('Invalid price')

    const originalProduct = products.find(p => p._id === id)
    
    setProducts(products.map(p => 
        p._id === id ? { 
          ...p, 
          stock: newStock, 
          status: statusValue,
          price: newPrice,
          oldPrice: newOldPrice,
          discount: newDiscount
        } : p
    ))
    setEditingId(null)

    try {
        const res = await fetch(`/api/admin/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              stock: newStock, 
              status: statusValue,
              price: newPrice,
              oldPrice: newOldPrice,
              discount: newDiscount
            })
        })

        if (!res.ok) throw new Error('Failed to update')
        toast.success('Product updated successfully!')
    } catch (error) {
        setProducts(products.map(p => p._id === id ? originalProduct : p))
        toast.error('Failed to update product')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Inventory & Prices</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor and manage product stock levels and pricing</p>
        </div>
        <div className="flex items-center gap-3">
          {lowStockItems.length > 0 && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                {lowStockItems.length} alert{lowStockItems.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search inventory by SKU or product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/90 dark:bg-[#1e1e1e]/90 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        <button
          onClick={() => fetchProducts(1, false)}
          className="px-4 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 transition-colors"
          title="Refresh Inventory"
          disabled={loading}
        >
          <RotateCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-[#2a2a2a]/50">
                <th className="p-4 font-semibold">SKU</th>
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Discount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && products.length === 0 ? (
                  <tr>
                      <td colSpan={7} className="p-8 text-center">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#d4af37]" />
                      </td>
                  </tr>
              ) : inventoryItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No inventory items found matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                inventoryItems.map((item) => {
                  const availability = getStockStatus(item.stock, item.threshold)
                  const isEditing = editingId === item.id
                  return (
                    <tr key={item.sku} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-[#2a2a2a]/30 transition-colors">
                      <td className="p-4 text-gray-900 dark:text-gray-100 font-medium font-mono text-xs">{item.sku}</td>
                      <td className="p-4 text-gray-700 dark:text-gray-300 font-semibold">
                        <div className="flex items-center gap-2">
                          {item.image && (
                              <img src={item.image} alt="" className="w-8 h-8 rounded object-cover" />
                          )}
                          <div className="flex flex-col">
                            <span className="truncate max-w-[150px]" title={item.product}>
                              {item.product}
                            </span>
                            <span className="text-[10px] text-gray-400">Sold: {item.sold} units</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {isEditing ? (
                          <input
                               type="number"
                               value={stockValue}
                               onChange={(e) => setStockValue(e.target.value)}
                               className="w-16 px-2 py-1 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                             />
                        ) : (
                          <span className={`font-bold ${availability === 'out' ? 'text-red-500' : availability === 'low' ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {item.stock}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {isEditing ? (
                          <div className="flex flex-col gap-1">
                            <input
                               type="number"
                               value={priceValue}
                               onChange={(e) => setPriceValue(e.target.value)}
                               className="w-20 px-2 py-1 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                               placeholder="New"
                             />
                            <input
                               type="number"
                               value={oldPriceValue}
                               onChange={(e) => setOldPriceValue(e.target.value)}
                               className="w-20 px-2 py-1 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-lg text-xs italic"
                               placeholder="Old"
                             />
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 dark:text-white">${item.price}</span>
                            {item.oldPrice > 0 && (
                              <span className="text-xs text-gray-400 line-through">${item.oldPrice}</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                               type="number"
                               value={discountValue}
                               onChange={(e) => setDiscountValue(e.target.value)}
                               className="w-16 px-2 py-1 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                             />
                             <span className="text-xs">%</span>
                          </div>
                        ) : (
                          <span className="text-red-500 font-medium">{item.discount}%</span>
                        )}
                      </td>
                      <td className="p-4">
                          {isEditing ? (
                              <select
                                  value={statusValue}
                                  onChange={(e) => setStatusValue(e.target.value as any)}
                                  className="px-2 py-1 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-100 dark:border-gray-800 rounded-lg text-xs"
                              >
                                  <option value="active">Active</option>
                                  <option value="draft">Draft</option>
                                  <option value="archived">Archived</option>
                              </select>
                          ) : (
                              <span className={`px-2 py-1 rounded-lg text-xs font-semibold capitalize ${
                                  item.status === 'active' ? 'bg-emerald-500/15 text-emerald-600' :
                                  'bg-gray-500/15 text-gray-600'
                              }`}>
                                  {item.status}
                              </span>
                          )}
                      </td>
                      <td className="p-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleSaveUpdates(item.id)} className="p-1 text-emerald-600 hover:bg-emerald-500/10 rounded-lg cursor-pointer"><Save className="w-4 h-4" /></button>
                            <button onClick={handleCancelEdit} className="p-1 text-red-600 hover:bg-red-500/10 rounded-lg cursor-pointer"><X className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <button onClick={() => handleEditProduct(item)} className="p-2 text-[#d4af37] hover:bg-[#d4af37]/10 rounded-lg cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        {!loading && hasMore && !searchQuery && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#2a2a2a]/50 flex justify-center">
             <button 
                onClick={loadMore} 
                disabled={loadingMore}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#d4af37] hover:bg-[#d4af37]/10 rounded-lg transition-colors"
             >
                 {loadingMore ? (
                     <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading more...
                     </>
                 ) : (
                     'Load More Products'
                 )}
             </button>
          </div>
        )}
      </div>
    </div>
  )
}
