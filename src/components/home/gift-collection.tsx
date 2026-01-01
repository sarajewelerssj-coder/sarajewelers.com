"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, Gift } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function GiftCollection() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const headingRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const productRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const buttonRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await fetch('/api/collections?type=gifts')
        const data = await response.json()
        if (data.success && data.collections.length > 0) {
          setProducts(data.collections[0].fullProducts || [])
        }
      } catch (error) {
        console.error('Failed to fetch gift collection:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchGifts()
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    // Heading animation
    if (headingRef.current) {
      gsap.set(headingRef.current, { y: -50, opacity: 0 })
      
      ScrollTrigger.create({
        trigger: headingRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(headingRef.current, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "back.out(1.7)"
        })
      })
    }

    // Products animation
    const products = productRefs.current.filter(Boolean)
    if (products.length > 0) {
      gsap.set(products, { y: 60, opacity: 0, scale: 0.9 })
      
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
              duration: 0.8,
              delay: index * 0.1,
              ease: "back.out(1.7)"
            })
          })
        },
        onLeave: () => {
          gsap.to(products, { y: 60, opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.05 })
        },
        onEnterBack: () => {
          products.forEach((product, index) => {
            gsap.to(product, {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              delay: index * 0.1,
              ease: "back.out(1.7)"
            })
          })
        },
        onLeaveBack: () => {
          gsap.to(products, { y: 60, opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.05 })
        }
      })
    }

    // Button animation
    if (buttonRef.current) {
      gsap.set(buttonRef.current, { y: 50, opacity: 0 })
      
      ScrollTrigger.create({
        trigger: buttonRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(buttonRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)"
        })
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

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
            <p className="text-[#d4af37] font-medium animate-pulse tracking-widest uppercase text-xs">Curating Gifts...</p>
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-20 bg-white dark:bg-[#1e1e1e]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10">
             <h2 className="text-4xl md:text-5xl font-serif italic font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white" style={{ fontFamily: 'var(--font-serif)' }}>Gifts Gallore</h2>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-3xl p-12 border-2 border-dashed border-gray-200 dark:border-gray-700 max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#d4af37]/20 to-[#f4d03f]/20 rounded-full flex items-center justify-center">
              <Gift className="w-10 h-10 text-[#d4af37]" />
            </div>
            <h3 className="text-2xl font-serif italic font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-serif)' }}>Presents Coming Soon</h3>
            <p className="text-gray-600 dark:text-gray-400">We are hand-picking special gifts for your loved ones. <br/>Check back soon to find the perfect match!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white dark:bg-[#1e1e1e] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.08),transparent_50%)]" />
      </div>
      
      <div className="container mx-auto px-4 relative max-w-7xl">
        <div ref={headingRef} className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
            <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
              Perfect Presents
            </span>
            <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-bold mb-6 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
            <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
              Gifts for Your Loved Ones
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Show your love with our curated collection of 
            <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium"> meaningful gifts</span> for every special occasion.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          {products.map((product, index) => (
            <Link
              key={product.id}
              ref={(el) => { productRefs.current[index] = el }}
              href={`/products/${product.id}`}
              className="group bg-white dark:bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 dark:hover:shadow-[#f4d03f]/20 transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40"
            >
              <div className="aspect-square relative overflow-hidden">
                {(() => {
                  // Find front and back images by type
                  const frontImage = product.images?.find((img: any) => img.type === 'front')?.url || product.images?.[0]?.url || product.images?.[0] || '/placeholder.svg'
                  
                  // Try to find a back image, then gallery, then just the second image in the array
                  const backImage = 
                    product.images?.find((img: any) => img.type === 'back')?.url || 
                    product.images?.find((img: any) => img.type === 'gallery')?.url || 
                    (product.images?.[1]?.url ? product.images[1].url : product.images?.[1]) ||
                    null

                  return (
                    <>
                      {/* Primary Image (Front) */}
                      <Image
                        src={frontImage}
                        alt={product.name}
                        fill
                        className={`object-cover transition-opacity duration-300 ${backImage ? 'group-hover:opacity-0' : ''}`}
                      />
                      
                      {/* Secondary Image (Back - shown on hover) */}
                      {backImage && (
                        <Image
                          src={backImage}
                          alt={`${product.name} - Back view`}
                          fill
                          className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      )}
                    </>
                  )
                })()}
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              <div className="p-3 sm:p-4 md:p-6">
                <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors mb-1 sm:mb-2 leading-tight">
                  {product.name}
                </h3>
                <p className="font-bold text-[#d4af37] dark:text-[#f4d03f] text-sm sm:text-base md:text-lg">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link ref={buttonRef} href="/products?collection=gifts">
            <Button className="group relative overflow-hidden bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-black font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2 border-2 border-[#d4af37]/20">
              <span className="relative z-10 flex items-center gap-3 text-lg">
                Explore All Gifts
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-2 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}