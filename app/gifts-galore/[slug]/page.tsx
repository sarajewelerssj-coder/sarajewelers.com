"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Eye, ArrowLeft } from "lucide-react"
import FilterBar from "@/components/products/product-filters"
import { useToast } from "@/components/ui/use-toast"
import NewsletterSection from "@/components/layout/newsletter-section"
import { giftCategoriesData, giftPriceRanges, giftRecipients } from "@/data/gift-categories"
import { giftProductsData } from "@/data/gift-products"

export default function GiftCategoryPage({ params }: { params: { slug: string } }) {
  const { toast } = useToast()
  const { slug } = params

  const [categoryTitle, setCategoryTitle] = useState("")
  const [categoryDescription, setCategoryDescription] = useState("")
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [sortBy, setSortBy] = useState("featured")
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])

  useEffect(() => {
    // Find the category information based on the slug
    let title = ""
    let description = ""

    // Check in occasion categories
    const occasionCategory = giftCategoriesData.find((cat) => cat.slug === slug)
    if (occasionCategory) {
      title = occasionCategory.title
      description = occasionCategory.description
    }

    // Check in price range categories
    const priceCategory = giftPriceRanges.find((cat) => cat.slug === slug)
    if (priceCategory) {
      title = priceCategory.range
      description = priceCategory.description
    }

    // Check in recipient categories
    const recipientCategory = giftRecipients.find((cat) => cat.slug === slug)
    if (recipientCategory) {
      title = recipientCategory.recipient
      description = recipientCategory.description
    }

    setCategoryTitle(title)
    setCategoryDescription(description)

    // Filter products based on the category
    let categoryProducts: any[] = []

    // For occasion categories
    if (occasionCategory) {
      categoryProducts = giftProductsData.filter((product) => product.category === `${occasionCategory.title} Gifts`)
    }

    // For price range categories
    if (priceCategory) {
      if (slug === "under-100") {
        categoryProducts = giftProductsData.filter((product) => product.price < 100)
      } else if (slug === "100-to-250") {
        categoryProducts = giftProductsData.filter((product) => product.price >= 100 && product.price <= 250)
      } else if (slug === "250-to-500") {
        categoryProducts = giftProductsData.filter((product) => product.price > 250 && product.price <= 500)
      } else if (slug === "over-500") {
        categoryProducts = giftProductsData.filter((product) => product.price > 500)
      }
    }

    // For recipient categories
    if (recipientCategory) {
      // This is a simplified approach - in a real app, you'd have a more sophisticated way to determine which products are for which recipients
      if (slug === "for-her") {
        categoryProducts = giftProductsData.filter(
          (product) =>
            ["Mother's Day Gifts", "Valentine's Gifts"].includes(product.category) ||
            product.name.includes("Bracelet") ||
            product.name.includes("Necklace") ||
            product.name.includes("Earrings"),
        )
      } else if (slug === "for-him") {
        categoryProducts = giftProductsData.filter(
          (product) =>
            ["Father's Day Gifts"].includes(product.category) ||
            product.name.includes("Men's") ||
            product.name.includes("Cufflinks") ||
            product.name.includes("Signet"),
        )
      } else if (slug === "for-couples") {
        categoryProducts = giftProductsData.filter(
          (product) =>
            ["Wedding Gifts", "Anniversary Gifts"].includes(product.category) ||
            product.name.includes("His & Hers") ||
            product.name.includes("Couple"),
        )
      }
    }

    setAllProducts(categoryProducts)
    setFilteredProducts(categoryProducts)
  }, [slug])

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
    // Apply the new sort immediately
    const newSortBy = value
    const result = [...filteredProducts]

    switch (newSortBy) {
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

  return (
    <div className="min-h-screen">
      <div className="bg-[#fdf6f3] dark:bg-[#1a1a1a] py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-4">
            <Link
              href="/gifts-galore"
              className="flex items-center text-[#555555] dark:text-[#cccccc] hover:text-[#b17a65] dark:hover:text-[#d8a48f]"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Gifts
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#333333] dark:text-[#f5f5f5] mb-4">{categoryTitle}</h1>
            <p className="text-[#555555] dark:text-[#cccccc] max-w-2xl mx-auto">{categoryDescription}</p>
          </div>
        </div>
      </div>

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

      <div className="container mx-auto px-4 py-8">
        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white dark:bg-[#1a1a1a] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={
                      hoveredProduct === product.id && product.images.length > 1 ? product.images[1] : product.images[0]
                    }
                    alt={product.name}
                    fill
                    className="object-cover transition-all duration-500"
                  />

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
                      <span className="ml-1 text-xs text-[#777777] dark:text-[#aaaaaa]">({product.reviewCount})</span>
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
      </div>

      <NewsletterSection />
    </div>
  )
}

