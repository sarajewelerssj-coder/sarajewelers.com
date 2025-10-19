"use client"

import { useEffect, useRef } from "react"
import { Wrench, DollarSign, Sparkles, Gem } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function OurServices() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const boxRefs = useRef<(HTMLDivElement | null)[]>([])
  const headingRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const services = [
    {
      icon: Wrench,
      title: "Same-Day Repair",
      description: "Expert jewelry repair with same-day service.",
      delay: "delay-100"
    },
    {
      icon: DollarSign,
      title: "Cash for Gold",
      description: "Instant cash at best market rates.",
      delay: "delay-200"
    },
    {
      icon: Sparkles,
      title: "Custom Design",
      description: "Bespoke jewelry crafted to perfection.",
      delay: "delay-300"
    },
    {
      icon: Gem,
      title: "Cleaning & Polish",
      description: "Professional restoration services.",
      delay: "delay-400"
    }
  ]

  useEffect(() => {
    if (typeof window === "undefined") return

    const boxes = boxRefs.current.filter(Boolean)
    if (boxes.length === 0 || !headingRef.current || !gridRef.current) return

    // Set initial states
    gsap.set(headingRef.current, { y: -50, opacity: 0 })
    gsap.set(boxes[0], { y: -100, opacity: 0 })
    gsap.set(boxes[1], { y: -100, opacity: 0 })
    gsap.set(boxes[2], { x: -100, opacity: 0 })
    gsap.set(boxes[3], { x: 100, opacity: 0 })

    // Heading animation
    ScrollTrigger.create({
      trigger: headingRef.current,
      start: "top 80%",
      toggleActions: "play reverse play reverse",
      animation: gsap.to(headingRef.current, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" })
    })

    // Boxes animation - trigger on grid view
    ScrollTrigger.create({
      trigger: gridRef.current,
      start: "top 70%",
      toggleActions: "play reverse play reverse",
      onEnter: () => {
        gsap.to(boxes[0], { y: 0, opacity: 1, duration: 0.8, delay: 0.1, ease: "back.out(1.7)" })
        gsap.to(boxes[1], { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "back.out(1.7)" })
        gsap.to(boxes[2], { x: 0, opacity: 1, duration: 0.8, delay: 0.5, ease: "back.out(1.7)" })
        gsap.to(boxes[3], { x: 0, opacity: 1, duration: 0.8, delay: 0.7, ease: "back.out(1.7)" })
      },
      onLeave: () => {
        gsap.to(boxes[0], { y: -100, opacity: 0, duration: 0.6 })
        gsap.to(boxes[1], { y: -100, opacity: 0, duration: 0.6, delay: 0.1 })
        gsap.to(boxes[2], { x: -100, opacity: 0, duration: 0.6, delay: 0.2 })
        gsap.to(boxes[3], { x: 100, opacity: 0, duration: 0.6, delay: 0.3 })
      },
      onEnterBack: () => {
        gsap.to(boxes[0], { y: 0, opacity: 1, duration: 0.8, delay: 0.1, ease: "back.out(1.7)" })
        gsap.to(boxes[1], { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "back.out(1.7)" })
        gsap.to(boxes[2], { x: 0, opacity: 1, duration: 0.8, delay: 0.5, ease: "back.out(1.7)" })
        gsap.to(boxes[3], { x: 0, opacity: 1, duration: 0.8, delay: 0.7, ease: "back.out(1.7)" })
      },
      onLeaveBack: () => {
        gsap.to(boxes[3], { x: 100, opacity: 0, duration: 0.6 })
        gsap.to(boxes[2], { x: -100, opacity: 0, duration: 0.6, delay: 0.1 })
        gsap.to(boxes[1], { y: -100, opacity: 0, duration: 0.6, delay: 0.2 })
        gsap.to(boxes[0], { y: -100, opacity: 0, duration: 0.6, delay: 0.3 })
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 overflow-hidden"
      style={{
        backgroundImage: "url('/images/banners/Our Services bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.2),transparent_50%)]" />
      </div>

      <div className="container px-4 mx-auto relative max-w-7xl z-10">
        {/* Section Header */}
        <div ref={headingRef} className="text-center mb-16">
          {/* Subtitle */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
            <span className="text-[#d4af37] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
              Excellence
            </span>
            <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
          </div>
          
          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight font-serif">
            <span className="bg-gradient-to-r from-white via-[#d4af37] to-white bg-clip-text text-transparent">
              Our Services
            </span>
          </h2>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Expert Jewelry Care, Custom Designs & Gold Exchange Services
          </p>
        </div>

        {/* Services Grid */}
        <div ref={gridRef} className="grid grid-cols-2 gap-4 md:gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <div
                key={index}
                ref={(el) => { boxRefs.current[index] = el }}
                className="group"
              >
                {/* Glassmorphic Service Box */}
                <div className="relative backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-[#d4af37]/30 shadow-2xl hover:shadow-[#d4af37]/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:bg-white/15 group overflow-hidden h-48 flex flex-col justify-center">
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  {/* Gold Border Glow */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-[#d4af37]/0 group-hover:border-[#d4af37]/50 transition-all duration-500" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-[#d4af37]/40 transition-all duration-500 group-hover:scale-110">
                      <IconComponent className="w-6 h-6 text-black" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-3 text-center group-hover:text-[#d4af37] transition-colors duration-300 font-serif">
                      {service.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-white/80 text-center group-hover:text-white transition-colors duration-300">
                      {service.description}
                    </p>
                  </div>
                  
                  {/* Corner Decorations */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-[#d4af37]/30 rounded-full group-hover:bg-[#d4af37]/60 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-[#d4af37]/30 rounded-full group-hover:bg-[#d4af37]/60 transition-colors duration-300" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}