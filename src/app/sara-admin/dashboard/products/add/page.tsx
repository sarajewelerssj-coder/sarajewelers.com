'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Upload, X, Image as ImageIcon, Grid3x3, Star, RotateCcw, Plus, Minus, Sparkles, Loader2, MessageSquare } from 'lucide-react'
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





export default function AddProductPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [galleryImages, setGalleryImages] = useState<ProductImage[]>([])
  const uploadTypeRef = useRef<'front' | 'back' | 'gallery' | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadingFront, setUploadingFront] = useState(false)
  const [uploadingBack, setUploadingBack] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [fetchingGallery, setFetchingGallery] = useState(false)
  const [generatingDesc, setGeneratingDesc] = useState(false)
  const [generatingLongDesc, setGeneratingLongDesc] = useState(false)
  const [generatingPricing, setGeneratingPricing] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categories: [] as string[],
    price: '',
    oldPrice: '',
    discount: '',
    stock: '',
    status: 'draft' as 'active' | 'draft',
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
  const [categories, setCategories] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Local storage key
  const STORAGE_KEY = 'sara-admin-add-product-form'

  const [newVariationTitle, setNewVariationTitle] = useState('')
  const [newVariationValue, setNewVariationValue] = useState('')
  const [newSpecTitle, setNewSpecTitle] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')
  const [newSpecType, setNewSpecType] = useState<'string' | 'number'>('string')
  const [savedVariations, setSavedVariations] = useState<string[]>([])
  const [savedSpecifications, setSavedSpecifications] = useState<string[]>([])

  const [images, setImages] = useState<ProductImage[]>([])

  useEffect(() => {
    fetchGalleryImages()
    fetchCategories()
    loadFromLocalStorage()
    loadSavedVariationsAndSpecs()
  }, [])

  const loadSavedVariationsAndSpecs = () => {
    try {
      const variations = JSON.parse(localStorage.getItem('sara-admin-saved-variations') || '[]')
      const specifications = JSON.parse(localStorage.getItem('sara-admin-saved-specifications') || '[]')
      setSavedVariations(variations)
      setSavedSpecifications(specifications)
    } catch (error) {
      console.error('Error loading saved variations/specs:', error)
    }
  }

  const savePredefinedVariation = (title: string) => {
    if (!savedVariations.includes(title)) {
      const updated = [...savedVariations, title]
      setSavedVariations(updated)
      localStorage.setItem('sara-admin-saved-variations', JSON.stringify(updated))
    }
  }

  const savePredefinedSpecification = (title: string) => {
    if (!savedSpecifications.includes(title)) {
      const updated = [...savedSpecifications, title]
      setSavedSpecifications(updated)
      localStorage.setItem('sara-admin-saved-specifications', JSON.stringify(updated))
    }
  }

  // Fetch categories from API
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



  // Load form data from localStorage
  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        setFormData(parsedData.formData || formData)
        setImages(parsedData.images || [])
        setVariations(parsedData.variations || [])
        setSpecifications(parsedData.specifications || [])
        toast.success('Draft restored from local storage')
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
  }

  // Save form data to localStorage
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

  // Clear localStorage
  const clearLocalStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }

  // Clear all form data
  const clearAllForm = () => {
    setFormData({
      name: '',
      sku: '',
      categories: [],
      price: '',
      oldPrice: '',
      discount: '',
      stock: '',
      status: 'draft' as 'active' | 'draft',
      description: '',
      longDescription: '',
      isNewProduct: false,
      isFeatured: false
    })
    setVariations([])
    setSpecifications([])
    setNewVariationTitle('')
    setNewVariationValue('')
    setNewSpecTitle('')
    setNewSpecValue('')
    setImages([])
    clearLocalStorage()
    toast.success('Form cleared')
  }



  // Auto-save to localStorage when form data changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage()
    }, 1000) // Save after 1 second of inactivity

    return () => clearTimeout(timeoutId)
  }, [formData, images, variations, specifications])

  // Add new variation
  const addVariation = () => {
    if (newVariationTitle.trim()) {
      const title = newVariationTitle.trim()
      const newVar: Variation = {
        id: Date.now().toString(),
        title,
        values: []
      }
      setVariations(prev => [...prev, newVar])
      savePredefinedVariation(title)
      setNewVariationTitle('')
    }
  }

  // Add value to variation
  const addVariationValue = (variationId: string) => {
    if (newVariationValue.trim()) {
      setVariations(prev => prev.map(v => 
        v.id === variationId 
          ? { ...v, values: [...v.values, newVariationValue.trim()] }
          : v
      ))
      setNewVariationValue('')
    }
  }

  // Remove variation
  const removeVariation = (variationId: string) => {
    setVariations(prev => prev.filter(v => v.id !== variationId))
  }

  // Remove variation value
  const removeVariationValue = (variationId: string, valueIndex: number) => {
    setVariations(prev => prev.map(v => 
      v.id === variationId 
        ? { ...v, values: v.values.filter((_, i) => i !== valueIndex) }
        : v
    ))
  }

  // Add specification
  const addSpecification = () => {
    if (newSpecTitle.trim() && newSpecValue.trim()) {
      const title = newSpecTitle.trim()
      const newSpec: Specification = {
        id: Date.now().toString(),
        title,
        value: newSpecValue.trim(),
        type: newSpecType
      }
      setSpecifications(prev => [...prev, newSpec])
      savePredefinedSpecification(title)
      setNewSpecTitle('')
      setNewSpecValue('')
    }
  }

  // Remove specification
  const removeSpecification = (specId: string) => {
    setSpecifications(prev => prev.filter(s => s.id !== specId))
  }

  // Update specification
  const updateSpecification = (specId: string, field: 'title' | 'value' | 'type', value: string) => {
    setSpecifications(prev => prev.map(s => 
      s.id === specId ? { ...s, [field]: value } : s
    ))
  }


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

  const handlePriceChange = (value: string) => {
    setFormData(prev => {
      const newPrice = value
      let newOldPrice = prev.oldPrice
      
      // If price is entered and oldPrice is empty, suggest price + 20%
      if (newPrice && (!prev.oldPrice || prev.oldPrice === (parseFloat(prev.price) * 1.2).toFixed(2))) {
        newOldPrice = (parseFloat(newPrice) * 1.2).toFixed(2)
      }
      
      return { ...prev, price: newPrice, oldPrice: newOldPrice }
    })
  }

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
        setSpecifications(data.specifications.map((s: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          ...s
        })))
        toast.success('Specifications generated!')
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
        setVariations(data.variations.map((v: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          ...v
        })))
        toast.success('Variations generated!')
      }
    } catch (error) {
      toast.error('Failed to generate variations')
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
      toast.error('Failed to load gallery')
    } finally {
      setFetchingGallery(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const uploadType = uploadTypeRef.current || 'gallery'
    
    // Set appropriate loader
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



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!formData.name.trim()) {
      toast.error('Product name is required')
      setLoading(false)
      return
    }
    if (!formData.sku.trim()) {
      toast.error('SKU is required')
      setLoading(false)
      return
    }
    if (!formData.categories || formData.categories.length === 0) {
      toast.error('At least one category is required')
      setLoading(false)
      return
    }
    if (!formData.description.trim()) {
      toast.error('Description is required')
      setLoading(false)
      return
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Valid price is required')
      setLoading(false)
      return
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      toast.error('Valid stock quantity is required')
      setLoading(false)
      return
    }

    // Validate Images
    const hasFrontImage = images.some(img => img.type === 'front')
    const hasBackImage = images.some(img => img.type === 'back')

    if (!hasFrontImage || !hasBackImage) {
      toast.error('Both Front and Back images are required')
      setLoading(false)
      return
    }

    try {
      const productData = {
        name: formData.name,
        sku: formData.sku,
        categories: formData.categories,
        description: formData.description,
        longDescription: formData.longDescription || undefined,
        price: parseFloat(formData.price),
        oldPrice: formData.oldPrice && formData.oldPrice.trim() !== '' ? parseFloat(formData.oldPrice) : undefined,
        discount: formData.discount && formData.discount.trim() !== '' ? parseFloat(formData.discount) : 0,
        stock: parseInt(formData.stock),
        status: formData.status,
        isNewProduct: formData.isNewProduct,
        isFeatured: formData.isFeatured,
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
        }, {} as Record<string, string>),
        images: images.map(img => ({
          id: img.id,
          url: img.url,
          type: img.type,
          alt: img.name,
          isVideo: img.isVideo || false
        }))
      }

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (response.ok) {
        clearLocalStorage() // Clear saved draft after successful creation
        toast.success('Product created successfully!')
        router.push('/sara-admin/dashboard/products')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create product')
      }
    } catch (error) {
      toast.error('Failed to create product')
    }

    setLoading(false)
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
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#d4af37] mr-2"></div>
              <span className="text-gray-600 dark:text-gray-400 text-sm">Loading gallery images...</span>
            </div>
          ) : galleryImages.length > 0 ? (
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
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No images or videos in gallery</p>
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
            onClick={() => router.push('/sara-admin/dashboard/products')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add Product</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create a new product for your store</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (confirm('Are you sure you want to reload the page? All unsaved changes will be lost.')) {
              clearAllForm()
              window.location.reload()
            }
          }}
          className="p-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
          title="Reload & Clear Form"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
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
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100"
                    placeholder="Enter product name"
                  />
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
                        title="Guided Write with Instructions"
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
                        onChange={(e) => handlePriceChange(e.target.value)}
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
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'draft' })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
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
                        isFeatured: e.target.checked ? false : formData.isFeatured // Uncheck featured if new is checked
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
                        isNewProduct: e.target.checked ? false : formData.isNewProduct // Uncheck new if featured is checked
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

            <ProductVariations variations={variations} setVariations={setVariations} onGenerateAI={handleGenerateAIVariations} />
            <ProductSpecifications specifications={specifications} setSpecifications={setSpecifications} onGenerateAI={handleGenerateAISpecs} />

          </div>

          {/* Right Column - Images */}
          <div className="space-y-6">
            {/* Front & Back Images */}
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Product Images</h3>
              
              {/* Front Image */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Front Image</label>
                <div className="relative group aspect-square bg-gray-100 dark:bg-[#2a2a2a] rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700">
                  {frontImage ? (
                    <>
                      <img src={frontImage.url} alt="Front" className="w-full h-full object-cover" />
                      {backImage && (
                        <img src={backImage.url} alt="Back" className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            uploadTypeRef.current = 'front'
                            setShowGalleryModal(true)
                          }}
                          className="px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg text-xs font-semibold cursor-pointer"
                          disabled={uploadingFront}
                        >
                          <Grid3x3 className="w-4 h-4 inline mr-1" />
                          From Gallery
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            uploadTypeRef.current = 'front'
                            fileInputRef.current?.click()
                          }}
                          className="px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg text-xs font-semibold cursor-pointer"
                          disabled={uploadingFront}
                        >
                          <Upload className="w-4 h-4 inline mr-1" />
                          {uploadingFront ? '...' : 'Upload'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(frontImage.id)}
                          className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm text-white rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          <X className="w-4 h-4 inline" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      {uploadingFront ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37] mb-2"></div>
                          <p className="text-xs text-gray-500">Uploading...</p>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                uploadTypeRef.current = 'front'
                                setShowGalleryModal(true)
                              }}
                              className="px-3 py-1 bg-[#d4af37] text-black rounded-lg text-xs font-semibold hover:shadow-lg transition-all cursor-pointer"
                            >
                              <Grid3x3 className="w-4 h-4 inline mr-1" />
                              Gallery
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                uploadTypeRef.current = 'front'
                                fileInputRef.current?.click()
                              }}
                              className="px-3 py-1 bg-[#d4af37] text-black rounded-lg text-xs font-semibold hover:shadow-lg transition-all cursor-pointer"
                            >
                              <Upload className="w-4 h-4 inline mr-1" />
                              Upload
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Back Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Back Image</label>
                <div className="relative group aspect-square bg-gray-100 dark:bg-[#2a2a2a] rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700">
                  {backImage ? (
                    <>
                      <img src={backImage.url} alt="Back" className="w-full h-full object-cover" />
                      {frontImage && (
                        <img src={frontImage.url} alt="Front" className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            uploadTypeRef.current = 'back'
                            setShowGalleryModal(true)
                          }}
                          className="px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg text-xs font-semibold"
                        >
                          <Grid3x3 className="w-4 h-4 inline mr-1" />
                          From Gallery
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            uploadTypeRef.current = 'back'
                            fileInputRef.current?.click()
                          }}
                          className="px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg text-xs font-semibold"
                        >
                          <Upload className="w-4 h-4 inline mr-1" />
                          {uploadingBack ? '...' : 'Upload'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(backImage.id)}
                          className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm text-white rounded-lg text-xs font-semibold"
                        >
                          <X className="w-4 h-4 inline" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      {uploadingBack ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37] mb-2"></div>
                          <p className="text-xs text-gray-500">Uploading...</p>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                uploadTypeRef.current = 'back'
                                setShowGalleryModal(true)
                              }}
                              className="px-3 py-1 bg-[#d4af37] text-black rounded-lg text-xs font-semibold hover:shadow-lg transition-all cursor-pointer"
                            >
                              <Grid3x3 className="w-4 h-4 inline mr-1" />
                              Gallery
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                uploadTypeRef.current = 'back'
                                fileInputRef.current?.click()
                              }}
                              className="px-3 py-1 bg-[#d4af37] text-black rounded-lg text-xs font-semibold hover:shadow-lg transition-all cursor-pointer"
                            >
                              <Upload className="w-4 h-4 inline mr-1" />
                              Upload
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Gallery</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      uploadTypeRef.current = 'gallery'
                      setShowGalleryModal(true)
                    }}
                    className="px-3 py-1 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black rounded-lg text-xs font-semibold hover:shadow-lg transition-all cursor-pointer"
                    disabled={uploadingGallery}
                  >
                    <Grid3x3 className="w-3 h-3 inline mr-1" />
                    From Gallery
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      uploadTypeRef.current = 'gallery'
                      fileInputRef.current?.click()
                    }}
                    className="px-3 py-1 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black rounded-lg text-xs font-semibold hover:shadow-lg transition-all cursor-pointer"
                    disabled={uploadingGallery}
                  >
                    <Upload className="w-3 h-3 inline mr-1" />
                    {uploadingGallery ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {uploadingGallery && (
                  <div className="relative aspect-square bg-gray-50/50 dark:bg-[#2a2a2a]/50 rounded-lg border-2 border-dashed border-[#d4af37] flex flex-col items-center justify-center animate-pulse">
                    <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
                    <span className="text-[10px] text-[#d4af37] mt-1 font-bold uppercase tracking-tighter">Uploading</span>
                  </div>
                )}
                {galleryItems.map((image) => (
                  <div key={image.id} className="relative group aspect-square">
                    {image.isVideo ? (
                      <video src={image.url} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <img src={image.url} alt={image.name} className="w-full h-full object-cover rounded-lg" />
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleSetAsFrontBack(image.id, 'front')}
                        className="p-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded text-white text-xs cursor-pointer"
                        title="Set as Front"
                      >
                        <Star className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetAsFrontBack(image.id, 'back')}
                        className="p-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded text-white text-xs cursor-pointer"
                        title="Set as Back"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image.id)}
                        className="p-1 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded text-white cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {galleryItems.length === 0 && (
                  <div className="col-span-3 text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                    No gallery images. Add images from gallery or upload new ones.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={clearAllForm}
            className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-200 dark:hover:bg-red-900/30 transition-all cursor-pointer"
          >
            Clear All Form
          </button>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push('/sara-admin/dashboard/products')}
              className="px-6 py-2 bg-gray-100 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-[#333] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingFront || uploadingBack || uploadingGallery}
              className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </div>
      </form>

      <GalleryModal />
    </div>
  )
}
