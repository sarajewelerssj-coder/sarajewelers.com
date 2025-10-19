"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"
import { categoriesData } from "@/data/categories"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState(categoriesData)
  const gridRef = useRef<HTMLDivElement>(null)
  const categoryRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const buttonRef = useRef<HTMLButtonElement>(null)



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

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" ref={gridRef}>
        {categories.slice(0, 6).map((category, index) => (
          <Link
            href={`/categories/${category.slug}`}
            key={category.id}
            ref={(el) => { categoryRefs.current[index] = el }}
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 active:scale-95 sm:hover:shadow-2xl sm:hover:shadow-[#d4af37]/20 sm:hover:-translate-y-3 border border-white/20 dark:border-gray-700/30"
          >
            <div className="aspect-square relative overflow-hidden rounded-xl sm:rounded-2xl">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 sm:duration-700 sm:group-hover:scale-110"
              />
              {/* Mobile: Simple overlay for text, Desktop: Enhanced overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:via-black/10 sm:group-hover:from-black/50 transition-all duration-300" />
              <div className="hidden sm:block absolute top-4 right-4 w-8 h-8 border-2 border-[#d4af37]/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200" />
              <div className="hidden sm:block absolute top-6 right-6 w-4 h-4 bg-[#d4af37]/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300" />
            </div>
            
            {/* Mobile: Simple category name */}
            <div className="sm:hidden absolute bottom-0 left-0 right-0 p-3 text-center">
              <h3 className="text-white font-bold text-sm">
                {category.name}
              </h3>
            </div>
            
            {/* Desktop: Enhanced content card */}
            <div className="hidden sm:block absolute bottom-0 start-0 end-0 p-3 md:p-4 text-center">
              <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-t-xl border-t border-white/30 dark:border-gray-700/30" />
              <div className="relative z-10">
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 transform translate-y-2 group-hover:translate-y-0">
                  {category.description}
                </p>
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200 transform translate-y-2 group-hover:translate-y-0">
                  <span className="inline-flex items-center text-[#d4af37] dark:text-[#f4d03f] text-xs font-semibold">
                    Explore Collection
                    <svg className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* View All Categories Button */}
      <div className="flex justify-center">
        <Link href="/categories">
          <button ref={buttonRef} className="group relative overflow-hidden bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] hover:from-[#b8860b] hover:via-[#d4af37] hover:to-[#b8860b] text-black font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-xl sm:shadow-2xl hover:shadow-[#d4af37]/30 transition-all duration-500 sm:hover:scale-105 sm:hover:-translate-y-2 border-2 border-[#d4af37]/20 backdrop-blur-sm"
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
          </button>
        </Link>
      </div>
    </div>
  )
}

