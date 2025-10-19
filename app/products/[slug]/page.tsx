"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Heart, ChevronLeft, ChevronRight, Home, ChevronRight as BreadcrumbChevron } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { productsData } from "@/data/products"
import RelatedProducts from "@/components/products/related-products"
import { useToast } from "@/components/ui/use-toast"
import LogoLoader from "@/components/ui/logo-loader"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const slug = params.slug as string

  const [product, setProduct] = useState<any>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [customQuantity, setCustomQuantity] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // Product images from Unsplash
  const productImages = [
    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1374&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1374&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1470&auto=format&fit=crop",
  ]

  useEffect(() => {
    const currentProduct = productsData.find((prod) => prod.slug === slug)
    if (currentProduct) {
      // Assign real images to the product
      const productWithImages = {
        ...currentProduct,
        images: productImages,
      }
      setProduct(productWithImages)
      setSelectedImageIndex(0)

      // Set default selections if available
      if (currentProduct.variations?.sizes?.length) {
        setSelectedSize(currentProduct.variations.sizes[0])
      }
      if (currentProduct.variations?.colors?.length) {
        setSelectedColor(currentProduct.variations.colors[0])
      }
    }
  }, [slug])

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1)
    setCustomQuantity("")
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
      setCustomQuantity("")
    }
  }

  const handleCustomQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "") {
      setCustomQuantity("")
      return
    }

    const numValue = Number.parseInt(value, 10)
    if (!isNaN(numValue) && numValue > 0) {
      setCustomQuantity(value)
      setQuantity(numValue)
    }
  }

  const nextImage = () => {
    if (!product) return
    setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
    setIsVideoPlaying(false)
  }

  const prevImage = () => {
    if (!product) return
    setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
    setIsVideoPlaying(false)
  }

  const handleGoBack = () => {
    router.back()
  }

  const addToCart = () => {
    // Get existing cart from localStorage or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex(
      (item: any) =>
        item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor,
    )

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      existingCart[existingItemIndex].quantity += quantity
    } else {
      // Add new item if it doesn't exist
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity,
        selectedSize,
        selectedColor,
      })
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart))

    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event("cartUpdated"))

    // Show toast notification
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
      duration: 3000,
    })
  }

  const addToWishlist = () => {
    // Get existing wishlist from localStorage or initialize empty array
    const existingWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")

    // Check if product already exists in wishlist
    const existingItemIndex = existingWishlist.findIndex((item: any) => item.id === product.id)

    if (existingItemIndex < 0) {
      // Add new item if it doesn't exist
      existingWishlist.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      })

      // Save updated wishlist to localStorage
      localStorage.setItem("wishlist", JSON.stringify(existingWishlist))

      // Dispatch custom event to update wishlist count
      window.dispatchEvent(new Event("wishlistUpdated"))

      // Show toast notification
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist`,
        duration: 3000,
      })
    } else {
      toast({
        title: "Already in wishlist",
        description: "This product is already in your wishlist",
        duration: 3000,
      })
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
        <LogoLoader />
      </div>
    )
  }

  const isVideo = (src: string) => src.includes(".mp4") || src.includes(".webm")
  const currentMedia = product.images[selectedImageIndex]

  return (
    <div className="bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm mb-8">
            <Link href="/" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-[#d4af37] dark:hover:text-[#f4d03f] transition-colors">
              <Home size={16} className="mr-1" />
              Home
            </Link>
            <BreadcrumbChevron size={16} className="text-gray-400" />
            <Link 
              href="/categories" 
              className="text-gray-600 dark:text-gray-400 hover:text-[#d4af37] dark:hover:text-[#f4d03f] transition-colors"
            >
              Categories
            </Link>
            <BreadcrumbChevron size={16} className="text-gray-400" />
            <Link
              href={`/categories/${product.category.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-gray-600 dark:text-gray-400 hover:text-[#d4af37] dark:hover:text-[#f4d03f] transition-colors"
            >
              {product.category}
            </Link>
            <BreadcrumbChevron size={16} className="text-gray-400" />
            <span className="text-gray-900 dark:text-gray-100 font-medium">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div>
              <div className="relative aspect-square overflow-hidden rounded-2xl mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl border border-white/20 dark:border-gray-700/30">
              {isVideo(currentMedia) ? (
                <video
                  src={currentMedia}
                  controls
                  autoPlay={isVideoPlaying}
                  className="w-full h-full object-contain"
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                />
              ) : (
                <Image src={currentMedia || "/placeholder.svg"} alt={product.name} fill className="object-contain" />
              )}

                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-[#d4af37] hover:text-white dark:hover:bg-[#f4d03f] dark:hover:text-gray-900 text-gray-700 dark:text-gray-200 p-3 rounded-full transition-all duration-300 shadow-lg backdrop-blur-sm z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-[#d4af37] hover:text-white dark:hover:bg-[#f4d03f] dark:hover:text-gray-900 text-gray-700 dark:text-gray-200 p-3 rounded-full transition-all duration-300 shadow-lg backdrop-blur-sm z-10"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
            </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImageIndex(index)
                      setIsVideoPlaying(false)
                    }}
                    className={`relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300 ${
                      selectedImageIndex === index
                        ? "border-2 border-[#d4af37] dark:border-[#f4d03f] shadow-lg scale-105"
                        : "border border-gray-200 dark:border-gray-600 hover:border-[#d4af37]/50 dark:hover:border-[#f4d03f]/50"
                    }`}
                >
                  {isVideo(image) ? (
                    <div className="w-full h-full bg-[#f8f8f8] dark:bg-[#1a1a1a] flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-[#d4af37] dark:text-[#f4d03f]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  ) : (
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

            {/* Product Details */}
            <div className="bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30">
              <div className="mb-3">
                <Link
                  href={`/categories/${product.category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-[#d4af37]/10 to-orange-100/20 dark:from-[#f4d03f]/10 dark:to-orange-200/10 text-[#d4af37] dark:text-[#f4d03f] hover:from-[#d4af37]/20 hover:to-orange-100/30 transition-all duration-300"
                >
                  {product.category}
                </Link>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-6 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center mb-8">
                <span className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#d4af37] to-orange-500 dark:from-[#f4d03f] dark:to-orange-400 bg-clip-text text-transparent mr-4">
                  ${product.price.toFixed(2)}
                </span>
                {product.oldPrice && (
                  <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="ml-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-lg">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">{product.description}</p>

              <div className="space-y-8 mb-10">
                {/* Size Selection */}
                {product.variations?.sizes && (
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">Size</label>
                    <div className="flex flex-wrap gap-3">
                      {product.variations.sizes.map((size: string) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[50px] h-12 px-4 rounded-xl border-2 font-medium transition-all duration-300 ${
                            selectedSize === size
                              ? "border-[#d4af37] bg-gradient-to-r from-[#d4af37] to-orange-500 text-white shadow-lg dark:border-[#f4d03f] dark:from-[#f4d03f] dark:to-orange-400"
                              : "border-gray-200 bg-white text-gray-700 hover:border-[#d4af37]/50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:border-[#f4d03f]/50"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {product.variations?.colors && (
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Metal Color
                    </label>
                    <div className="flex space-x-4">
                      {product.variations.colors.map((color: string) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-12 h-12 rounded-full border-3 transition-all duration-300 shadow-lg hover:scale-110 ${
                            selectedColor === color
                              ? "border-[#d4af37] dark:border-[#f4d03f] ring-4 ring-[#d4af37]/30 dark:ring-[#f4d03f]/30"
                              : "border-gray-300 dark:border-gray-500 hover:border-[#d4af37]/50 dark:hover:border-[#f4d03f]/50"
                          }`}
                        style={{
                          backgroundColor:
                            color === "Yellow Gold"
                              ? "#FFD700"
                              : color === "White Gold"
                                ? "#F5F5F5"
                                : color === "Rose Gold"
                                  ? "#B76E79"
                                  : color === "Platinum"
                                    ? "#E5E4E2"
                                    : "#CCCCCC",
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

                {/* Quantity */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">Quantity</label>
                  <div className="flex items-center bg-white dark:bg-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-600 overflow-hidden shadow-lg">
                    <button
                      onClick={decreaseQuantity}
                      className="p-4 hover:bg-[#d4af37] hover:text-white dark:hover:bg-[#f4d03f] dark:hover:text-gray-900 text-gray-700 dark:text-gray-200 transition-all duration-300"
                    >
                      <Minus size={18} />
                    </button>
                    <div className="flex-1 min-w-[80px] h-[56px]">
                      <Input
                        type="text"
                        value={customQuantity || quantity}
                        onChange={handleCustomQuantityChange}
                        className="w-full h-full border-0 text-center text-lg font-semibold bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 dark:text-white"
                      />
                    </div>
                    <button
                      onClick={increaseQuantity}
                      className="p-4 hover:bg-[#d4af37] hover:text-white dark:hover:bg-[#f4d03f] dark:hover:text-gray-900 text-gray-700 dark:text-gray-200 transition-all duration-300"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button 
                  onClick={addToCart} 
                  className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-[#d4af37] to-orange-500 hover:from-[#b8941f] hover:to-orange-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 dark:from-[#f4d03f] dark:to-orange-400 dark:hover:from-[#e6c235] dark:hover:to-orange-500"
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={addToWishlist}
                  variant="outline"
                  className="flex-1 h-14 text-lg font-semibold border-2 border-[#d4af37] text-[#d4af37] hover:bg-gradient-to-r hover:from-[#d4af37] hover:to-orange-500 hover:text-white hover:border-transparent dark:border-[#f4d03f] dark:text-[#f4d03f] dark:hover:from-[#f4d03f] dark:hover:to-orange-400 dark:hover:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Heart size={20} className="mr-2" />
                  Add to Wishlist
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800/30">
                  <svg
                    className="w-6 h-6 text-[#d4af37] dark:text-[#f4d03f] mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Free shipping over $100</span>
                </div>
                <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                  <svg
                    className="w-6 h-6 text-[#d4af37] dark:text-[#f4d03f] mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">2-year warranty</span>
                </div>
                <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30">
                  <svg
                    className="w-6 h-6 text-[#d4af37] dark:text-[#f4d03f] mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">30-day returns</span>
                </div>
              </div>
          </div>
        </div>

          {/* Product Information Tabs */}
          <div className="mt-16 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start border-b-2 border-gray-200 dark:border-gray-600 rounded-none bg-transparent p-0">
                <TabsTrigger 
                  value="description" 
                  className="text-lg font-semibold px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-[#d4af37] dark:data-[state=active]:border-[#f4d03f] data-[state=active]:text-[#d4af37] dark:data-[state=active]:text-[#f4d03f] rounded-none bg-transparent"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger 
                  value="specifications" 
                  className="text-lg font-semibold px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-[#d4af37] dark:data-[state=active]:border-[#f4d03f] data-[state=active]:text-[#d4af37] dark:data-[state=active]:text-[#f4d03f] rounded-none bg-transparent"
                >
                  Specifications
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="py-8">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    {product.longDescription || product.description}
                  </p>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    Our <span className="font-semibold text-[#d4af37] dark:text-[#f4d03f]">jewelry pieces</span> are crafted with the utmost attention to detail, ensuring that each item meets our
                    high standards of quality and beauty. We use only the finest materials, including <span className="font-semibold text-[#d4af37] dark:text-[#f4d03f]">ethically sourced
                    gemstones</span> and precious metals, to create pieces that will be treasured for generations.
                  </p>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    Whether you're looking for a special gift or a treat for yourself, this piece is sure to delight with
                    its <span className="font-semibold text-[#d4af37] dark:text-[#f4d03f]">timeless elegance</span> and exceptional craftsmanship.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="specifications" className="py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="bg-gradient-to-br from-[#faf8f3] to-white dark:from-[#1a1a1a] dark:to-[#1e1e1e] p-6 rounded-xl border border-[#d4af37]/20 dark:border-[#f4d03f]/20">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-[#d4af37] to-[#f4d03f] dark:from-[#f4d03f] dark:to-[#d4af37] bg-clip-text text-transparent mb-6">Product Details</h3>
                    <ul className="space-y-4">
                      <li className="flex justify-between items-center border-b border-[#d4af37]/20 dark:border-[#f4d03f]/20 pb-3">
                        <span className="text-gray-600 dark:text-gray-300 font-medium">Material</span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {product.specifications?.material || "Premium Quality"}
                        </span>
                      </li>
                      <li className="flex justify-between items-center border-b border-[#d4af37]/20 dark:border-[#f4d03f]/20 pb-3">
                        <span className="text-gray-600 dark:text-gray-300 font-medium">Stone Type</span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {product.specifications?.stoneType || "Diamond"}
                        </span>
                      </li>
                      <li className="flex justify-between items-center border-b border-[#d4af37]/20 dark:border-[#f4d03f]/20 pb-3">
                        <span className="text-gray-600 dark:text-gray-300 font-medium">Setting Type</span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {product.specifications?.settingType || "Prong"}
                        </span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300 font-medium">Metal</span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {product.specifications?.metal || "14K Gold"}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-[#faf8f3] to-white dark:from-[#1a1a1a] dark:to-[#1e1e1e] p-6 rounded-xl border border-[#d4af37]/20 dark:border-[#f4d03f]/20">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-[#d4af37] to-[#f4d03f] dark:from-[#f4d03f] dark:to-[#d4af37] bg-clip-text text-transparent mb-6">Dimensions</h3>
                    <ul className="space-y-4">
                      <li className="flex justify-between items-center border-b border-[#d4af37]/20 dark:border-[#f4d03f]/20 pb-3">
                        <span className="text-gray-600 dark:text-gray-300 font-medium">Weight</span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {product.specifications?.weight || "2.5g"}
                        </span>
                      </li>
                      <li className="flex justify-between items-center border-b border-[#d4af37]/20 dark:border-[#f4d03f]/20 pb-3">
                        <span className="text-gray-600 dark:text-gray-300 font-medium">Width</span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {product.specifications?.width || "2mm"}
                        </span>
                      </li>
                      <li className="flex justify-between items-center border-b border-[#d4af37]/20 dark:border-[#f4d03f]/20 pb-3">
                        <span className="text-gray-600 dark:text-gray-300 font-medium">Stone Size</span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {product.specifications?.stoneSize || "0.5ct"}
                        </span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300 font-medium">Chain Length</span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {product.specifications?.chainLength || "18 inches"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
          </Tabs>
        </div>

          {/* Related Products */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="w-24 h-1 bg-gradient-to-r from-[#d4af37] to-orange-500 dark:from-[#f4d03f] dark:to-orange-400 mx-auto mb-6 rounded-full" />
              <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-4">
                You May Also <span className="bg-gradient-to-r from-[#d4af37] to-orange-500 dark:from-[#f4d03f] dark:to-orange-400 bg-clip-text text-transparent">Like</span>
              </h2>
            </div>
            <RelatedProducts currentProductId={product.id} category={product.category} />
          </div>
        </div>
      </div>
    </div>
  )
}

