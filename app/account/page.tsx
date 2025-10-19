"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { User, Package, Heart, CreditCard, LogOut, Settings, Bell, Lock } from "lucide-react"

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const userLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(userLoggedIn)
    setIsLoading(false)

    if (!userLoggedIn) {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false")
    window.dispatchEvent(new Event("storage"))

    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
      duration: 3000,
    })

    router.push("/")
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully",
      duration: 3000,
    })
  }

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully",
      duration: 3000,
    })
  }

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Notification preferences updated",
      description: "Your notification preferences have been updated successfully",
      duration: 3000,
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading account...</p>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null // Router will redirect
  }

  return (
    <div className="min-h-screen">
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
            <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">My Account</span>
          </nav>

          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                My Account
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Account Settings
              </span>
            </h1>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-[#f8f4e8] dark:bg-[#2d2d2d] flex items-center justify-center">
                  <User size={32} className="text-[#d4af37] dark:text-[#d4af37]" />
                </div>
                <div>
                  <h2 className="font-semibold text-[#333333] dark:text-[#f5f5f5]">John Doe</h2>
                  <p className="text-sm text-[#777777] dark:text-[#aaaaaa]">john.doe@example.com</p>
                </div>
              </div>

              <Separator className="mb-6" />

              <nav className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-[#333333] dark:text-[#f5f5f5] hover:bg-[#f8f4e8] dark:hover:bg-[#2d2d2d] hover:text-[#d4af37] dark:hover:text-[#d4af37]"
                >
                  <User size={18} className="mr-2" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-[#333333] dark:text-[#f5f5f5] hover:bg-[#f8f4e8] dark:hover:bg-[#2d2d2d] hover:text-[#d4af37] dark:hover:text-[#d4af37]"
                >
                  <Package size={18} className="mr-2" />
                  Orders
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-[#333333] dark:text-[#f5f5f5] hover:bg-[#f8f4e8] dark:hover:bg-[#2d2d2d] hover:text-[#d4af37] dark:hover:text-[#d4af37]"
                >
                  <Heart size={18} className="mr-2" />
                  Wishlist
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-[#333333] dark:text-[#f5f5f5] hover:bg-[#f8f4e8] dark:hover:bg-[#2d2d2d] hover:text-[#d4af37] dark:hover:text-[#d4af37]"
                >
                  <CreditCard size={18} className="mr-2" />
                  Payment Methods
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-[#333333] dark:text-[#f5f5f5] hover:bg-[#f8f4e8] dark:hover:bg-[#2d2d2d] hover:text-[#d4af37] dark:hover:text-[#d4af37]"
                >
                  <Settings size={18} className="mr-2" />
                  Account Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-[#e53935] dark:text-[#ff8a85] hover:bg-[#ffebee] dark:hover:bg-[#3d2726] hover:text-[#e53935] dark:hover:text-[#ff8a85]"
                  onClick={handleLogout}
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm p-6">
              <Tabs defaultValue="profile">
                <TabsList className="mb-6">
                  <TabsTrigger
                    value="profile"
                    className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-white dark:data-[state=active]:bg-[#d4af37]"
                  >
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="password"
                    className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-white dark:data-[state=active]:bg-[#d4af37]"
                  >
                    Password
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-white dark:data-[state=active]:bg-[#d4af37]"
                  >
                    Notifications
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#333333] dark:text-[#f5f5f5] mb-4">Profile Information</h2>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name" className="text-[#333333] dark:text-[#f5f5f5]">
                          First Name
                        </Label>
                        <Input
                          id="first-name"
                          defaultValue="John"
                          className="border-[#e0e0e0] dark:border-[#444444] focus-visible:ring-[#d4af37] dark:focus-visible:ring-[#d4af37]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name" className="text-[#333333] dark:text-[#f5f5f5]">
                          Last Name
                        </Label>
                        <Input
                          id="last-name"
                          defaultValue="Doe"
                          className="border-[#e0e0e0] dark:border-[#444444] focus-visible:ring-[#d4af37] dark:focus-visible:ring-[#d4af37]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#333333] dark:text-[#f5f5f5]">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="john.doe@example.com"
                        className="border-[#e0e0e0] dark:border-[#444444] focus-visible:ring-[#d4af37] dark:focus-visible:ring-[#d4af37]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#333333] dark:text-[#f5f5f5]">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        defaultValue="+1 (123) 456-7890"
                        className="border-[#e0e0e0] dark:border-[#444444] focus-visible:ring-[#d4af37] dark:focus-visible:ring-[#d4af37]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-[#333333] dark:text-[#f5f5f5]">
                        Address
                      </Label>
                      <Input
                        id="address"
                        defaultValue="123 Main St"
                        className="border-[#e0e0e0] dark:border-[#444444] focus-visible:ring-[#d4af37] dark:focus-visible:ring-[#d4af37]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-[#333333] dark:text-[#f5f5f5]">
                          City
                        </Label>
                        <Input
                          id="city"
                          defaultValue="New York"
                          className="border-[#e0e0e0] dark:border-[#444444] focus-visible:ring-[#d4af37] dark:focus-visible:ring-[#d4af37]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-[#333333] dark:text-[#f5f5f5]">
                          State
                        </Label>
                        <Input
                          id="state"
                          defaultValue="NY"
                          className="border-[#e0e0e0] dark:border-[#444444] focus-visible:ring-[#d4af37] dark:focus-visible:ring-[#d4af37]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip" className="text-[#333333] dark:text-[#f5f5f5]">
                          Zip Code
                        </Label>
                        <Input
                          id="zip"
                          defaultValue="10001"
                          className="border-[#e0e0e0] dark:border-[#444444] focus-visible:ring-[#d4af37] dark:focus-visible:ring-[#d4af37]"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button type="submit" className="bg-[#d4af37] hover:bg-[#b8860b] text-white">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="password" className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#333333] dark:text-[#f5f5f5] mb-4">Change Password</h2>

                  <form onSubmit={handleSavePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password" className="text-[#333333] dark:text-[#f5f5f5]">
                        Current Password
                      </Label>
                      <Input
                        id="current-password"
                        type="password"
                        className="border-[#e0e0e0] dark:border-[#444444] focus-visible:ring-[#d4af37] dark:focus-visible:ring-[#d4af37]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-[#333333] dark:text-[#f5f5f5]">
                        New Password
                      </Label>
                      <Input
                        id="new-password"
                        type="password"
                        className="border-[#e0e0e0] dark:border-[#444444] focus-visible:ring-[#d4af37] dark:focus-visible:ring-[#d4af37]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-[#333333] dark:text-[#f5f5f5]">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        className="border-[#e0e0e0] dark:border-[#444444] focus-visible:ring-[#d4af37] dark:focus-visible:ring-[#d4af37]"
                      />
                    </div>

                    <div className="pt-4">
                      <Button type="submit" className="bg-[#d4af37] hover:bg-[#b8860b] text-white">
                        <Lock size={16} className="mr-2" />
                        Update Password
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#333333] dark:text-[#f5f5f5] mb-4">
                    Notification Preferences
                  </h2>

                  <form onSubmit={handleSaveNotifications} className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell size={20} className="text-[#d4af37] dark:text-[#d4af37]" />
                          <div>
                            <h3 className="font-medium text-[#333333] dark:text-[#f5f5f5]">Order Updates</h3>
                            <p className="text-sm text-[#777777] dark:text-[#aaaaaa]">
                              Receive notifications about your order status
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="order-email" className="text-sm text-[#777777] dark:text-[#aaaaaa]">
                            Email
                          </Label>
                          <input
                            type="checkbox"
                            id="order-email"
                            defaultChecked
                            className="rounded text-[#d4af37] focus:ring-[#d4af37] dark:text-[#d4af37] dark:focus:ring-[#d4af37]"
                          />

                          <Label htmlFor="order-sms" className="text-sm text-[#777777] dark:text-[#aaaaaa] ml-2">
                            SMS
                          </Label>
                          <input
                            type="checkbox"
                            id="order-sms"
                            defaultChecked
                            className="rounded text-[#d4af37] focus:ring-[#d4af37] dark:text-[#d4af37] dark:focus:ring-[#d4af37]"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell size={20} className="text-[#d4af37] dark:text-[#d4af37]" />
                          <div>
                            <h3 className="font-medium text-[#333333] dark:text-[#f5f5f5]">Promotions & Discounts</h3>
                            <p className="text-sm text-[#777777] dark:text-[#aaaaaa]">
                              Get notified about sales and special offers
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="promo-email" className="text-sm text-[#777777] dark:text-[#aaaaaa]">
                            Email
                          </Label>
                          <input
                            type="checkbox"
                            id="promo-email"
                            defaultChecked
                            className="rounded text-[#d4af37] focus:ring-[#d4af37] dark:text-[#d4af37] dark:focus:ring-[#d4af37]"
                          />

                          <Label htmlFor="promo-sms" className="text-sm text-[#777777] dark:text-[#aaaaaa] ml-2">
                            SMS
                          </Label>
                          <input
                            type="checkbox"
                            id="promo-sms"
                            className="rounded text-[#d4af37] focus:ring-[#d4af37] dark:text-[#d4af37] dark:focus:ring-[#d4af37]"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell size={20} className="text-[#d4af37] dark:text-[#d4af37]" />
                          <div>
                            <h3 className="font-medium text-[#333333] dark:text-[#f5f5f5]">New Arrivals</h3>
                            <p className="text-sm text-[#777777] dark:text-[#aaaaaa]">
                              Be the first to know about new products
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="new-email" className="text-sm text-[#777777] dark:text-[#aaaaaa]">
                            Email
                          </Label>
                          <input
                            type="checkbox"
                            id="new-email"
                            className="rounded text-[#d4af37] focus:ring-[#d4af37] dark:text-[#d4af37] dark:focus:ring-[#d4af37]"
                          />

                          <Label htmlFor="new-sms" className="text-sm text-[#777777] dark:text-[#aaaaaa] ml-2">
                            SMS
                          </Label>
                          <input
                            type="checkbox"
                            id="new-sms"
                            className="rounded text-[#d4af37] focus:ring-[#d4af37] dark:text-[#d4af37] dark:focus:ring-[#d4af37]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button type="submit" className="bg-[#d4af37] hover:bg-[#b8860b] text-white">
                        <Bell size={16} className="mr-2" />
                        Save Preferences
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

