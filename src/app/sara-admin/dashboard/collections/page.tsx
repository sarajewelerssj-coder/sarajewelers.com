'use client'

import { useState, useMemo, useEffect } from 'react'
import { Package, Gift, Search, Plus, X, Star, Tags, RefreshCw, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface Category {
  _id: string
  name: string
  slug: string
  description: string
  image: string
  isActive: boolean
}

interface Product {
  _id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  status: 'active' | 'draft' | 'archived'
  images?: { id: string; url: string; type: 'front' | 'back' | 'gallery' }[] | string[] // Added images array
}

// ... existing code ...



export default function CollectionsPage() {
  const [activeTab, setActiveTab] = useState<'feature' | 'gifts' | 'shop-by-category'>('feature')
  const [searchQuery, setSearchQuery] = useState('')
  const [localCollections, setLocalCollections] = useState<any[]>([])
  const [loadingCollections, setLoadingCollections] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const fetchData = async () => {
    await fetchCollections()
    if (activeTab === 'shop-by-category') {
      await fetchCategories()
    } else {
      await fetchProducts()
    }
  }

  const fetchCollections = async () => {
    try {
      setLoadingCollections(true)
      const response = await fetch('/api/admin/collections')
      if (response.ok) {
        const data = await response.json()
        setLocalCollections(data.collections || [])
      }
    } catch (error) {
      toast.error('Failed to fetch collections')
    } finally {
      setLoadingCollections(false)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true)
      const response = await fetch('/api/admin/products?limit=1000')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      } else {
        toast.error('Failed to fetch products')
      }
    } catch (error) {
      toast.error('Failed to fetch products')
    } finally {
      setLoadingProducts(false)
    }
  }

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true)
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      } else {
        toast.error('Failed to fetch categories')
      }
    } catch (error) {
      toast.error('Failed to fetch categories')
    } finally {
      setLoadingCategories(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchCollections()
      if (activeTab === 'shop-by-category') {
        await fetchCategories()
      } else {
        await fetchProducts()
      }
      toast.success('Content refreshed successfully')
    } catch (error) {
      toast.error('Failed to refresh content')
    } finally {
      setRefreshing(false)
    }
  }

  const saveCollection = async (collection: any) => {
    try {
      setIsSaving(true)
      const response = await fetch('/api/admin/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collection)
      })
      if (response.ok) {
        toast.success(`${collection.name} saved successfully`)
      } else {
        toast.error(`Failed to save ${collection.name}`)
      }
    } catch (error) {
      toast.error(`Failed to save ${collection.name}`)
    } finally {
      setIsSaving(false)
    }
  }

  const truncateText = (text: string, maxLength: number = 30) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  const currentCollection = useMemo(() => {
    return localCollections.find((c: any) => c.type === activeTab)
  }, [activeTab, localCollections])

  const availableProducts = useMemo(() => {
    const query = searchQuery.toLowerCase()
    let filtered = products.filter((p: any) => 
      p.name.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    )
    
    // Filter out products already in the current collection
    if (currentCollection) {
      const assignedIds = currentCollection.products.map((p: any) => p.productId)
      filtered = filtered.filter((p: any) => !assignedIds.includes(p._id))
    }
    
    return filtered
  }, [searchQuery, currentCollection, products])

  const availableCategories = useMemo(() => {
    const query = searchQuery.toLowerCase()
    let filtered = categories.filter((c: any) => 
      c.name.toLowerCase().includes(query) ||
      c.slug.toLowerCase().includes(query) ||
      (c.description && c.description.toLowerCase().includes(query))
    )
    
    // Filter out categories already in the current collection
    if (currentCollection) {
      const assignedIds = currentCollection.categories.map((c: any) => c.categoryId)
      filtered = filtered.filter((c: any) => !assignedIds.includes(c._id))
    }
    
    return filtered
  }, [searchQuery, currentCollection, categories])

  const handleAddProduct = (product: Product) => {
    if (!currentCollection) return
    
    const collectionProduct = {
      productId: product._id,
      productName: product.name,
      sku: product.sku,
      price: product.price,
      image: (() => {
        if (!product.images || product.images.length === 0) return null;
        if (typeof product.images[0] === 'string') return product.images[0];
        
        const frontImage = (product.images as any[]).find(img => img.type === 'front');
        return frontImage ? frontImage.url : (product.images[0] as any).url;
      })()
    }
    
    const updatedCollections = localCollections.map((col: any) => {
      if (col.id === currentCollection.id) {
        return {
          ...col,
          products: [...col.products, collectionProduct]
        }
      }
      return col
    })
    
    setLocalCollections(updatedCollections)
    toast.success(`${product.name} added conditionally (Click Save to persist)`)
  }

  const handleRemoveProduct = (productId: string) => {
    if (!currentCollection) return
    
    const updatedCollections = localCollections.map((col: any) => {
      if (col.id === currentCollection.id) {
        return {
          ...col,
          products: col.products.filter((p: any) => p.productId !== productId)
        }
      }
      return col
    })
    
    setLocalCollections(updatedCollections)
  }

  const handleAddCategory = (category: Category) => {
    if (!currentCollection) return
    
    const collectionCategory = {
      categoryId: category._id,
      categoryName: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image
    }
    
    const updatedCollections = localCollections.map((col: any) => {
      if (col.id === currentCollection.id) {
        return {
          ...col,
          categories: [...col.categories, collectionCategory]
        }
      }
      return col
    })
    
    setLocalCollections(updatedCollections)
    toast.success(`${category.name} added conditionally (Click Save to persist)`)
  }

  const handleRemoveCategory = (categoryId: string) => {
    if (!currentCollection) return
    
    const updatedCollections = localCollections.map((col: any) => {
      if (col.id === currentCollection.id) {
        return {
          ...col,
          categories: col.categories.filter((c: any) => c.categoryId !== categoryId)
        }
      }
      return col
    })
    
    setLocalCollections(updatedCollections)
  }

  if (loadingCollections) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-white/50 dark:bg-black/20 rounded-3xl border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#f4d03f]/20 border-b-[#f4d03f] rounded-full animate-spin-reverse"></div>
          </div>
        </div>
        <p className="text-[#d4af37] font-medium animate-pulse tracking-widest uppercase text-xs">Organizing Experience...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Collections</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Curate your home page sections • {currentCollection?.products?.length || currentCollection?.categories?.length || 0} items active
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => currentCollection && saveCollection(currentCollection)}
            disabled={isSaving || !currentCollection}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-[#333] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl w-fit border border-gray-200 dark:border-gray-700">
        {(['feature', 'gifts', 'shop-by-category'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === tab
                ? 'bg-white dark:bg-gray-700 text-[#d4af37] shadow-md scale-105'
                : 'text-gray-500 dark:text-gray-400 hover:text-[#d4af37] hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
          >
            {tab === 'feature' ? <Star className="w-4 h-4" /> : tab === 'gifts' ? <Gift className="w-4 h-4" /> : <Tags className="w-4 h-4" />}
            <span className="capitalize">{tab === 'shop-by-category' ? 'Categories' : tab} Collection</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Assigned Items */}
        <div className="xl:col-span-12">
          <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                 {activeTab === 'feature' ? <Star className="w-6 h-6 text-[#d4af37]" /> : activeTab === 'gifts' ? <Gift className="w-6 h-6 text-[#d4af37]" /> : <Tags className="w-6 h-6 text-[#d4af37]" />}
                 {currentCollection?.name}
              </h3>
              <div className="px-4 py-1.5 bg-[#d4af37]/10 text-[#d4af37] rounded-full text-xs font-bold border border-[#d4af37]/20 uppercase tracking-widest">
                {activeTab === 'shop-by-category' ? (currentCollection?.categories.length || 0) : (currentCollection?.products.length || 0)} items active
              </div>
            </div>
            
            {(activeTab === 'shop-by-category' ? (currentCollection?.categories?.length || 0) : (currentCollection?.products?.length || 0)) === 0 ? (
              <div className="text-center py-20 bg-gray-50/50 dark:bg-black/10 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-full flex items-center justify-center opacity-50">
                   {activeTab === 'shop-by-category' ? <Tags className="w-10 h-10" /> : <Package className="w-10 h-10" />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Updated soon</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">No items have been assigned to this collection yet. Select from the items below to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {activeTab === 'shop-by-category' ? (
                  currentCollection?.categories.map((category: any) => (
                    <div key={category.categoryId} className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#2a2a2a] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      {category.image && typeof category.image === 'string' && category.image.trim() !== '' ? (
                        <Image src={category.image} alt={category.categoryName} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                          <Tags className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="font-bold text-white text-lg truncate">{category.categoryName}</p>
                        <p className="text-white/60 text-xs font-mono">/{category.slug}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveCategory(category.categoryId)}
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 cursor-pointer"
                        title="Remove from collection"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  currentCollection?.products.map((product: any) => (
                    <div key={product.productId} className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#2a2a2a] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      {product.image && typeof product.image === 'string' && product.image.trim() !== '' ? (
                        <Image 
                          src={product.image} 
                          alt={product.productName} 
                          fill 
                          className="object-cover" 
                        />
                      ) : (
                         <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                             <Package className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                         </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <p className="font-bold text-lg truncate mb-1">{product.productName}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/70 font-mono tracking-tighter">{product.sku}</span>
                          <span className="text-sm font-bold text-[#d4af37] bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">${product.price.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveProduct(product.productId)}
                        className="absolute top-3 right-3 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 cursor-pointer backdrop-blur-sm"
                        title="Remove from collection"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Available Items */}
        <div className="xl:col-span-12">
          <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                Available {activeTab === 'shop-by-category' ? 'Categories' : 'Products'}
              </h3>
              
              {/* Search */}
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={activeTab === 'shop-by-category' ? 'Search categories...' : 'Search products...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                />
              </div>
            </div>

            <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {activeTab === 'shop-by-category' ? (
                loadingCategories ? (
                  <div className="text-center py-20">
                    <Loader2 className="w-10 h-10 text-[#d4af37] animate-spin mx-auto mb-2" />
                    <p className="text-gray-500">Loading categories...</p>
                  </div>
                ) : availableCategories.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50/50 dark:bg-black/5 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800/50">
                    <p className="text-gray-500">No categories found matching your search</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {availableCategories.map((category: any) => (
                      <div key={category._id} className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1e1e1e] hover:border-[#d4af37]/50 transition-all">
                        {category.image && typeof category.image === 'string' && category.image.trim() !== '' ? (
                           <Image src={category.image} alt={category.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        ) : (
                           <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                             <Tags className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                           </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                        <div className="absolute inset-0 p-4 flex flex-col justify-end pointer-events-none">
                          <p className="font-bold text-white text-lg truncate">{category.name}</p>
                        </div>
                        <button
                          onClick={() => handleAddCategory(category)}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-[#d4af37] text-black rounded-full shadow-2xl scale-0 group-hover:scale-100 transition-all hover:bg-[#f4d03f] cursor-pointer z-10"
                          title="Add to collection"
                        >
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                loadingProducts ? (
                  <div className="text-center py-20">
                    <Loader2 className="w-10 h-10 text-[#d4af37] animate-spin mx-auto mb-2" />
                    <p className="text-gray-500">Loading products...</p>
                  </div>
                ) : availableProducts.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50/50 dark:bg-black/5 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800/50">
                    <p className="text-gray-500 text-lg">All items already assigned or none found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {availableProducts.map((product: any) => {
                       // Find the image, prioritizing 'front' type
                       const frontImage = product.images && typeof product.images[0] !== 'string' 
                         ? (product.images as any[]).find(img => img.type === 'front') 
                         : null;
                       
                       const displayImage = frontImage 
                         ? frontImage.url 
                         : (product.images && product.images.length > 0 
                             ? (typeof product.images[0] === 'string' ? product.images[0] : (product.images[0] as any).url) 
                             : (product.image || null));

                       return (
                        <div key={product._id} className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1e1e1e] hover:border-[#d4af37]/50 transition-all">
                          {displayImage && typeof displayImage === 'string' && displayImage.trim() !== '' ? (
                            <Image 
                              src={displayImage} 
                              alt={product.name} 
                              fill 
                              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                               <Package className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                            </div>
                          )}
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                          
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white pointer-events-none">
                            <p className="font-bold text-lg truncate mb-1">{product.name}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-white/70 font-mono tracking-tighter">{product.sku}</span>
                              <span className="text-sm font-bold text-[#d4af37] bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">${product.price.toFixed(2)}</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleAddProduct(product)}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-[#d4af37] text-black rounded-full shadow-2xl scale-0 group-hover:scale-100 transition-all hover:bg-[#f4d03f] cursor-pointer z-10"
                            title="Add to collection"
                          >
                            <Plus className="w-6 h-6" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
