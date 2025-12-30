"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ChevronUp } from "lucide-react"

export default function FloatingButtons() {
  const [isScrollVisible, setIsScrollVisible] = useState(false)
  
  const scrollButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsScrollVisible(window.pageYOffset > 300)
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  useEffect(() => {
    const scrollButton = scrollButtonRef.current
    
    if (!scrollButton) return

    if (isScrollVisible) {
      // Show scroll button
      gsap.fromTo(scrollButton, 
        { scale: 0, rotation: -180, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      )
    } else {
      // Hide scroll button
      gsap.to(scrollButton, {
        scale: 0,
        rotation: 180,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      })
    }
  }, [isScrollVisible])

  const scrollToTop = () => {
    const button = scrollButtonRef.current
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
    <>
      {/* Scroll to Top Button */}
      <button
        ref={scrollButtonRef}
        onClick={scrollToTop}
        className="fixed bottom-20 right-3 md:bottom-6 md:right-6 z-50 w-10 h-10 md:w-14 md:h-14 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-white rounded-full shadow-lg hover:shadow-xl hover:shadow-[#d4af37]/30 transition-all duration-300 flex items-center justify-center group"
        style={{ opacity: 0, transform: "scale(0)" }}
        aria-label="Scroll to top"
      >
        <ChevronUp 
          size={16} 
          className="md:w-6 md:h-6 transition-transform duration-300 group-hover:-translate-y-1" 
        />
      </button>
    </>
  )
}