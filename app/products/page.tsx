"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Eye } from "lucide-react"
import { productsData } from "@/data/products"
import ProductFilters from "@/components/products/product-filters"
import { useToast } from "@/components/ui/use-toast"
import NewsletterSection from "@/components/layout/newsletter-section"

export default function AllProductsPage() {
  const { toast } = useToast()

  const [allProducts, setAllProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [sortBy, setSortBy] = useState("featured")
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    // Set all products
    setAllProducts(productsData)
    setFilteredProducts(productsData)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Product images from Unsplash
  const productImages = [
    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1374&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1374&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1589674781759-c21c37956a44?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1601821765780-754fa98637c1?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=1470&auto=format&fit=crop",
  ]

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
    setCurrentPage(1) // Reset to first page when filters change
  }

  const resetFilters = () => {
    setPriceRange([0, 5000])
    setSelectedMaterials([])
    setSelectedStyles([])
    setFilteredProducts(allProducts)
    setCurrentPage(1)
  }

  const addToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id)

    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
        selectedSize: product.variations?.sizes?.[0] || "",
        selectedColor: product.variations?.colors?.[0] || "",
      })
    }

    localStorage.setItem("cart", JSON.stringify(existingCart))
    window.dispatchEvent(new Event("cartUpdated"))

    toast({
      title: "Added to cart",
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
      existingWishlist.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      })

      localStorage.setItem("wishlist", JSON.stringify(existingWishlist))
      window.dispatchEvent(new Event("wishlistUpdated"))

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

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const materials = ["Gold", "Silver", "Platinum", "Diamond", "Pearl"]
  const styles = [
    { name: "Elegant", count: 25 },
    { name: "Modern", count: 32 },
    { name: "Classic", count: 18 },
    { name: "Vintage", count: 40 },
    { name: "Bohemian", count: 12 },
    { name: "Minimalist", count: 28 },
    { name: "Luxury", count: 15 },
    { name: "Casual", count: 35 },
  ]

  return (
    <div className="min-h-screen">
      <div className="bg-[#fdf6f3] dark:bg-[#1a1a1a] py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">All Products</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our complete collection of fine jewelry, each piece crafted with precision and care.
          </p>
        </div>
      </div>

      {/* Filter bar - Fixed to top when scrolled */}
      <div
        className={`bg-white dark:bg-[#1e1e1e] border-b border-[#e0e0e0] dark:border-[#444444] py-3 transition-all duration-300 ${
          isScrolled ? "sticky top-[72px] z-40 shadow-sm" : ""
        }`}
      >
        <div className="container mx-auto px-4">
          <ProductFilters
            totalItems={filteredProducts.length}
            sortBy={sortBy}
            onSortChange={(value) => {
              setSortBy(value)
              // Apply the new sort immediately
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
            }}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedMaterials={selectedMaterials}
            toggleMaterial={(material) => {
              setSelectedMaterials((prev) =>
                prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material],
              )
            }}
            selectedStyles={selectedStyles}
            toggleStyle={(style) => {
              setSelectedStyles((prev) => (prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]))
            }}
            applyFilters={applyFilters}
            resetFilters={resetFilters}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Products section - takes full width */}
          <div className="w-full">
            {/* Products grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {currentProducts.length > 0 ? (
                currentProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="group relative bg-white dark:bg-[#1a1a1a] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={productImages[index % productImages.length] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-all duration-500"
                      />
                      {hoveredProduct === product.id && (
                        <Image
                          src={productImages[(index + 1) % productImages.length] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                      )}

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          className="bg-white dark:bg-[#333333] p-2 rounded-full shadow-md hover:bg-[#b17a65] hover:text-white dark:hover:bg-[#d8a48f] transition-colors"
                          onClick={(e) => addToWishlist(product, e)}
                        >
                          <Heart size={18} />
                        </button>
                        <button
                          className="bg-white dark:bg-[#333333] p-2 rounded-full shadow-md hover:bg-[#b17a65] hover:text-white dark:hover:bg-[#d8a48f] transition-colors"
                          onClick={(e) => addToCart(product, e)}
                        >
                          <ShoppingCart size={18} />
                        </button>
                        <Link
                          href={`/products/${product.slug}`}
                          className="bg-white dark:bg-[#333333] p-2 rounded-full shadow-md hover:bg-[#b17a65] hover:text-white dark:hover:bg-[#d8a48f] transition-colors"
                        >
                          <Eye size={18} />
                        </Link>
                      </div>

                      {product.isNew && (
                        <div className="absolute top-3 left-3 bg-[#b17a65] text-white text-xs font-medium px-2 py-1 rounded">
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
                        <h2 className="font-medium text-[#333333] dark:text-[#f5f5f5] mb-2 hover:text-[#b17a65] dark:hover:text-[#d8a48f] transition-colors">
                          {product.name}
                        </h2>
                      </Link>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <span className="font-semibold text-[#333333] dark:text-[#f5f5f5]">
                            ${product.price.toFixed(2)}
                          </span>
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
                                className={`w-4 h-4 ${
                                  star <= product.rating ? "text-yellow-400" : "text-[#e0e0e0] dark:text-[#555555]"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-1 text-xs text-[#777777] dark:text-[#aaaaaa]">
                            ({product.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-[#555555] dark:text-[#cccccc]">No products found. Try adjusting your filters.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center">
                  <button
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-l-md border ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 dark:bg-[#333333] dark:text-[#666666] cursor-not-allowed"
                        : "bg-white text-[#333333] hover:bg-[#f8f0ed] dark:bg-[#1a1a1a] dark:text-[#f5f5f5] dark:hover:bg-[#3d2e29]"
                    } border-[#e0e0e0] dark:border-[#444444]`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 border-t border-b ${
                        currentPage === number
                          ? "bg-[#b17a65] text-white dark:bg-[#d8a48f]"
                          : "bg-white text-[#333333] hover:bg-[#f8f0ed] dark:bg-[#1a1a1a] dark:text-[#f5f5f5] dark:hover:bg-[#3d2e29]"
                      } border-[#e0e0e0] dark:border-[#444444]`}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-r-md border ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 dark:bg-[#333333] dark:text-[#666666] cursor-not-allowed"
                        : "bg-white text-[#333333] hover:bg-[#f8f0ed] dark:bg-[#1a1a1a] dark:text-[#f5f5f5] dark:hover:bg-[#3d2e29]"
                    } border-[#e0e0e0] dark:border-[#444444]`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      <NewsletterSection />
    </div>
  )
}

