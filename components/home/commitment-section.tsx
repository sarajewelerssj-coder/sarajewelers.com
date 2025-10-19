"use client"

import { useEffect, useRef } from "react"
import { Truck, HeadphonesIcon, RefreshCw, Award, DollarSign, Leaf } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function CommitmentSection() {
  const gridRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return

    const cards = cardRefs.current.filter(Boolean)
    if (cards.length === 0) return

    // Set initial states
    gsap.set(cards, { y: 80, opacity: 0, scale: 0.8 })

    // Cards animation
    ScrollTrigger.create({
      trigger: gridRef.current,
      start: "top 75%",
      toggleActions: "play reverse play reverse",
      onEnter: () => {
        cards.forEach((card, index) => {
          gsap.to(card, {
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
        gsap.to(cards, { y: 80, opacity: 0, scale: 0.8, duration: 0.6, stagger: 0.05 })
      },
      onEnterBack: () => {
        cards.forEach((card, index) => {
          gsap.to(card, {
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
        gsap.to(cards, { y: 80, opacity: 0, scale: 0.8, duration: 0.6, stagger: 0.05 })
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const commitments = [
    {
      icon: <Truck className="w-10 h-10" />,
      title: "Free Shipping Worldwide",
      description: "On all orders over $100",
    },
    {
      icon: <HeadphonesIcon className="w-10 h-10" />,
      title: "24/7 Customer Service",
      description: "Expert assistance anytime",
    },
    {
      icon: <RefreshCw className="w-10 h-10" />,
      title: "100% Money Back Guarantee",
      description: "30-day return policy",
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: "Sara Jewelers' Trust",
      description: "Certified authentic jewelry",
    },
    {
      icon: <DollarSign className="w-10 h-10" />,
      title: "Unbeatable Market Price",
      description: "Best value guaranteed",
    },
    {
      icon: <Leaf className="w-10 h-10" />,
      title: "Eco Friendly Element",
      description: "Sustainable practices",
    },
  ]

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-2 sm:px-4">
        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8">
          {commitments.map((item, index) => (
            <div
              key={index}
              ref={(el) => { cardRefs.current[index] = el }}
              className="flex flex-col items-center text-center p-4 md:p-6 rounded-lg bg-[#f8f4e8] dark:bg-[#1e1e1e] transition-all duration-300 hover:scale-105 hover:shadow-xl group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="text-[#d4af37] dark:text-[#d4af37] mb-3 md:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h4 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 md:mb-2 group-hover:text-[#d4af37] transition-colors duration-300">
                {item.title}
              </h4>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

