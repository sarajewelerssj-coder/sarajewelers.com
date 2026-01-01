'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { ArrowLeft, Save, X, Image as ImageIcon, Upload, Grid3x3, Star, RotateCcw, Plus, Minus, Sparkles, Loader2, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import ProductVariations from '@/components/admin/ProductVariations'
import ProductSpecifications from '@/components/admin/ProductSpecifications'
import { uploadFileAction } from "@/app/actions/media-actions"

interface ProductImage {
  id: string
  url: string
  type: 'front' | 'back' | 'gallery'
  name?: string
  isVideo?: boolean
}

interface Variation {
  id: string
  title: string
  values: (string | { value: string, price: number })[]
}

interface Specification {
  id: string
  title: string
  value: string
  type: 'string' | 'number'
}

export default function ProductEditPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [galleryImages, setGalleryImages] = useState<ProductImage[]>([])
  const uploadTypeRef = useRef<'front' | 'back' | 'gallery' | null>(null)

  const [product, setProduct] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categories: [] as string[],
    price: '',
    oldPrice: '',
    discount: '',
    stock: '',
    status: 'draft' as 'active' | 'draft' | 'archived',
    description: '',
    longDescription: '',
    isNewProduct: false,
    isFeatured: false
  })

  const [aiInstructions, setAiInstructions] = useState({
    description: '',
    longDescription: '',
    specifications: '',
    variations: ''
  })

  const [activeInstructionField, setActiveInstructionField] = useState<string | null>(null)
  
  const [variations, setVariations] = useState<Variation[]>([])
  const [specifications, setSpecifications] = useState<Specification[]>([])
  
  const [images, setImages] = useState<ProductImage[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingProduct, setFetchingProduct] = useState(true)
  const [uploadingFront, setUploadingFront] = useState(false)
  const [uploadingBack, setUploadingBack] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [fetchingGallery, setFetchingGallery] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [generatingDesc, setGeneratingDesc] = useState(false)
  const [generatingLongDesc, setGeneratingLongDesc] = useState(false)
  const [generatingPricing, setGeneratingPricing] = useState(false)
  const [generatingName, setGeneratingName] = useState(false)

  const STORAGE_KEY = `sara-admin-edit-product-${productId}`

  useEffect(() => {
    fetchProduct()
    fetchGalleryImages()
    fetchCategories()
  }, [productId])

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true)
      const response = await fetch('/api/admin/categories/names')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

  useEffect(() => {
    if (product) {
      console.log('DEBUG: Product data received in Edit Page:', product)
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        categories: product.categories || [],
        price: product.price?.toString() || '',
        oldPrice: product.oldPrice?.toString() || '',
        discount: product.discount?.toString() || '',
        stock: product.stock?.toString() || '',
        status: product.status || 'draft',
        description: product.description || '',
        longDescription: product.longDescription || '',
        isNewProduct: product.isNewProduct || false,
        isFeatured: product.isFeatured || false
      })
      setImages(product.images || [])

      // Transform backend variations to component format
      const productVariations: Variation[] = []
      if (product.variations) {
        Object.entries(product.variations).forEach(([key, value]) => {
            // Filter out system fields just in case they snuck in
            if (['_id', '__v'].includes(key)) return;

            if (Array.isArray(value) && value.length > 0) {
                productVariations.push({
                    id: Date.now().toString() + Math.random(),
                    title: key.charAt(0).toUpperCase() + key.slice(1), 
                    values: value as (string | { value: string, price: number })[]
                })
            }
        })
      }
      setVariations(productVariations)

      // Transform backend specifications to component format
      const productSpecs: Specification[] = []
      if (product.specifications) {
          Object.entries(product.specifications).forEach(([key, value]) => {
              // Filter out system fields
              if (['_id', '__v', 'createdAt', 'updatedAt', 'sku', 'id'].includes(key)) return;

              const valStr = String(value)
              const isNum = !isNaN(Number(valStr)) && valStr.trim() !== ''
              productSpecs.push({
                  id: Date.now().toString() + Math.random(),
                  title: key,
                  value: valStr,
                  type: isNum ? 'number' : 'string'
              })
          })
      }
      setSpecifications(productSpecs)
    }
  }, [product])

  useEffect(() => {
    if (product) {
      const timeoutId = setTimeout(() => {
        saveToLocalStorage()
      }, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [formData, images, variations, specifications, product])



  const handleGenerateAI = async (type: 'short' | 'long') => {
    if (!formData.name) {
      toast.error('Please enter a Product Name first')
      return
    }
    
    if (type === 'short') setGeneratingDesc(true)
    else setGeneratingLongDesc(true)

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: formData.name,
          categories: formData.categories,
          type: type === 'short' ? 'short' : 'long',
          keywords: formData.categories.join(', '),
          instructions: type === 'short' ? aiInstructions.description : aiInstructions.longDescription
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        if (type === 'short') {
          setFormData(prev => ({ ...prev, description: data.content }))
        } else {
          setFormData(prev => ({ ...prev, longDescription: data.content }))
        }
        toast.success('Description generated by AI!')
      } else {
        toast.error(data.error || 'Failed to generate')
      }
    } catch (error) {
      toast.error('AI generation failed')
    } finally {
      if (type === 'short') setGeneratingDesc(false)
      else setGeneratingLongDesc(false)
    }
  }

  const handleGenerateAIPricing = async () => {
    if (!formData.name) {
      toast.error('Please enter a Product Name first')
      return
    }
    setGeneratingPricing(true)
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: formData.name,
          categories: formData.categories,
          type: 'pricing',
          instructions: 'Suggest realistic jewelry pricing and inventory.'
        })
      })
      const data = await response.json()
      if (response.ok && data.price) {
        setFormData(prev => ({
            ...prev,
            price: data.price,
            oldPrice: data.oldPrice,
            stock: data.stock,
            discount: data.oldPrice ? ((1 - (parseFloat(data.price) / parseFloat(data.oldPrice))) * 100).toFixed(0) : ''
        }))
        toast.success('Pricing & Stock populated by AI!')
      } else {
        toast.error('Failed to generate pricing')
      }
    } catch (error) {
      toast.error('AI generation failed')
    } finally {
      setGeneratingPricing(false)
    }
  }

  const handlePolishName = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a name first')
      return
    }
    setGeneratingName(true)
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: formData.name,
          type: 'polish-name',
        })
      })
      const data = await response.json()
      if (response.ok && data.polishedName) {
        setFormData(prev => ({ ...prev, name: data.polishedName }))
        toast.success('Name polished by AI!')
      } else {
        toast.error('Failed to polish name')
      }
    } catch (error) {
      toast.error('AI generation failed')
    } finally {
      setGeneratingName(false)
    }
  }

  // Removed auto-calculation handlers - admin has full control over pricing
  // Price, oldPrice, and discount are saved exactly as entered

  const handleGenerateAISpecs = async () => {
    if (!formData.name) {
      toast.error('Please enter a Product Name first')
      return
    }
    toast.info('AI is generating specifications...')
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: formData.name,
          categories: formData.categories,
          type: 'specifications',
          instructions: aiInstructions.specifications
        })
      })
      const data = await response.json()
      if (response.ok && data.specifications) {
        const newSpecs = data.specifications.map((s: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          ...s
        }))

        setSpecifications(prev => {
           const existingTitles = new Set(prev.map(p => p.title.toLowerCase()))
           const distinctNew = newSpecs.filter((ns: any) => !existingTitles.has(ns.title.toLowerCase()))
           
           if (distinctNew.length === 0 && newSpecs.length > 0) {
             toast.info('No new specifications added (duplicates skipped)')
             return prev
           }

            if (distinctNew.length > 0) {
             toast.success(`Added ${distinctNew.length} new specifications!`)
          }

           return [...prev, ...distinctNew]
        })
      }
    } catch (error) {
      toast.error('Failed to generate specifications')
    }
  }

  const handleGenerateAIVariations = async () => {
    if (!formData.name) {
      toast.error('Please enter a Product Name first')
      return
    }
    toast.info('AI is generating variations...')
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: formData.name,
          categories: formData.categories,
          type: 'variations',
          instructions: aiInstructions.variations
        })
      })
      const data = await response.json()
      if (response.ok && data.variations) {
        const newVariations = data.variations.map((v: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          ...v
        }))
        
        setVariations(prev => {
          const existingTitles = new Set(prev.map(p => p.title.toLowerCase()))
          const distinctNew = newVariations.filter((nv: any) => !existingTitles.has(nv.title.toLowerCase()))
          
          if (distinctNew.length === 0 && newVariations.length > 0) {
            toast.info('No new variations added (duplicates skipped)')
            return prev
          }
          
          if (distinctNew.length > 0) {
             toast.success(`Added ${distinctNew.length} new variations!`)
          }
          
          return [...prev, ...distinctNew]
        })
      }
    } catch (error) {
      toast.error('Failed to generate variations')
    }
  }

  const fetchProduct = async () => {
    try {
      setFetchingProduct(true)
      const response = await fetch(`/api/admin/products/${productId}`)
      if (response.ok) {
        const productData = await response.json()
        setProduct(productData)
      } else {
        toast.error('Product not found')
        router.push('/sara-admin/dashboard/products')
      }
    } catch (error) {
      toast.error('Failed to fetch product')
      router.push('/sara-admin/dashboard/products')
    } finally {
      setFetchingProduct(false)
    }
  }

  const fetchGalleryImages = async () => {
    try {
      setFetchingGallery(true)
      const response = await fetch('/api/admin/gallery')
      if (response.ok) {
        const gallery = await response.json()
        setGalleryImages(gallery.map((item: any) => ({
          id: item._id,
          url: item.url,
          type: 'gallery' as const,
          name: item.name,
          isVideo: item.type === 'video'
        })))
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
    } finally {
      setFetchingGallery(false)
    }
  }

  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        return JSON.parse(savedData)
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
    return null
  }

  const saveToLocalStorage = () => {
    try {
      const dataToSave = {
        formData,
        images,
        variations,
        specifications,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
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

  if (fetchingProduct) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37]"></div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Loading Product...</h2>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <X className="w-16 h-16 text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Product Not Found</h2>
        <button
          onClick={() => router.push('/sara-admin/dashboard/products')}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer"
        >
          Back to Products
        </button>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!formData.name.trim() || !formData.sku.trim() || !formData.categories || formData.categories.length === 0 || !formData.description.trim()) {
      toast.error('Please fill in all required fields')
      setLoading(false)
      return
    }

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : undefined,
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        stock: parseInt(formData.stock),
        images: images.map(img => ({
          id: img.id,
          url: img.url,
          type: img.type,
          alt: img.name,
          isVideo: img.isVideo || false
        })),
        variations: variations.reduce((acc, v) => {
          acc[v.title.toLowerCase()] = v.values.map(val => ({
            value: typeof val === 'string' ? val : (val as any).value,
            price: typeof val === 'string' ? 0 : (val as any).price || 0
          }))
          return acc
        }, {} as Record<string, any[]>),
        specifications: specifications.reduce((acc, s) => {
          acc[s.title] = s.value
          return acc
        }, {} as Record<string, string>)
      }

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (response.ok) {
        clearLocalStorage()
        toast.success('Product updated successfully!')
        router.push('/sara-admin/dashboard/products')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update product')
      }
    } catch (error) {
      toast.error('Failed to update product')
    }

    setLoading(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const uploadType = uploadTypeRef.current || 'gallery'
    
    if (uploadType === 'front') setUploadingFront(true)
    else if (uploadType === 'back') setUploadingBack(true)
    else setUploadingGallery(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          toast.error(`${file.name} is not a valid image or video file`)
          return null
        }

        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        uploadFormData.append('folder', 'sara-jewelers/products')

        const result = await uploadFileAction(uploadFormData)

        if (result.success) {
          return {
            id: result.id,
            url: result.url,
            type: uploadType,
            name: file.name,
            isVideo: result.isVideo
          } as ProductImage
        }
        return null
      })

      const results = await Promise.all(uploadPromises)
      const validResults = results.filter(Boolean) as ProductImage[]

      if (validResults.length > 0) {
        if (uploadType === 'front' || uploadType === 'back') {
          setImages(prev => prev.filter(img => img.type !== uploadType).concat(validResults[0]))
        } else {
          setImages(prev => [...prev, ...validResults])
        }
        toast.success(`${validResults.length} file(s) uploaded successfully!`)
      }
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      if (uploadType === 'front') setUploadingFront(false)
      else if (uploadType === 'back') setUploadingBack(false)
      else setUploadingGallery(false)

      uploadTypeRef.current = null
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSelectFromGallery = (image: ProductImage, type: 'front' | 'back' | 'gallery') => {
    const newImage: ProductImage = {
      ...image,
      type
    }

    if (type === 'front' || type === 'back') {
      setImages(prev => prev.filter(img => img.type !== type).concat(newImage))
      toast.success(`${type === 'front' ? 'Front' : 'Back'} image selected from gallery`)
    } else {
      setImages(prev => [...prev, newImage])
      toast.success('Image added to gallery')
    }
    setShowGalleryModal(false)
    uploadTypeRef.current = null
  }

  const handleRemoveImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
    toast.success('Image removed')
  }

  const handleSetAsFrontBack = (imageId: string, type: 'front' | 'back') => {
    const image = images.find(img => img.id === imageId)
    if (!image) return

    const newImage: ProductImage = { ...image, type }
    setImages(prev => prev.filter(img => img.id !== imageId).filter(img => img.type !== type).concat(newImage))
    toast.success(`Set as ${type === 'front' ? 'front' : 'back'} image`)
  }

  const frontImage = images.find(img => img.type === 'front')
  const backImage = images.find(img => img.type === 'back')
  const galleryItems = images.filter(img => img.type === 'gallery')

  const GalleryModal = () => {
    if (!showGalleryModal) return null
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowGalleryModal(false)}>
        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 w-full max-w-4xl mx-4 border border-gray-100 dark:border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Select from Gallery</h3>
            <button onClick={() => setShowGalleryModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          {fetchingGallery ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37] mr-3"></div>
              <span className="text-gray-600 dark:text-gray-400">Loading gallery...</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {galleryImages.map((image) => (
                <div key={image.id} className="relative group aspect-square">
                  {image.isVideo ? (
                    <video src={image.url} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <img src={image.url} alt={image.name} className="w-full h-full object-cover rounded-lg" />
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    {uploadTypeRef.current !== 'gallery' && (
                      <button
                        onClick={() => handleSelectFromGallery(image, uploadTypeRef.current || 'front')}
                        className="px-3 py-1 bg-[#d4af37] text-black rounded-lg text-xs font-semibold hover:shadow-lg transition-all cursor-pointer"
                      >
                        Select
                      </button>
                    )}
                    {uploadTypeRef.current === 'gallery' && (
                      <button
                        onClick={() => handleSelectFromGallery(image, 'gallery')}
                        className="px-3 py-1 bg-[#d4af37] text-black rounded-lg text-xs font-semibold hover:shadow-lg transition-all cursor-pointer"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/sara-admin/dashboard/products/${productId}`)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Product</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update product information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to reload? All unsaved changes will be lost.')) {
                window.location.reload()
              }
            }}
            className="p-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
            title="Reload Product Data"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="flex-1 px-4 py-2 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100"
                      placeholder="Enter product name"
                    />
                    <button
                      type="button"
                      onClick={handlePolishName}
                      disabled={generatingName || !formData.name}
                      className="p-2 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#c5a028] hover:to-[#eec62f] text-black rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Polish with AI"
                    >
                      {generatingName ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100 font-mono"
                    placeholder="e.g., DR-1001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categories <span className="text-red-500">*</span>
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-[#2a2a2a]">
                    {loadingCategories ? (
                      <div className="flex items-center justify-center py-6">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#d4af37] mr-2"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Loading categories...</span>
                      </div>
                    ) : categories.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {categories.map((categoryName) => (
                          <label 
                            key={categoryName} 
                            className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-white dark:hover:bg-[#1e1e1e] transition-all duration-200 border border-transparent hover:border-[#d4af37]/30 hover:shadow-sm group"
                          >
                            <input
                              type="checkbox"
                              checked={formData.categories?.includes(categoryName) || false}
                              onChange={(e) => {
                                const currentCategories = formData.categories || []
                                if (e.target.checked) {
                                  setFormData({ ...formData, categories: [...currentCategories, categoryName] })
                                } else {
                                  setFormData({ ...formData, categories: currentCategories.filter(c => c !== categoryName) })
                                }
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-[#d4af37] focus:ring-[#d4af37] focus:ring-2 transition-all"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#d4af37] transition-colors flex-1">
                              {categoryName}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                        No categories available
                      </div>
                    )}
                  </div>
                  {formData.categories && formData.categories.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {formData.categories.map((category) => (
                        <span key={category} className="inline-flex items-center gap-1 px-2 py-1 bg-[#d4af37] text-black rounded-lg text-xs">
                          {category}
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, categories: formData.categories.filter(c => c !== category) })}
                            className="hover:bg-black/20 rounded"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between items-center">
                    <span>Description <span className="text-red-500">*</span></span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleGenerateAI('short')}
                        disabled={generatingDesc}
                        className="text-[10px] flex items-center gap-1 text-[#d4af37] hover:text-[#b8941f] disabled:opacity-50 transition-colors font-bold uppercase tracking-wider"
                        title="Quick Auto-Write"
                      >
                        {generatingDesc ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        {generatingDesc ? 'Writing...' : 'Auto'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveInstructionField(activeInstructionField === 'description' ? null : 'description')}
                        className={`text-[10px] flex items-center gap-1 transition-colors font-bold uppercase tracking-wider ${activeInstructionField === 'description' ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <MessageSquare className="w-3 h-3" />
                        Guided
                      </button>
                    </div>
                  </label>
                  {activeInstructionField === 'description' && (
                    <div className="mb-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <input 
                        type="text"
                        placeholder="e.g., Mention it's a gift for wedding"
                        value={aiInstructions.description}
                        onChange={(e) => setAiInstructions({...aiInstructions, description: e.target.value})}
                        className="w-full px-3 py-1.5 text-xs bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleGenerateAI('short'))}
                      />
                    </div>
                  )}
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100"
                    placeholder="Short product description..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between items-center">
                    <span>Long Description</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleGenerateAI('long')}
                        disabled={generatingLongDesc}
                        className="text-[10px] flex items-center gap-1 text-[#d4af37] hover:text-[#b8941f] disabled:opacity-50 transition-colors font-bold uppercase tracking-wider"
                      >
                        {generatingLongDesc ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        {generatingLongDesc ? 'Writing...' : 'Auto'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveInstructionField(activeInstructionField === 'longDescription' ? null : 'longDescription')}
                        className={`text-[10px] flex items-center gap-1 transition-colors font-bold uppercase tracking-wider ${activeInstructionField === 'longDescription' ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <MessageSquare className="w-3 h-3" />
                        Guided
                      </button>
                    </div>
                  </label>
                  {activeInstructionField === 'longDescription' && (
                    <div className="mb-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <input 
                        type="text"
                        placeholder="e.g., Highlight the 22K gold purity"
                        value={aiInstructions.longDescription}
                        onChange={(e) => setAiInstructions({...aiInstructions, longDescription: e.target.value})}
                        className="w-full px-3 py-1.5 text-xs bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleGenerateAI('long'))}
                      />
                    </div>
                  )}
                  <textarea
                    value={formData.longDescription}
                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100"
                    placeholder="Detailed product description..."
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Pricing & Inventory</h3>
                <button
                  type="button"
                  onClick={handleGenerateAIPricing}
                  disabled={generatingPricing}
                  className="text-xs flex items-center gap-1.5 text-[#d4af37] hover:text-[#b8941f] disabled:opacity-50 transition-colors font-bold uppercase tracking-wider"
                >
                  {generatingPricing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  {generatingPricing ? 'Calculating...' : 'Auto-Fill'}
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        required
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Old Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.oldPrice}
                        onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                        className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Discount %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'draft' | 'archived' })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex gap-6 pt-2">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.isNewProduct}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        isNewProduct: e.target.checked,
                        isFeatured: e.target.checked ? false : formData.isFeatured 
                      })}
                      className="w-5 h-5 rounded border-gray-300 text-[#d4af37] focus:ring-[#d4af37] focus:ring-2 transition-all"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#d4af37] transition-colors">
                      New Arrival
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        isFeatured: e.target.checked,
                        isNewProduct: e.target.checked ? false : formData.isNewProduct 
                      })}
                      className="w-5 h-5 rounded border-gray-300 text-[#d4af37] focus:ring-[#d4af37] focus:ring-2 transition-all"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#d4af37] transition-colors">
                      Featured Product
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Product Variations */}
            <ProductVariations 
              variations={variations} 
              setVariations={setVariations} 
              onGenerateAI={handleGenerateAIVariations}
              showGuidedInput={activeInstructionField === 'variations'}
              onToggleGuided={() => setActiveInstructionField(activeInstructionField === 'variations' ? null : 'variations')}
              guidedInstructions={aiInstructions.variations}
              onInstructionsChange={(value) => setAiInstructions({...aiInstructions, variations: value})}
            />
            
            {/* Product Specifications */}
            <ProductSpecifications 
              specifications={specifications} 
              setSpecifications={setSpecifications} 
              onGenerateAI={handleGenerateAISpecs}
              showGuidedInput={activeInstructionField === 'specifications'}
              onToggleGuided={() => setActiveInstructionField(activeInstructionField === 'specifications' ? null : 'specifications')}
              guidedInstructions={aiInstructions.specifications}
              onInstructionsChange={(value) => setAiInstructions({...aiInstructions, specifications: value})}
            />
            
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Product Images */}
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Product Images</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Front Image */}
                <div className="relative aspect-square rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 overflow-hidden group hover:border-[#d4af37] transition-colors bg-gray-50 dark:bg-[#2a2a2a]">
                  {frontImage ? (
                    <>
                      <img src={frontImage.url} alt="Front view" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button onClick={() => { uploadTypeRef.current = 'front'; setShowGalleryModal(true); }} className="p-2 bg-white rounded-lg text-black hover:bg-[#d4af37] transition-colors">
                          <Grid3x3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            uploadTypeRef.current = 'front'
                            fileInputRef.current?.click()
                          }}
                          className="p-2 bg-white rounded-lg text-black hover:bg-[#d4af37] transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleRemoveImage(frontImage.id)} className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded-lg backdrop-blur-sm">Front View</span>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      {uploadingFront ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37]"></div>
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500 text-center">Front View</span>
                          <div className="flex gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                uploadTypeRef.current = 'front'
                                if (fileInputRef.current) fileInputRef.current.click()
                              }}
                              className="px-3 py-1 bg-[#d4af37] text-black rounded-lg text-xs font-semibold hover:shadow-lg transition-all"
                            >
                              Upload
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                uploadTypeRef.current = 'front'
                                setShowGalleryModal(true)
                              }}
                              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                            >
                              Gallery
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Back Image */}
                <div className="relative aspect-square rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 overflow-hidden group hover:border-[#d4af37] transition-colors bg-gray-50 dark:bg-[#2a2a2a]">
                  {backImage ? (
                    <>
                      <img src={backImage.url} alt="Back view" className="w-full h-full object-cover" />
                      {frontImage && (
                        <img src={frontImage.url} alt="Front" className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button onClick={() => { uploadTypeRef.current = 'back'; setShowGalleryModal(true); }} className="p-2 bg-white rounded-lg text-black hover:bg-[#d4af37] transition-colors">
                          <Grid3x3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            uploadTypeRef.current = 'back'
                            fileInputRef.current?.click()
                          }}
                          className="p-2 bg-white rounded-lg text-black hover:bg-[#d4af37] transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleRemoveImage(backImage.id)} className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded-lg backdrop-blur-sm">Back View</span>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      {uploadingBack ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37]"></div>
                      ) : (
                        <>
                          <RotateCcw className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500 text-center">Back View</span>
                          <div className="flex gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                uploadTypeRef.current = 'back'
                                if (fileInputRef.current) fileInputRef.current.click()
                              }}
                              className="px-3 py-1 bg-[#d4af37] text-black rounded-lg text-xs font-semibold hover:shadow-lg transition-all"
                            >
                              Upload
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                uploadTypeRef.current = 'back'
                                setShowGalleryModal(true)
                              }}
                              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                            >
                              Gallery
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Gallery Images
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        uploadTypeRef.current = 'gallery'
                        if (fileInputRef.current) fileInputRef.current.click()
                      }}
                      className="flex items-center gap-1 text-[#d4af37] hover:text-[#b8941f] text-sm font-medium transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        uploadTypeRef.current = 'gallery'
                        setShowGalleryModal(true)
                      }}
                      className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 text-sm font-medium transition-colors"
                    >
                      <Grid3x3 className="w-4 h-4" />
                      Gallery
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {uploadingGallery && (
                    <div className="relative aspect-square bg-gray-50/50 dark:bg-[#2a2a2a]/50 rounded-xl border-2 border-dashed border-[#d4af37] flex flex-col items-center justify-center animate-pulse">
                      <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
                      <span className="text-[10px] text-[#d4af37] mt-1 font-bold uppercase tracking-tighter">Uploading</span>
                    </div>
                  )}
                  {galleryItems.map((item) => (
                    <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700">
                      {item.isVideo ? (
                        <video src={item.url} className="w-full h-full object-cover" />
                      ) : (
                        <img src={item.url} alt="Gallery item" className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                        <button
                          type="button"
                          onClick={() => handleSetAsFrontBack(item.id, 'front')}
                          className="w-full px-2 py-1 bg-white/90 text-black rounded text-xs hover:bg-white transition-colors"
                        >
                          Set Front
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetAsFrontBack(item.id, 'back')}
                          className="w-full px-2 py-1 bg-white/90 text-black rounded text-xs hover:bg-white transition-colors"
                        >
                          Set Back
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(item.id)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-[#d4af37] transition-colors flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 dark:bg-[#2a2a2a]/50"
                    onClick={() => {
                       uploadTypeRef.current = 'gallery'
                       if (fileInputRef.current) fileInputRef.current.click()
                    }}
                  >
                    {uploadingGallery ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#d4af37]"></div>
                    ) : (
                      <>
                        <Plus className="w-6 h-6 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500">Add</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,video/*"
        multiple
        onChange={handleFileUpload}
      />
      
      <GalleryModal />
    </div>
  )
}
