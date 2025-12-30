"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ArrowLeft, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import LogoLoader from "@/components/ui/logo-loader"

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  slug: string
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    // Get wishlist items from localStorage
    const storedWishlist = localStorage.getItem("wishlist")
    if (storedWishlist) {
      try {
        const parsedWishlist = JSON.parse(storedWishlist)
        const correctedWishlist = parsedWishlist.map((item: any) => ({
          ...item,
          slug: item.slug || item.id // Fallback for old data to prevent /products/undefined
        }))
        setWishlistItems(correctedWishlist)
      } catch (error) {
        console.error("Failed to parse wishlist:", error)
        setWishlistItems([])
      }
    }
    setIsLoading(false)
  }, [])

  const removeItem = (id: string) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== id)
    setWishlistItems(updatedWishlist)
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
    window.dispatchEvent(new Event("wishlistUpdated"))

    toast.success("Item removed", {
      description: "The item has been removed from your wishlist",
      duration: 3000,
    })
  }

  const clearWishlist = () => {
    setWishlistItems([])
    localStorage.removeItem("wishlist")
    window.dispatchEvent(new Event("wishlistUpdated"))

    toast.success("Wishlist cleared", {
      description: "All items have been removed from your wishlist",
      duration: 3000,
    })
  }

  const moveToCart = (item: WishlistItem) => {
    // Get existing cart from localStorage or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex((cartItem: any) => cartItem.id === item.id)

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      existingCart[existingItemIndex].quantity += 1
    } else {
      // Add new item if it doesn't exist
      existingCart.push({
        ...item,
        quantity: 1,
      })
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart))

    // Remove from wishlist
    removeItem(item.id)

    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event("cartUpdated"))

    // Show toast notification
    toast.success("Moved to cart", {
      description: `${item.name} has been moved to your cart`,
      duration: 3000,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F6F1E8] dark:bg-[#1a1a1a]">
        <LogoLoader />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F1E8] dark:bg-gradient-to-br dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
      {/* Hero Section */}
      <section className="py-8 md:py-16 bg-transparent relative overflow-hidden">
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
            <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">Wishlist</span>
          </nav>

          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                Your Wishlist
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif italic font-bold mb-4 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Saved Items
              </span>
            </h1>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl flex-1">

        {wishlistItems.length > 0 ? (
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm p-4 md:p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl md:text-2xl font-serif italic font-bold text-[#333333] dark:text-[#f5f5f5] tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Wishlist Items</h2>
              <Button
                variant="outline"
                onClick={clearWishlist}
                size="sm"
                className="w-full sm:w-auto text-[#e53935] border-[#e53935] hover:bg-[#ffebee] dark:text-[#ff8a85] dark:border-[#ff8a85] dark:hover:bg-[#3d2726] transition-colors"
              >
                <Trash2 size={16} className="mr-2" />
                Clear Wishlist
              </Button>
            </div>

            <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-[#777777] dark:text-[#aaaaaa] text-sm font-medium">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-4 text-right">Actions</div>
            </div>

            <Separator className="mb-6 hidden md:block" />

            {wishlistItems.map((item, index) => (
              <div key={item.id} className="group">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center">
                  <div className="col-span-1 md:col-span-6 flex items-center">
                    <Link href={`/products/${item.slug}`} className="relative w-24 h-24 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </Link>
                    <div className="ml-4 flex-1">
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="text-lg md:text-base font-serif italic font-bold text-[#333333] dark:text-[#f5f5f5] hover:text-[#d4af37] dark:hover:text-[#f4d03f] tracking-tight transition-colors" style={{ fontFamily: 'var(--font-serif)' }}>
                          {item.name}
                        </h3>
                      </Link>
                      <div className="md:hidden mt-1 font-bold text-[#d4af37] dark:text-[#f4d03f]">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:block md:col-span-2 text-center text-lg font-medium text-gray-900 dark:text-gray-100">
                    ${item.price.toFixed(2)}
                  </div>

                  <div className="col-span-1 md:col-span-4 flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => moveToCart(item)}
                      className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-black font-bold h-10 md:h-9"
                      size="sm"
                    >
                      <ShoppingCart size={16} className="mr-2" />
                      Move to Cart
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => removeItem(item.id)}
                      className="flex-1 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 dark:hover:bg-red-900/20 h-10 md:h-9 transition-all"
                      size="sm"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>

                {index < wishlistItems.length - 1 && <Separator className="my-6" />}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <Heart size={64} className="text-[#d4af37] dark:text-[#d4af37]" />
            </div>
            <h2 className="text-2xl font-serif italic font-bold text-[#333333] dark:text-[#f5f5f5] mb-2 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Your wishlist is empty</h2>
            <p className="text-[#777777] dark:text-[#aaaaaa] mb-6">
              Looks like you haven't added any jewelry to your wishlist yet.
            </p>
            <Link href="/categories">
              <Button className="bg-[#d4af37] hover:bg-[#b8860b] text-white">Start Shopping</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

