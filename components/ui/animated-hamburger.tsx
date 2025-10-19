"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface AnimatedHamburgerProps {
  isOpen: boolean
  onClick: () => void
  className?: string
}

export default function AnimatedHamburger({ isOpen, onClick, className = "" }: AnimatedHamburgerProps) {
  const line1Ref = useRef<SVGLineElement>(null)
  const line2Ref = useRef<SVGLineElement>(null)
  const line3Ref = useRef<SVGLineElement>(null)

  const containerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const line1 = line1Ref.current
    const line2 = line2Ref.current
    const line3 = line3Ref.current
    const container = containerRef.current

    if (!line1 || !line2 || !line3 || !container) return

    // Add click bounce animation
    gsap.to(container, {
      duration: 0.1,
      scale: 0.95,
      ease: "power2.out",
      yoyo: true,
      repeat: 1
    })

    if (isOpen) {
      // Animate to X with stagger effect
      gsap.to(line1, {
        duration: 0.4,
        rotation: 45,
        y: 6,
        transformOrigin: "center",
        ease: "back.out(1.7)"
      })
      gsap.to(line2, {
        duration: 0.25,
        opacity: 0,
        scaleX: 0,
        ease: "power2.out"
      })
      gsap.to(line3, {
        duration: 0.4,
        rotation: -45,
        y: -6,
        transformOrigin: "center",
        ease: "back.out(1.7)",
        delay: 0.05
      })
    } else {
      // Animate back to hamburger with bounce
      gsap.to([line1, line3], {
        duration: 0.4,
        rotation: 0,
        y: 0,
        transformOrigin: "center",
        ease: "back.out(1.7)"
      })
      gsap.to(line2, {
        duration: 0.35,
        opacity: 1,
        scaleX: 1,
        ease: "back.out(1.7)",
        delay: 0.15
      })
    }
  }, [isOpen])

  return (
    <button
      ref={containerRef}
      onClick={onClick}
      className={`relative p-3 rounded-lg transition-all duration-200 ${className}`}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        className={`transition-colors duration-200 ${
          isOpen ? "text-[#d4af37]" : "text-gray-700 dark:text-gray-300 hover:text-[#d4af37] dark:hover:text-[#d4af37]"
        }`}
      >
        <line
          ref={line1Ref}
          x1="3"
          y1="6"
          x2="21"
          y2="6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          ref={line2Ref}
          x1="3"
          y1="12"
          x2="21"
          y2="12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          ref={line3Ref}
          x1="3"
          y1="18"
          x2="21"
          y2="18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}