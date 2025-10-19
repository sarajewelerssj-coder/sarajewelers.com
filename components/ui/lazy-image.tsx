"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"

interface LazyImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  style?: React.CSSProperties
  onLoad?: () => void
}

export default function LazyImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  priority = false,
  sizes,
  style,
  onLoad
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (priority) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: "100px" }
    )

    const current = imgRef.current
    if (current) {
      observer.observe(current)
    }

    return () => {
      if (current) observer.unobserve(current)
    }
  }, [priority])

  return (
    <div ref={imgRef} className={className} style={style}>
      {isInView ? (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          className={className}
          priority={priority}
          sizes={sizes}
          onLoad={onLoad}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}
    </div>
  )
}