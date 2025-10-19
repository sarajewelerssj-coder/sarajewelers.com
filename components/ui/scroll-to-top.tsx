"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ChevronUp } from "lucide-react"

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    if (isVisible) {
      gsap.fromTo(button, 
        { 
          scale: 0,
          rotation: -180,
          opacity: 0 
        },
        { 
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)"
        }
      )
    } else {
      gsap.to(button, {
        scale: 0,
        rotation: 180,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      })
    }
  }, [isVisible])

  const scrollToTop = () => {
    const button = buttonRef.current
    if (button) {
      gsap.to(button, {
        scale: 0.8,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      })
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      className="fixed bottom-36 right-6 z-50 w-12 h-12 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-white rounded-full shadow-lg hover:shadow-xl hover:shadow-[#d4af37]/30 transition-all duration-300 flex items-center justify-center group"
      style={{ opacity: 0, transform: "scale(0)" }}
      aria-label="Scroll to top"
    >
      <ChevronUp 
        size={20} 
        className="transition-transform duration-300 group-hover:-translate-y-1" 
      />
    </button>
  )
}