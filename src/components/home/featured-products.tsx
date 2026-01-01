"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Heart, ShoppingCart, Eye, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from '@/components/products/product-card'
import { toast } from "sonner"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function FeaturedProducts() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const gridRef = useRef<HTMLDivElement>(null)
  const productRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/collections?type=feature')
        const data = await response.json()
        if (data.success && data.collections.length > 0) {
          setProducts(data.collections[0].fullProducts || [])
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

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
        image: (() => {
          if (Array.isArray(product.images)) {
            const front = product.images.find((img: any) => img.type === 'front')
            if (front) return front.url || front
          }
          return product.images[0]?.url || product.images[0]
        })(),
        quantity: 1,
        selectedVariations: {}, // Variations can be selected on detail page
      })
    }

    localStorage.setItem("cart", JSON.stringify(existingCart))
    window.dispatchEvent(new Event("cartUpdated"))

    toast.success("Added to cart", {
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
        image: (() => {
          if (Array.isArray(product.images)) {
            const front = product.images.find((img: any) => img.type === 'front')
            if (front) return front.url || front
          }
          return product.images[0]?.url || product.images[0]
        })(),
      })

      localStorage.setItem("wishlist", JSON.stringify(existingWishlist))
      window.dispatchEvent(new Event("wishlistUpdated"))

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

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-[#1e1e1e]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#f4d03f]/20 border-b-[#f4d03f] rounded-full animate-spin-reverse"></div>
              </div>
            </div>
            <p className="text-[#d4af37] font-medium animate-pulse tracking-widest uppercase text-xs">Designing your collection...</p>
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-3xl p-12 border-2 border-dashed border-gray-200 dark:border-gray-700 max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#d4af37]/20 to-[#f4d03f]/20 rounded-full flex items-center justify-center">
          <ShoppingCart className="w-10 h-10 text-[#d4af37]" />
        </div>
        <h3 className="text-2xl font-serif italic font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-serif)' }}>Collection Updating</h3>
        <p className="text-gray-600 dark:text-gray-400">Our curators are currently selecting the finest pieces for you. <br/>Check back very soon for amazing new arrivals!</p>
      </div>
    )
  }

  return (
    <>
      <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, index) => (
          <div key={product.id} ref={(el) => { productRefs.current[index] = el }}>
             <ProductCard product={product} />
          </div>
        ))}
      </div>


    </>
  )
}

