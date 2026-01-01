"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Eye } from "lucide-react"
import FilterBar from "@/components/products/product-filters"
import LogoLoader from "@/components/ui/logo-loader"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import NewsletterSection from "@/components/layout/newsletter-section"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { calculateDisplayPrice } from "@/lib/product-utils"

export default function AllProductsPage() {
  return (
    <Suspense fallback={<LogoLoader />}>
      <ProductsContent />
    </Suspense>
  )
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const collectionParam = searchParams.get('collection')
  const [loading, setLoading] = useState(true)
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [sortBy, setSortBy] = useState("featured")

  // Filter states
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = collectionParam === 'gifts' ? '/api/collections?type=gifts' : '/api/products'
        const response = await fetch(url)
        const data = await response.json()
        if (data.success) {
          const products = collectionParam === 'gifts' 
            ? data.collections.flatMap((col: any) => col.fullProducts || [])
            : data.products
          setAllProducts(products)
          setFilteredProducts(products)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [collectionParam])

  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) => (prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material]))
  }

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) => (prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]))
  }

  const applyFilters = () => {
    let result = [...allProducts]

    // Apply price filter
    result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Apply material filter if any selected
    if (selectedMaterials.length > 0) {
      result = result.filter((product) => {
        const productMaterial = product.variations?.colors?.[0] || ""
        return selectedMaterials.some((material) => productMaterial.toLowerCase().includes(material.toLowerCase()))
      })
    }

    // Apply style filter if any selected
    if (selectedStyles.length > 0) {
      result = result.filter((product) => {
        return product.id % (selectedStyles.length + 1) !== 0
      })
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high-low":
        result.sort((a, b) => b.price - a.price)
        break
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case "best-selling":
        result.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      default: // featured
        break
    }

    setFilteredProducts(result)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    const result = [...filteredProducts]

    switch (value) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high-low":
        result.sort((a, b) => b.price - a.price)
        break
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case "best-selling":
        result.sort((a, b) => b.reviewCount - a.reviewCount)
        break
    }

    setFilteredProducts(result)
  }

  const resetFilters = () => {
    setPriceRange([0, 5000])
    setSelectedMaterials([])
    setSelectedStyles([])
    setSortBy("featured")
    setFilteredProducts(allProducts)
  }

  const addToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id)
    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1
    } else {
      const frontImage = product.images?.find((img: any) => img.type === 'front')?.url || product.images?.[0]?.url || product.images?.[0] || '/placeholder.svg'
      existingCart.push({
        id: product.id,
        name: product.name,
        price: calculateDisplayPrice(product.price, product.variations),
        image: frontImage,
        quantity: 1,
        selectedSize: product.variations?.sizes?.[0] || "",
        selectedColor: product.variations?.colors?.[0] || "",
      })
    }
    localStorage.setItem("cart", JSON.stringify(existingCart))
    window.dispatchEvent(new Event("cartUpdated"))
    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart`,
      duration: 3000,
    })
  }

  const addToWishlist = (product: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const existingWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    const existingItemIndex = existingWishlist.findIndex((item: any) => item.id === product.id)
    if (existingItemIndex < 0) {
      const frontImage = product.images?.find((img: any) => img.type === 'front')?.url || product.images?.[0]?.url || product.images?.[0] || '/placeholder.svg'
      existingWishlist.push({
        id: product.id,
        name: product.name,
        price: calculateDisplayPrice(product.price, product.variations),
        image: frontImage,
      })
      localStorage.setItem("wishlist", JSON.stringify(existingWishlist))
      window.dispatchEvent(new Event("wishlistUpdated"))
      toast.success("Added to wishlist", {
        description: `${product.name} has been added to your wishlist`,
        duration: 3000,
      })
    } else {
      toast.info("Already in wishlist", {
        description: "This product is already in your wishlist",
        duration: 3000,
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F1E8] dark:bg-gradient-to-br dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
        <LogoLoader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F1E8] dark:bg-gradient-to-br dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
      {/* Hero Section */}
      <section className="py-16 bg-transparent relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative max-w-7xl">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm mb-6">
            <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-[#d4af37] dark:hover:text-[#f4d03f] transition-colors duration-300">
              Home
            </Link>
            <span className="text-gray-400 dark:text-gray-600">/</span>
            <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">All Products</span>
          </nav>

          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                {collectionParam === 'gifts' ? 'Presents & Gifts' : 'Collection'}
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif italic font-bold mb-4 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                {collectionParam === 'gifts' ? 'The Gift Gallery' : 'All Products Collection'}
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <FilterBar
        totalItems={filteredProducts.length}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedMaterials={selectedMaterials}
        toggleMaterial={toggleMaterial}
        selectedStyles={selectedStyles}
        toggleStyle={toggleStyle}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
      />

      {/* Products Section */}
      <section className="py-16 bg-transparent relative overflow-hidden min-h-[600px]">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative max-w-7xl">
          {/* Products grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => {
                const frontImage = product.images?.find((img: any) => img.type === 'front')?.url || product.images?.[0] || '/placeholder.svg'
                const backImage = product.images?.find((img: any) => img.type === 'back')?.url || product.images?.[1]

                return (
                <div
                  key={product.id}
                  className="group relative bg-white dark:bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 dark:hover:shadow-[#f4d03f]/20 transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={frontImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-all duration-500"
                  />
                  {hoveredProduct === product.id && backImage && (
                    <Image
                      src={backImage}
                      alt={product.name}
                      fill
                      className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  )}

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-[#d4af37] hover:text-white dark:hover:bg-[#f4d03f] dark:hover:text-black transition-colors duration-200 text-gray-700 dark:text-gray-300"
                      onClick={(e) => addToWishlist(product, e)}
                    >
                      <Heart size={16} />
                    </button>
                    <button
                      className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-[#d4af37] hover:text-white dark:hover:bg-[#f4d03f] dark:hover:text-black transition-colors duration-200 text-gray-700 dark:text-gray-300"
                      onClick={(e) => addToCart(product, e)}
                    >
                      <ShoppingCart size={16} />
                    </button>
                    <Link
                      href={`/products/${product.slug}`}
                      className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-[#d4af37] hover:text-white dark:hover:bg-[#f4d03f] dark:hover:text-black transition-colors duration-200 text-gray-700 dark:text-gray-300"
                    >
                      <Eye size={16} />
                    </Link>
                  </div>

                  {product.isNew && (
                    <div className="absolute top-3 left-3 bg-[#d4af37] text-white text-xs font-medium px-2 py-1 rounded shadow-sm">
                      New
                    </div>
                  )}

                  {product.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-[#b22222] text-white text-xs font-medium px-2 py-1 rounded shadow-sm">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="text-xs sm:text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1 sm:mb-2 group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors duration-300 font-medium">{product.category}</h3>
                  <Link href={`/products/${product.slug}`}>
                    <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 hover:text-[#d4af37] dark:hover:text-[#f4d03f] transition-colors duration-300 text-sm sm:text-sm leading-tight">
                      {product.name}
                    </h2>
                  </Link>

                  <div className="flex items-center justify-between mt-2 sm:mt-3">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors duration-300">${calculateDisplayPrice(product.price, product.variations).toFixed(2)}</span>
                      {product.oldPrice && (
                        <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 line-through">
                          ${product.oldPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-3 h-3 sm:w-3 sm:h-3 transition-colors duration-300 ${
                              star <= product.rating ? "text-[#d4af37] dark:text-[#f4d03f]" : "text-gray-300 dark:text-gray-600"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">({product.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </div>
              )
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <ShoppingCart className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-serif italic font-bold text-gray-900 dark:text-white mb-4 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                  No Products Found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed mb-6">
                  We couldn't find any products matching your current selection. Try resetting your filters.
                </p>
                <Button onClick={resetFilters} className="bg-[#d4af37] hover:bg-[#d4af37]/90 dark:bg-[#f4d03f] dark:hover:bg-[#f4d03f]/90 text-white dark:text-black rounded-full px-8">
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </div>
  )
}

