"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { productsData } from "@/data/products"

interface RelatedProductsProps {
  currentProductId: number
  category: string
}

export default function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  // Filter products by category and exclude current product
  const relatedProducts = productsData
    .filter((product) => product.category === category && product.id !== currentProductId)
    .slice(0, 8) // Show up to 8 related products

  useEffect(() => {
    const checkScroll = () => {
      if (!scrollContainerRef.current) return

      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10) // 10px buffer
    }

    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScroll)
      // Initial check
      checkScroll()
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", checkScroll)
      }
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const scrollAmount = 320 // Approximate width of a product card + gap
    const currentScroll = scrollContainerRef.current.scrollLeft

    scrollContainerRef.current.scrollTo({
      left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: "smooth",
    })
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="relative">
      {/* Navigation arrows */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute start-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-[#333333]/80 size-10 rounded-full shadow-md hover:bg-[#d4af37] hover:text-white transition-colors -ms-4 sm:ms-0 grid place-items-center"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute end-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-[#333333]/80 size-10 rounded-full shadow-md hover:bg-[#d4af37] hover:text-white transition-colors -me-4 sm:me-0 grid place-items-center"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-4 pt-2 px-4 -mx-4 snap-x snap-mandatory scroll-px-4 scrollbar-hide"
      >
        {relatedProducts.map((product, index) => (
          <div
            key={product.id}
            className="flex-none w-[280px] sm:w-[300px] snap-start mx-2 group relative bg-white dark:bg-[#1a1a1a] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={`https://images.unsplash.com/photo-${1600003014755 + index * 10000}-ba31aa59c4b6?q=80&w=1470&auto=format&fit=crop`}
                alt={product.name}
                fill
                className="object-cover transition-all duration-500"
              />
              {hoveredProduct === product.id && (
                <Image
                  src={`https://images.unsplash.com/photo-${1600003014755 + index * 10000 + 5000}-ba31aa59c4b6?q=80&w=1470&auto=format&fit=crop`}
                  alt={product.name}
                  fill
                  className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              )}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="bg-white dark:bg-[#333333] size-8 rounded-full shadow-md hover:bg-[#d4af37] hover:text-white dark:hover:bg-[#d4af37] transition-colors grid place-items-center">
                  <Heart size={18} />
                </button>
                <button className="bg-white dark:bg-[#333333] size-8 rounded-full shadow-md hover:bg-[#d4af37] hover:text-white dark:hover:bg-[#d4af37] transition-colors grid place-items-center">
                  <ShoppingCart size={18} />
                </button>
                <Link
                  href={`/products/${product.slug}`}
                  className="bg-white dark:bg-[#333333] size-8 rounded-full shadow-md hover:bg-[#d4af37] hover:text-white dark:hover:bg-[#d4af37] transition-colors grid place-items-center"
                >
                  <Eye size={18} />
                </Link>
              </div>

              {product.isNew && (
                <div className="absolute top-3 left-3 bg-[#d4af37] text-white text-xs font-medium px-2 py-1 rounded">
                  New
                </div>
              )}

              {product.discount > 0 && (
                <div className="absolute top-3 left-3 bg-[#e53935] text-white text-xs font-medium px-2 py-1 rounded">
                  {product.discount}% OFF
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-sm text-[#777777] dark:text-[#aaaaaa] mb-1">{product.category}</h3>
              <Link href={`/products/${product.slug}`}>
                <h2 className="font-medium text-[#333333] dark:text-[#f5f5f5] mb-2 hover:text-[#d4af37] dark:hover:text-[#d4af37] transition-colors">
                  {product.name}
                </h2>
              </Link>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <span className="font-semibold text-[#333333] dark:text-[#f5f5f5]">${product.price.toFixed(2)}</span>
                  {product.oldPrice && (
                    <span className="ml-2 text-sm text-[#777777] dark:text-[#aaaaaa] line-through">
                      ${product.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`size-4 ${
                          star <= product.rating ? "text-[#ffc107]" : "text-[#e0e0e0] dark:text-[#555555]"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-1 text-xs text-[#777777] dark:text-[#aaaaaa]">({product.reviewCount})</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom scrollbar styling */}
      <style jsx global>{`
        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

