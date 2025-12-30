"use client"

import { useState, useRef, useEffect } from "react"
import { Play, ChevronLeft, ChevronRight, VideoOff } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface CustomerVideo {
  _id: string
  url: string
  cloudinaryId: string
  position: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function CustomerVideos() {
  const [selectedVideo, setSelectedVideo] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [videos, setVideos] = useState<CustomerVideo[]>([])
  const [loading, setLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/customer-videos')
        if (response.ok) {
          const data = await response.json()
          setVideos(data)
        }
      } catch (error) {
        console.error('Error fetching videos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchVideos, 30000) // Poll every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const videosPerSlide = 4
  const totalSlides = Math.ceil(videos.length / videosPerSlide)
  const videoUrls = videos.map(video => video.url)

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

    // Preview animation
    if (previewRef.current) {
      gsap.set(previewRef.current, { scale: 0.8, opacity: 0 })
      
      ScrollTrigger.create({
        trigger: previewRef.current,
        start: "top 80%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(previewRef.current, {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "back.out(1.7)"
        })
      })
    }

    // Gallery cards animation
    const cards = cardRefs.current.filter(Boolean)
    if (cards.length > 0) {
      gsap.set(cards, { y: 60, opacity: 0, scale: 0.9 })
      
      ScrollTrigger.create({
        trigger: galleryRef.current,
        start: "top 80%",
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
          gsap.to(cards, { y: 60, opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.05 })
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
          gsap.to(cards, { y: 60, opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.05 })
        }
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const getCurrentVideos = () => {
    const start = currentSlide * videosPerSlide
    return videos.slice(start, start + videosPerSlide)
  }

  // Show loading state
  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-[#1e1e1e] relative overflow-hidden">
        <div className="container mx-auto px-4 relative max-w-6xl">
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#f4d03f]/20 border-b-[#f4d03f] rounded-full animate-spin-reverse"></div>
              </div>
            </div>
            <p className="text-[#d4af37] font-medium animate-pulse tracking-widest uppercase text-xs">Capturing Moments...</p>
          </div>
        </div>
      </section>
    )
  }

  // Show no videos message if no active videos
  if (videos.length === 0) {
    return (
      <section className="py-20 bg-white dark:bg-[#1e1e1e] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.08),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative max-w-6xl">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                Real Stories
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-bold mb-6 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Meet Our Customers
              </span>
            </h2>
          </div>

          {/* No Videos Available */}
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-12 border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center">
                <VideoOff className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-serif italic font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
                No Videos Available
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                We're currently updating our customer video collection. 
                <br className="hidden md:block" />
                Check back soon to see amazing stories from our valued customers!
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }



  return (
    <section className="py-20 bg-white dark:bg-[#1e1e1e] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.08),transparent_50%)]" />
      </div>
      
      <div className="container mx-auto px-4 relative max-w-6xl">
        <div ref={headingRef} className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
            <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
              Real Stories
            </span>
            <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-bold mb-6 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
            <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
              Meet Our Customers
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Hear from our customers about their 
            <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium"> special moments</span> and experiences with our jewelry.
          </p>
        </div>

        {/* Main Video Preview */}
        <div ref={previewRef} className="mb-8 max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black group border-2 border-[#d4af37]/30">
            <video
              ref={videoRef}
              key={selectedVideo}
              className="w-full h-full object-contain bg-black"
              controls
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onLoadedData={() => setIsPlaying(false)}
            >
              <source src={videoUrls[selectedVideo]} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Branded Logo Overlay */}
            <div className={`absolute top-4 left-4 transition-all duration-300 ${isPlaying ? 'opacity-95' : 'opacity-70'}`}>
              <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg">
                <>
                  <style jsx>{`
                    @keyframes flipLogo {
                      0% { transform: rotateY(0deg); }
                      50% { transform: rotateY(180deg); }
                      100% { transform: rotateY(360deg); }
                    }
                  `}</style>
                  <img 
                    src="/logo.webp" 
                    alt="Sara Jewelers" 
                    className="w-10 h-10 object-contain"
                    style={{
                      animation: isPlaying ? 'flipLogo 2s linear infinite' : '',
                      transformStyle: 'preserve-3d'
                    }}
                  />
                </>
                <div className="flex flex-col">
                  <span className="text-[#d4af37] text-sm font-bold leading-tight">SARA</span>
                  <span className="text-[#d4af37] text-sm font-bold leading-tight -mt-1">JEWELERS</span>
                </div>
              </div>
            </div>
            {!isPlaying && (
              <button
                onClick={() => videoRef.current?.play()}
                className="absolute inset-0 bg-black/30 hover:bg-black/20 flex items-center justify-center transition-all duration-300 cursor-pointer z-10"
              >
                <div className="bg-[#d4af37] hover:bg-[#f4d03f] p-6 rounded-full transition-all duration-300 hover:scale-110 shadow-2xl">
                  <Play className="w-12 h-12 text-white ml-1" fill="currentColor" />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Video Gallery Slider */}
        <div className="relative">
          {/* Navigation Buttons */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#d4af37] hover:bg-[#f4d03f] text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 -ml-6 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#d4af37] hover:bg-[#f4d03f] text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 -mr-6 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Video Cards */}
          <div ref={galleryRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 px-8">
            {getCurrentVideos().map((video, index) => {
              const videoIndex = currentSlide * videosPerSlide + index
              return (
                <button
                  key={video._id}
                  ref={(el) => { cardRefs.current[index] = el }}
                  onClick={() => {
                    setSelectedVideo(videoIndex)
                    setIsPlaying(false)
                  }}
                  className={`relative group aspect-video rounded-xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${
                    selectedVideo === videoIndex 
                      ? "ring-4 ring-[#d4af37] shadow-2xl shadow-[#d4af37]/30 scale-105" 
                      : "hover:scale-105 hover:shadow-xl ring-2 ring-gray-200 dark:ring-gray-700 hover:ring-[#d4af37]/50"
                  }`}
                >
                  <video
                    className="w-full h-full object-cover"
                    preload="metadata"
                    muted
                  >
                    <source src={video.url} type="video/mp4" />
                  </video>
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 transition-all duration-300 ${
                    selectedVideo === videoIndex 
                      ? "opacity-30" 
                      : "opacity-60 group-hover:opacity-40"
                  }`} />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`p-3 rounded-full transition-all duration-300 ${
                      selectedVideo === videoIndex 
                        ? "bg-[#d4af37] text-white scale-110" 
                        : "bg-white/20 text-white group-hover:bg-[#d4af37]/80 group-hover:scale-110"
                    }`}>
                      <Play className="w-5 h-5" fill="currentColor" />
                    </div>
                  </div>
                  
                  {/* Active Indicator */}
                  {selectedVideo === videoIndex && (
                    <div className="absolute top-3 right-3 w-4 h-4 bg-[#d4af37] rounded-full animate-pulse shadow-lg" />
                  )}
                  
                  {/* Video Number */}
                  <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    {videoIndex + 1}
                  </div>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              )
            })}
          </div>
          
          {/* Slide Indicators */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === index 
                      ? "bg-[#d4af37] scale-125" 
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-[#d4af37]/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}