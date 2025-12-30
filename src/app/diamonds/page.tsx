"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import DiamondsFAQ from "@/components/diamonds/diamonds-faq"
import NewsletterSection from "@/components/layout/newsletter-section"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function DiamondsPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const categoriesHeadingRef = useRef<HTMLDivElement>(null)
  const educationHeadingRef = useRef<HTMLDivElement>(null)
  const comparisonHeadingRef = useRef<HTMLDivElement>(null)
  const faqHeadingRef = useRef<HTMLDivElement>(null)
  const categoryCardsRef = useRef<(HTMLDivElement | null)[]>([])
  const educationContentRef = useRef<HTMLDivElement>(null)
  const comparisonCardsRef = useRef<(HTMLDivElement | null)[]>([])
  const faqSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    // Hero animation
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

    const headings = [categoriesHeadingRef, educationHeadingRef, comparisonHeadingRef, faqHeadingRef]
    
    headings.forEach((headingRef) => {
      if (headingRef.current) {
        gsap.set(headingRef.current, { y: -50, opacity: 0 })
        
        ScrollTrigger.create({
          trigger: headingRef.current,
          start: "top 85%",
          toggleActions: "play reverse play reverse",
          animation: gsap.to(headingRef.current, { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            ease: "back.out(1.7)" 
          })
        })
      }
    })

    // Category cards animation
    const categoryCards = categoryCardsRef.current.filter(Boolean)
    if (categoryCards.length > 0) {
      gsap.set(categoryCards, { y: 60, opacity: 0 })
      
      categoryCards.forEach((card, index) => {
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
      })
    }

    // Education content animation
    if (educationContentRef.current) {
      gsap.set(educationContentRef.current, { x: 50, opacity: 0 })
      
      ScrollTrigger.create({
        trigger: educationContentRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(educationContentRef.current, {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out"
        })
      })
    }

    // Comparison cards animation
    const comparisonCards = comparisonCardsRef.current.filter(Boolean)
    if (comparisonCards.length > 0) {
      gsap.set(comparisonCards, { y: 60, opacity: 0 })
      
      comparisonCards.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          toggleActions: "play reverse play reverse",
          animation: gsap.to(card, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.2,
            ease: "back.out(1.7)"
          })
        })
      })
    }

    // FAQ section animation
    if (faqSectionRef.current) {
      gsap.set(faqSectionRef.current, { scale: 0.8, opacity: 0 })
      
      ScrollTrigger.create({
        trigger: faqSectionRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(faqSectionRef.current, {
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
    <div className="min-h-screen bg-[#F6F1E8] dark:bg-gradient-to-br dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
      {/* Hero Section */}
      <div className="relative h-[70vh] sm:h-[75vh] md:h-[80vh] min-h-[500px] max-h-[700px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=1470&auto=format&fit=crop"
          alt="Diamond Collection"
          fill
          className="object-cover scale-110 transition-transform duration-6000 ease-out"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="max-w-4xl">
              <div ref={heroRef} className="backdrop-blur-sm bg-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 md:w-16 h-[2px] bg-[#d4af37]" />
                  <span className="text-[#d4af37] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                    Premium Collection
                  </span>
                  <div className="w-12 md:w-16 h-[2px] bg-[#d4af37]" />
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic font-bold text-white mb-6 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                  <span className="bg-gradient-to-r from-white via-white to-[#d4af37] bg-clip-text text-transparent">
                    Exquisite Diamond Collection
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl leading-relaxed">
                  Discover our handcrafted diamond pieces, each one 
                  <span className="text-[#d4af37] font-semibold">unique and stunning</span>.
                </p>
                
                <Button className="group relative overflow-hidden bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-black font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2 border-2 border-[#d4af37]/20">
                  <span className="relative z-10 flex items-center gap-3 text-lg">
                    Shop Diamonds
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-2 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diamond Categories */}
      <section className="py-20 bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative max-w-7xl">
          <div ref={categoriesHeadingRef} className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                Our Collections
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-bold mb-6 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Explore Our Diamond Collections
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From classic solitaires to modern designs, find the perfect diamond piece to celebrate 
              <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">life's special moments</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Engagement Rings",
                image: "https://images.unsplash.com/photo-1589674781759-c21c37956a44?q=80&w=1470&auto=format&fit=crop",
                description: "Begin your forever with a stunning diamond engagement ring.",
                link: "/categories/engagement-rings",
              },
              {
                title: "Diamond Necklaces",
                image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1470&auto=format&fit=crop",
                description: "Elegant diamond necklaces for everyday luxury.",
                link: "/categories/pendants-necklaces",
              },
              {
                title: "Diamond Earrings",
                image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1470&auto=format&fit=crop",
                description: "Sparkle and shine with our diamond earring collection.",
                link: "/categories/earrings",
              },
            ].map((category, index) => (
              <div
                key={index}
                ref={(el) => { categoryCardsRef.current[index] = el }}
                className="group relative overflow-hidden rounded-xl bg-white dark:bg-[#1e1e1e] shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 dark:hover:shadow-[#f4d03f]/20 transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-colors duration-300" />
                </div>
                <div className="p-6 relative z-10 transform translate-y-0 group-hover:-translate-y-4 transition-transform duration-300">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{category.description}</p>
                  <Link href={category.link}>
                    <Button
                      variant="outline"
                      className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-white dark:border-[#d4af37] dark:text-[#d4af37] dark:hover:bg-[#d4af37] dark:hover:text-white transition-all duration-300 group/btn"
                    >
                      Explore <ChevronRight size={16} className="ml-1 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diamond Education */}
      <section className="py-20 bg-white dark:bg-[#1e1e1e] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.08),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative max-w-7xl">
          <div ref={educationHeadingRef} className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                Learn About Diamonds
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-bold mb-6 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Diamond Education
              </span>
            </h3>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Learn about the 4Cs and how to choose the 
              <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">perfect diamond</span> for your special occasion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-[#d4af37]/30 dark:hover:shadow-[#f4d03f]/30 transition-all duration-500 hover:scale-105">
                <Image
                  src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1470&auto=format&fit=crop"
                  alt="Diamond Education"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-r from-[#d4af37]/30 to-[#f4d03f]/20 rounded-full blur-2xl z-0"></div>
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-gradient-to-l from-[#d4af37]/20 to-[#f4d03f]/30 rounded-full blur-2xl z-0"></div>
            </div>
            <div ref={educationContentRef}>
              <h3 className="text-3xl md:text-4xl font-bold text-[#d4af37] dark:text-[#f4d03f] mb-8">The 4Cs of Diamonds</h3>

              <div className="space-y-6">
                <div className="group bg-gradient-to-br from-[#faf8f3] to-white dark:from-[#1a1a1a] dark:to-[#2a2a2a] p-6 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 dark:hover:shadow-[#f4d03f]/20 transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors">
                    Cut
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    The cut of a diamond determines its brilliance and sparkle. A well-cut diamond will reflect light
                    internally and disperse it through the top of the stone.
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-[#faf8f3] to-white dark:from-[#1a1a1a] dark:to-[#2a2a2a] p-6 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 dark:hover:shadow-[#f4d03f]/20 transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors">
                    Color
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Diamond color is graded on a scale from D (colorless) to Z (light yellow or brown). The less color,
                    the higher the grade and value.
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-[#faf8f3] to-white dark:from-[#1a1a1a] dark:to-[#2a2a2a] p-6 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 dark:hover:shadow-[#f4d03f]/20 transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors">
                    Clarity
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Clarity refers to the absence of inclusions and blemishes. Diamonds with fewer imperfections receive
                    higher clarity grades.
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-[#faf8f3] to-white dark:from-[#1a1a1a] dark:to-[#2a2a2a] p-6 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 dark:hover:shadow-[#f4d03f]/20 transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors">
                    Carat
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Carat refers to a diamond's weight, not its size. One carat equals 200 milligrams, and each carat
                    can be divided into 100 points.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/diamond-education">
                  <Button className="group relative overflow-hidden bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-black font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2 border-2 border-[#d4af37]/20">
                    <span className="relative z-10 flex items-center gap-3 text-lg">
                      Learn More About Diamonds
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-2 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lab-Grown vs Natural */}
      <section className="py-20 bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,175,55,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative max-w-7xl">
          <div ref={comparisonHeadingRef} className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                Make Your Choice
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-bold mb-6 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Lab-Grown vs Natural Diamonds
              </span>
            </h3>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Understanding the differences to make an 
              <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">informed choice</span> for your jewelry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div ref={(el) => { comparisonCardsRef.current[0] = el }} className="group bg-white dark:bg-[#1e1e1e] p-8 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 dark:hover:shadow-[#f4d03f]/20 transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40">
              <h3 className="text-2xl font-bold text-[#d4af37] dark:text-[#f4d03f] mb-4 group-hover:text-[#f4d03f] dark:group-hover:text-[#d4af37] transition-colors">Natural Diamonds</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Natural diamonds are formed deep within the Earth over billions of years under extreme heat and
                pressure. Each natural diamond is unique, with its own set of characteristics and inclusions.
              </p>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300 mb-8">
                <li className="flex items-start">
                  <span className="text-[#d4af37] dark:text-[#f4d03f] mr-3 mt-1">✓</span>
                  <span>Formed naturally over billions of years</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4af37] dark:text-[#f4d03f] mr-3 mt-1">✓</span>
                  <span>Rare and unique characteristics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4af37] dark:text-[#f4d03f] mr-3 mt-1">✓</span>
                  <span>Traditional choice with historical significance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4af37] dark:text-[#f4d03f] mr-3 mt-1">✓</span>
                  <span>Potential investment value</span>
                </li>
              </ul>
              <Link href="/categories/natural-diamonds">
                <Button
                  variant="outline"
                  className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-white dark:border-[#d4af37] dark:text-[#d4af37] dark:hover:bg-[#d4af37] dark:hover:text-white transition-all duration-300 group/btn w-full"
                >
                  Shop Natural Diamonds
                  <ChevronRight size={16} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </div>

            <div ref={(el) => { comparisonCardsRef.current[1] = el }} className="group bg-white dark:bg-[#1e1e1e] p-8 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 dark:hover:shadow-[#f4d03f]/20 transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40">
              <h3 className="text-2xl font-bold text-[#d4af37] dark:text-[#f4d03f] mb-4 group-hover:text-[#f4d03f] dark:group-hover:text-[#d4af37] transition-colors">Lab-Grown Diamonds</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Lab-grown diamonds are created in controlled environments that replicate the natural diamond-growing
                process. They have the same physical, chemical, and optical properties as natural diamonds.
              </p>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300 mb-8">
                <li className="flex items-start">
                  <span className="text-[#d4af37] dark:text-[#f4d03f] mr-3 mt-1">✓</span>
                  <span>Identical physical and chemical properties to natural diamonds</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4af37] dark:text-[#f4d03f] mr-3 mt-1">✓</span>
                  <span>More affordable price point</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4af37] dark:text-[#f4d03f] mr-3 mt-1">✓</span>
                  <span>Environmentally friendly option</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4af37] dark:text-[#f4d03f] mr-3 mt-1">✓</span>
                  <span>Ethically sourced with transparent origins</span>
                </li>
              </ul>
              <Link href="/categories/lab-grown-diamonds">
                <Button
                  variant="outline"
                  className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-white dark:border-[#d4af37] dark:text-[#d4af37] dark:hover:bg-[#d4af37] dark:hover:text-white transition-all duration-300 group/btn w-full"
                >
                  Shop Lab-Grown Diamonds
                  <ChevronRight size={16} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-[#1e1e1e] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative max-w-7xl">
          <div ref={faqHeadingRef} className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                Have Questions?
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-bold mb-6 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h3>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions about our 
              <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">diamond collections</span>.
            </p>
          </div>

          <div ref={faqSectionRef} className="max-w-4xl mx-auto bg-gradient-to-br from-[#faf8f3] to-white dark:from-[#1a1a1a] dark:to-[#2a2a2a] p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800">
            <DiamondsFAQ />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  )
}

