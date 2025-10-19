"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import LogoLoader from "@/components/ui/logo-loader"

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [checkoutStep, setCheckoutStep] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    // Get cart items from localStorage
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }
    setIsLoading(false)
  }, [])

  const updateQuantity = (id: number, size: string | undefined, color: string | undefined, newQuantity: number) => {
    if (newQuantity < 1) return

    const updatedCart = cartItems.map((item) => {
      if (item.id === id && item.selectedSize === size && item.selectedColor === color) {
        return { ...item, quantity: newQuantity }
      }
      return item
    })

    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const removeItem = (id: number, size: string | undefined, color: string | undefined) => {
    const updatedCart = cartItems.filter(
      (item) => !(item.id === id && item.selectedSize === size && item.selectedColor === color),
    )

    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    window.dispatchEvent(new Event("cartUpdated"))

    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
      duration: 3000,
    })
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem("cart")
    window.dispatchEvent(new Event("cartUpdated"))

    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
      duration: 3000,
    })
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const subtotal = calculateSubtotal()
  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal + shipping

  const nextStep = () => {
    setCheckoutStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setCheckoutStep((prev) => prev - 1)
  }

  const completeOrder = () => {
    toast({
      title: "Order placed successfully!",
      description: "Thank you for your purchase. Your order has been placed.",
      duration: 5000,
    })

    // Clear cart after successful order
    clearCart()

    // Reset checkout step
    setCheckoutStep(0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
        <LogoLoader />
      </div>
    )
  }

  const renderCheckoutStep = () => {
    switch (checkoutStep) {
      case 1: // Shipping information
        return (
          <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm p-6">


            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#555555] dark:text-[#cccccc] mb-1">
                    First Name
                  </label>
                  <Input className="w-full" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] dark:text-[#cccccc] mb-1">Last Name</label>
                  <Input className="w-full" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#555555] dark:text-[#cccccc] mb-1">Email</label>
                <Input className="w-full" type="email" placeholder="john.doe@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#555555] dark:text-[#cccccc] mb-1">Phone</label>
                <Input className="w-full" type="tel" placeholder="+1 (123) 456-7890" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#555555] dark:text-[#cccccc] mb-1">Address</label>
                <Input className="w-full" placeholder="123 Main St" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#555555] dark:text-[#cccccc] mb-1">City</label>
                  <Input className="w-full" placeholder="New York" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] dark:text-[#cccccc] mb-1">Zip Code</label>
                  <Input className="w-full" placeholder="10001" />
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
          <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm p-6">


            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#555555] dark:text-[#cccccc] mb-1">Card Number</label>
                <Input className="w-full" placeholder="1234 5678 9012 3456" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#555555] dark:text-[#cccccc] mb-1">
                    Expiration Date
                  </label>
                  <Input className="w-full" placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] dark:text-[#cccccc] mb-1">CVV</label>
                  <Input className="w-full" placeholder="123" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#555555] dark:text-[#cccccc] mb-1">
                  Name on Card
                </label>
                <Input className="w-full" placeholder="John Doe" />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-[#333333] dark:text-[#f5f5f5] mb-2">Order Summary</h3>
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
          <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm p-6">


            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-[#333333] dark:text-[#f5f5f5] mb-2">Shipping Information</h3>
                <p className="text-[#555555] dark:text-[#cccccc]">John Doe</p>
                <p className="text-[#555555] dark:text-[#cccccc]">123 Main St</p>
                <p className="text-[#555555] dark:text-[#cccccc]">New York, NY 10001</p>
                <p className="text-[#555555] dark:text-[#cccccc]">john.doe@example.com</p>
                <p className="text-[#555555] dark:text-[#cccccc]">+1 (123) 456-7890</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-[#333333] dark:text-[#f5f5f5] mb-2">Payment Method</h3>
                <p className="text-[#555555] dark:text-[#cccccc]">Credit Card ending in 3456</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-[#333333] dark:text-[#f5f5f5] mb-2">Order Items</h3>
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div
                      key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                      className="flex items-center"
                    >
                      <div className="relative size-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="ms-4 flex-1">
                        <h4 className="font-medium text-[#333333] dark:text-[#f5f5f5]">{item.name}</h4>
                        <div className="flex justify-between">
                          <div>
                            {item.selectedSize && (
                              <p className="text-xs text-[#777777] dark:text-[#aaaaaa]">Size: {item.selectedSize}</p>
                            )}
                            {item.selectedColor && (
                              <p className="text-xs text-[#777777] dark:text-[#aaaaaa]">Color: {item.selectedColor}</p>
                            )}
                            <p className="text-xs text-[#777777] dark:text-[#aaaaaa]">Qty: {item.quantity}</p>
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
                <h3 className="font-semibold text-[#333333] dark:text-[#f5f5f5] mb-2">Order Summary</h3>
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
              <Button className="bg-[#d4af37] hover:bg-[#b8860b] text-white" onClick={completeOrder}>
                Place Order
              </Button>
            </div>
          </div>
        )

      default: // Cart (step 0)
        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[#333333] dark:text-[#f5f5f5]">Shopping Cart</h2>
                    {cartItems.length > 0 && (
                      <Button
                        variant="outline"
                        onClick={clearCart}
                        className="text-[#e53935] border-[#e53935] hover:bg-[#ffebee] dark:text-[#ff8a85] dark:border-[#ff8a85] dark:hover:bg-[#3d2726]"
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
                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`} className="mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="col-span-6 flex items-center">
                          <div className="relative size-20 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ms-4">
                            <Link href={`/products/${item.id}`}>
                              <h3 className="font-medium text-[#333333] dark:text-[#f5f5f5] hover:text-[#d4af37] dark:hover:text-[#d4af37]">
                                {item.name}
                              </h3>
                            </Link>
                            {item.selectedSize && (
                              <p className="text-sm text-[#777777] dark:text-[#aaaaaa] mt-1">
                                Size: {item.selectedSize}
                              </p>
                            )}
                            {item.selectedColor && (
                              <p className="text-sm text-[#777777] dark:text-[#aaaaaa] mt-1">
                                Color: {item.selectedColor}
                              </p>
                            )}
                            <button
                              onClick={() => removeItem(item.id, item.selectedSize, item.selectedColor)}
                              className="flex items-center text-[#e53935] dark:text-[#ff8a85] text-sm mt-2 hover:underline"
                            >
                              <Trash2 size={14} className="me-1" />
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="col-span-2 text-center">
                          <span className="md:hidden text-[#777777] dark:text-[#aaaaaa] mr-2">Price:</span>
                          <span className="text-[#333333] dark:text-[#f5f5f5]">${item.price.toFixed(2)}</span>
                        </div>

                        <div className="col-span-2 flex justify-center">
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)
                              }
                              className="p-1 border border-[#e0e0e0] dark:border-[#444444] bg-white dark:bg-[#333333] text-[#333333] dark:text-[#f5f5f5] rounded-s-md hover:bg-[#f5f5f5] dark:hover:bg-[#444444]"
                            >
                              <Minus size={14} />
                            </button>
                            <div className="px-3 py-1 border-t border-b border-[#e0e0e0] dark:border-[#444444] bg-white dark:bg-[#333333] text-[#333333] dark:text-[#f5f5f5] text-center min-w-[40px]">
                              {item.quantity}
                            </div>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)
                              }
                              className="p-1 border border-[#e0e0e0] dark:border-[#444444] bg-white dark:bg-[#333333] text-[#333333] dark:text-[#f5f5f5] rounded-e-md hover:bg-[#f5f5f5] dark:hover:bg-[#444444]"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="col-span-2 text-right">
                          <span className="md:hidden text-[#777777] dark:text-[#aaaaaa] mr-2">Total:</span>
                          <span className="font-medium text-[#333333] dark:text-[#f5f5f5]">
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
                  <h2 className="text-xl font-bold text-[#333333] dark:text-[#f5f5f5] mb-6">Order Summary</h2>

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
          </>
        )
    }
  }

  return (
    <div>
      {/* Hero Section */}
      {checkoutStep === 0 && (
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
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
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

            {renderCheckoutStep()}
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

