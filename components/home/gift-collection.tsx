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

export default function GiftCollection() {
  const headingRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const productRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const buttonRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    // Heading animation
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

    // Products animation
    const products = productRefs.current.filter(Boolean)
    if (products.length > 0) {
      gsap.set(products, { y: 60, opacity: 0, scale: 0.9 })
      
      ScrollTrigger.create({
        trigger: gridRef.current,
        start: "top 80%",
        toggleActions: "play reverse play reverse",
        onEnter: () => {
          products.forEach((product, index) => {
            gsap.to(product, {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              delay: index * 0.1,
              ease: "back.out(1.7)"
            })
          })
        },
        onLeave: () => {
          gsap.to(products, { y: 60, opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.05 })
        },
        onEnterBack: () => {
          products.forEach((product, index) => {
            gsap.to(product, {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              delay: index * 0.1,
              ease: "back.out(1.7)"
            })
          })
        },
        onLeaveBack: () => {
          gsap.to(products, { y: 60, opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.05 })
        }
      })
    }

    // Button animation
    if (buttonRef.current) {
      gsap.set(buttonRef.current, { y: 50, opacity: 0 })
      
      ScrollTrigger.create({
        trigger: buttonRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(buttonRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)"
        })
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const giftProducts = [
    {
      name: "Diamond Stud Earrings",
      price: 499.99,
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1470&auto=format&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1374&auto=format&fit=crop",
      link: "/products/diamond-stud-earrings",
    },
    {
      name: "Pearl Pendant Necklace",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1470&auto=format&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1374&auto=format&fit=crop",
      link: "/products/pearl-pendant-necklace",
    },
    {
      name: "Tennis Bracelet",
      price: 1299.99,
      image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1470&auto=format&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1470&auto=format&fit=crop",
      link: "/products/tennis-bracelet",
    },
    {
      name: "Birthstone Ring",
      price: 349.99,
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1470&auto=format&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1470&auto=format&fit=crop",
      link: "/products/birthstone-ring",
    },
    {
      name: "Custom Name Necklace",
      price: 249.99,
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1470&auto=format&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1589674781759-c21c37956a44?q=80&w=1470&auto=format&fit=crop",
      link: "/products/custom-name-necklace",
    },
    {
      name: "Men's Luxury Watch",
      price: 899.99,
      image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=1470&auto=format&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1601821765780-754fa98637c1?q=80&w=1470&auto=format&fit=crop",
      link: "/products/mens-luxury-watch",
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-[#1e1e1e] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.08),transparent_50%)]" />
      </div>
      
      <div className="container mx-auto px-4 relative max-w-7xl">
        <div ref={headingRef} className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
            <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
              Perfect Presents
            </span>
            <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
              Gifts for Your Loved Ones
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Show your love with our curated collection of 
            <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium"> meaningful gifts</span> for every special occasion.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          {giftProducts.map((product, index) => (
            <Link
              key={index}
              ref={(el) => { productRefs.current[index] = el }}
              href={product.link}
              className="group bg-white dark:bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 dark:hover:shadow-[#f4d03f]/20 transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40"
            >
              <div className="aspect-square relative overflow-hidden">
                {/* Primary Image */}
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                />
                
                {/* Secondary Image (shown on hover) */}
                <Image
                  src={product.hoverImage || product.image || "/placeholder.svg"}
                  alt={`${product.name} - alternate view`}
                  fill
                  className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              <div className="p-3 sm:p-4 md:p-6">
                <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors mb-1 sm:mb-2 leading-tight">
                  {product.name}
                </h3>
                <p className="font-bold text-[#d4af37] dark:text-[#f4d03f] text-sm sm:text-base md:text-lg">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link ref={buttonRef} href="/gifts-galore">
            <Button className="group relative overflow-hidden bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-black font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2 border-2 border-[#d4af37]/20">
              <span className="relative z-10 flex items-center gap-3 text-lg">
                Explore All Gifts
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
  )
}