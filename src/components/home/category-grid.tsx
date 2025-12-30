"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles, Loader2 } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const gridRef = useRef<HTMLDivElement>(null)
  const categoryRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/collections?type=shop-by-category')
        const data = await response.json()
        if (data.success && data.collections.length > 0) {
          setCategories(data.collections[0].categories || [])
        }
      } catch (error) {
        console.error('Failed to fetch category collection:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])



  useEffect(() => {
    if (typeof window === "undefined") return

    const categoryElements = categoryRefs.current.filter(Boolean)
    if (categoryElements.length === 0 || !buttonRef.current) return

    // Set initial states
    gsap.set(categoryElements, { y: 80, opacity: 0, scale: 0.8 })
    gsap.set(buttonRef.current, { y: 50, opacity: 0 })

    // Categories animation
    ScrollTrigger.create({
      trigger: gridRef.current,
      start: "top 75%",
      toggleActions: "play reverse play reverse",
      onEnter: () => {
        categoryElements.forEach((el, index) => {
          gsap.to(el, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: index * 0.15,
            ease: "back.out(1.7)"
          })
        })
      },
      onLeave: () => {
        gsap.to(categoryElements, { y: 80, opacity: 0, scale: 0.8, duration: 0.6, stagger: 0.1 })
      },
      onEnterBack: () => {
        categoryElements.forEach((el, index) => {
          gsap.to(el, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: index * 0.15,
            ease: "back.out(1.7)"
          })
        })
      },
      onLeaveBack: () => {
        gsap.to(categoryElements, { y: 80, opacity: 0, scale: 0.8, duration: 0.6, stagger: 0.1 })
      }
    })

    // Button animation
    ScrollTrigger.create({
      trigger: buttonRef.current,
      start: "top 85%",
      toggleActions: "play reverse play reverse",
      animation: gsap.to(buttonRef.current, { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" })
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#f4d03f]/20 border-b-[#f4d03f] rounded-full animate-spin-reverse"></div>
          </div>
        </div>
        <p className="text-[#d4af37] font-medium animate-pulse tracking-widest uppercase text-xs">Organizing Gallery...</p>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-3xl p-12 border-2 border-dashed border-gray-200 dark:border-gray-700 max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#d4af37]/20 to-[#f4d03f]/20 rounded-full flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-[#d4af37]" />
        </div>
        <h3 className="text-2xl font-serif italic font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-serif)' }}>Categories Updating</h3>
        <p className="text-gray-600 dark:text-gray-400">Discover our refined world of jewelry soon. <br/>We are re-organizing our collections for you!</p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" ref={gridRef}>
        {categories.slice(0, 6).map((category, index) => (
          <Link
            href={`/categories/${category.slug || ''}`}
            key={category._id || category.id || index}
            ref={(el) => { categoryRefs.current[index] = el as any }}
            className="group relative block overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 sm:hover:shadow-2xl sm:hover:shadow-[#d4af37]/20 sm:hover:-translate-y-3 border border-white/20 dark:border-gray-700/30 cursor-pointer"
          >
            <div className="aspect-square relative overflow-hidden rounded-xl sm:rounded-2xl">
              <Image
                src={category.image}
                alt={category.name || "Category Image"}
                fill
                className="object-cover transition-transform duration-300 sm:duration-700 sm:group-hover:scale-110"
              />
            </div>
            
            {/* Content Overlay - Amazing Hover Effect */}
            <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 transition-all duration-500">
              {/* Gradient Overlay - Expands on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/90 group-hover:via-black/70 transition-all duration-500" />
              
              {/* Content Container */}
              <div className="relative z-10 space-y-3 sm:space-y-4">
                {/* Category Title - Always visible, turns gold on hover */}
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white transition-all duration-400 group-hover:text-[#f4d03f] drop-shadow-lg">
                  {category.categoryName || category.name}
                </h3>
                
                {/* Description - Slides up and fades in on hover */}
                <div className="max-h-0 overflow-hidden opacity-0 group-hover:max-h-32 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-4 line-clamp-3">
                    {category.description}
                  </p>
                  
                  {/* Explore Collection Button */}
                  <div className="inline-flex items-center gap-2 text-[#f4d03f] font-semibold text-sm sm:text-base group/btn">
                    <span className="transition-all duration-300 group-hover/btn:tracking-wide">Explore {category.categoryName || category.name}</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:translate-x-2" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* View All Categories Button */}
      <div className="flex justify-center">
        <Link 
          href="/categories"
          className="group relative overflow-hidden bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] hover:from-[#b8860b] hover:via-[#d4af37] hover:to-[#b8860b] text-black font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-xl sm:shadow-2xl hover:shadow-[#d4af37]/30 transition-all duration-500 sm:hover:scale-105 sm:hover:-translate-y-2 border-2 border-[#d4af37]/20 backdrop-blur-sm"
        >
          {/* Animated Background - Desktop only */}
          <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          
          {/* Sparkle Effects - Desktop only */}
          <div className="hidden sm:block absolute -top-1 -left-1 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div className="hidden sm:block absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300">
            <Sparkles className="w-3 h-3 text-white animate-pulse" />
          </div>
          
          {/* Button Content */}
          <span className="relative z-10 flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 sm:group-hover:translate-x-2 sm:group-hover:scale-110" />
          </span>
          
          {/* Ripple Effect - Desktop only */}
          <div className="hidden sm:block absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out" />
        </Link>
      </div>
    </div>
  )
}

