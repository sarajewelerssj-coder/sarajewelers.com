"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function DiamondBanner() {
  const contentRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    if (contentRef.current && imageRef.current) {
      // Set initial states
      gsap.set(contentRef.current, { x: -100, opacity: 0 })
      gsap.set(imageRef.current, { x: 100, opacity: 0 })

      // Content animation (from left)
      ScrollTrigger.create({
        trigger: contentRef.current,
        start: "top 80%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(contentRef.current, {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "back.out(1.7)"
        })
      })

      // Image animation (from right)
      ScrollTrigger.create({
        trigger: imageRef.current,
        start: "top 80%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(imageRef.current, {
          x: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3,
          ease: "back.out(1.7)"
        })
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 relative max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div ref={contentRef} className="lg:order-1 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm font-semibold tracking-[0.2em] uppercase">
                Premium Collection
              </span>
              <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Exquisite Diamond Collection
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              Discover our handcrafted diamond pieces, each one unique and stunning. Our master craftsmen select only the finest diamonds to create jewelry that will be treasured for generations.
            </p>

            <Link href="/diamonds">
              <Button className="group relative overflow-hidden bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-black font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2 border-2 border-[#d4af37]/20">
                <span className="relative z-10 flex items-center gap-3 text-lg">
                  Shop Diamonds
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-2 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>
            </Link>
          </div>

          <div ref={imageRef} className="lg:order-2 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl hover:shadow-[#d4af37]/30 dark:hover:shadow-[#f4d03f]/30 transition-all duration-500 hover:scale-105">
              <Image
                src="/images/banners/bottom of feature prod banner.webp"
                alt="Exquisite Diamond Collection"
                fill
                className="object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
            
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-r from-[#d4af37]/30 to-[#f4d03f]/20 rounded-full blur-2xl z-0"></div>
            <div className="absolute -top-8 -left-8 w-40 h-40 bg-gradient-to-l from-[#d4af37]/20 to-[#f4d03f]/30 rounded-full blur-2xl z-0"></div>
          </div>
        </div>
      </div>
    </section>
  )
}