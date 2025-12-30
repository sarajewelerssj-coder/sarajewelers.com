"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Truck, FileText, ChevronRight, Mail, Phone } from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function PoliciesPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("shipping")

  useEffect(() => {
    if (typeof window === "undefined") return

    if (heroRef.current) {
      gsap.set(heroRef.current, { scale: 0.8, opacity: 0 })
      gsap.to(heroRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "back.out(1.7)",
        delay: 0.3
      })
    }

    if (contentRef.current) {
      gsap.set(contentRef.current, { y: 50, opacity: 0 })
      ScrollTrigger.create({
        trigger: contentRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(contentRef.current, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "back.out(1.7)"
        })
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#F6F1E8] dark:bg-gradient-to-br dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
      {/* Hero Section */}
      <div className="relative h-[65vh] min-h-[450px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1470&auto=format&fit=crop"
          alt="Sara Jewelers Policies"
          fill
          className="object-cover scale-110 transition-transform duration-6000 ease-out"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 max-w-7xl">
            <div ref={heroRef} className="backdrop-blur-md bg-white/5 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-[2px] bg-[#d4af37]" />
                <span className="text-[#d4af37] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                  Service & Security
                </span>
                <div className="w-16 h-[2px] bg-[#d4af37]" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-serif italic font-bold text-white mb-6 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                <span className="bg-gradient-to-r from-white via-white to-[#d4af37] bg-clip-text text-transparent">
                  Policies & Information
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Everything you need to know about our <span className="text-[#d4af37] font-semibold">shipping, terms, and privacy</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Policies Tabs */}
      <section className="py-20 bg-transparent relative overflow-hidden">
        <div className="container mx-auto px-4 relative max-w-5xl">
          <div ref={contentRef}>
            <Tabs defaultValue="shipping" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-12 bg-white/50 dark:bg-black/20 p-1 rounded-2xl border border-gray-200 dark:border-gray-800 h-auto gap-2">
                <TabsTrigger 
                  value="shipping" 
                  className="rounded-xl py-4 data-[state=active]:bg-[#d4af37] data-[state=active]:text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Truck size={20} className="hidden sm:inline" />
                  <span className="font-serif italic font-bold" style={{ fontFamily: 'var(--font-serif)' }}>Shipping</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="privacy" 
                  className="rounded-xl py-4 data-[state=active]:bg-[#d4af37] data-[state=active]:text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Shield size={20} className="hidden sm:inline" />
                  <span className="font-serif italic font-bold" style={{ fontFamily: 'var(--font-serif)' }}>Privacy</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="terms" 
                  className="rounded-xl py-4 data-[state=active]:bg-[#d4af37] data-[state=active]:text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FileText size={20} className="hidden sm:inline" />
                  <span className="font-serif italic font-bold" style={{ fontFamily: 'var(--font-serif)' }}>Terms</span>
                </TabsTrigger>
              </TabsList>

              {/* Shipping Content */}
              <TabsContent value="shipping" className="focus-visible:outline-none ring-0">
                <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                      <h2 className="text-3xl font-serif italic font-bold text-gray-900 dark:text-white mb-8 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                        Shipping Information
                      </h2>
                      <div className="space-y-6">
                        <div className="group">
                          <h3 className="text-lg font-bold text-[#d4af37] mb-2 flex items-center gap-2">
                            <ChevronRight size={18} /> Free Delivery
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 pl-6 border-l border-gray-200 dark:border-gray-700">
                            Complimentary shipping on all orders over $500. Express shipping available for urgent orders.
                          </p>
                        </div>
                        <div className="group">
                          <h3 className="text-lg font-bold text-[#d4af37] mb-2 flex items-center gap-2">
                            <ChevronRight size={18} /> Delivery Times
                          </h3>
                          <ul className="text-gray-600 dark:text-gray-300 pl-6 border-l border-gray-200 dark:border-gray-700 space-y-1">
                            <li>• Standard Shipping: 3-5 business days</li>
                            <li>• Express Shipping: 1-2 business days</li>
                            <li>• International: 7-14 business days</li>
                          </ul>
                        </div>
                        <div className="group">
                          <h3 className="text-lg font-bold text-[#d4af37] mb-2 flex items-center gap-2">
                            <ChevronRight size={18} /> Secure Packaging
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 pl-6 border-l border-gray-200 dark:border-gray-700">
                            All jewelry is shipped in secure, insured packaging with signature confirmation required.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-serif italic font-bold text-gray-900 dark:text-white mb-8 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                        Returns & Exchanges
                      </h2>
                      <div className="space-y-6">
                        <div className="group">
                          <h3 className="text-lg font-bold text-[#d4af37] mb-2 flex items-center gap-2">
                            <ChevronRight size={18} /> 7-Day Exchange Only
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 pl-6 border-l border-gray-200 dark:border-gray-700">
                            Items can be exchanged within 7 days of delivery. Returns and refunds are not accepted; we offer exchange for another piece of equal or higher value.
                          </p>
                        </div>
                        <div className="group">
                          <h3 className="text-lg font-bold text-[#d4af37] mb-2 flex items-center gap-2">
                            <ChevronRight size={18} /> Free Return Shipping
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 pl-6 border-l border-gray-200 dark:border-gray-700">
                            We provide prepaid return labels for all domestic returns. International returns subject to applicable fees.
                          </p>
                        </div>
                        <div className="group">
                          <h3 className="text-lg font-bold text-[#d4af37] mb-2 flex items-center gap-2">
                            <ChevronRight size={18} /> Exchange Policy
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 pl-6 border-l border-gray-200 dark:border-gray-700">
                            Exchanges are valid for items in their original, unworn condition. Custom or personalized pieces are final sale and not eligible for exchange.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Privacy Content */}
              <TabsContent value="privacy" className="focus-visible:outline-none ring-0">
                <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-3xl font-serif italic font-bold text-gray-900 dark:text-white mb-8 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                    Privacy Policy
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                    <section>
                      <h3 className="text-xl font-bold text-[#d4af37] mb-4">Information We Collect</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        We collect information you provide directly to us, such as when you create an account, make a purchase, 
                        or contact us for support. This may include your name, email address, phone number, shipping address, 
                        and payment information.
                      </p>
                    </section>
                    <section>
                      <h3 className="text-xl font-bold text-[#d4af37] mb-4">How We Use Your Information</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        We use the information we collect to provide, maintain, and improve our services, process transactions, 
                        send you technical notices and support messages, and communicate with you about products, services, 
                        and promotional offers.
                      </p>
                    </section>
                    <section>
                      <h3 className="text-xl font-bold text-[#d4af37] mb-4">Information Sharing</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        We do not sell, trade, or otherwise transfer your personal information to third parties without your 
                        consent. We may share your information with trusted service providers who assist us in operating our 
                        website and conducting our business.
                      </p>
                    </section>
                  </div>
                </div>
              </TabsContent>

              {/* Terms Content */}
              <TabsContent value="terms" className="focus-visible:outline-none ring-0">
                <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-3xl font-serif italic font-bold text-gray-900 dark:text-white mb-8 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                    Terms of Service
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                    <section>
                      <h3 className="text-xl font-bold text-[#d4af37] mb-4">Acceptance of Terms</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        By accessing and using Sara Jewelers' website and services, you accept and agree to be bound by the 
                        terms and provision of this agreement. These terms apply to all visitors, users, and others who 
                        access or use our service.
                      </p>
                    </section>
                    <section>
                      <h3 className="text-xl font-bold text-[#d4af37] mb-4">Products and Services</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        All jewelry pieces are handcrafted and may have slight variations from displayed images. We reserve 
                        the right to modify or discontinue any product without prior notice. Custom jewelry orders are 
                        final and non-refundable unless there is a manufacturing defect.
                      </p>
                    </section>
                    <section>
                      <h3 className="text-xl font-bold text-[#d4af37] mb-4">Limitation of Liability</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Sara Jewelers shall not be liable for any indirect, incidental, special, consequential, or punitive 
                        damages, including without limitation, loss of profits, data, use, goodwill, or other intangible 
                        losses, resulting from your use of our service.
                      </p>
                    </section>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Footer Info Hub */}
      <section className="py-12 bg-white/30 dark:bg-black/10 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
              <Mail className="text-[#d4af37]" />
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">Legal Inquiries</p>
                <p className="text-sm">S.wcollections2@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
              <Phone className="text-[#d4af37]" />
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">Compliance Hotline</p>
                <p className="text-sm">609-855-9100</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
              <Truck className="text-[#d4af37]" />
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">Order Support</p>
                <p className="text-sm">Tracking & Delivery Updates</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
