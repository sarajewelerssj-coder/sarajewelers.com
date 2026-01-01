
'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    oldPrice?: number
    images: { url: string }[] | string[] // Handle both object and string arrays
    category?: string
    rating?: number
    reviewCount?: number
    isNew?: boolean
    isFeatured?: boolean
    discount?: number
    variations?: any
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const router = useRouter()

  // Helper to get image URL safely
  const getImageUrl = (img: any) => {
    if (typeof img === 'string') return img
    return img?.url || '/placeholder.svg'
  }

  const mainImage = (() => {
    if (Array.isArray(product.images)) {
      const front = product.images.find((img: any) => img.type === 'front')
      if (front) return getImageUrl(front)
    }
    return getImageUrl(product.images?.[0])
  })()

  const hoverImage = (() => {
    if (Array.isArray(product.images)) {
      const back = product.images.find((img: any) => img.type === 'back')
      if (back) return getImageUrl(back)
    }
    return product.images?.[1] ? getImageUrl(product.images[1]) : mainImage
  })()

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id)

    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: mainImage,
        quantity: 1,
        selectedSize: product.variations?.sizes?.[0] || '',
        selectedColor: product.variations?.colors?.[0] || '',
      })
    }

    localStorage.setItem('cart', JSON.stringify(existingCart))
    window.dispatchEvent(new Event('cartUpdated'))

    toast.success('Added to cart', {
      description: `${product.name} has been added to your cart`,
      duration: 3000,
    })
  }

  const addToWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const existingWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    const existingItemIndex = existingWishlist.findIndex((item: any) => item.id === product.id)

    if (existingItemIndex < 0) {
      existingWishlist.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: mainImage,
      })

      localStorage.setItem('wishlist', JSON.stringify(existingWishlist))
      window.dispatchEvent(new Event('wishlistUpdated'))

      toast.success('Added to wishlist', {
        description: `${product.name} has been added to your wishlist`,
        duration: 3000,
      })
    } else {
      toast.info('Already in wishlist', {
        description: 'This product is already in your wishlist',
        duration: 3000,
      })
    }
  }

  // Calculate display price
  const displayPrice = (() => {
    // If base price is 0 and we have variations, try to find the lowest price from variations
    if (product.price === 0 && product.variations) {
      let minPrice = Infinity
      let hasPricedVariations = false

      Object.values(product.variations).forEach((varType: any) => {
        if (Array.isArray(varType)) {
          varType.forEach((option: any) => {
            if (typeof option === 'object' && typeof option.price === 'number') {
              if (option.price > 0 && option.price < minPrice) {
                minPrice = option.price
                hasPricedVariations = true
              }
            }
          })
        }
      })

      if (hasPricedVariations && minPrice !== Infinity) {
        return minPrice
      }
    }
    return product.price
  })()

  // Helper to format price
  const formatPrice = (price: number) => {
     return price.toFixed(2)
  }

  return (
    <div
      className="group relative bg-white dark:bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 dark:hover:shadow-[#f4d03f]/20 transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${product.slug}`}>
            <Image
            src={isHovered ? hoverImage : mainImage}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 transform group-hover:scale-110"
            />
        </Link>
        

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-[#d4af37] hover:text-white dark:hover:bg-[#f4d03f] dark:hover:text-black transition-colors duration-200 text-gray-700 dark:text-gray-300"
            onClick={addToWishlist}
            title="Add to Wishlist"
          >
            <Heart size={16} />
          </button>
          <button
            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-[#d4af37] hover:text-white dark:hover:bg-[#f4d03f] dark:hover:text-black transition-colors duration-200 text-gray-700 dark:text-gray-300"
            onClick={addToCart}
            title="Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-[#d4af37] hover:text-white dark:hover:bg-[#f4d03f] dark:hover:text-black transition-colors duration-200 text-gray-700 dark:text-gray-300"
            title="View Details"
          >
            <Eye size={16} />
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.isNew && (
            <div className="bg-[#065f46] text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-sm shadow-lg backdrop-blur-sm bg-opacity-90">
              New Arrival
            </div>
          )}
          {product.isFeatured && (
            <div className="bg-[#d4af37] text-black text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-sm shadow-lg backdrop-blur-sm bg-opacity-90">
              Featured
            </div>
          )}
          {product.discount && product.discount > 0 && (
            <div className="bg-[#991b1b] text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-sm shadow-lg backdrop-blur-sm bg-opacity-90">
              {product.discount}% OFF
            </div>
          )}
        </div>
      </div>

      <div className="p-3 sm:p-4">
        {product.category && (
            <h3 className="text-xs sm:text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1 sm:mb-2 group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors duration-300 font-medium">
            {product.category}
            </h3>
        )}
        <Link href={`/products/${product.slug}`}>
          <h2 className="font-serif italic font-medium text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 hover:text-[#d4af37] dark:hover:text-[#f4d03f] transition-colors duration-300 text-lg sm:text-xl leading-tight line-clamp-2 min-h-[2.5em] tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
            {product.name}
          </h2>
        </Link>

        <div className="flex items-center justify-between mt-2 sm:mt-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors duration-300">
              ${formatPrice(displayPrice)}
            </span>
            {product.oldPrice && (
              <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 line-through">
                ${product.oldPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-3 h-3 sm:w-3 sm:h-3 transition-colors duration-300 ${
                    star <= (product.rating || 0)
                      ? 'text-[#d4af37] dark:text-[#f4d03f]'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
              ({product.reviewCount || 0})
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
