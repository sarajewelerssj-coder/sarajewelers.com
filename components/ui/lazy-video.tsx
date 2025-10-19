"use client"

import { useState, useRef, useEffect } from "react"

interface LazyVideoProps {
  src: string
  className?: string
  controls?: boolean
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  preload?: "none" | "metadata" | "auto"
  onPlay?: () => void
  onPause?: () => void
  onLoadedData?: () => void
  children?: React.ReactNode
}

export default function LazyVideo({
  src,
  className = "",
  controls = false,
  autoPlay = false,
  muted = false,
  loop = false,
  preload = "metadata",
  onPlay,
  onPause,
  onLoadedData,
  children
}: LazyVideoProps) {
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: "50px" }
    )

    const current = containerRef.current
    if (current) {
      observer.observe(current)
    }

    return () => {
      if (current) observer.unobserve(current)
    }
  }, [])

  return (
    <div ref={containerRef} className={className}>
      {isInView ? (
        <video
          className={className}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          preload={preload}
          onPlay={onPlay}
          onPause={onPause}
          onLoadedData={onLoadedData}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {children}
    </div>
  )
}