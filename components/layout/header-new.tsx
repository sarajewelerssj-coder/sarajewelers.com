"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Heart, ShoppingCart, User, Menu, X, LogOut, Home, Grid, Phone, Diamond, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import LoginForm from "@/components/auth/login-form"
import { useToast } from "@/components/ui/use-toast"
import { productsData } from "@/data/products"
import { usePathname } from "next/navigation"

const navLinks = [
  { name: "Home", href: "/" },
  {
    name: "Engagement Rings",
    href: "/categories/engagement-rings",
    dropdown: [
      {
        title: "Popular Styles",
        links: [
          { name: "Solitaire", href: "/categories/engagement-rings?style=solitaire" },
          { name: "Halo", href: "/categories/engagement-rings?style=halo" },
          { name: "Vintage", href: "/categories/engagement-rings?style=vintage" },
        ],
      },
      {
        title: "Metals",
        links: [
          { name: "White Gold", href: "/categories/engagement-rings?metal=white-gold" },
          { name: "Yellow Gold", href: "/categories/engagement-rings?metal=yellow-gold" },
          { name: "Rose Gold", href: "/categories/engagement-rings?metal=rose-gold" },
        ],
      },
    ],
  },
  {
    name: "Fine Jewelry",
    href: "/categories/fine-jewelry",
    dropdown: [
      { title: "Necklaces", href: "/categories/pendants-necklaces" },
      { title: "Earrings", href: "/categories/earrings" },
      { title: "Bracelets", href: "/categories/bracelets" },
      { title: "Rings", href: "/categories/fashion-rings" },
    ],
  },
  {
    name: "Diamonds",
    href: "/diamonds",
    dropdown: [
      { title: "Natural", href: "/diamonds?type=natural" },
      { title: "Lab-grown", href: "/diamonds?type=lab-grown" },
    ],
  },
  {
    name: "Design Studio",
    href: "/custom-design",
    dropdown: [
      { title: "Custom Rings", href: "/custom-design?type=ring" },
      { title: "Design Consultation", href: "/custom-design?type=consultation" },
      { title: "Bespoke Jewelry", href: "/custom-design?type=bespoke" },
    ],
  },
  {
    name: "Contact",
    href: "/contact",
  },
]

export default function Header() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const { toast } = useToast()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    // Check if user is logged in
    const userLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(userLoggedIn)

    // Get cart count
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartCount(cart.length)

    // Get wishlist count
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    setWishlistCount(wishlist.length)

    window.addEventListener("scroll", handleScroll)

    // Set up storage event listener to update cart and wishlist counts
    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]")
      setCartCount(updatedCart.length)

      const updatedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
      setWishlistCount(updatedWishlist.length)

      const userLoggedInUpdated = localStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(userLoggedInUpdated)
    }

    window.addEventListener("storage", handleStorageChange)

    // Custom event listener for cart and wishlist updates
    const handleCartUpdate = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]")
      setCartCount(updatedCart.length)
    }

    const handleWishlistUpdate = () => {
      const updatedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
      setWishlistCount(updatedWishlist.length)
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    window.addEventListener("wishlistUpdated", handleWishlistUpdate)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cartUpdated", handleCartUpdate)
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    // Always navigate to search page when form is submitted
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    setShowSearchResults(false)
    setSearchQuery("")
  }

  const handleSearchInput = (query: string) => {
    setSearchQuery(query)
    
    if (!query.trim() || query.length < 2) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    // Filter products for dropdown preview
    const results = productsData.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()),
    )

    setSearchResults(results.slice(0, 5))
    setShowSearchResults(results.length > 0)
  }

  const handleSearchItemClick = (slug: string) => {
    setShowSearchResults(false)
    setSearchQuery("")
    router.push(`/products/${slug}`)
  }

  const handleSearchAll = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSearchResults(false)
      setSearchQuery("")
    }
  }

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false")
    setIsLoggedIn(false)
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
      duration: 3000,
    })
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-white/95 dark:bg-[#292929]/95 backdrop-blur-sm shadow-sm" : "bg-white dark:bg-[#292929]"
        }`}
      >
        <div className="container mx-auto px-4">
          {/* Top row with logo and icons */}
          <div className="flex items-center justify-between py-4">
            {/* Mobile menu button - left side */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden z-10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={22} className="text-[#d4af37]" /> : <Menu size={22} />}
            </Button>

            {/* Logo - positioned to the left */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-3">
                <img 
                  src="/logo.png" 
                  alt="Sara Jewelers" 
                  className="w-16 h-16 object-contain"
                />
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-[#d4af37] dark:text-[#d4af37]">SARA</span>
                  <span className="text-xl font-bold text-[#d4af37] dark:text-[#d4af37] -mt-1">JEWELERS</span>
                </div>
              </Link>
            </div>

            {/* Desktop search bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative w-full">
                  <Input
                    type="search"
                    placeholder="Search for jewelry..."
                    className="w-full pe-10 border-[#d4af37] dark:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                    value={searchQuery}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                    onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                  />
                  <button
                    type="submit"
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-[#777777] dark:text-[#aaaaaa] hover:text-[#d4af37] dark:hover:text-[#d4af37] transition-colors"
                  >
                    <Search size={18} />
                  </button>
                </div>
              </form>

              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full start-0 end-0 mt-1 bg-white dark:bg-[#292929] border border-[#d4af37] dark:border-[#d4af37] rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center p-3 hover:bg-[#f8f4e8] dark:hover:bg-[#2d2d2d] border-b border-[#e0e0e0] dark:border-[#444444] last:border-0 transition-colors cursor-pointer"
                      onClick={() => handleSearchItemClick(product.slug)}
                    >
                      <div className="relative size-12 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="ms-3">
                        <h3 className="text-sm font-medium text-[#333333] dark:text-[#f5f5f5]">{product.name}</h3>
                        <p className="text-xs text-[#777777] dark:text-[#aaaaaa]">{product.category}</p>
                      </div>
                      <div className="ms-auto text-sm font-medium text-[#d4af37]">${product.price.toFixed(2)}</div>
                    </div>
                  ))}

                  <div
                    className="p-3 text-center bg-[#f8f4e8] dark:bg-[#2d2d2d] hover:bg-[#f0e9d2] dark:hover:bg-[#3d3d3d] cursor-pointer"
                    onClick={handleSearchAll}
                  >
                    <span className="text-[#d4af37] font-medium">See all results for "{searchQuery}"</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-4">
              <ModeToggle />

              <Link href="/wishlist" className="relative">
                <Heart
                  size={22}
                  className="text-[#555555] hover:text-[#d4af37] dark:text-[#cccccc] dark:hover:text-[#d4af37] transition-colors"
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -end-2 bg-[#d4af37] text-white text-xs rounded-full size-5 grid place-items-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative flex items-center justify-center">
                      <Avatar className="size-8 cursor-pointer hover:ring-2 hover:ring-[#d4af37]/20 transition-all">
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback className="bg-[#d4af37] text-white">SJ</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem className="cursor-default">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-[#333333] dark:text-[#f5f5f5]">John Doe</p>
                        <p className="text-xs text-[#777777] dark:text-[#aaaaaa]">john.doe@example.com</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-[#b22222] dark:text-[#ff6b6b] cursor-pointer hover:bg-[#fff0f0] dark:hover:bg-[#3d2222] transition-colors"
                    >
                      <LogOut className="me-2 size-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="hidden sm:flex">
                      <User
                        size={22}
                        className="text-[#555555] hover:text-[#d4af37] dark:text-[#cccccc] dark:hover:text-[#d4af37] transition-colors"
                      />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md border-none">
                    <DialogHeader className="sr-only">
                      <DialogTitle>Login</DialogTitle>
                    </DialogHeader>
                    <LoginForm />
                  </DialogContent>
                </Dialog>
              )}

              <Link href="/cart" className="relative">
                <ShoppingCart
                  size={22}
                  className="text-[#555555] hover:text-[#d4af37] dark:text-[#cccccc] dark:hover:text-[#d4af37] transition-colors"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -end-2 bg-[#d4af37] text-white text-xs rounded-full size-5 grid place-items-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile search toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
              >
                <Search size={22} className={showMobileSearch ? "text-[#d4af37]" : ""} />
              </Button>
            </div>
          </div>

          {/* Desktop navigation - separate row */}
          <nav className="hidden md:flex items-center justify-center py-3 border-t border-[#e0e0e0] dark:border-[#444444]">
            {navLinks.map((link) => {
              const isActive =
                (link.href === "/" && pathname === "/") || (link.href !== "/" && pathname.startsWith(link.href))

              return link.dropdown ? (
                <div
                  key={link.name}
                  className="group relative"
                  onMouseEnter={() => setOpenDropdown(link.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={`relative flex items-center px-4 py-2 font-medium transition-colors duration-300 ${
                      isActive
                        ? "text-[#d4af37] dark:text-[#d4af37]"
                        : "text-[#555555] hover:text-[#d4af37] dark:text-[#cccccc] dark:hover:text-[#d4af37]"
                    }`}
                  >
                    {link.name}
                    <ChevronDown size={16} className="ml-1 transition-transform duration-300 group-hover:rotate-180" />
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-[#d4af37] rounded-full" />
                    )}
                  </Link>
                  {openDropdown === link.name && (
                    <div className="absolute top-full left-0 w-screen bg-white dark:bg-[#292929] shadow-lg border-t border-[#d4af37] z-50">
                      <div className="container mx-auto px-8 py-6">
                        <div className="flex gap-8">
                          <div className="flex-1 flex gap-8">
                            {link.dropdown.map((col: any, index: number) => (
                              <div key={index} className="flex-1">
                                <Link 
                                  href={col.href || "#"} 
                                  className="block text-base font-medium text-[#d4af37] hover:text-[#f4d03f] pb-2 border-b border-[#d4af37]/20 mb-3 transition-colors"
                                >
                                  {col.title}
                                </Link>
                                {col.links && (
                                  <div className="space-y-2">
                                    {col.links.map((item: any) => (
                                      <Link 
                                        key={typeof item === 'string' ? item : item.name} 
                                        href={typeof item === 'string' ? "#" : item.href || "#"} 
                                        className="block text-sm text-gray-600 dark:text-gray-400 hover:text-[#d4af37] py-1.5 px-2 rounded hover:bg-[#f8f4e8] dark:hover:bg-[#303846] transition-all"
                                      >
                                        {typeof item === 'string' ? item : item.name}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="w-56">
                            <div className="bg-gradient-to-br from-[#f8f4e8] to-[#faf8f3] dark:from-[#2d2d2d] dark:to-[#3d3d3d] rounded-lg p-4 h-40">
                              <img 
                                src={link.name === "Engagement Rings" ? "/images/categories/Engangement rings.webp" :
                                     link.name === "Fine Jewelry" ? "/images/categories/fine jewelery.webp" :
                                     link.name === "Diamonds" ? "/images/categories/gemstone jewelery.webp" :
                                     link.name === "Design Studio" ? "/images/categories/Wedding rings.webp" :
                                     "/placeholder.jpg"} 
                                alt={`${link.name} Collection`}
                                className="w-full h-full object-cover rounded-lg shadow-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-[#d4af37] dark:text-[#d4af37]"
                      : "text-[#555555] hover:text-[#d4af37] dark:text-[#cccccc] dark:hover:text-[#d4af37]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-[#d4af37] rounded-full" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Mobile search bar */}
          {showMobileSearch && (
            <div className="md:hidden mt-4">
              <form onSubmit={handleSearch} className="flex">
                <Input
                  type="search"
                  placeholder="Search for jewelry..."
                  className="w-full pe-10 border-[#d4af37] dark:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  autoFocus
                />
                <Button type="submit" variant="ghost" size="icon" className="ms-2">
                  <Search size={18} className="text-[#d4af37]" />
                </Button>
              </form>
            </div>
          )}

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-[#e0e0e0] dark:border-[#444444]">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => {
                  const isActive =
                    (link.href === "/" && pathname === "/") || (link.href !== "/" && pathname.startsWith(link.href))
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`font-medium transition-colors flex items-center p-2 rounded-md ${
                        isActive ? "bg-[#f8f4e8] text-[#d4af37] dark:bg-[#303846]" : "text-[#555555] dark:text-[#cccccc]"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                    {link.name === "Home" && <Home size={18} className="me-2" />}
                    {link.name === "Engagement Rings" && <Heart size={18} className="me-2" />}
                    {link.name === "Fine Jewelry" && <Grid size={18} className="me-2" />}
                    {link.name === "Design Studio" && <User size={18} className="me-2" />}
                    {link.name === "Diamonds" && <Diamond size={18} className="me-2" />}
                    {link.name === "Contact" && <Phone size={18} className="me-2" />}
                    {link.name}
                    </Link>
                  )
                })}
                {!isLoggedIn && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start hover:bg-[#f8f4e8] dark:hover:bg-[#303846] transition-colors border-[#d4af37] text-[#d4af37]"
                      >
                        <User size={18} className="me-2" />
                        Login / Register
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Account</DialogTitle>
                      </DialogHeader>
                      <LoginForm />
                    </DialogContent>
                  </Dialog>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Mobile bottom navigation bar */}
      <div className="md:hidden fixed bottom-0 start-0 end-0 bg-white dark:bg-[#292929] border-t border-[#e0e0e0] dark:border-[#444444] z-50 py-2 px-2 shadow-lg w-full">
        <div className="flex justify-around items-center">
          <Link
            href="/"
            className="flex flex-col items-center justify-center text-xs text-[#777777] dark:text-[#aaaaaa] hover:text-[#d4af37] dark:hover:text-[#d4af37]"
          >
            <Home size={20} className="mb-1" />
            <span>Home</span>
          </Link>
          <Link
            href="/categories"
            className="flex flex-col items-center justify-center text-xs text-[#777777] dark:text-[#aaaaaa] hover:text-[#d4af37] dark:hover:text-[#d4af37]"
          >
            <Grid size={20} className="mb-1" />
            <span>Categories</span>
          </Link>
          <Link
            href="/search"
            className="flex flex-col items-center justify-center text-xs text-[#777777] dark:text-[#aaaaaa] hover:text-[#d4af37] dark:hover:text-[#d4af37]"
          >
            <Search size={20} className="mb-1" />
            <span>Search</span>
          </Link>
          <Link
            href="/wishlist"
            className="flex flex-col items-center justify-center text-xs text-[#777777] dark:text-[#aaaaaa] hover:text-[#d4af37] dark:hover:text-[#d4af37]"
          >
            <Heart size={20} className="mb-1" />
            <span>Wishlist</span>
          </Link>
          <Link
            href="/cart"
            className="flex flex-col items-center justify-center text-xs text-[#777777] dark:text-[#aaaaaa] hover:text-[#d4af37] dark:hover:text-[#d4af37]"
          >
            <ShoppingCart size={20} className="mb-1" />
            <span>Cart</span>
          </Link>
        </div>
      </div>
    </>
  )
}