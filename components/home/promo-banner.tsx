"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Star } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function PromoBanner() {
  const contentRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const elements = [badgeRef, headingRef, descRef, buttonsRef]
    
    elements.forEach((ref, index) => {
      if (ref.current) {
        gsap.set(ref.current, { y: 50, opacity: 0 })
        
        ScrollTrigger.create({
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play reverse play reverse",
          animation: gsap.to(ref.current, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.2,
            ease: "back.out(1.7)"
          })
        })
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banners/Premium Collection.webp"
          alt="Luxury Jewelry"
          fill
          className="object-cover scale-110 transition-transform [transition-duration:10000ms] ease-out"
        />
        {/* Enhanced Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#d4af37]/20 via-transparent to-transparent" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-5 opacity-30">
        <div className="absolute top-20 left-10 animate-pulse">
          <Sparkles className="text-[#d4af37] w-8 h-8" />
        </div>
        <div className="absolute top-40 right-20 animate-pulse delay-1000">
          <Star className="text-[#d4af37] w-6 h-6" />
        </div>
        <div className="absolute bottom-32 left-1/4 animate-pulse delay-2000">
          <Sparkles className="text-[#d4af37] w-5 h-5" />
        </div>
        <div className="absolute top-1/3 right-1/3 w-32 h-32 border border-[#d4af37]/20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 border border-[#d4af37]/30 rounded-full animate-bounce" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          {/* Enhanced Limited Time Badge */}
          <div ref={badgeRef} className="inline-flex items-center gap-3 bg-[#d4af37]/20 backdrop-blur-md border border-[#d4af37]/40 px-6 py-3 rounded-full mb-8 animate-pulse">
            <div className="w-3 h-3 bg-[#d4af37] rounded-full animate-ping" />
            <span className="text-[#d4af37] text-sm md:text-base font-bold tracking-widest uppercase">
              Limited Time Offer
            </span>
          </div>
          
          {/* Main Heading with Animation */}
          <h2 ref={headingRef} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 leading-tight">
            <span className="block mb-2">Exclusive Collection</span>
            <span className="bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] bg-clip-text text-transparent animate-pulse text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              30% OFF
            </span>
          </h2>
          
          {/* Enhanced Description */}
          <p ref={descRef} className="text-white/90 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-3xl leading-relaxed">
            Discover our exclusive collection of handcrafted jewelry pieces. Each piece is meticulously designed to
            bring out your unique style and elegance.
          </p>
          
          {/* Enhanced CTA Buttons */}
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-6">
            <Link href="/categories">
              <Button className="group relative overflow-hidden bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-black font-bold px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-6 text-base sm:text-lg md:text-xl rounded-full shadow-2xl hover:shadow-[#d4af37]/50 transition-all duration-500 hover:scale-110 hover:-translate-y-3 border-2 border-[#d4af37]/30">
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                  Shop Now
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-2 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Button>
            </Link>
            
            <Link href="/custom-design">
              <Button className="group bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-6 text-base sm:text-lg md:text-xl rounded-full border-2 border-white/30 hover:border-[#d4af37] transition-all duration-500 hover:scale-105 hover:text-[#d4af37]">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Bottom Fade Effect - Fixed for light mode */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-gray-900 to-transparent z-10" />
    </section>
  )
}
