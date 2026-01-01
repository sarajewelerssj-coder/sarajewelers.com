"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"
import NextImage from "next/image"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { User, Package, Heart, ShoppingCart, LogOut, Clock, CheckCircle2, ChevronRight, FileText, Image as ImageIcon, Camera, Pin, Loader2, Trash2, AlertCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AuthFlow from "@/components/auth/auth-flow"
import LogoLoader from "@/components/ui/logo-loader"
import { motion, AnimatePresence } from 'framer-motion'
import { uploadFileAction } from "@/app/actions/media-actions"

export default function AccountPage() {
  return (
    <Suspense fallback={<LogoLoader />}>
      <AccountContent />
    </Suspense>
  )
}

function AccountContent() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "profile")
  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [activeOrder, setActiveOrder] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [loadingWishlist, setLoadingWishlist] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const uploadData = new FormData()
    uploadData.append('file', file)
    uploadData.append('folder', 'sara-jewelers/profiles')

    try {
      // 1. Upload to Cloudinary via our existing Server Action
      const result = await uploadFileAction(uploadData)

      if (!result.success) throw new Error(result.error || 'Upload failed')
      
      const { url, publicId } = result

      // 2. Update user profile in DB
      const updateRes = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: url, imagePublicId: publicId })
      })

      if (updateRes.ok) {
        toast.success("Profile picture updated")
        // Update session to reflect new image
        await update({ image: url, imagePublicId: publicId })
      } else {
        toast.error("Failed to update profile in database")
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error("Error uploading profile picture")
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async () => {
    if (!confirm("Are you sure you want to remove your profile picture?")) return

    setUploading(true)
    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: "", imagePublicId: "" })
      })

      if (response.ok) {
        toast.success("Profile picture removed")
        await update({ image: "", imagePublicId: "" })
      } else {
        toast.error("Failed to remove profile picture")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) setActiveTab(tab)
  }, [searchParams])

  useEffect(() => {
    if (session) {
      fetchOrders()
    }
  }, [session])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoadingOrders(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      toast.success("Logged out successfully", {
        description: "You have been logged out of your account",
        duration: 3000,
      })
      router.push("/")
    } catch (error) {
      toast.error("Logout failed", {
        description: "Please try again",
        duration: 3000,
      })
    }
  }

  const [profileName, setProfileName] = useState(session?.user?.name || "")
  const [profilePhone, setProfilePhone] = useState("")
  const [profileAddress, setProfileAddress] = useState("")
  const [profileCity, setProfileCity] = useState('')
  const [profileState, setProfileState] = useState("") // Keeping state field as well
  const [profileZip, setProfileZip] = useState('')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  useEffect(() => {
    if (session?.user) {
      setProfileName(session.user.name || "")
      // Fetch user specific data from an API if needed, or if session already has it
      // For now let's assume we might need to fetch it to get latest DB values
      const fetchUserData = async () => {
        try {
          const res = await fetch('/api/user/profile')
          if (res.ok) {
            const { user } = await res.json()
            setProfilePhone(user.phone || "")
            setProfileAddress(user.address || "")
            setProfileCity(user.city || "")
            setProfileZip(user.zipCode || "")
          }
        } catch (err) {
          console.error("Failed to fetch user data", err)
        }
      }
      fetchUserData()
    }

    // Load wishlist
    const storedWishlist = localStorage.getItem("wishlist")
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist))
    }
    setLoadingWishlist(false)

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      const stored = localStorage.getItem("wishlist")
      if (stored) setWishlistItems(JSON.parse(stored))
    }
    window.addEventListener("wishlistUpdated", handleWishlistUpdate)
    return () => window.removeEventListener("wishlistUpdated", handleWishlistUpdate)
  }, [session])

  const removeWishlistItem = (id: string | number) => {
    const updated = wishlistItems.filter(item => item.id !== id)
    setWishlistItems(updated)
    localStorage.setItem("wishlist", JSON.stringify(updated))
    window.dispatchEvent(new Event("wishlistUpdated"))
    toast.success("Item removed from wishlist")
  }

  const clearWishlist = () => {
    setWishlistItems([])
    localStorage.removeItem("wishlist")
    window.dispatchEvent(new Event("wishlistUpdated"))
    toast.success("Wishlist cleared")
  }

  const moveWishlistToCart = (item: any) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingIndex = existingCart.findIndex((cartItem: any) => cartItem.id === item.id)
    if (existingIndex >= 0) {
      existingCart[existingIndex].quantity += 1
    } else {
      existingCart.push({ ...item, quantity: 1 })
    }
    localStorage.setItem("cart", JSON.stringify(existingCart))
    removeWishlistItem(item.id)
    window.dispatchEvent(new Event("cartUpdated"))
    toast.success("Moved to cart")
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: profileName,
          phone: profilePhone,
          address: profileAddress,
          city: profileCity,
          zipCode: profileZip
        })
      })

      if (response.ok) {
        toast.success("Profile updated", {
          description: "Your profile information has been updated successfully",
          duration: 3000,
        })
        await update({ name: profileName })
      } else {
        toast.error("Failed to update profile")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }



  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F6F1E8] dark:bg-gradient-to-br dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
        <LogoLoader />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#F6F1E8] dark:bg-gradient-to-br dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a] relative overflow-hidden flex items-center justify-center py-20">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ x: [0, -40, 0], y: [0, 60, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[#d4af37]/10 rounded-full blur-[120px]" 
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">

          <AuthFlow />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F1E8] dark:bg-gradient-to-br dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a] pb-20">
      {/* Premium Header */}


      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg p-6 border border-[#e0e0e0] dark:border-[#333333]">
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Avatar className="w-24 h-24 ring-4 ring-[#d4af37]/20">
                    <AvatarImage src={session.user?.image || undefined} alt="User" />
                    <AvatarFallback className="bg-[#d4af37] text-white text-3xl font-bold">
                      {session.user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 flex gap-1.5">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      title="Upload new photo"
                      className="p-1.5 bg-[#d4af37] hover:bg-[#b8860b] text-white rounded-full shadow-md transition-all hover:scale-110 disabled:opacity-50"
                    >
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                    </button>
                    {session.user?.image && (
                      <button 
                        onClick={handleDeleteImage}
                        disabled={uploading}
                        title="Remove photo"
                        className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-md transition-all hover:scale-110 disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfileImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <h2 className="text-2xl font-serif italic font-bold text-[#333333] dark:text-[#f5f5f5] mb-1 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                  {session.user?.name || 'User'}
                </h2>
                <p className="text-sm text-[#777777] dark:text-[#aaaaaa] mb-4">
                  {session.user?.email}
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium">
                  ✓ Verified Account
                </div>
              </div>

              <Separator className="mb-6" />

              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors group ${activeTab === 'orders' ? 'bg-[#f8f4e8] dark:bg-[#2d2d2d]' : 'hover:bg-[#f8f4e8] dark:hover:bg-[#2d2d2d]'}`}
                >
                  <Package size={18} className="mr-3 text-[#d4af37] group-hover:scale-110 transition-transform" />
                  <span className="text-[#333333] dark:text-[#f5f5f5] font-medium">My Orders</span>
                </button>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-3 text-[#e53935] dark:text-[#ff8a85] hover:bg-red-50 dark:hover:bg-red-900/20 group"
                  onClick={handleLogout}
                >
                  <LogOut size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Sign Out</span>
                </Button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg border border-[#e0e0e0] dark:border-[#333333]">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start p-1 bg-[#f8f4e8] dark:bg-[#2d2d2d] rounded-t-xl overflow-x-auto flex-nowrap scrollbar-hide h-auto">
                  <TabsTrigger
                    value="profile"
                    className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium whitespace-nowrap text-sm sm:text-base flex-shrink-0"
                  >
                    Profile Settings
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium whitespace-nowrap text-sm sm:text-base flex-shrink-0"
                  >
                    Security
                  </TabsTrigger>
                  <TabsTrigger
                    value="orders"
                    className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium whitespace-nowrap text-sm sm:text-base flex-shrink-0"
                  >
                    My Orders
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-serif italic font-bold text-[#333333] dark:text-[#f5f5f5] mb-2 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Personal Information</h3>
                      <p className="text-sm text-[#777777] dark:text-[#aaaaaa]">Update your personal details and contact information</p>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium text-[#333333] dark:text-[#f5f5f5]">
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            disabled={isSubmitting}
                            className="h-11 border-[#e0e0e0] dark:border-[#444444] focus-visible:ring-[#d4af37] rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-medium text-[#333333] dark:text-[#f5f5f5]">
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={profilePhone}
                            onChange={(e) => setProfilePhone(e.target.value)}
                            disabled={isSubmitting}
                            className="h-11 border-[#e0e0e0] dark:border-[#444444] focus-visible:ring-[#d4af37] rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-[#333333] dark:text-[#f5f5f5]">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={session.user?.email || ''}
                          disabled
                          className="h-11 border-[#e0e0e0] dark:border-[#444444] bg-gray-50 dark:bg-gray-800 rounded-lg"
                        />
                        <p className="text-xs text-[#777777] dark:text-[#aaaaaa]">Email cannot be changed as it's linked to your Google account</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium text-[#333333] dark:text-[#f5f5f5]">
                          Address
                        </Label>
                        <Input
                          id="address"
                          placeholder="123 Main Street"
                          value={profileAddress}
                          onChange={(e) => setProfileAddress(e.target.value)}
                          disabled={isSubmitting}
                          className="h-11 border-[#e0e0e0] dark:border-[#444444] focus-visible:ring-[#d4af37] rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-sm font-medium text-[#333333] dark:text-[#f5f5f5]">
                            City
                          </Label>
                          <Input
                            id="city"
                            placeholder="New York"
                            value={profileCity}
                            onChange={(e) => setProfileCity(e.target.value)}
                            disabled={isSubmitting}
                            className="h-11 border-[#e0e0e0] dark:border-[#444444] focus-visible:ring-[#d4af37] rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state" className="text-sm font-medium text-[#333333] dark:text-[#f5f5f5]">
                            State
                          </Label>
                          <Input
                            id="state"
                            placeholder="NY"
                            value={profileState}
                            onChange={(e) => setProfileState(e.target.value)}
                            disabled={isSubmitting}
                            className="h-11 border-[#e0e0e0] dark:border-[#444444] focus-visible:ring-[#d4af37] rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip" className="text-sm font-medium text-[#333333] dark:text-[#f5f5f5]">
                            ZIP Code
                          </Label>
                          <Input
                            id="zip"
                            placeholder="10001"
                            value={profileZip}
                            onChange={(e) => setProfileZip(e.target.value)}
                            disabled={isSubmitting}
                            className="h-11 border-[#e0e0e0] dark:border-[#444444] focus-visible:ring-[#d4af37] rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="bg-[#d4af37] hover:bg-[#b8860b] text-white px-8 py-2 rounded-lg font-medium"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-serif italic font-bold text-[#333333] dark:text-[#f5f5f5] mb-2 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Account Security</h3>
                      <p className="text-sm text-[#777777] dark:text-[#aaaaaa]">Manage your account security settings</p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">Google Account Security</h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            Your account is secured through Google OAuth. Password changes should be made through your Google account settings.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-[#e0e0e0] dark:border-[#444444] rounded-lg">
                        <div>
                          <h4 className="font-medium text-[#333333] dark:text-[#f5f5f5]">Two-Factor Authentication</h4>
                          <p className="text-sm text-[#777777] dark:text-[#aaaaaa]">Managed through your Google account</p>
                        </div>
                        <div className="text-green-600 dark:text-green-400 text-sm font-medium">Active</div>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-[#e0e0e0] dark:border-[#444444] rounded-lg">
                        <div>
                          <h4 className="font-medium text-[#333333] dark:text-[#f5f5f5]">Login Activity</h4>
                          <p className="text-sm text-[#777777] dark:text-[#aaaaaa]">Last login: Today</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-white">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="orders" className="p-0 sm:p-6 pb-12">
                  <div className="space-y-6">
                    <div className="px-6 sm:px-0">
                      <h3 className="text-xl font-serif italic font-bold text-[#333333] dark:text-[#f5f5f5] mb-2 flex items-center gap-2 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                        <Package className="w-6 h-6 text-[#d4af37]" />
                        My Orders
                      </h3>
                      <p className="text-sm text-[#777777] dark:text-[#aaaaaa]">View and track all your jewelry purchases</p>
                    </div>

                    <div className="bg-gray-50/50 dark:bg-[#1e1e1e]/50 rounded-2xl border border-[#e0e0e0] dark:border-[#333333] overflow-hidden min-h-[400px]">
                      {loadingOrders ? (
                        <div className="py-20 text-center flex flex-col items-center justify-center">
                          <LogoLoader />
                          <p className="mt-4 text-sm text-gray-500 animate-pulse">Fetching your orders...</p>
                        </div>
                      ) : activeOrder ? (
                        /* Detailed Order View (The "Bill") */
                        <div className="animate-in fade-in slide-in-from-right duration-300">
                          <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] flex items-center justify-between sticky top-0 z-10">
                            <Button 
                              variant="ghost" 
                              onClick={() => setActiveOrder(null)}
                              className="text-[#d4af37] hover:bg-[#d4af37]/10"
                            >
                              <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                              Back to List
                            </Button>
                            <span className="text-xs font-mono text-gray-400">ORDER #{activeOrder._id.slice(-8)}</span>
                          </div>
                          
                          <div className="p-6 space-y-8">
                            {/* Status Header */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-100 dark:border-gray-800 pb-8">
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Date</p>
                                <p className="font-semibold">{new Date(activeOrder.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Status</p>
                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                  activeOrder.orderStatus === 'delivered' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                                }`}>
                                  {activeOrder.orderStatus}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Total Amount</p>
                                <p className="text-xl font-black text-[#d4af37]">${activeOrder.total.toFixed(2)}</p>
                              </div>
                            </div>

                            {/* Items List */}
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400">Order Summary</h4>
                              {activeOrder.items.map((item: any, i: number) => (
                                <div key={i} className="flex items-center gap-4 py-2 border-b border-gray-50 dark:border-gray-900/50 last:border-0">
                                  <div className="w-16 h-16 bg-gray-100 dark:bg-[#2d2d2d] rounded-xl overflow-hidden flex-shrink-0">
                                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">{item.name}</h5>
                                    <div className="flex flex-wrap gap-1 mb-1">
                                      {item.selectedVariations && Object.entries(item.selectedVariations).map(([key, value]) => (
                                        <span key={key} className="text-[10px] text-gray-400">
                                          {key}: {value as string}{" "}
                                        </span>
                                      ))}
                                    </div>
                                    <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-sm">${(item.quantity * item.price).toFixed(2)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Billing & Payment */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                              <div className="p-4 bg-white dark:bg-[#252525] rounded-2xl border border-gray-100 dark:border-gray-800">
                                <h4 className="text-xs font-bold uppercase text-gray-400 mb-3 flex items-center gap-2">
                                  <User className="w-3 h-3" /> Shipping Details
                                </h4>
                                <div className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                                  <p className="font-bold text-gray-900 dark:text-gray-100">{activeOrder.customer.firstName} {activeOrder.customer.lastName}</p>
                                  <p>{activeOrder.customer.address}</p>
                                  <p>{activeOrder.customer.city}, {activeOrder.customer.zipCode}</p>
                                  <p>Ph: {activeOrder.customer.phone}</p>
                                </div>
                              </div>
                              <div className="p-4 bg-white dark:bg-[#252525] rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
                                <h4 className="text-xs font-bold uppercase text-gray-400 mb-3 flex items-center gap-2">
                                  <Clock className="w-3 h-3" /> Cost Breakdown
                                </h4>
                                <div className="text-xs space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span>${activeOrder.subtotal?.toFixed(2) || activeOrder.total.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Shipping</span>
                                    <span>${activeOrder.shipping?.toFixed(2) || '0.00'}</span>
                                  </div>
                                  <div className="border-t border-gray-50 dark:border-gray-800 pt-2 flex justify-between font-black text-[#d4af37] text-lg">
                                    <span>TOTAL</span>
                                    <span>${activeOrder.total.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {activeOrder.paymentScreenshot && (
                              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-3">Proof of Payment</p>
                                  <div className="flex flex-col gap-4">
                                    <div 
                                      onClick={() => {
                                        setPreviewImage(activeOrder.paymentScreenshot)
                                        setIsPreviewOpen(true)
                                      }}
                                      className="block relative aspect-video w-full max-w-md mx-auto rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-[#f8f4e8] group cursor-pointer"
                                    >
                                      <img src={activeOrder.paymentScreenshot} alt="Payment proof" className="w-full h-full object-contain" />
                                      <div className="absolute inset-0 bg-[#d4af37]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="bg-white/90 px-4 py-2 rounded-full text-xs font-bold text-[#d4af37] shadow-xl">VIEW FULL SCREEN</span>
                                      </div>
                                    </div>

                                    {activeOrder.paymentStatus === 'rejected' && (
                                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 p-4 rounded-xl">
                                        <p className="text-red-600 dark:text-red-400 text-sm font-bold mb-3 flex items-center gap-2">
                                          <AlertCircle className="w-4 h-4" /> Payment Proof Rejected
                                        </p>
                                        <div className="flex items-center gap-4">
                                          <input 
                                            type="file" 
                                            id="resubmit-payment" 
                                            className="hidden" 
                                            onChange={async (e) => {
                                              const file = e.target.files?.[0]
                                              if (!file) return
                                              
                                              const toastId = toast.loading("Uploading new proof...")
                                              const formData = new FormData()
                                              formData.append('file', file)
                                              formData.append('folder', 'sara-jewelers/payments')

                                              try {
                                                const result = await uploadFileAction(formData)
                                                if (!result.success) throw new Error(result.error || "Upload failed")
                                                const { url } = result
                                                
                                                const res = await fetch(`/api/orders/${activeOrder._id}/payment`, {
                                                  method: 'PATCH',
                                                  headers: { 'Content-Type': 'application/json' },
                                                  body: JSON.stringify({ paymentScreenshot: url })
                                                })

                                                if (res.ok) {
                                                  toast.success("Payment re-submitted!")
                                                  // Refresh orders
                                                  const ordersRes = await fetch('/api/orders')
                                                  const data = await ordersRes.json()
                                                  setOrders(Array.isArray(data) ? data : [])
                                                  setActiveOrder(null)
                                                } else {
                                                  toast.error("Failed to re-submit")
                                                }
                                              } catch (err) {
                                                toast.error("Error occurred", { id: toastId })
                                              }
                                            }}
                                          />
                                          <label 
                                            htmlFor="resubmit-payment"
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-colors"
                                          >
                                            RE-SUBMIT PROOF
                                          </label>
                                          <span className="text-xs text-gray-500">Pick a new screenshot</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : orders.length === 0 ? (
                        <div className="text-center py-20 px-6">
                          <Package className="w-16 h-16 text-gray-200 dark:text-gray-800 mx-auto mb-6" />
                          <h4 className="text-xl font-serif italic font-bold text-gray-900 dark:text-gray-100 mb-3 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Awaiting Your First Order</h4>
                          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">Discover our exquisite collection and find your next timeless piece.</p>
                          <Button 
                            onClick={() => router.push('/shop')}
                            className="bg-[#d4af37] hover:bg-[#b8860b] text-white rounded-xl px-10 h-12 shadow-lg hover:shadow-[#d4af37]/20 transition-all font-bold"
                          >
                            EXPLORE COLLECTION
                          </Button>
                        </div>
                      ) : (
                        /* Orders List */
                        <div className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#1a1a1a]">
                          {orders.map((order) => (
                            <div 
                              key={order._id}
                              className="group p-6 hover:bg-[#f8f4e8]/30 dark:hover:bg-[#d4af37]/5 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                              onClick={() => setActiveOrder(order)}
                            >
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="p-3 bg-gray-50 dark:bg-[#252525] rounded-xl text-gray-400 group-hover:text-[#d4af37] group-hover:bg-[#d4af37]/10 transition-colors">
                                  <FileText className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-mono text-gray-400">#{order._id.slice(-8)}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                      order.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                    }`}>
                                      {order.orderStatus}
                                    </span>
                                    {order.paymentStatus && (
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                        order.paymentStatus === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                                        order.paymentStatus === 'rejected' ? 'bg-red-50 text-red-600' : 
                                        'bg-gray-100 text-gray-500'
                                      }`}>
                                        Pay: {order.paymentStatus}
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate">
                                    {order.items.length} {order.items.length === 1 ? 'Product' : 'Products'} Purchased
                                  </h4>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-6 justify-between md:justify-end">
                                <div className="text-right">
                                  <p className="text-lg font-black text-[#d4af37] group-hover:scale-105 transition-transform origin-right">
                                    ${order.total.toFixed(2)}
                                  </p>
                                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">Total Bill</p>
                                </div>
                                <div className="p-2 border border-gray-100 dark:border-gray-800 rounded-lg group-hover:border-[#d4af37] transition-colors">
                                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#d4af37] transition-colors" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Wishlist Tab Content */}
                <TabsContent value="wishlist" className="p-0 animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-serif italic font-bold text-[#333333] dark:text-[#f5f5f5]" style={{ fontFamily: 'var(--font-serif)' }}>
                        Saved Items
                      </h3>
                      {wishlistItems.length > 0 && (
                        <Button 
                          variant="ghost" 
                          onClick={clearWishlist}
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Clear All
                        </Button>
                      )}
                    </div>

                    {wishlistItems.length > 0 ? (
                      <div className="space-y-4">
                        {wishlistItems.map((item) => (
                          <div key={item.id} className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/30 transition-all group relative">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <NextImage src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                              <Link href={`/products/${item.slug || item.id}`}>
                                <h4 className="font-bold text-gray-900 dark:text-white hover:text-[#d4af37] transition-colors">
                                  {item.name}
                                </h4>
                              </Link>
                              <p className="text-[#d4af37] font-bold">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => moveWishlistToCart(item)}
                                className="bg-[#d4af37] hover:bg-[#b8860b] text-white rounded-full"
                              >
                                <ShoppingCart size={16} className="mr-2" />
                                Add to Cart
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => removeWishlistItem(item.id)}
                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-gray-50/50 dark:bg-black/20 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                        <div className="w-16 h-16 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Heart size={32} className="text-[#d4af37]" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h4>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Explore our collections and save your favorites here.</p>
                        <Link href="/categories">
                          <Button className="bg-[#d4af37] hover:bg-[#b8860b] text-white rounded-full px-8">
                            Start Shopping
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Payment Proof Preview</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[80vh] flex items-center justify-center">
            <img 
              src={previewImage} 
              alt="Payment Screenshot" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

