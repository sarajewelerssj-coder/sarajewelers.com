"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import Link from "next/link"
import CategoryGrid from "@/components/home/category-grid"
import HeroSlider from "@/components/home/hero-slider"
import OurServices from "@/components/home/our-services"
import FeaturedProducts from "@/components/home/featured-products"
import PromoBanner from "@/components/home/promo-banner"
import DiamondBanner from "@/components/home/diamond-banner"
import GiftsBanner from "@/components/home/gifts-banner"
import LogoLoader from "@/components/ui/logo-loader"
import FloatingButtons from "@/components/ui/floating-buttons"
import dynamic from "next/dynamic"

const GiftCollection = dynamic(() => import("@/components/home/gift-collection"), { ssr: false })
const CustomerVideos = dynamic(() => import("@/components/home/customer-videos"), { ssr: false })
const HomeFAQ = dynamic(() => import("@/components/home/home-faq"), { ssr: false })
const NewsletterSection = dynamic(() => import("@/components/layout/newsletter-section"), { ssr: false })
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Home() {
  const categoryHeadingRef = useRef<HTMLDivElement>(null)
  const featuredHeadingRef = useRef<HTMLDivElement>(null)
  const commitmentHeadingRef = useRef<HTMLDivElement>(null)
  const faqHeadingRef = useRef<HTMLDivElement>(null)
  const locationHeadingRef = useRef<HTMLDivElement>(null)
  const commitmentGridRef = useRef<HTMLDivElement>(null)
  const commitmentItemRefs = useRef<(HTMLDivElement | null)[]>([])
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const headings = [categoryHeadingRef, featuredHeadingRef, commitmentHeadingRef, faqHeadingRef, locationHeadingRef]
    
    headings.forEach((headingRef) => {
      if (headingRef.current) {
        gsap.set(headingRef.current, { y: -50, opacity: 0 })
        
        ScrollTrigger.create({
          trigger: headingRef.current,
          start: "top 85%",
          once: true,
          animation: gsap.to(headingRef.current, { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            ease: "back.out(1.7)" 
          })
        })
      }
    })

    // Commitment items animation
    const commitmentItems = commitmentItemRefs.current.filter(Boolean)
    if (commitmentItems.length > 0) {
      gsap.set(commitmentItems, { y: 60, opacity: 0 })
      
      ScrollTrigger.create({
        trigger: commitmentGridRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          commitmentItems.forEach((item, index) => {
            gsap.to(item, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              delay: index * 0.1,
              ease: "back.out(1.7)"
            })
          })
        }
      })
    }

    // Map animation
    if (mapRef.current) {
      gsap.set(mapRef.current, { scale: 0.8, opacity: 0 })
      
      ScrollTrigger.create({
        trigger: mapRef.current,
        start: "top 85%",
        once: true,
        animation: gsap.to(mapRef.current, {
          scale: 1,
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
    <>
    <main>
      <Suspense fallback={<LogoLoader />}>
        <HeroSlider />
        <h1 className="sr-only">Sara Jewelers - Premium Fine Jewelry & Custom Designs Hamilton NJ</h1>
      </Suspense>

      {/* Our Services Section */}
      <OurServices />

      {/* Shop by Category - Moved after Hero */}
      <section className="py-20 bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
        </div>
        
        <div className="container px-4 mx-auto relative max-w-7xl">
          <div ref={categoryHeadingRef} className="text-center mb-16">
            {/* Enhanced Subtitle */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                Explore
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            {/* Main Heading with Gradient */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-bold mb-6 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Shop by Category
              </span>
            </h2>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Browse our extensive collection of fine jewelry categories, each piece crafted with 
              <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium"> exceptional artistry</span> and attention to detail.
            </p>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* Promo Banner - Moved after Categories */}
      <PromoBanner />

      {/* Featured Collections */}
      <section className="py-20 bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,175,55,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
        </div>
        
        <div className="container px-4 mx-auto relative max-w-7xl">
          <div ref={featuredHeadingRef} className="text-center mb-16">
            {/* Enhanced Subtitle */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                Our Collections
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            {/* Main Heading with Gradient */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-bold mb-6 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Featured Products
              </span>
            </h2>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
              Discover our most popular jewelry pieces, crafted with 
              <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium"> precision and care</span>.
            </p>
          </div>
          
          <FeaturedProducts />
          
          {/* See All Products Button */}
          <div className="flex justify-center mt-12">
            <Link href="/products">
              <button className="group relative overflow-hidden bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-black font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2 border-2 border-[#d4af37]/20 cursor-pointer">
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {/* Button Content */}
                <span className="relative z-10 flex items-center gap-3 text-lg">
                  See All Products
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-2 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                
                {/* Ripple Effect */}
                <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Diamond Banner */}
      <DiamondBanner />

      {/* Our Commitment */}
      <section className="py-20 bg-white dark:bg-[#1e1e1e] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.08),transparent_50%)]" />
        </div>
        
        <div className="container px-4 mx-auto relative max-w-7xl">
          <div ref={commitmentHeadingRef} className="text-center mb-16">
            {/* Enhanced Subtitle */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                Our Promise
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            {/* Main Heading with Gradient */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-bold mb-6 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Our Commitment
              </span>
            </h2>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We are dedicated to providing 
              <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">exceptional quality</span> and 
              <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">unparalleled service</span> in every piece we create.
            </p>
          </div>
          
          {/* Enhanced Grid Layout */}
          <div ref={commitmentGridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 lg:gap-6">
            {/* Quality Assurance */}
            <div ref={(el) => { commitmentItemRefs.current[0] = el }} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-[#d4af37]/30 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#d4af37] transition-colors duration-300">
                Quality Assurance
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Rigorous quality control
              </p>
            </div>

            {/* Lifetime Warranty */}
            <div ref={(el) => { commitmentItemRefs.current[1] = el }} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-[#d4af37]/30 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#d4af37] transition-colors duration-300">
                Lifetime Warranty
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Complete coverage
              </p>
            </div>

            {/* Fast Shipping */}
            <div ref={(el) => { commitmentItemRefs.current[2] = el }} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-[#d4af37]/30 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#d4af37] transition-colors duration-300">
                Fast Shipping
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Quick delivery
              </p>
            </div>

            {/* Expert Craftsmanship */}
            <div ref={(el) => { commitmentItemRefs.current[3] = el }} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-[#d4af37]/30 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#d4af37] transition-colors duration-300">
                Expert Craftsmanship
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Master jewelers
              </p>
            </div>

            {/* 24/7 Support */}
            <div ref={(el) => { commitmentItemRefs.current[4] = el }} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-[#d4af37]/30 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#d4af37] transition-colors duration-300">
                24/7 Support
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Always available
              </p>
            </div>

            {/* Secure Payment */}
            <div ref={(el) => { commitmentItemRefs.current[5] = el }} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-[#d4af37]/30 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#d4af37] transition-colors duration-300">
                Secure Payment
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Safe & protected
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gifts Banner */}
      <AnimatedWrapper>
        <GiftsBanner />
      </AnimatedWrapper>

      {/* Gift Collection */}
      <AnimatedWrapper>
        <GiftCollection />
      </AnimatedWrapper>

      {/* Customer Videos */}
      <AnimatedWrapper>
        <CustomerVideos />
      </AnimatedWrapper>

      {/* FAQ Section */}
      <AnimatedWrapper className="py-20 bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
        </div>
        
        <div className="container px-4 mx-auto relative max-w-7xl">
          <div ref={faqHeadingRef} className="text-center mb-6">
            {/* Enhanced Subtitle */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-serif italic font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-serif)' }}>
                Have Questions?
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            {/* Main Heading with Gradient */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-bold mb-6 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-serif italic font-medium" style={{ fontFamily: 'var(--font-serif)' }}>
              Find answers to common questions about our 
              <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium ml-1">products and services</span>.
            </p>
          </div>
          <HomeFAQ />
        </div>
      </AnimatedWrapper>

      {/* Location Section */}
      <AnimatedWrapper className="py-20 bg-white dark:bg-[#1e1e1e] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.08),transparent_50%)]" />
        </div>
        
        <div className="container px-4 mx-auto relative max-w-7xl">
          <div ref={locationHeadingRef} className="text-center mb-16">
            {/* Enhanced Subtitle */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                Find Us
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            {/* Main Heading with Gradient */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-bold mb-6 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Visit Our Store Location
              </span>
            </h2>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Located in the heart of Hamilton Mall, we're easy to find and 
              <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">ready to serve you</span>.
            </p>
          </div>
          
          <div className="flex justify-center">
            <div ref={mapRef} className="w-full max-w-5xl bg-white dark:bg-[#2a2a2a] p-3 rounded-[2rem] shadow-2xl border border-[#d4af37]/20 hover:shadow-[#d4af37]/10 transition-all duration-500 relative group overflow-hidden">
               {/* Gold Border Effect */}
               <div className="absolute inset-0 rounded-[2rem] border-2 border-[#d4af37]/10 pointer-events-none"></div>

              <div className="relative overflow-hidden rounded-[1.5rem] h-[500px]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3080.6839615650388!2d-74.6456739!3d39.4538746!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c0dd7f793257ff%3A0x181a54b70c73c791!2sSara%20Jewelers!5e0!3m2!1sen!2s!4v1760858723121!5m2!1sen!2s" 
                  width="100%" 
                  height="100%" 
                  style={{border: 0, pointerEvents: 'none'}} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-[1.5rem] transition-transform duration-700 group-hover:scale-105"
                />
                <div 
                  onClick={() => window.open('https://www.google.com/maps/place/Sara+Jewelers/@39.4538746,-74.6456739,17z/data=!3m1!4b1!4m6!3m5!1s0x89c0dd7f793257ff:0x181a54b70c73c791!8m2!3d39.4538746!4d-74.6456739!16s%2Fg%2F11c5qx8y8q', '_blank')}
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-12 cursor-pointer"
                >
                  <button className="bg-[#d4af37] hover:bg-[#b8941f] text-black font-bold px-8 py-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedWrapper>

      {/* Newsletter Section */}
      <AnimatedWrapper>
        <NewsletterSection />
      </AnimatedWrapper>
    </main>
    <FloatingButtons />
    </>
  )
}


function AnimatedWrapper({ children, className }: { children: React.ReactNode, className?: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className || ''}`}
    >
      {children}
    </div>
  )
}
