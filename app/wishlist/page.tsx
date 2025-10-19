"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ArrowLeft, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import LogoLoader from "@/components/ui/logo-loader"

interface WishlistItem {
  id: number
  name: string
  price: number
  image: string
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Get wishlist items from localStorage
    const storedWishlist = localStorage.getItem("wishlist")
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist))
    }
    setIsLoading(false)
  }, [])

  const removeItem = (id: number) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== id)
    setWishlistItems(updatedWishlist)
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
    window.dispatchEvent(new Event("wishlistUpdated"))

    toast({
      title: "Item removed",
      description: "The item has been removed from your wishlist",
      duration: 3000,
    })
  }

  const clearWishlist = () => {
    setWishlistItems([])
    localStorage.removeItem("wishlist")
    window.dispatchEvent(new Event("wishlistUpdated"))

    toast({
      title: "Wishlist cleared",
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
    toast({
      title: "Moved to cart",
      description: `${item.name} has been moved to your cart`,
      duration: 3000,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
        <LogoLoader />
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a] relative overflow-hidden">
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
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Saved Items
              </span>
            </h1>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">

        {wishlistItems.length > 0 ? (
          <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#333333] dark:text-[#f5f5f5]">Wishlist Items</h2>
              <Button
                variant="outline"
                onClick={clearWishlist}
                className="text-[#e53935] border-[#e53935] hover:bg-[#ffebee] dark:text-[#ff8a85] dark:border-[#ff8a85] dark:hover:bg-[#3d2726]"
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
              <div key={item.id} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="col-span-6 flex items-center">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="ml-4">
                      <Link href={`/products/${item.id}`}>
                        <h3 className="font-medium text-[#333333] dark:text-[#f5f5f5] hover:text-[#d4af37] dark:hover:text-[#d4af37]">
                          {item.name}
                        </h3>
                      </Link>
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className="md:hidden text-[#777777] dark:text-[#aaaaaa] mr-2">Price:</span>
                    <span className="text-[#333333] dark:text-[#f5f5f5]">${item.price.toFixed(2)}</span>
                  </div>

                  <div className="col-span-4 flex justify-end space-x-2">
                    <Button
                      onClick={() => moveToCart(item)}
                      className="bg-[#d4af37] hover:bg-[#b8860b] text-white"
                      size="sm"
                    >
                      <ShoppingCart size={16} className="mr-2" />
                      Move to Cart
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => removeItem(item.id)}
                      className="text-[#e53935] border-[#e53935] hover:bg-[#ffebee] dark:text-[#ff8a85] dark:border-[#ff8a85] dark:hover:bg-[#3d2726]"
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
            <h2 className="text-2xl font-bold text-[#333333] dark:text-[#f5f5f5] mb-2">Your wishlist is empty</h2>
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

