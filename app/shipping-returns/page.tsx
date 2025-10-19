"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ShippingReturnsPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return

    if (heroRef.current) {
      gsap.set(heroRef.current, { scale: 0.8, opacity: 0 })
      gsap.to(heroRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "back.out(1.7)",
        delay: 0.3
      })
    }

    if (contentRef.current) {
      gsap.set(contentRef.current, { y: 50, opacity: 0 })
      ScrollTrigger.create({
        trigger: contentRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(contentRef.current, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "back.out(1.7)"
        })
      })
    }

    const cards = cardsRef.current.filter(Boolean)
    cards.forEach((card, index) => {
      if (card) {
        gsap.set(card, { y: 60, opacity: 0 })
        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          toggleActions: "play reverse play reverse",
          animation: gsap.to(card, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.1,
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
    <div className="min-h-screen">
      <div className="relative h-[50vh] min-h-[300px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=1470&auto=format&fit=crop"
          alt="Shipping & Returns"
          fill
          className="object-cover scale-110 transition-transform duration-6000 ease-out"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 max-w-7xl">
            <div ref={heroRef} className="backdrop-blur-sm bg-white/10 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-[2px] bg-[#d4af37]" />
                <span className="text-[#d4af37] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                  Delivery & Returns
                </span>
                <div className="w-16 h-[2px] bg-[#d4af37]" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-white to-[#d4af37] bg-clip-text text-transparent">
                  Shipping & Returns
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Fast, secure delivery and <span className="text-[#d4af37] font-semibold">hassle-free returns</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="py-20 bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 max-w-6xl relative">
          <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-[#d4af37]/10 transition-all duration-500">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                  Shipping Information
                </span>
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-[#d4af37] pl-6 hover:bg-gradient-to-r hover:from-[#d4af37]/5 hover:to-transparent transition-all duration-300 p-4 rounded-r-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Free Shipping</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Complimentary shipping on all orders over $500. Express shipping available for urgent orders.
                  </p>
                </div>
                
                <div className="border-l-4 border-[#d4af37] pl-6 hover:bg-gradient-to-r hover:from-[#d4af37]/5 hover:to-transparent transition-all duration-300 p-4 rounded-r-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Delivery Times</h3>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Standard Shipping: 3-5 business days</li>
                    <li>• Express Shipping: 1-2 business days</li>
                    <li>• International: 7-14 business days</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-[#d4af37] pl-6 hover:bg-gradient-to-r hover:from-[#d4af37]/5 hover:to-transparent transition-all duration-300 p-4 rounded-r-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Secure Packaging</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    All jewelry is shipped in secure, insured packaging with signature confirmation required.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-[#d4af37]/10 transition-all duration-500">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                  Returns & Exchanges
                </span>
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-[#d4af37] pl-6 hover:bg-gradient-to-r hover:from-[#d4af37]/5 hover:to-transparent transition-all duration-300 p-4 rounded-r-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">60-Day Returns</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Return unworn items within 60 days for a full refund. Items must be in original condition.
                  </p>
                </div>
                
                <div className="border-l-4 border-[#d4af37] pl-6 hover:bg-gradient-to-r hover:from-[#d4af37]/5 hover:to-transparent transition-all duration-300 p-4 rounded-r-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Free Return Shipping</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We provide prepaid return labels for all domestic returns. International returns subject to fees.
                  </p>
                </div>
                
                <div className="border-l-4 border-[#d4af37] pl-6 hover:bg-gradient-to-r hover:from-[#d4af37]/5 hover:to-transparent transition-all duration-300 p-4 rounded-r-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Exchange Policy</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Free exchanges for different sizes or styles. Upgrade fees apply for higher-value items.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-[#d4af37]/10 transition-all duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div ref={(el) => { cardsRef.current[0] = el }} className="text-center p-6 bg-gradient-to-br from-[#faf8f3] to-white dark:from-[#1a1a1a] dark:to-[#2a2a2a] rounded-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#d4af37] transition-colors duration-300">Fully Insured</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">All shipments are fully insured</p>
              </div>
              
              <div ref={(el) => { cardsRef.current[1] = el }} className="text-center p-6 bg-gradient-to-br from-[#faf8f3] to-white dark:from-[#1a1a1a] dark:to-[#2a2a2a] rounded-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#d4af37] transition-colors duration-300">Quality Guarantee</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Lifetime warranty on craftsmanship</p>
              </div>
              
              <div ref={(el) => { cardsRef.current[2] = el }} className="text-center p-6 bg-gradient-to-br from-[#faf8f3] to-white dark:from-[#1a1a1a] dark:to-[#2a2a2a] rounded-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#d4af37] transition-colors duration-300">24/7 Support</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Customer service available</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}