"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import NewsletterSection from "@/components/layout/newsletter-section"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)
  const storyTextRef = useRef<HTMLDivElement>(null)
  const storyImageRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)
  const teamRef = useRef<HTMLDivElement>(null)
  const ownerImageRef = useRef<HTMLDivElement>(null)
  const ownerContentRef = useRef<HTMLDivElement>(null)

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

    const sections = [valuesRef, teamRef]
    sections.forEach((sectionRef) => {
      if (sectionRef.current) {
        gsap.set(sectionRef.current, { y: 50, opacity: 0 })
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play reverse play reverse",
          animation: gsap.to(sectionRef.current, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "back.out(1.7)"
          })
        })
      }
    })

    // Story section animations
    if (storyTextRef.current) {
      gsap.set(storyTextRef.current, { x: -80, opacity: 0 })
      ScrollTrigger.create({
        trigger: storyRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(storyTextRef.current, {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "back.out(1.7)"
        })
      })
    }

    if (storyImageRef.current) {
      gsap.set(storyImageRef.current, { x: 80, opacity: 0, scale: 0.8 })
      ScrollTrigger.create({
        trigger: storyRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(storyImageRef.current, {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          delay: 0.3,
          ease: "back.out(1.7)"
        })
      })
    }

    // Owner image animation from left
    if (ownerImageRef.current) {
      gsap.set(ownerImageRef.current, { x: -100, opacity: 0 })
      ScrollTrigger.create({
        trigger: ownerImageRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(ownerImageRef.current, {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "back.out(1.7)"
        })
      })
    }

    // Owner content animation from right
    if (ownerContentRef.current) {
      gsap.set(ownerContentRef.current, { x: 100, opacity: 0 })
      ScrollTrigger.create({
        trigger: ownerContentRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(ownerContentRef.current, {
          x: 0,
          opacity: 1,
          duration: 1.2,
          delay: 0.2,
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
      <div className="relative h-[70vh] sm:h-[75vh] md:h-[80vh] min-h-[500px] max-h-[700px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1470&auto=format&fit=crop"
          alt="About Sara Jewelers"
          fill
          className="object-cover scale-110 transition-transform duration-6000 ease-out"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div ref={heroRef} className="backdrop-blur-sm bg-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 md:w-16 h-[2px] bg-[#d4af37]" />
                  <span className="text-[#d4af37] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                    Our Legacy
                  </span>
                  <div className="w-12 md:w-16 h-[2px] bg-[#d4af37]" />
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white via-white to-[#d4af37] bg-clip-text text-transparent">
                    Our Story
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl leading-relaxed">
                  Crafting exquisite jewelry pieces that celebrate life's special moments since 
                  <span className="text-[#d4af37] font-semibold">2008</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Owner Section */}
      <section className="py-20 bg-white dark:bg-[#1e1e1e] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.08),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative max-w-7xl">
          <div ref={teamRef} className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                Meet The Owner
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                The Artisan Behind Our Jewelry
              </span>
            </h3>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Bringing <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">years of experience and passion</span> to every piece created since 2008.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div ref={ownerImageRef} className="relative group">
              <div className="aspect-[3/4] max-w-sm mx-auto relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-[#d4af37]/30 dark:hover:shadow-[#f4d03f]/30 transition-all duration-500 hover:scale-105">
                <Image 
                  src="/placeholder.jpg" 
                  alt="Rana Waqar Ahmed" 
                  fill 
                  className="object-cover transition-transform duration-700 hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-[#d4af37]/30 to-[#f4d03f]/20 rounded-full blur-2xl z-0"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-l from-[#d4af37]/20 to-[#f4d03f]/30 rounded-full blur-2xl z-0"></div>
            </div>
            
            <div ref={ownerContentRef} className="space-y-6">
              <div>
                <h4 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                    Rana Waqar Ahmed
                  </span>
                </h4>
                <p className="text-[#d4af37] dark:text-[#f4d03f] text-xl font-semibold mb-6">
                  Owner & Master Jeweler
                </p>
              </div>
              
              <div className="space-y-4">
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  With over <span className="text-[#d4af37] dark:text-[#f4d03f] font-semibold">15 years of experience</span> since founding Sara Jewelers in 2008, 
                  Rana brings exceptional craftsmanship and attention to detail to every piece.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Specializing in <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">custom designs and fine jewelry</span>, Rana's passion for excellence 
                  ensures that each creation meets the highest standards of quality and beauty.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Every piece tells a story, crafted with <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">precision, care, and artistic vision</span> 
                  that has made Sara Jewelers a trusted name in fine jewelry.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="bg-gradient-to-r from-[#d4af37]/10 to-[#f4d03f]/10 px-4 py-2 rounded-full border border-[#d4af37]/20">
                  <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium text-sm">Custom Design Expert</span>
                </div>
                <div className="bg-gradient-to-r from-[#d4af37]/10 to-[#f4d03f]/10 px-4 py-2 rounded-full border border-[#d4af37]/20">
                  <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium text-sm">15+ Years Experience</span>
                </div>
                <div className="bg-gradient-to-r from-[#d4af37]/10 to-[#f4d03f]/10 px-4 py-2 rounded-full border border-[#d4af37]/20">
                  <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium text-sm">Master Craftsman</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative max-w-7xl">
          <div ref={storyRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div ref={storyTextRef}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
                <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                  Our Heritage
                </span>
                <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
              </div>
              
              <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                  A Legacy of Excellence
                </span>
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Founded in <span className="text-[#d4af37] dark:text-[#f4d03f] font-semibold">2008</span> by Rana Waqar Ahmed, Sara Jewelers began with a vision to create 
                exceptional jewelry pieces. With a passion for <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">exceptional craftsmanship</span> and an eye for timeless design, 
                we quickly established a reputation for creating jewelry of unparalleled quality and beauty.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Over the years, our commitment to excellence has never wavered. We continue to combine 
                <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">traditional techniques with innovative design</span> to create pieces that will be treasured for generations.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Each piece in our collection is meticulously crafted with <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">years of experience and dedication</span>,
                using only the finest materials and ethically sourced gemstones.
              </p>
            </div>
            <div ref={storyImageRef} className="relative">
              <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-[#d4af37]/30 dark:hover:shadow-[#f4d03f]/30 transition-all duration-500 hover:scale-105">
                <Image
                  src="https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=1470&auto=format&fit=crop"
                  alt="Our Heritage"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-r from-[#d4af37]/30 to-[#f4d03f]/20 rounded-full blur-2xl z-0"></div>
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-gradient-to-l from-[#d4af37]/20 to-[#f4d03f]/30 rounded-full blur-2xl z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white dark:bg-[#1e1e1e] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.08),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative max-w-7xl">
          <div ref={valuesRef} className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                What We Stand For
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Our Core Values
              </span>
            </h3>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              These principles guide everything we do, from 
              <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">design to customer service</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-[#faf8f3] to-white dark:from-[#1a1a1a] dark:to-[#2a2a2a] p-8 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 dark:hover:shadow-[#f4d03f]/20 transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40">
              <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl group-hover:shadow-[#d4af37]/30 transition-all duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors duration-300">Quality</h4>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                We never compromise on quality. From the materials we select to the finishing touches, every detail
                matters.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-[#faf8f3] to-white dark:from-[#1a1a1a] dark:to-[#2a2a2a] p-8 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 dark:hover:shadow-[#f4d03f]/20 transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40">
              <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl group-hover:shadow-[#d4af37]/30 transition-all duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors duration-300">Innovation</h4>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                We blend traditional craftsmanship with contemporary design to create jewelry that is both timeless and
                modern.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-[#faf8f3] to-white dark:from-[#1a1a1a] dark:to-[#2a2a2a] p-8 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 dark:hover:shadow-[#f4d03f]/20 transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40">
              <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl group-hover:shadow-[#d4af37]/30 transition-all duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors duration-300">
                Sustainability
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                We are committed to ethical sourcing and sustainable practices that respect both people and the planet.
              </p>
            </div>
          </div>
        </div>
      </section>





      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  )
}

