"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag, Loader2, Upload, CheckCircle2, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import LogoLoader from "@/components/ui/logo-loader"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { uploadFileAction } from "@/app/actions/media-actions"

interface CartItem {
  id: string
  name: string
  price: number
  image?: string
  slug: string
  quantity: number
}

export default function CartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [checkoutStep, setCheckoutStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [paymentScreenshot, setPaymentScreenshot] = useState("")
  const [shippingSettings, setShippingSettings] = useState({ standardShippingFee: 15, freeShippingThreshold: 500 })

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: ""
  })

  useEffect(() => {
    if (session?.user) {
      const names = session.user.name?.split(" ") || ["", ""]
      setShippingInfo(prev => ({
        ...prev,
        firstName: names[0] || "",
        lastName: names.slice(1).join(" ") || "",
        email: session.user?.email || ""
      }))

      const fetchProfile = async () => {
        try {
          const res = await fetch('/api/user/profile')
          if (res.ok) {
            const { user } = await res.json()
            setShippingInfo(prev => ({
              ...prev,
              phone: user.phone || prev.phone,
              address: user.address || prev.address,
              city: user.city || prev.city,
              zipCode: user.zipCode || prev.zipCode
            }))
          }
        } catch (err) {
          console.error("Auto-fill fetch failed", err)
        }
      }
      fetchProfile()
    }
  }, [session])

  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart)
        // Make it simple like wishlist, no strict Zod validation
        // But ensures essentials like slug and id exist for current session
        const correctedCart = parsedCart.map((item: any) => ({
          ...item,
          slug: item.slug || item.id // Fallback for old data
        }))
        setCartItems(correctedCart)
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
        setCartItems([])
      }
    }
    
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings')
        if (res.ok) {
          const data = await res.json()
          setShippingSettings(data)
        }
      } catch (err) {
        console.error("Failed to fetch shipping settings", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: newQuantity }
      }
      return item
    })

    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id)

    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    window.dispatchEvent(new Event("cartUpdated"))

    toast.success("Item removed", {
      description: "The item has been removed from your cart",
      duration: 3000,
    })
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem("cart")
    window.dispatchEvent(new Event("cartUpdated"))

    toast.success("Cart cleared", {
      description: "All items have been removed from your cart",
      duration: 3000,
    })
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0)
  }

  const subtotal = calculateSubtotal()
  const shipping = subtotal >= shippingSettings.freeShippingThreshold && shippingSettings.freeShippingThreshold > 0 ? 0 : shippingSettings.standardShippingFee
  const total = subtotal + shipping

  const nextStep = () => {
    // Validate Shipping Step
    if (checkoutStep === 1) {
      const { firstName, lastName, email, phone, address, city, zipCode } = shippingInfo
      if (!firstName || !lastName || !email || !phone || !address || !city || !zipCode) {
        toast.error("Please fill in all shipping details", {
          description: "All fields are required to proceed."
        })
        return
      }
    }

    if (checkoutStep === 2 && !paymentScreenshot) {
      toast.error("Please upload the transaction screenshot first", {
        description: "You must provide proof of payment before reviewing your order."
      })
      return
    }
    setCheckoutStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setCheckoutStep((prev) => prev - 1)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const uploadData = new FormData()
    uploadData.append('file', file)
    uploadData.append('folder', 'sara-jewelers/payments')

    try {
      const result = await uploadFileAction(uploadData)

      if (result.success && result.url) {
        setPaymentScreenshot(result.url)
        toast.success("Transaction screenshot uploaded")
      } else {
        toast.error("Upload failed", {
          description: result.error || "Check image size and format"
        })
      }
    } catch (error) {
      toast.error("Error uploading image")
    } finally {
      setUploading(false)
    }
  }

  const completeOrder = async () => {
    if (!paymentScreenshot) {
      toast.error("Please upload the transaction screenshot")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: shippingInfo,
          items: cartItems,
          subtotal,
          shipping,
          total,
          paymentScreenshot
        })
      })

      if (response.ok) {
        toast.success("Order placed successfully!", {
          description: "Thank you for your purchase. Your order is pending admin approval.",
          duration: 5000,
        })
        clearCart()
        setCheckoutStep(0)
        setPaymentScreenshot("")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to place order")
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F6F1E8] dark:bg-[#1a1a1a]">
        <LogoLoader />
      </div>
    )
  }

  const renderCheckoutStep = () => {
    switch (checkoutStep) {
      case 1: // Shipping information
        return (
          <div className="max-w-4xl mx-auto bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm p-4 md:p-8 border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl md:text-2xl font-serif italic font-bold text-[#333333] dark:text-[#f5f5f5] mb-6 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Shipping Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#555555] dark:text-[#cccccc] mb-1.5">
                    First Name
                  </label>
                  <Input 
                    className="w-full h-11" 
                    placeholder="John" 
                    value={shippingInfo.firstName}
                    onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] dark:text-[#cccccc] mb-1.5">Last Name</label>
                  <Input 
                    className="w-full h-11" 
                    placeholder="Doe" 
                    value={shippingInfo.lastName}
                    onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#555555] dark:text-[#cccccc] mb-1">Email</label>
                <Input 
                  className="w-full" 
                  type="email" 
                  placeholder="john.doe@example.com" 
                  value={shippingInfo.email}
                  onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#555555] dark:text-[#cccccc] mb-1">Phone</label>
                <Input 
                  className="w-full" 
                  type="tel" 
                  placeholder="+1 (123) 456-7890" 
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#555555] dark:text-[#cccccc] mb-1">Address</label>
                <Input 
                  className="w-full" 
                  placeholder="123 Main St" 
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#555555] dark:text-[#cccccc] mb-1.5">City</label>
                  <Input 
                    className="w-full h-11" 
                    placeholder="New York" 
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] dark:text-[#cccccc] mb-1.5">Zip Code</label>
                  <Input 
                    className="w-full h-11" 
                    placeholder="10001" 
                    value={shippingInfo.zipCode}
                    onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={prevStep}>
                Back to Cart
              </Button>
              <Button className="bg-[#d4af37] hover:bg-[#b8860b] text-white" onClick={nextStep}>
                Continue to Payment
              </Button>
            </div>
          </div>
        )

      case 2: // Payment information
        return (
          <div className="max-w-4xl mx-auto bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm p-4 md:p-8 border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl md:text-2xl font-serif italic font-bold text-[#333333] dark:text-[#f5f5f5] mb-6 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Payment</h2>
            <div className="space-y-6">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <h3 className="text-amber-800 dark:text-amber-400 font-bold mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" /> Bank Transfer Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-amber-200/50 pb-1">
                    <span className="text-amber-700/70 dark:text-amber-500/70">Account Name:</span>
                    <span className="font-semibold text-amber-900 dark:text-amber-200">S&W Collections LLC</span>
                  </div>
                  <div className="flex justify-between border-b border-amber-200/50 pb-1">
                    <span className="text-amber-700/70 dark:text-amber-500/70">Bank Name:</span>
                    <span className="font-semibold text-amber-900 dark:text-amber-200">Wells Fargo Bank, N.A.</span>
                  </div>
                  <div className="flex justify-between border-b border-amber-200/50 pb-1">
                    <span className="text-amber-700/70 dark:text-amber-500/70">Routing Number:</span>
                    <span className="font-mono font-semibold text-amber-900 dark:text-amber-200">021200025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700/70 dark:text-amber-500/70">Account Number:</span>
                    <span className="font-mono font-semibold text-amber-900 dark:text-amber-200">2386522169</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-amber-200 dark:border-amber-800/50">
                  <p className="text-xs text-amber-800/80 dark:text-amber-400/80 italic">
                    Bank Address: 4403 E Black Horse Pike, K225 Mays Landing, NJ 08330, USA
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                  Transaction Screenshot <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <Input 
                    type="file" 
                    id="ss-upload" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  <label 
                    htmlFor="ss-upload"
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all ${paymentScreenshot ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : 'border-[#d4af37]/30 hover:border-[#d4af37] bg-gray-50 dark:bg-gray-900/20'}`}
                  >
                    {uploading ? (
                      <Loader2 className="w-10 h-10 text-[#d4af37] animate-spin" />
                    ) : paymentScreenshot ? (
                      <>
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Screenshot Uploaded!</span>
                        <p className="text-xs text-gray-500 mt-1">Click to change</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-[#d4af37] mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Upload Payment Screenshot</span>
                        <p className="text-xs text-gray-500 mt-1">Please upload the transaction receipt</p>
                      </>
                    )}
                  </label>
                </div>
                {paymentScreenshot && (
                  <div className="mt-4 relative aspect-video rounded-xl overflow-hidden border border-emerald-200 dark:border-emerald-800 shadow-lg">
                    <Image src={paymentScreenshot} alt="Transaction SS" fill className="object-contain bg-black/5" />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-serif italic font-bold text-[#333333] dark:text-[#f5f5f5] mb-2 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#555555] dark:text-[#cccccc]">Subtotal</span>
                  <span className="text-[#333333] dark:text-[#f5f5f5]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#555555] dark:text-[#cccccc]">Shipping</span>
                  <span className="text-[#333333] dark:text-[#f5f5f5]">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span className="text-[#333333] dark:text-[#f5f5f5]">Total</span>
                  <span className="text-[#d4af37] dark:text-[#d4af37]">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={prevStep}>
                Back to Shipping
              </Button>
              <Button className="bg-[#d4af37] hover:bg-[#b8860b] text-white" onClick={nextStep}>
                Review Order
              </Button>
            </div>
          </div>
        )

      case 3: // Order review
        return (
          <div className="max-w-4xl mx-auto bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm p-4 md:p-8 border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl md:text-2xl font-serif italic font-bold text-[#333333] dark:text-[#f5f5f5] mb-6 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Review Your Order</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-serif italic font-bold text-[#333333] dark:text-[#f5f5f5] mb-2 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Shipping Information</h3>
                <p className="text-[#555555] dark:text-[#cccccc]">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                <p className="text-[#555555] dark:text-[#cccccc]">{shippingInfo.address}</p>
                <p className="text-[#555555] dark:text-[#cccccc]">{shippingInfo.city}, {shippingInfo.zipCode}</p>
                <p className="text-[#555555] dark:text-[#cccccc]">{shippingInfo.email}</p>
                <p className="text-[#555555] dark:text-[#cccccc]">{shippingInfo.phone}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-serif italic font-bold text-[#333333] dark:text-[#f5f5f5] mb-2 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Payment Method</h3>
                <p className="text-[#555555] dark:text-[#cccccc]">Manual Bank Transfer</p>
                {paymentScreenshot && (
                  <p className="text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-4 h-4" /> Screenshot provided
                  </p>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="font-serif italic font-bold text-[#333333] dark:text-[#f5f5f5] mb-2 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Order Items</h3>
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-center"
                    >
                      <div className="relative size-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="ms-4 flex-1">
                        <h4 className="font-medium text-[#333333] dark:text-[#f5f5f5]">{item.name}</h4>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs text-[#777777] dark:text-[#aaaaaa] mt-1">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium text-[#333333] dark:text-[#f5f5f5]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-serif italic font-bold text-[#333333] dark:text-[#f5f5f5] mb-2 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#555555] dark:text-[#cccccc]">Subtotal</span>
                    <span className="text-[#333333] dark:text-[#f5f5f5]">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555555] dark:text-[#cccccc]">Shipping</span>
                    <span className="text-[#333333] dark:text-[#f5f5f5]">
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span className="text-[#333333] dark:text-[#f5f5f5]">Total</span>
                    <span className="text-[#d4af37] dark:text-[#d4af37]">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={prevStep}>
                Back to Payment
              </Button>
              <Button className="bg-[#d4af37] hover:bg-[#b8860b] text-white" onClick={completeOrder} disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Placing Order...</> : 'Place Order'}
              </Button>
            </div>
          </div>
        )

      default: // Cart (step 0)
        return (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm p-4 md:p-6 border border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-xl md:text-2xl font-serif italic font-bold text-[#333333] dark:text-[#f5f5f5] tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Shopping Cart</h2>
                    {cartItems.length > 0 && (
                      <Button
                        variant="outline"
                        onClick={clearCart}
                        size="sm"
                        className="w-full sm:w-auto text-[#e53935] border-[#e53935] hover:bg-[#ffebee] dark:text-[#ff8a85] dark:border-[#ff8a85] dark:hover:bg-[#3d2726] transition-colors"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Clear Cart
                      </Button>
                    )}
                  </div>

                  <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-[#777777] dark:text-[#aaaaaa] text-sm font-medium">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>

                  <Separator className="mb-6 hidden md:block" />

                    {cartItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="group">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center">
                        <div className="col-span-1 md:col-span-6 flex items-center">
                          <Link href={`/products/${item.slug}`} className="relative size-24 md:size-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </Link>
                          <div className="ms-4 flex-1">
                            <Link href={`/products/${item.slug}`}>
                             <h3 className="text-lg md:text-base font-serif italic font-bold text-[#333333] dark:text-[#f5f5f5] hover:text-[#d4af37] dark:hover:text-[#f4d03f] tracking-tight transition-colors" style={{ fontFamily: 'var(--font-serif)' }}>
                                {item.name}
                              </h3>
                            </Link>
                            <div className="md:hidden mt-1 text-sm font-bold text-[#d4af37] dark:text-[#f4d03f]">
                              ${item.price.toFixed(2)}
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="flex items-center text-[#e53935] dark:text-[#ff8a85] text-xs mt-2 hover:underline transition-all"
                            >
                              <Trash2 size={14} className="me-1" />
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="hidden md:block md:col-span-2 text-center text-gray-900 dark:text-gray-100 font-medium">
                          ${item.price.toFixed(2)}
                        </div>

                        <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center">
                          <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 rounded-lg p-1 border border-gray-100 dark:border-gray-800">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-1.5 hover:bg-[#d4af37] hover:text-white dark:text-gray-400 dark:hover:text-white rounded-md transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <div className="px-4 font-bold text-[#333333] dark:text-[#f5f5f5] text-center min-w-[32px]">
                              {item.quantity}
                            </div>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-1.5 hover:bg-[#d4af37] hover:text-white dark:text-gray-400 dark:hover:text-white rounded-md transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 text-right">
                          <span className="md:hidden text-[#777777] dark:text-[#aaaaaa] text-sm mr-2 font-medium tracking-tight">Total:</span>
                          <span className="text-lg md:text-base font-bold text-[#d4af37] dark:text-[#f4d03f]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {index < cartItems.length - 1 && <Separator className="my-6" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-serif italic font-bold text-[#333333] dark:text-[#f5f5f5] mb-6 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-[#555555] dark:text-[#cccccc]">Subtotal</span>
                      <span className="text-[#333333] dark:text-[#f5f5f5]">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#555555] dark:text-[#cccccc]">Shipping</span>
                      <span className="text-[#333333] dark:text-[#f5f5f5]">
                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span className="text-[#333333] dark:text-[#f5f5f5]">Total</span>
                      <span className="text-[#d4af37] dark:text-[#d4af37]">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-[#d4af37] hover:bg-[#b8860b] text-white"
                    onClick={nextStep}
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </Button>

                  <div className="mt-6 text-sm text-[#777777] dark:text-[#aaaaaa] text-center">
                    <p className="mb-2">We accept:</p>
                    <div className="flex justify-center space-x-2 mt-2">
                      <div className="size-10 h-6 bg-[#f5f5f5] dark:bg-[#333333] rounded flex items-center justify-center">
                        <svg viewBox="0 0 38 24" width="38" height="24" role="img" aria-labelledby="pi-visa">
                          <title id="pi-visa">Visa</title>
                          <path
                            opacity=".07"
                            d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                          ></path>
                          <path
                            fill="#fff"
                            d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                          ></path>
                          <path
                            d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z"
                            fill="#142688"
                          ></path>
                        </svg>
                      </div>
                      <div className="size-10 h-6 bg-[#f5f5f5] dark:bg-[#333333] rounded flex items-center justify-center">
                        <svg viewBox="0 0 38 24" width="38" height="24" role="img" aria-labelledby="pi-master">
                          <title id="pi-master">Mastercard</title>
                          <path
                            opacity=".07"
                            d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                          ></path>
                          <path
                            fill="#fff"
                            d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                          ></path>
                          <circle fill="#EB001B" cx="15" cy="12" r="7"></circle>
                          <circle fill="#F79E1B" cx="23" cy="12" r="7"></circle>
                          <path
                            fill="#FF5F00"
                            d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"
                          ></path>
                        </svg>
                      </div>
                      <div className="size-10 h-6 bg-[#f5f5f5] dark:bg-[#333333] rounded flex items-center justify-center">
                        <svg viewBox="0 0 38 24" width="38" height="24" role="img" aria-labelledby="pi-amex">
                          <title id="pi-amex">American Express</title>
                          <path
                            opacity=".07"
                            d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                          ></path>
                          <path
                            fill="#fff"
                            d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                          ></path>
                          <path
                            d="M20.4 12.5l-2.1-2.1-2.1 2.1 2.1 2.1 2.1-2.1zm4.9-3.2h-7.2l-1.6 1.9-1.6-1.9H3.4v12.4h13l1.6-1.9 1.6 1.9h7.2l-5.3-6 5.3-6.4zm-9.8 4.3l1.4-1.7h4.1l1.4 1.7 1.4-1.7h3.2L24.9 16l-1.7-2h-4.1l-1.7 2-1.7-2h-3.2l-1.7-2 1.7-2h3.2l1.4 1.7zm9.8 2.4h-1.9l-3.5-4.1-3.5 4.1h-7.9v-1.7h7.8l1.4-1.7 1.4 1.7h3.2l1.4-1.7 1.4 1.7h3.2v1.7h-1.9zm0-3.4h-3.2l-1.4-1.7-1.4 1.7h-3.2l-1.4-1.7-1.4 1.7H8.3V9.1h7.9l3.5 4.1 3.5-4.1h1.9v3.5z"
                            fill="#006FCF"
                          ></path>
                        </svg>
                      </div>
                      <div className="size-10 h-6 bg-[#f5f5f5] dark:bg-[#333333] rounded flex items-center justify-center">
                        <svg viewBox="0 0 38 24" width="38" height="24" role="img" aria-labelledby="pi-paypal">
                          <title id="pi-paypal">PayPal</title>
                          <path
                            opacity=".07"
                            d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                          ></path>
                          <path
                            fill="#fff"
                            d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                          ></path>
                          <path
                            fill="#003087"
                            d="M23.9 8.3c.2-1 0-1.7-.6-2.3-.6-.7-1.7-1-3.1-1h-4.1c-.3 0-.5.2-.6.5L14 15.6c0 .2.1.4.3.4H17l.4-3.4 1.8-2.2 4.7-2.1z"
                          ></path>
                          <path
                            fill="#3086C8"
                            d="M23.9 8.3l-.2.2c-.5 2.8-2.2 3.8-4.6 3.8H18c-.3 0-.5.2-.6.5l-.6 3.9-.2 1c0 .2.1.4.3.4H19c.3 0 .5-.2.5-.4v-.1l.4-2.4v-.1c0-.2.3-.4.5-.4h.3c2.1 0 3.7-.8 4.1-3.2.2-1 .1-1.8-.4-2.4-.1-.5-.3-.7-.5-.8z"
                          ></path>
                          <path
                            fill="#012169"
                            d="M23.3 8.1c-.1-.1-.2-.1-.3-.1-.1 0-.2 0-.2-.1-.3-.1-.7-.1-1.1-.1h-3c-.1 0-.2 0-.2.1-.2.1-.3.2-.3.4l-.7 4.4v.1c0-.3.3-.5.6-.5h1.3c2.5 0 4.1-1 4.6-3.8v-.2c-.1-.1-.3-.2-.5-.2h-.1z"
                          ></path>
                        </svg>
                      </div>
                      <div className="size-10 h-6 bg-[#f5f5f5] dark:bg-[#333333] rounded flex items-center justify-center">
                        <svg viewBox="0 0 38 24" width="38" height="24" role="img" aria-labelledby="pi-apple-pay">
                          <title id="pi-apple-pay">Apple Pay</title>
                          <path
                            opacity=".07"
                            d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                          ></path>
                          <path
                            fill="#fff"
                            d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                          ></path>
                          <path
                            d="M30 12.2c0-1.2-.9-1.9-1.8-2.1-.9-.2-1.6.4-2.1.4-.4 0-1.1-.4-1.8-.4-1 0-1.8.6-2.2 1.5-.9 1.5-.2 3.7.6 4.9.4.6.9 1.2 1.6 1.2.6 0 .9-.4 1.6-.4.7 0 1 .4 1.6.4.7 0 1.2-.6 1.6-1.2.3-.4.6-1 .8-1.6-.8-.5-1.3-1.2-1.3-2.2 0-.9.6-1.7 1.4-2.1zm-1.7-4c.5-.6 1-1.6.8-2.5-.8.1-1.6.5-2.2 1.1-.5.5-.9 1.3-.8 2.2.9 0 1.7-.4 2.2-.8z"
                            fill="#000"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F1E8] dark:bg-gradient-to-br dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
      {/* Hero Section */}
      {checkoutStep === 0 && (
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
              <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">Shopping Cart</span>
            </nav>

            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
                <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                  Shopping Cart
                </span>
                <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif italic font-bold mb-4 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                  Your Cart
                </span>
              </h1>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-8">
        {cartItems.length > 0 || checkoutStep > 0 ? (
          <>

            {checkoutStep > 0 && (
              <>
                {/* Checkout Hero Section */}
                <section className="py-12 bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a] relative overflow-hidden mb-8">
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
                  </div>
                  
                  <div className="container mx-auto px-4 relative max-w-7xl">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
                        <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                          {checkoutStep === 1 ? 'Shipping Information' : checkoutStep === 2 ? 'Payment Details' : 'Order Review'}
                        </span>
                        <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
                      </div>
                      
                      <h1 className="text-2xl md:text-3xl font-bold mb-8 leading-tight">
                        <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                          {checkoutStep === 1 ? 'Enter Your Details' : checkoutStep === 2 ? 'Secure Payment' : 'Confirm Your Order'}
                        </span>
                      </h1>
                    </div>
                  </div>
                </section>

                {/* Progress Steps */}
                <div className="mb-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center">
                      <div className={`size-10 rounded-full flex items-center justify-center font-semibold ${checkoutStep >= 1 ? "bg-[#d4af37] text-white" : "bg-[#e0e0e0] dark:bg-[#444444] text-[#777777] dark:text-[#aaaaaa]"}`}>
                        1
                      </div>
                      <div className={`w-20 h-1 ${checkoutStep >= 2 ? "bg-[#d4af37]" : "bg-[#e0e0e0] dark:bg-[#444444]"}`}></div>
                      <div className={`size-10 rounded-full flex items-center justify-center font-semibold ${checkoutStep >= 2 ? "bg-[#d4af37] text-white" : "bg-[#e0e0e0] dark:bg-[#444444] text-[#777777] dark:text-[#aaaaaa]"}`}>
                        2
                      </div>
                      <div className={`w-20 h-1 ${checkoutStep >= 3 ? "bg-[#d4af37]" : "bg-[#e0e0e0] dark:bg-[#444444]"}`}></div>
                      <div className={`size-10 rounded-full flex items-center justify-center font-semibold ${checkoutStep >= 3 ? "bg-[#d4af37] text-white" : "bg-[#e0e0e0] dark:bg-[#444444] text-[#777777] dark:text-[#aaaaaa]"}`}>
                        3
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center text-sm">
                    <div className="w-28 text-center">
                      <span className={checkoutStep >= 1 ? "text-[#d4af37] dark:text-[#d4af37] font-medium" : "text-[#777777] dark:text-[#aaaaaa]"}>
                        Shipping
                      </span>
                    </div>
                    <div className="w-20"></div>
                    <div className="w-28 text-center">
                      <span className={checkoutStep >= 2 ? "text-[#d4af37] dark:text-[#d4af37] font-medium" : "text-[#777777] dark:text-[#aaaaaa]"}>
                        Payment
                      </span>
                    </div>
                    <div className="w-20"></div>
                    <div className="w-28 text-center">
                      <span className={checkoutStep >= 3 ? "text-[#d4af37] dark:text-[#d4af37] font-medium" : "text-[#777777] dark:text-[#aaaaaa]"}>
                        Review
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="relative">
              {status === 'unauthenticated' && checkoutStep > 0 && (
                <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-white/60 dark:bg-black/60 backdrop-blur-[2px] border border-gray-100 dark:border-gray-800">
                  <div className="text-center p-8 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl border border-[#d4af37]/20">
                    <LogIn className="w-12 h-12 text-[#d4af37] mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Login Required</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-[250px] mx-auto">
                      Please login to your account to proceed with the checkout.
                    </p>
                    <Button 
                      onClick={() => router.push('/account?callbackUrl=/cart')}
                      className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black font-bold px-8 py-2 rounded-full hover:scale-105 transition-all shadow-lg"
                    >
                      LOG IN NOW
                    </Button>
                  </div>
                </div>
              )}
              {renderCheckoutStep()}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <ShoppingBag size={64} className="text-[#d4af37] dark:text-[#d4af37]" />
            </div>
            <h2 className="text-2xl font-bold text-[#333333] dark:text-[#f5f5f5] mb-2">Your cart is empty</h2>
            <p className="text-[#777777] dark:text-[#aaaaaa] mb-6">
              Looks like you haven't added any jewelry to your cart yet.
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

