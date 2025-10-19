"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Eye, ChevronRight } from "lucide-react"
import { productsData } from "@/data/products"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function FeaturedProducts() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const { toast } = useToast()
  const gridRef = useRef<HTMLDivElement>(null)
  const productRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return

    const products = productRefs.current.filter(Boolean)
    if (products.length === 0) return

    // Set initial states
    gsap.set(products, { y: 60, opacity: 0, scale: 0.9 })

    // Products animation
    ScrollTrigger.create({
      trigger: gridRef.current,
      start: "top 80%",
      toggleActions: "play reverse play reverse",
      onEnter: () => {
        products.forEach((product, index) => {
          gsap.to(product, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: "back.out(1.7)"
          })
        })
      },
      onLeave: () => {
        gsap.to(products, { y: 60, opacity: 0, scale: 0.9, duration: 0.4, stagger: 0.05 })
      },
      onEnterBack: () => {
        products.forEach((product, index) => {
          gsap.to(product, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: "back.out(1.7)"
          })
        })
      },
      onLeaveBack: () => {
        gsap.to(products, { y: 60, opacity: 0, scale: 0.9, duration: 0.4, stagger: 0.05 })
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const addToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id)

    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
        selectedSize: product.variations?.sizes?.[0] || "",
        selectedColor: product.variations?.colors?.[0] || "",
      })
    }

    localStorage.setItem("cart", JSON.stringify(existingCart))
    window.dispatchEvent(new Event("cartUpdated"))

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
      duration: 3000,
    })
  }

  const addToWishlist = (product: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const existingWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    const existingItemIndex = existingWishlist.findIndex((item: any) => item.id === product.id)

    if (existingItemIndex < 0) {
      existingWishlist.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      })

      localStorage.setItem("wishlist", JSON.stringify(existingWishlist))
      window.dispatchEvent(new Event("wishlistUpdated"))

      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist`,
        duration: 3000,
      })
    } else {
      toast({
        title: "Already in wishlist",
        description: "This product is already in your wishlist",
        duration: 3000,
      })
    }
  }

  // Enhanced product images from Unsplash
  const productImages = [
    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1374&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1374&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1589674781759-c21c37956a44?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1601821765780-754fa98637c1?q=80&w=1470&auto=format&fit=crop",
  ]

  return (
    <>
      <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {productsData.slice(0, 8).map((product, index) => (
          <div
            key={product.id}
            ref={(el) => { productRefs.current[index] = el }}
            className="group relative bg-white dark:bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/30 dark:hover:shadow-[#f4d03f]/35 transition-all duration-150 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              {/* Primary Image */}
              <Image
                src={productImages[index] || product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-opacity duration-300 group-hover:opacity-0"
              />
              
              {/* Secondary Image (shown on hover) */}
              <Image
                src={productImages[(index + 4) % 8] || product.images[1] || product.images[0]}
                alt={`${product.name} - alternate view`}
                fill
                className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              
              {/* Golden shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/40 dark:via-[#f4d03f]/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-800 ease-out" />

              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-[#d4af37] hover:text-white dark:hover:bg-[#f4d03f] dark:hover:text-black transition-colors duration-200 text-gray-700 dark:text-gray-300"
                  onClick={(e) => addToWishlist(product, e)}
                >
                  <Heart size={16} />
                </button>
                <button
                  className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-[#d4af37] hover:text-white dark:hover:bg-[#f4d03f] dark:hover:text-black transition-colors duration-200 text-gray-700 dark:text-gray-300"
                  onClick={(e) => addToCart(product, e)}
                >
                  <ShoppingCart size={16} />
                </button>
                <Link
                  href={`/products/${product.slug}`}
                  className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-[#d4af37] hover:text-white dark:hover:bg-[#f4d03f] dark:hover:text-black transition-colors duration-200 text-gray-700 dark:text-gray-300"
                >
                  <Eye size={16} />
                </Link>
              </div>

              {product.isNew && (
                <div className="absolute top-3 left-3 bg-[#d4af37] text-white text-xs font-medium px-2 py-1 rounded shadow-sm">
                  New
                </div>
              )}

              {product.discount > 0 && (
                <div className="absolute top-3 left-3 bg-[#b22222] text-white text-xs font-medium px-2 py-1 rounded shadow-sm">
                  {product.discount}% OFF
                </div>
              )}
            </div>

            <div className="p-3 sm:p-4">
              <h3 className="text-xs sm:text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1 sm:mb-2 group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors duration-300 font-medium">{product.category}</h3>
              <Link href={`/products/${product.slug}`}>
                <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 hover:text-[#d4af37] dark:hover:text-[#f4d03f] transition-colors duration-300 text-sm sm:text-sm leading-tight">
                  {product.name}
                </h2>
              </Link>

              <div className="flex items-center justify-between mt-2 sm:mt-3">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors duration-300">${product.price.toFixed(2)}</span>
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
                          star <= product.rating ? "text-[#d4af37] dark:text-[#f4d03f]" : "text-gray-300 dark:text-gray-600"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">({product.reviewCount})</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


    </>
  )
}

