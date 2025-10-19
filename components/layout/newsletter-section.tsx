"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function NewsletterSection() {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    if (contentRef.current) {
      gsap.set(contentRef.current, { y: 80, opacity: 0, scale: 0.9 })

      ScrollTrigger.create({
        trigger: contentRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(contentRef.current, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)"
        })
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 transition-transform duration-6000 ease-out"
          style={{
            backgroundImage:
              'url("/images/banners/new letter bg.webp")',
            filter: "blur(8px)",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div ref={contentRef} className="backdrop-blur-sm bg-white/10 rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                Let's Stay In Touch
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
              <span className="bg-gradient-to-r from-white via-white to-[#d4af37] bg-clip-text text-transparent">
                Get exclusive access to new collections & special offers
              </span>
            </h3>

            <div className="max-w-lg mx-auto mt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-white/20 backdrop-blur-sm border-2 border-[#d4af37]/50 rounded-full sm:rounded-r-full focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] text-white placeholder-white/70 transition-all duration-300"
                />
                <button className="group relative bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-black font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/30 transition-all duration-500 hover:scale-105 hover:-translate-y-1">
                  <span className="relative z-10">SUBSCRIBE</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
              <p className="text-white/70 text-xs mt-3">
                By subscribing, you agree to our <span className="text-[#d4af37]">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

