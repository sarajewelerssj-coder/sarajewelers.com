"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <div
      className={cn(
        "fixed bottom-24 md:bottom-24 right-6 z-[59] transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
      )}
    >
      <Button
        size="icon"
        onClick={scrollToTop}
        className="w-12 h-12 rounded-full bg-white dark:bg-[#1a1a1a] text-[#d4af37] border border-[#d4af37]/20 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group"
      >
        <ChevronUp className="w-6 h-6 transition-transform group-hover:scale-110" />
      </Button>
    </div>
  )
}
