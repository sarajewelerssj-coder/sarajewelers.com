"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import NewsletterSection from "@/components/layout/newsletter-section"
import { giftCategoriesData, giftPriceRanges, giftRecipients } from "@/data/gift-categories"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function GiftsGalorePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const categoriesHeadingRef = useRef<HTMLDivElement>(null)
  const priceHeadingRef = useRef<HTMLDivElement>(null)
  const recipientHeadingRef = useRef<HTMLDivElement>(null)
  const ideasHeadingRef = useRef<HTMLDivElement>(null)
  const categoryCardsRef = useRef<(HTMLDivElement | null)[]>([])
  const priceCardsRef = useRef<(HTMLDivElement | null)[]>([])
  const recipientCardsRef = useRef<(HTMLDivElement | null)[]>([])
  const ideaCardsRef = useRef<(HTMLDivElement | null)[]>([])

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

    const headings = [categoriesHeadingRef, priceHeadingRef, recipientHeadingRef, ideasHeadingRef]
    
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
            delay: index * 0.05,
            ease: "back.out(1.7)"
          })
        })
      })
    }

    // Price cards animation
    const priceCards = priceCardsRef.current.filter(Boolean)
    if (priceCards.length > 0) {
      gsap.set(priceCards, { y: 60, opacity: 0 })
      
      priceCards.forEach((card, index) => {
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

    // Recipient cards animation
    const recipientCards = recipientCardsRef.current.filter(Boolean)
    if (recipientCards.length > 0) {
      gsap.set(recipientCards, { y: 60, opacity: 0 })
      
      recipientCards.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          toggleActions: "play reverse play reverse",
          animation: gsap.to(card, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.15,
            ease: "back.out(1.7)"
          })
        })
      })
    }

    // Idea cards animation
    const ideaCards = ideaCardsRef.current.filter(Boolean)
    if (ideaCards.length > 0) {
      gsap.set(ideaCards, { y: 60, opacity: 0 })
      
      ideaCards.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          toggleActions: "play reverse play reverse",
          animation: gsap.to(card, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.05,
            ease: "back.out(1.7)"
          })
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
          src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=1470&auto=format&fit=crop"
          alt="Gifts Collection"
          fill
          className="object-cover scale-110 transition-transform ease-out"
          style={{ transitionDuration: "6000ms" }}
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
                    Perfect Presents
                  </span>
                  <div className="w-12 md:w-16 h-[2px] bg-[#d4af37]" />
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white via-white to-[#d4af37] bg-clip-text text-transparent">
                    Gifts Galore
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl leading-relaxed">
                  Find the perfect gift for every occasion and celebrate 
                  <span className="text-[#d4af37] font-semibold"> life's special moments</span>.
                </p>
                
                <Button className="group relative overflow-hidden bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-black font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2 border-2 border-[#d4af37]/20">
                  <span className="relative z-10 flex items-center gap-3 text-lg">
                    Explore Gifts
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

      {/* Gift Categories */}
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
                Perfect Presents
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Shop By Occasion
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover thoughtful and elegant gifts for 
              <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium"> every special moment</span> in life.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {giftCategoriesData.map((category, index) => {
              let imageUrl = ""
              if (category.title.toLowerCase().includes("anniversary")) {
                imageUrl = "https://images.unsplash.com/photo-1518542698889-ca82262f08d5?q=80&w=1470&auto=format&fit=crop"
              } else if (category.title.toLowerCase().includes("birthday")) {
                imageUrl = "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1470&auto=format&fit=crop"
              } else if (category.title.toLowerCase().includes("wedding")) {
                imageUrl = "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1470&auto=format&fit=crop"
              } else if (category.title.toLowerCase().includes("graduation")) {
                imageUrl = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1470&auto=format&fit=crop"
              } else if (category.title.toLowerCase().includes("valentine")) {
                imageUrl = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1470&auto=format&fit=crop"
              } else if (category.title.toLowerCase().includes("mother")) {
                imageUrl = "https://images.unsplash.com/photo-1520096459084-096fcc53fa43?q=80&w=1470&auto=format&fit=crop"
              } else if (category.title.toLowerCase().includes("father")) {
                imageUrl = "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?q=80&w=1470&auto=format&fit=crop"
              } else if (category.title.toLowerCase().includes("holiday")) {
                imageUrl = "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=1470&auto=format&fit=crop"
              } else {
                imageUrl = `https://images.unsplash.com/photo-${1600003014755 + index * 10000}-ba31aa59c4b6?q=80&w=1470&auto=format&fit=crop`
              }

              return (
                <Link
                  key={index}
                  ref={(el) => { categoryCardsRef.current[index] = el }}
                  href={`/gifts-galore/${category.slug}`}
                  className="group relative overflow-hidden rounded-xl bg-white dark:bg-[#1e1e1e] shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 dark:hover:shadow-[#f4d03f]/20 transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-4">
                        <h3 className="text-xl font-bold text-white mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          {category.title}
                        </h3>
                        <p className="text-white/0 group-hover:text-white/90 transition-all duration-300 text-sm">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Gift Price Ranges */}
      <section className="py-20 bg-white dark:bg-[#1e1e1e] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.08),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative max-w-7xl">
          <div ref={priceHeadingRef} className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                For Every Budget
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Shop By Price
              </span>
            </h3>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Find the perfect gift for 
              <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium"> every budget</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {giftPriceRanges.map((priceRange, index) => {
              const priceImages = [
                "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1470&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1470&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1470&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=1470&auto=format&fit=crop",
              ]

              return (
                <Link
                  key={index}
                  ref={(el) => { priceCardsRef.current[index] = el }}
                  href={`/gifts-galore/${priceRange.slug}`}
                  className="group bg-white dark:bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 dark:hover:shadow-[#f4d03f]/20 transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={priceImages[index % priceImages.length] || "/placeholder.svg"}
                      alt={priceRange.range}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6 text-center relative z-10 bg-white dark:bg-[#1e1e1e] transform translate-y-0 group-hover:-translate-y-4 transition-transform duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors mb-2">
                      {priceRange.range}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-relaxed">
                      {priceRange.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Gift Recipients */}
      <section className="py-20 bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,175,55,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative max-w-7xl">
          <div ref={recipientHeadingRef} className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                For Your Loved Ones
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Shop By Recipient
              </span>
            </h3>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Find the perfect gift for that 
              <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium"> special someone</span> in your life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {giftRecipients.map((category, index) => {
              const recipientImages = [
                "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1470&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=1470&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1518542698889-ca82262f08d5?q=80&w=1470&auto=format&fit=crop",
              ]

              return (
                <div
                  key={index}
                  ref={(el) => { recipientCardsRef.current[index] = el }}
                  className="group relative overflow-hidden rounded-xl bg-white dark:bg-[#1e1e1e] shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 dark:hover:shadow-[#f4d03f]/20 transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={recipientImages[index % recipientImages.length] || "/placeholder.svg"}
                      alt={category.recipient}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-colors duration-300" />
                  </div>
                  <div className="p-6 relative z-10 transform translate-y-0 group-hover:-translate-y-4 transition-transform duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors">
                      {category.recipient}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{category.description}</p>
                    <Link href={`/gifts-galore/${category.slug}`}>
                      <Button
                        variant="outline"
                        className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-white dark:border-[#d4af37] dark:text-[#d4af37] dark:hover:bg-[#d4af37] dark:hover:text-white transition-all duration-300 group/btn"
                      >
                        Explore <ChevronRight size={16} className="ml-1 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Gift Ideas */}
      <section className="py-20 bg-white dark:bg-[#1e1e1e] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative max-w-7xl">
          <div ref={ideasHeadingRef} className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                Trending Now
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Popular Gift Ideas
              </span>
            </h3>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover our most loved gifts that are 
              <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium"> sure to impress</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Diamond Stud Earrings",
                price: 499.99,
                image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1470&auto=format&fit=crop",
                link: "/products/diamond-stud-earrings",
              },
              {
                name: "Pearl Pendant Necklace",
                price: 299.99,
                image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1470&auto=format&fit=crop",
                link: "/products/pearl-pendant-necklace",
              },
              {
                name: "Men's Luxury Watch",
                price: 899.99,
                image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=1470&auto=format&fit=crop",
                link: "/products/mens-luxury-watch",
              },
              {
                name: "Tennis Bracelet",
                price: 1299.99,
                image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1470&auto=format&fit=crop",
                link: "/products/tennis-bracelet",
              },
              {
                name: "Personalized Jewelry Box",
                price: 149.99,
                image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1374&auto=format&fit=crop",
                link: "/products/personalized-jewelry-box",
              },
              {
                name: "Birthstone Ring",
                price: 349.99,
                image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1470&auto=format&fit=crop",
                link: "/products/birthstone-ring",
              },
              {
                name: "Cufflinks Set",
                price: 199.99,
                image: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=1470&auto=format&fit=crop",
                link: "/products/cufflinks-set",
              },
              {
                name: "Custom Name Necklace",
                price: 249.99,
                image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1470&auto=format&fit=crop",
                link: "/products/custom-name-necklace",
              },
            ].map((product, index) => (
              <Link
                key={index}
                ref={(el) => { ideaCardsRef.current[index] = el }}
                href={product.link}
                className="group bg-white dark:bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 dark:hover:shadow-[#f4d03f]/20 transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>
                <div className="p-4 bg-white dark:bg-[#1e1e1e]">
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors">
                    {product.name}
                  </h3>
                  <p className="font-semibold text-[#d4af37] dark:text-[#f4d03f] mt-1">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/categories">
              <Button className="group relative overflow-hidden bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-black font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2 border-2 border-[#d4af37]/20">
                <span className="relative z-10 flex items-center gap-3 text-lg">
                  View All Gift Ideas
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-2 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  )
}