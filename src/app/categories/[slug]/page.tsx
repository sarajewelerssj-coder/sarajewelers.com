"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Eye, ArrowLeft } from "lucide-react"
import FilterBar from "@/components/products/product-filters"

import ProductCard from '@/components/products/product-card'
import { Button } from "@/components/ui/button"
import LogoLoader from "@/components/ui/logo-loader"
import { toast } from "sonner"
import NewsletterSection from "@/components/layout/newsletter-section"

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string


  const [category, setCategory] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [sortBy, setSortBy] = useState("featured")

  // Filter states
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])

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
  ]

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // 1. Fetch all categories to find the current one by slug
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        
        if (!categoriesData.success && !categoriesData.categories) {
          console.error("Failed to fetch categories");
          setLoading(false)
          return;
        }

        const cats = categoriesData.categories || [];
        
        // Special handling for new-arrivals
        if (slug === 'new-arrivals') {
          setCategory({ 
            name: 'New Arrivals', 
            slug: 'new-arrivals', 
            description: 'Discover our latest exquisite additions to the collection.' 
          });
          const productsResponse = await fetch('/api/products?isNew=true');
          const productsData = await productsResponse.json();
          if (productsData.success) {
            setAllProducts(productsData.products || []);
            setFilteredProducts(productsData.products || []);
          }
          setLoading(false);
          return;
        }

        const currentCategory = cats.find((cat: any) => cat.slug === slug);

        if (currentCategory) {
          setCategory(currentCategory);

          // 2. Fetch products for this category
          const productsResponse = await fetch(`/api/products?category=${encodeURIComponent(currentCategory.name)}`);
          const productsData = await productsResponse.json();

          if (productsData.success) {
            setAllProducts(productsData.products || []);
            setFilteredProducts(productsData.products || []);
          }
        } else {
             // Handle category not found
             console.log("Category not found for slug:", slug);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load category data");
      } finally {
        setLoading(false)
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

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
      // This is a mock implementation since we don't have material data in our products
      // In a real app, you would filter based on actual product material data
      result = result.filter((product) => {
        // Assuming product has a material property or we're checking against color
        const productMaterial = product.variations?.colors?.[0] || ""
        return selectedMaterials.some((material) => productMaterial.toLowerCase().includes(material.toLowerCase()))
      })
    }

    // Apply style filter if any selected
    if (selectedStyles.length > 0) {
      // This is a mock implementation since we don't have style data in our products
      // In a real app, you would filter based on actual product style data
      result = result.filter((product) => {
        // For demo purposes, we'll just filter randomly based on product ID
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
        // Keep original order
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

    // Get existing cart from localStorage or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id)

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      existingCart[existingItemIndex].quantity += 1
    } else {
      // Add new item if it doesn't exist
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

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart))

    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event("cartUpdated"))

    // Show toast notification
    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart`,
      duration: 3000,
    })
  }

  const addToWishlist = (product: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

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

  const handleGoBack = () => {
    router.push("/categories")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F1E8] dark:bg-gradient-to-br dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
        <LogoLoader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F1E8] dark:bg-gradient-to-br dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a] relative overflow-hidden">
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
            <Link href="/categories" className="text-gray-600 dark:text-gray-400 hover:text-[#d4af37] dark:hover:text-[#f4d03f] transition-colors duration-300">
              Categories
            </Link>
            <span className="text-gray-400 dark:text-gray-600">/</span>
            <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">{category?.name || 'Category'}</span>
          </nav>

          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                {category?.name || 'Collection'}
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif italic font-bold mb-4 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                {category?.name || 'Product'} Collection
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
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <ShoppingCart className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-serif italic font-bold text-gray-900 dark:text-white mb-4 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                  No Products Found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed mb-6">
                  {category ? "We couldn't find any products in this category matching your filters." : "This category does not exist or has no products at the moment."}
                </p>
                {category && (
                  <Button onClick={resetFilters} className="bg-[#d4af37] hover:bg-[#d4af37]/90 dark:bg-[#f4d03f] dark:hover:bg-[#f4d03f]/90 text-white dark:text-black rounded-full px-8">
                    Reset All Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </div>
  )
}

