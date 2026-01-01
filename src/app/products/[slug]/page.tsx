"use client"


import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Heart, ChevronLeft, ChevronRight, Home, ChevronRight as BreadcrumbChevron, Star, StarHalf, ChevronDown, ChevronUp, MessageSquare, PenTool, Trash2, Loader2, Share2, Facebook, Twitter, Mail, Link as LinkIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import RelatedProducts from "@/components/products/related-products"
import { toast } from "sonner"
import LogoLoader from "@/components/ui/logo-loader"

// Star rating component
function StarRating({ rating, size = "w-5 h-5", showValue = false }: { rating: number; size?: string; showValue?: boolean }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className={`${size} fill-[#d4af37] dark:fill-[#f4d03f] text-[#d4af37] dark:text-[#f4d03f]`} />
        ))}
        {hasHalfStar && (
          <StarHalf className={`${size} fill-[#d4af37] dark:fill-[#f4d03f] text-[#d4af37] dark:text-[#f4d03f]`} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className={`${size} text-gray-300 dark:text-gray-600`} />
        ))}
      </div>
      {showValue && (
        <span className="ml-2 text-lg font-semibold text-gray-700 dark:text-gray-300">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}

export default function ProductPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { data: session } = useSession()

  const [product, setProduct] = useState<any>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [customQuantity, setCustomQuantity] = useState("")
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({})
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    content: ""
  })
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [settings, setSettings] = useState<any>(null)


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`)
        const data = await response.json()
        if (data.success) {
          setProduct(data.product)
          console.log('Fetched Product Data:', data.product)
          setSelectedImageIndex(0)
          
          // Set default selections for all variations if available
          // Set default selections for all variations if available
          if (data.product.variations) {
            const defaults: Record<string, string> = {}
            
            // Strategy: Find the combination that yields the lowest price
            // Assuming variations are independent, we just pick the cheapest option for each variation set
            Object.entries(data.product.variations).forEach(([title, values]) => {
              if (Array.isArray(values) && values.length > 0) {
                // Find the value with the lowest price (or 0 if no price)
                // We default to the first one, then search for a cheaper one
                let bestOption = values[0]
                let minPrice = typeof bestOption === 'object' ? (bestOption.price || 0) : 0
                
                // If it's just a string array, search doesn't matter (all price 0), so [0] is fine
                // Only if objects with prices do we search
                if (typeof bestOption === 'object') {
                   values.forEach((val: any) => {
                     if (typeof val === 'object') {
                       const price = val.price || 0
                       if (price < minPrice) {
                         minPrice = price
                         bestOption = val
                       }
                     }
                   })
                }

                defaults[title] = typeof bestOption === 'string' ? bestOption : bestOption.value
              }
            })
            setSelectedVariations(defaults)
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }

    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        const data = await response.json()
        setSettings(data)
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }

    if (slug) {
      fetchProduct()
      fetchSettings()
    }
  }, [slug])

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1)
    setCustomQuantity("")
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
      setCustomQuantity("")
    }
  }

  const handleCustomQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "") {
      setCustomQuantity("")
      return
    }

    const numValue = Number.parseInt(value, 10)
    if (!isNaN(numValue) && numValue > 0) {
      setCustomQuantity(value)
      setQuantity(numValue)
    }
  }

  const nextImage = () => {
    if (!product) return
    setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
    setIsVideoPlaying(false)
  }

  const prevImage = () => {
    if (!product) return
    setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
    setIsVideoPlaying(false)
  }

  const handleGoBack = () => {
    router.back()
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => {
        console.log('Error sharing', error)
        setShowShareDialog(true)
      });
    } else {
      setShowShareDialog(true)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard", {
      description: "You can now share this product link with anyone.",
      duration: 3000,
    });
  }

  const calculateTotalPrice = () => {
    if (!product) return 0
    let total = product.price || 0
    
    // Sum up price differentials from selected variations
    if (product.variations && selectedVariations) {
      Object.entries(product.variations).forEach(([title, values]) => {
        const selectedValue = selectedVariations[title]
        if (Array.isArray(values) && selectedValue) {
          const variationOption = values.find((v: any) => 
            (typeof v === 'string' ? v : v.value) === selectedValue
          )
          if (variationOption && typeof variationOption === 'object' && variationOption.price) {
            total += Number(variationOption.price)
          }
        }
      })
    }
    return total
  }

  const addToCart = () => {
    // Get existing cart from localStorage or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")
    
    const totalPrice = calculateTotalPrice()

    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex(
      (item: any) => item.id === product.id
    )

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      existingCart[existingItemIndex].quantity += quantity
    } else {
      // Add new item if it doesn't exist
      existingCart.push({
        id: product.id,
        name: product.name,
        price: totalPrice,
        image: (() => {
          if (Array.isArray(product.images)) {
            const front = product.images.find((img: any) => typeof img === 'object' && img.type === 'front')
            if (front) return front.url
            const first = product.images[0]
            return typeof first === 'string' ? first : first?.url
          }
          return '/placeholder.svg'
        })(),
        slug: product.slug,
        quantity,
        selectedVariations,
      })
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart))

    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event("cartUpdated"))

    // Show toast notification
    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart`,
      duration: 3000,
    })
  }

  const addToWishlist = () => {
    // Get existing wishlist from localStorage or initialize empty array
    const existingWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    
    const totalPrice = calculateTotalPrice()

    // Check if product already exists in wishlist
    const existingItemIndex = existingWishlist.findIndex((item: any) => item.id === product.id)

    if (existingItemIndex < 0) {
      // Add new item if it doesn't exist
      existingWishlist.push({
        id: product.id,
        name: product.name,
        price: totalPrice,
        image: (() => {
          if (Array.isArray(product.images)) {
            const front = product.images.find((img: any) => typeof img === 'object' && img.type === 'front')
            if (front) return front.url
            const first = product.images[0]
            return typeof first === 'string' ? first : first?.url
          }
          return '/placeholder.svg'
        })(),
        slug: product.slug,
      })

      // Save updated wishlist to localStorage
      localStorage.setItem("wishlist", JSON.stringify(existingWishlist))

      // Dispatch custom event to update wishlist count
      window.dispatchEvent(new Event("wishlistUpdated"))

      // Show toast notification
      toast.success("Added to wishlist", {
        description: `${product.name} has been added to your wishlist`,
        duration: 3000,
      })
    } else {
      toast.info("Already in wishlist", {
        description: "This product is already in your wishlist",
        duration: 3000,
      })
    }
  }

  // Calculate rating breakdown
  const getRatingBreakdown = (product: any) => {
    if (!product?.reviews || product.reviews.length === 0) {
      return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    }
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    product.reviews.forEach((review: any) => {
      breakdown[review.rating as keyof typeof breakdown]++
    })
    return breakdown
  }

  const handleSubmitReview = async () => {
    if (!reviewForm.content.trim()) {
      toast.error("Please write your review", {
        description: "Review text is required",
        duration: 3000,
      })
      return
    }

    if (!session) {
      toast.error("Please log in", {
        description: "You must be logged in to modify items",
        duration: 3000,
      })
      return
    }

    setIsSubmittingReview(true)
    try {
      const response = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: reviewForm.rating,
          content: reviewForm.content,
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Review submitted!", {
          description: "Thank you for your review.",
          duration: 3000,
        })
        setShowWriteReview(false)
        setReviewForm({ rating: 5, content: "" })
        
        // Update product state with new review
        setProduct(data.product)
      } else {
        toast.error(data.error || "Failed to submit review")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return

    try {
      const response = await fetch(`/api/products/${product.id}/reviews/${reviewId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()

      if (response.ok) {
        toast.success("Review deleted")
        setProduct(data.product)
      } else {
        toast.error(data.error || "Failed to delete review")
      }
    } catch (error) {
       toast.error("Failed to delete review")
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
        <LogoLoader />
      </div>
    )
  }

  const ratingBreakdown = getRatingBreakdown(product)
  const totalReviews = product.reviews?.length || product.reviewCount || 0
  const displayedReviews = showAllReviews ? (product.reviews || []) : (product.reviews || []).slice(0, 3)

  const getMediaUrl = (media: any) => {
    if (!media) return ''
    if (typeof media === 'string') return media
    return media.url || ''
  }

  const isVideo = (media: any) => {
    const src = getMediaUrl(media).toLowerCase()
    if (typeof media === 'object' && media?.isVideo) return true
    return src.includes(".mp4") || src.includes(".webm")
  }

  const currentMedia = product.images[selectedImageIndex]

  return (
    <div className="min-h-screen bg-[#F6F1E8] dark:bg-gradient-to-br dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm mb-8">
            <Link href="/" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-[#d4af37] dark:hover:text-[#f4d03f] transition-colors">
              <Home size={16} className="mr-1" />
              Home
            </Link>
            <BreadcrumbChevron size={16} className="text-gray-400" />
            <Link 
              href="/categories" 
              className="text-gray-600 dark:text-gray-400 hover:text-[#d4af37] dark:hover:text-[#f4d03f] transition-colors"
            >
              Categories
            </Link>
            <Link
              href={`/categories/${(product.category || 'general').toLowerCase().replace(/\s+/g, "-")}`}
              className="text-gray-600 dark:text-gray-400 hover:text-[#d4af37] dark:hover:text-[#f4d03f] transition-colors"
            >
              {product.category || 'General'}
            </Link>
            <BreadcrumbChevron size={16} className="text-gray-400" />
            <span className="text-gray-900 dark:text-gray-100 font-medium">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Enhanced Product Gallery */}
            <div className="space-y-5">
              {/* Main Image Display */}
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-lg group">
                {isVideo(currentMedia) ? (
                  <video
                    src={getMediaUrl(currentMedia)}
                    controls
                    autoPlay={isVideoPlaying}
                    className="w-full h-full object-contain"
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                  />
                ) : (
                  <Image 
                    src={getMediaUrl(currentMedia) || "/placeholder.svg"} 
                    alt={product.name} 
                    fill 
                    className="object-contain transition-transform duration-500 group-hover:scale-105" 
                  />
                )}

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 dark:bg-gray-800/95 hover:bg-[#d4af37] hover:text-white dark:hover:bg-[#f4d03f] dark:hover:text-gray-900 text-gray-700 dark:text-gray-200 p-3 rounded-full transition-all duration-300 shadow-xl backdrop-blur-sm z-10 cursor-pointer opacity-0 group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>

                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 dark:bg-gray-800/95 hover:bg-[#d4af37] hover:text-white dark:hover:bg-[#f4d03f] dark:hover:text-gray-900 text-gray-700 dark:text-gray-200 p-3 rounded-full transition-all duration-300 shadow-xl backdrop-blur-sm z-10 cursor-pointer opacity-0 group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/60 dark:bg-white/60 backdrop-blur-sm text-white dark:text-gray-900 px-3 py-1.5 rounded-full text-sm font-medium">
                    {selectedImageIndex + 1} / {product.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {product.images.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImageIndex(index)
                      setIsVideoPlaying(false)
                    }}
                    className={`relative aspect-square overflow-hidden rounded-lg transition-all duration-300 cursor-pointer group ${
                      selectedImageIndex === index
                        ? "ring-2 ring-[#d4af37] dark:ring-[#f4d03f] shadow-md"
                        : "border border-gray-200 dark:border-gray-700 hover:border-[#d4af37]/50 dark:hover:border-[#f4d03f]/50"
                    }`}
                  >
                    {isVideo(image) ? (
                      <div className="w-full h-full bg-gradient-to-br from-[#faf8f3] to-gray-100 dark:from-[#1a1a1a] dark:to-[#2a2a2a] flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-[#d4af37] dark:text-[#f4d03f]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    ) : (
                      <>
                        <Image
                          src={getMediaUrl(image) || "/placeholder.svg"}
                          alt={`${product.name} view ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </>
                    )}
                  </button>
                ))}
              </div>

              {/* Write Review Button */}

            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Category Badge */}
              <Link
                href={`/categories/${(product.category || 'general').toLowerCase().replace(/\s+/g, "-")}`}
                className="inline-flex items-center text-sm text-[#d4af37] dark:text-[#f4d03f] font-medium hover:underline"
              >
                {product.category || 'General'}
              </Link>

              {/* Product Title */}
              <div className="flex justify-between items-start">
                <h1 className="text-4xl lg:text-5xl font-serif italic font-bold text-gray-900 dark:text-white leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                  {product.name}
                </h1>
                <Button
                  onClick={handleShare}
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-[#d4af37]/10 text-[#d4af37] dark:text-[#f4d03f]"
                  title="Share product"
                >
                  <Share2 size={24} />
                </Button>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-[#d4af37] dark:text-[#f4d03f]">
                  ${calculateTotalPrice().toFixed(2)}
                </span>
                {product.oldPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ${Number(product.oldPrice).toFixed(2)}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="bg-[#991b1b] text-white text-sm font-semibold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                    {product.discount}% OFF
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-[#065f46] text-white text-sm font-semibold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                    New Arrival
                  </span>
                )}
              </div>

              {/* Ratings & SKU */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div className="flex items-center gap-3">
                  <StarRating rating={product.rating || 0} size="w-5 h-5" showValue={true} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
                <div className="flex items-center gap-2 border-l border-gray-300 dark:border-gray-700 pl-6">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">SKU:</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-mono tracking-wider">{product.sku}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>

              {/* Variations */}
              {product.variations && Object.entries(product.variations).some(([_, values]) => Array.isArray(values) && values.length > 0) && (
                <div className="space-y-6">
                  {Object.entries(product.variations).map(([title, values]) => (
                    Array.isArray(values) && values.length > 0 && (
                      <div key={title} className="space-y-3">
                        <label className="block text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                          {title}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {values.map((varItem: any, index: number) => {
                            const varValue = typeof varItem === 'string' ? varItem : varItem.value
                            const varPrice = typeof varItem === 'object' ? varItem.price : 0
                            return (
                              <button
                                key={`${title}-${varValue}-${index}`}
                                onClick={() => setSelectedVariations(prev => ({ ...prev, [title]: varValue }))}
                                className={`min-w-[45px] px-4 h-10 rounded-lg border font-medium transition-all duration-200 cursor-pointer ${
                                  selectedVariations[title] === varValue
                                    ? "border-[#d4af37] dark:border-[#f4d03f] bg-[#d4af37] dark:bg-[#f4d03f] text-white shadow-md shadow-[#d4af37]/20"
                                    : "border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 hover:border-[#d4af37]/50"
                                }`}
                              >
                                {varValue}
                                {varPrice > 0 && <span className="text-xs ml-1">(+${varPrice})</span>}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Quantity</label>
                <div className="flex items-center w-full max-w-[150px] border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <button
                    onClick={decreaseQuantity}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                  >
                    <Minus size={18} />
                  </button>
                  <div className="flex-1 min-w-[60px] h-[48px]">
                    <Input
                      type="text"
                      value={customQuantity || quantity}
                      onChange={handleCustomQuantityChange}
                      className="w-full h-full border-0 text-center text-lg font-semibold bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={increaseQuantity}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={addToCart} 
                  disabled={product.stock <= 0}
                  className={`flex-1 h-12 font-semibold rounded-lg shadow-md transition-all duration-300 ${
                    product.stock <= 0 
                      ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed shadow-none' 
                      : 'bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-black hover:shadow-lg cursor-pointer'
                  }`}
                >
                  {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Button
                  onClick={addToWishlist}
                  variant="outline"
                  className="flex-1 h-12 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300 cursor-pointer"
                >
                  <Heart size={18} className="mr-2" />
                  Wishlist
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-[#d4af37] dark:text-[#f4d03f] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Free Delivery over ${settings?.freeShippingThreshold || 500}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-[#d4af37] dark:text-[#f4d03f] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Long-term Gold Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-[#d4af37] dark:text-[#f4d03f] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-400">No Return, Exchange Only</span>
                </div>
              </div>
            </div>
        </div>

          {/* Product Information Tabs */}
          <div className="mt-24 bg-white dark:bg-[#1a1a1a]/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 relative z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-20"></div>
            
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full flex justify-start border-b border-gray-200 dark:border-gray-800 bg-transparent p-0 mb-10 overflow-x-auto scrollbar-none snap-x snap-mandatory">
                <TabsTrigger 
                  value="description" 
                  className="group relative px-4 md:px-8 py-4 text-sm md:text-base font-serif italic font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all bg-transparent rounded-none data-[state=active]:text-[#d4af37] dark:data-[state=active]:text-[#f4d03f] data-[state=active]:shadow-none after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-[#d4af37] after:to-[#f4d03f] after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-300 snap-start"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  <span className="relative z-10">Description</span>
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </TabsTrigger>
                <TabsTrigger 
                  value="specifications" 
                  className="group relative px-4 md:px-8 py-4 text-sm md:text-base font-serif italic font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all bg-transparent rounded-none data-[state=active]:text-[#d4af37] dark:data-[state=active]:text-[#f4d03f] data-[state=active]:shadow-none after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-[#d4af37] after:to-[#f4d03f] after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-300 snap-start"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  <span className="relative z-10">Specifications</span>
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="group relative px-4 md:px-8 py-4 text-sm md:text-base font-serif italic font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all bg-transparent rounded-none data-[state=active]:text-[#d4af37] dark:data-[state=active]:text-[#f4d03f] data-[state=active]:shadow-none after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-[#d4af37] after:to-[#f4d03f] after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-300 snap-start"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  <span className="relative z-10 flex items-center">
                    Reviews 
                    <span className="ml-1 md:ml-2 text-[10px] md:text-xs font-bold bg-[#d4af37]/10 text-[#d4af37] dark:bg-[#f4d03f]/10 dark:text-[#f4d03f] px-1.5 md:px-2.5 py-0.5 rounded-full border border-[#d4af37]/20 dark:border-[#f4d03f]/20">
                      {totalReviews}
                    </span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="focus:outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12">
                  <div className="lg:col-span-2 prose dark:prose-invert max-w-none">
                    <h3 className="text-2xl font-serif italic font-bold text-gray-900 dark:text-white mb-6 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                      Craftsmanship & Details
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-8 mb-8 first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-[#d4af37] dark:first-letter:text-[#f4d03f]">
                      {product.longDescription || product.description}
                    </p>
                    <div className="bg-[#f9f9f9] dark:bg-[#252525] p-8 rounded-2xl border-l-4 border-[#d4af37] dark:border-[#f4d03f] my-8">
                       <p className="text-lg font-medium text-gray-800 dark:text-gray-200 italic leading-relaxed">
                        "Our <span className="text-[#d4af37] dark:text-[#f4d03f]">jewelry pieces</span> are crafted with the utmost attention to detail, ensuring that each item meets our
                        high standards of quality and beauty. We use only the finest materials, including <span className="text-[#d4af37] dark:text-[#f4d03f]">ethically sourced
                        gemstones</span> and precious metals."
                      </p>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      Whether you're looking for a special gift or a treat for yourself, this piece is sure to delight with
                      its timeless elegance and exceptional craftsmanship. Perfect for special occasions or everyday luxury.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="relative overflow-hidden rounded-2xl aspect-[3/4] shadow-lg group">
                      <Image 
                        src={(() => {
                          const back = product.images.find((img: any) => typeof img === 'object' && img.type === 'back')
                          return back ? back.url : (getMediaUrl(product.images[1]) || getMediaUrl(product.images[0]) || "/placeholder.svg")
                        })()}
                        alt="Product detail" 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 text-white">
                        <p className="text-sm font-semibold uppercase tracking-widest text-[#d4af37]">Premium Quality</p>
                        <p className="text-xl font-bold mt-1">Handcrafted Perfection</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="focus:outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white dark:bg-[#202020] rounded-2xl md:rounded-3xl p-5 md:p-8 lg:p-10 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                   
                   <h3 className="text-2xl font-serif italic font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3 relative z-10 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#d4af37]/10 dark:bg-[#f4d03f]/10 text-[#d4af37] dark:text-[#f4d03f]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </span>
                    Product Specifications
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-0 relative z-10">
                    {(() => {
                        const validSpecs = product.specifications 
                            ? Object.entries(product.specifications).filter(([key, value]) => 
                                !['_id', '__v', 'createdAt', 'updatedAt', 'sku'].includes(key) && 
                                value && 
                                typeof value === 'string'
                              )
                            : [];

                        return validSpecs.length > 0 ? (
                            validSpecs.map(([key, value]) => (
                                <div 
                                  key={key} 
                                  className="flex justify-between items-center py-5 border-b border-dashed border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 px-4 -mx-4 rounded-xl transition-colors group"
                                >
                                  <span className="text-gray-500 dark:text-gray-400 font-medium capitalize group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors flex items-center gap-2">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                  <span className="text-gray-900 dark:text-white font-bold text-right tracking-tight">
                                    {value as string}
                                  </span>
                                </div>
                            ))
                        ) : (
                          <div className="col-span-full py-20 text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                               <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">No specific technical details available for this product.</p>
                          </div>
                        );
                    })()}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="focus:outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                    <div>
                      <h3 className="text-2xl font-serif italic font-bold text-gray-900 dark:text-white tracking-tight leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>Customer Reviews</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-3xl font-bold text-[#d4af37] dark:text-[#f4d03f]">{product.rating ? product.rating.toFixed(1) : '0.0'}</span>
                        <div>
                          <StarRating rating={product.rating || 0} size="w-4 h-4" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">Based on {totalReviews} reviews</p>
                        </div>
                      </div>
                    </div>
                    {product.reviews && product.reviews.length > 0 && (
                      <Button
                        onClick={() => setShowWriteReview(true)}
                        className="w-full sm:w-auto bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black hover:shadow-lg hover:from-[#e6c235] hover:to-[#ffdb58] font-bold px-6 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                      >
                        {session ? (
                          <>
                            <PenTool size={16} className="mr-2" />
                            Write a Review
                          </>
                        ) : (
                          <Link href="/account" className="flex items-center">
                            <PenTool size={16} className="mr-2" />
                            Login to Review
                          </Link>
                        )}
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {product.reviews && product.reviews.length > 0 ? (
                      <>
                        {displayedReviews.map((review: any, index: number) => (
                          <div
                            key={index}
                            className="p-8 bg-white dark:bg-[#202020] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-[#d4af37]/30 dark:hover:border-[#f4d03f]/30 transition-all duration-300 group"
                          >
                            <div className="flex items-start justify-between mb-6">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4d03f] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                  {review.author ? review.author.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <div>
                                  <span className="block font-bold text-gray-900 dark:text-white text-lg group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors">{review.author || 'Anonymous'}</span>
                                  <span className="text-sm text-gray-400 dark:text-gray-500">{review.date || 'Recent'}</span>
                                </div>
                              </div>
                              <StarRating rating={review.rating} size="w-5 h-5" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg italic">"{review.content}"</p>
                            
                          </div>
                        ))}
                        
                        {product.reviews.length > 3 && (
                          <div className="text-center pt-8">
                            <Button
                              onClick={() => setShowAllReviews(!showAllReviews)}
                              variant="ghost"
                              className="text-[#d4af37] hover:bg-[#d4af37]/10 hover:text-[#d4af37] dark:text-[#f4d03f] dark:hover:bg-[#f4d03f]/10 dark:hover:text-[#f4d03f] px-8 py-6 rounded-xl font-bold text-lg transition-all"
                            >
                              {showAllReviews ? (
                                <>
                                  <ChevronUp size={20} className="mr-2" />
                                  Show Less Reviews
                                </>
                              ) : (
                                <>
                                  <ChevronDown size={20} className="mr-2" />
                                  View All {product.reviews.length} Reviews
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-16 bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                        <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-gray-200/50 dark:shadow-none">
                           <MessageSquare className="w-8 h-8 text-[#d4af37] dark:text-[#f4d03f]" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No reviews yet</h4>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">Be the first to share your thoughts on this exquisite piece.</p>
                        <Button
                          onClick={() => setShowWriteReview(true)}
                          className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black hover:shadow-lg hover:from-[#e6c235] hover:to-[#ffdb58] font-bold px-10 py-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                        >
                          {session ? (
                            <>
                              <PenTool size={18} className="mr-2" />
                              Write a Review
                            </>
                          ) : (
                            <Link href="/account" className="flex items-center">
                               <PenTool size={18} className="mr-2" />
                               Login to Review
                            </Link>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

        {/* Write Review Dialog - Simplified */}
        <Dialog open={showWriteReview} onOpenChange={setShowWriteReview}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1e1e1e] border-[#d4af37]/20 dark:border-[#f4d03f]/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#d4af37] to-orange-500 dark:from-[#f4d03f] dark:to-orange-400 bg-clip-text text-transparent">
                Write a Review
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Share your experience with this product
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Rating Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Your Rating
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="transition-transform hover:scale-125 cursor-pointer"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= reviewForm.rating
                            ? "fill-[#d4af37] dark:fill-[#f4d03f] text-[#d4af37] dark:text-[#f4d03f]"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Review Text */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Your Review
                </label>
                <Textarea
                  value={reviewForm.content}
                  onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                  placeholder="Share your thoughts about this product..."
                  rows={6}
                  className="bg-gray-50 dark:bg-[#2a2a2a] border-gray-200 dark:border-gray-700 focus:border-[#d4af37] dark:focus:border-[#f4d03f] resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowWriteReview(false)
                  setReviewForm({ rating: 5, content: "" })
                }}
                className="border-gray-300 dark:border-gray-600 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmittingReview}
                className="bg-gradient-to-r from-[#d4af37] to-orange-500 hover:from-[#b8941f] hover:to-orange-600 text-white dark:from-[#f4d03f] dark:to-orange-400 dark:hover:from-[#e6c235] dark:hover:to-orange-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
              >
                {isSubmittingReview ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : 'Submit Review'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="max-w-md bg-white dark:bg-[#1e1e1e] border-[#d4af37]/20 dark:border-[#f4d03f]/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#d4af37] to-orange-500 dark:from-[#f4d03f] dark:to-orange-400 bg-clip-text text-transparent">
                Share this Product
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Share this exquisite piece with your friends and family
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${product.name} - ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors group"
              >
                <div className="size-12 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <MessageSquare size={24} />
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">WhatsApp</span>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors group"
              >
                <div className="size-12 rounded-full bg-[#1877F2] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Facebook size={24} />
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Facebook</span>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(product.name)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-900/10 transition-colors group"
              >
                <div className="size-12 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Twitter size={24} />
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Twitter (X)</span>
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(`Check out this product from Sara Jewelers: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
              >
                <div className="size-12 rounded-full bg-[#EA4335] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Email</span>
              </a>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-[#252525] rounded-xl border border-gray-200 dark:border-gray-800">
               <div className="flex-1 truncate text-xs text-gray-500 dark:text-gray-400 px-2 font-mono">
                 {typeof window !== 'undefined' ? window.location.href : ''}
               </div>
               <Button 
                onClick={copyToClipboard}
                size="sm" 
                className="bg-[#d4af37] hover:bg-[#b8941f] text-white rounded-lg h-8 px-3"
               >
                 <LinkIcon size={14} className="mr-2" />
                 Copy
               </Button>
            </div>
          </DialogContent>
        </Dialog>

          {/* Related Products */}
          <div className="mt-20">
            <RelatedProducts currentProductId={product.id} category={product.category} />
          </div>
        </div>
      </div>
    </div>
  )
}

