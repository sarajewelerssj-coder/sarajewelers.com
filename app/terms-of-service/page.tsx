"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function TermsOfServicePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

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

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[250px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1470&auto=format&fit=crop"
          alt="Terms of Service"
          fill
          className="object-cover scale-110 transition-transform duration-6000 ease-out"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 max-w-7xl">
            <div ref={heroRef} className="backdrop-blur-sm bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                <span className="bg-gradient-to-r from-white via-white to-[#d4af37] bg-clip-text text-transparent">
                  Terms of Service
                </span>
              </h1>
              <p className="text-lg text-white/90">Last updated: January 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-20 bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div ref={contentRef} className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-[#d4af37]/10 transition-all duration-500">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                  Acceptance of Terms
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                By accessing and using Sara Jewelers' website and services, you accept and agree to be bound by the 
                terms and provision of this agreement. These terms apply to all visitors, users, and others who 
                access or use our service.
              </p>

              <h2 className="text-2xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                  Products and Services
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                All jewelry pieces are handcrafted and may have slight variations from displayed images. We reserve 
                the right to modify or discontinue any product without prior notice. Custom jewelry orders are 
                final and non-refundable unless there is a manufacturing defect.
              </p>

              <h2 className="text-2xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                  Pricing and Payment
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                All prices are subject to change without notice. Payment is required in full before shipment unless 
                other arrangements have been made. We accept major credit cards, PayPal, and other approved payment 
                methods. All transactions are processed securely.
              </p>

              <h2 className="text-2xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                  Shipping and Returns
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We offer worldwide shipping with full insurance coverage. Return policy allows 60 days for unworn 
                items in original condition. Custom pieces have a 14-day return window. All returns must include 
                original packaging and documentation.
              </p>

              <h2 className="text-2xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                  Limitation of Liability
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Sara Jewelers shall not be liable for any indirect, incidental, special, consequential, or punitive 
                damages, including without limitation, loss of profits, data, use, goodwill, or other intangible 
                losses, resulting from your use of our service.
              </p>

              <h2 className="text-2xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                  Contact Information
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                If you have any questions about these Terms of Service, please contact us at{" "}
                <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">legal@sarajewelers.com</span> or 
                call us at <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">+1 (800) 123-4567</span>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}