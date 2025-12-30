"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Sparkles, Star } from "lucide-react"

export default function HeroSlider() {
  const sliderData = [
    {
      id: 1,
      title: "Diamond Jewelry",
      subtitle: "Quality Diamonds",
      description: "Browse our diamond collection with certified stones and expert craftsmanship.",
      image: "/images/Slider/Slider 2 diamon.webp",
      buttonText: "View Diamonds",
      buttonLink: "/diamonds",
      accent: "from-purple-600/20 to-pink-600/20"
    },
    {
      id: 2,
      title: "Fine Jewelry",
      subtitle: "Handcrafted Pieces",
      description: "Quality jewelry for everyday wear and special occasions.",
      image: "/images/Slider/Slider 3 amazing.webp",
      buttonText: "Shop Now",
      buttonLink: "/categories/fine-jewelry",
      accent: "from-blue-600/20 to-cyan-600/20"
    },
    {
      id: 3,
      title: "Custom Design",
      subtitle: "Made to Order",
      description: "Work with our team to create jewelry designed just for you.",
      image: "/images/Slider/Slider 4 Custom jewel.webp",
      buttonText: "Get Started",
      buttonLink: "/custom-design",
      accent: "from-emerald-600/20 to-teal-600/20"
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1))
    setTimeout(() => setIsTransitioning(false), 800)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1))
    setTimeout(() => setIsTransitioning(false), 800)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        setCurrentSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1))
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [isTransitioning, sliderData.length])

  return (
    <div className="relative h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] xl:h-[90vh] min-h-[500px] max-h-[900px] overflow-hidden group">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
      </div>

      {sliderData.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-105 pointer-events-none"
          }`}
        >
          <div className="relative h-full w-full">
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              priority={index === 0}
              className={`object-cover transition-transform ease-out ${
                index === currentSlide ? "scale-110" : "scale-100"
              }`}
              style={{
                transitionDuration: index === currentSlide ? "6000ms" : "0ms"
              }}
            />
            
            {/* Enhanced Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className={`absolute inset-0 bg-gradient-to-t ${slide.accent}`} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
            
            {/* Floating Elements */}
            <div className="absolute top-20 left-10 animate-pulse">
              <Sparkles className="text-[#d4af37] w-6 h-6 opacity-60" />
            </div>
            <div className="absolute top-32 right-20 animate-pulse delay-1000">
              <Star className="text-[#d4af37] w-4 h-4 opacity-40" />
            </div>
            <div className="absolute bottom-40 left-20 animate-pulse delay-2000">
              <Sparkles className="text-[#d4af37] w-5 h-5 opacity-50" />
            </div>
            
            {/* Content Container */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl">
                  {/* Glassmorphism Card */}
                  <div className="backdrop-blur-sm bg-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 border border-white/20 shadow-2xl">
                    <div className={`transform transition-all duration-1000 delay-300 ${
                      index === currentSlide 
                        ? "translate-y-0 opacity-100" 
                        : "translate-y-8 opacity-0"
                    }`}>
                      {/* Subtitle */}
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <div className="w-6 sm:w-8 md:w-12 h-[2px] bg-[#d4af37]" />
                        <span className="text-[#d4af37] text-xs sm:text-sm md:text-base font-medium tracking-wider uppercase">
                          {slide.subtitle}
                        </span>
                        <div className="w-6 sm:w-8 md:w-12 h-[2px] bg-[#d4af37]" />
                      </div>
                      
                      {/* Main Title */}
                      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif italic font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                        <span className="bg-gradient-to-r from-white via-white to-[#d4af37] bg-clip-text text-transparent">
                          {slide.title}
                        </span>
                      </h1>
                      
                      {/* Description */}
                      <p className="text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl text-white/90 mb-4 sm:mb-6 md:mb-8 max-w-2xl leading-relaxed">
                        {slide.description}
                      </p>
                      
                      {/* CTA Button */}
                      <Link href={slide.buttonLink}>
                        <Button className="group relative bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#b8860b] hover:to-[#d4af37] text-black font-semibold px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg rounded-full shadow-2xl hover:shadow-[#d4af37]/25 transition-all duration-500 hover:scale-105 hover:-translate-y-1 border-2 border-[#d4af37]/30">
                          <span className="relative z-10">{slide.buttonText}</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Enhanced Navigation Buttons */}
      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-2 sm:p-3 md:p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/20 shadow-xl z-20 disabled:opacity-50 disabled:cursor-not-allowed group"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:-translate-x-1 transition-transform duration-300" />
      </button>
      
      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-2 sm:p-3 md:p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/20 shadow-xl z-20 disabled:opacity-50 disabled:cursor-not-allowed group"
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:translate-x-1 transition-transform duration-300" />
      </button>

      {/* Enhanced Pagination Dots */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-20">
        {sliderData.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true)
                setCurrentSlide(index)
                setTimeout(() => setIsTransitioning(false), 800)
              }
            }}
            disabled={isTransitioning}
            className={`relative transition-all duration-500 disabled:cursor-not-allowed ${
              index === currentSlide 
                ? "w-8 sm:w-10 md:w-12 h-2 sm:h-2.5 md:h-3 bg-[#d4af37] rounded-full" 
                : "w-2 sm:w-2.5 md:w-3 h-2 sm:h-2.5 md:h-3 bg-white/40 hover:bg-white/60 rounded-full hover:scale-125"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentSlide && (
              <div className="absolute inset-0 bg-[#d4af37] rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20 z-20">
        <div 
          className="h-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] transition-all ease-linear"
          style={{ 
            width: `${((currentSlide + 1) / sliderData.length) * 100}%`,
            transitionDuration: "6000ms",
            animation: "none"
          }}
        />
      </div>
    </div>
  )
}

