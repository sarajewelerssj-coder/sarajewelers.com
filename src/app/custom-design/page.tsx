"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CustomOrderFAQ from "@/components/custom-design/custom-order-faq"
import NewsletterSection from "@/components/layout/newsletter-section"
import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { toast } from "sonner"
import { Loader2, X as CloseIcon, LogIn } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { uploadFileAction } from "@/app/actions/media-actions"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function CustomDesignPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const heroRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const processRef = useRef<HTMLDivElement>(null)
  const faqHeadingRef = useRef<HTMLDivElement>(null)
  const faqSectionRef = useRef<HTMLDivElement>(null)
  const processStepsRef = useRef<(HTMLDivElement | null)[]>([])

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    stoneType: '',
    jewelryTypes: [] as string[],
    metalType: '',
    budget: '',
    comments: ''
  })

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user?.name || prev.name,
        email: session.user?.email || prev.email
      }))
    }
  }, [session])

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('Please login to submit a custom design request')
    }
  }, [status])
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const newImages: string[] = []

    try {
      for (const file of Array.from(files)) {
        const uploadData = new FormData()
        uploadData.append('file', file)
        uploadData.append('folder', 'sara-jewelers/custom-designs')

        const result = await uploadFileAction(uploadData)

        if (result.success && result.url) {
          newImages.push(result.url)
        }
      }
      setUploadedImages(prev => [...prev, ...newImages])
      toast.success(`${newImages.length} image(s) uploaded`)
    } catch (error) {
      toast.error('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const toggleJewelryType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      jewelryTypes: prev.jewelryTypes.includes(type)
        ? prev.jewelryTypes.filter(t => t !== type)
        : [...prev.jewelryTypes, type]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.jewelryTypes.length === 0) {
      toast.error('Please select at least one jewelry type')
      return
    }

    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one reference image')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/custom-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: uploadedImages
        })
      })

      if (response.ok) {
        toast.success('Your custom design request has been submitted!')
        setFormData({
          name: '',
          email: '',
          phone: '',
          stoneType: '',
          jewelryTypes: [],
          metalType: '',
          budget: '',
          comments: ''
        })
        setUploadedImages([])
      } else {
        const error = await response.json()
        toast.error(error.error || 'Submission failed')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    // Hero animation
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

    // Form animation
    if (formRef.current) {
      gsap.set(formRef.current, { x: -50, opacity: 0 })
      
      ScrollTrigger.create({
        trigger: formRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(formRef.current, {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out"
        })
      })
    }

    // Process section animation
    if (processRef.current) {
      gsap.set(processRef.current, { x: 50, opacity: 0 })
      
      ScrollTrigger.create({
        trigger: processRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(processRef.current, {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out"
        })
      })
    }

    // Process steps animation
    const processSteps = processStepsRef.current.filter(Boolean)
    if (processSteps.length > 0) {
      gsap.set(processSteps, { y: 60, opacity: 0 })
      
      processSteps.forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 85%",
          toggleActions: "play reverse play reverse",
          animation: gsap.to(step, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: "back.out(1.7)"
          })
        })
      })
    }

    // FAQ heading animation
    if (faqHeadingRef.current) {
      gsap.set(faqHeadingRef.current, { y: -50, opacity: 0 })
      
      ScrollTrigger.create({
        trigger: faqHeadingRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(faqHeadingRef.current, { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: "back.out(1.7)" 
        })
      })
    }

    // FAQ section animation
    if (faqSectionRef.current) {
      gsap.set(faqSectionRef.current, { scale: 0.8, opacity: 0 })
      
      ScrollTrigger.create({
        trigger: faqSectionRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(faqSectionRef.current, {
          scale: 1,
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
    <div className="min-h-screen">
      {/* Simple Top Banner */}
      <div className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black py-4 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-lg md:text-xl font-serif italic font-bold tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
            Create Something Unique Just For You
          </h2>
          <p className="text-sm opacity-80 mt-1 font-serif italic" style={{ fontFamily: 'var(--font-serif)' }}>
            Handcrafted • Personalized • Unforgettable
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[70vh] sm:h-[75vh] md:h-[80vh] min-h-[500px] max-h-[700px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1470&auto=format&fit=crop"
          alt="Custom Design Banner"
          fill
          className="object-cover scale-110 transition-transform duration-6000 ease-out"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="max-w-4xl">
              <div ref={heroRef} className="backdrop-blur-sm bg-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 md:w-16 h-[2px] bg-[#d4af37]" />
                  <span className="text-[#d4af37] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                    Bespoke Jewelry
                  </span>
                  <div className="w-12 md:w-16 h-[2px] bg-[#d4af37]" />
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic font-bold text-white mb-6 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                  <span className="bg-gradient-to-r from-white via-white to-[#d4af37] bg-clip-text text-transparent">
                    Custom Design Your Dream Jewelry
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl leading-relaxed font-serif italic font-medium" style={{ fontFamily: 'var(--font-serif)' }}>
                  Work with our expert designers to create a 
                  <span className="text-[#d4af37] font-semibold ml-1">personalized piece</span> that tells your story.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-20 bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="order-2 lg:order-1 relative">
              {status === 'unauthenticated' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-white/60 dark:bg-black/60 backdrop-blur-[2px] border border-gray-100 dark:border-gray-800">
                  <div className="text-center p-8 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl border border-[#d4af37]/20">
                    <LogIn className="w-12 h-12 text-[#d4af37] mx-auto mb-4" />
                    <h3 className="text-xl font-serif italic font-bold mb-2 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Login Required</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-[250px] mx-auto">
                      Please login to your account to submit a custom design request.
                    </p>
                    <Button 
                      onClick={() => router.push('/account')}
                      className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black font-bold px-8 py-2 rounded-full hover:scale-105 transition-all shadow-lg"
                    >
                      LOG IN NOW
                    </Button>
                  </div>
                </div>
              )}
              <form 
                ref={formRef} 
                onSubmit={handleSubmit}
                className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl p-8 md:p-10 hover:shadow-[#d4af37]/20 dark:hover:shadow-[#f4d03f]/20 transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-900 dark:text-white font-medium">
                      Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-2 border-[#d4af37]/30 dark:border-[#d4af37]/30 focus:border-[#d4af37] dark:focus:border-[#f4d03f] focus:ring-2 focus:ring-[#d4af37]/20 transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-900 dark:text-white font-medium">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-2 border-[#d4af37]/30 dark:border-[#d4af37]/30 focus:border-[#d4af37] dark:focus:border-[#f4d03f] focus:ring-2 focus:ring-[#d4af37]/20 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="phone" className="text-gray-900 dark:text-white font-medium">
                      Phone number
                    </Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-2 border-[#d4af37]/30 dark:border-[#d4af37]/30 focus:border-[#d4af37] dark:focus:border-[#f4d03f] focus:ring-2 focus:ring-[#d4af37]/20 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stone-type" className="text-gray-900 dark:text-white font-medium">
                      Stone type <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      required 
                      value={formData.stoneType}
                      onValueChange={(val) => setFormData({ ...formData, stoneType: val })}
                    >
                      <SelectTrigger id="stone-type" className="mt-2 border-[#d4af37]/30 dark:border-[#d4af37]/30 focus:border-[#d4af37] dark:focus:border-[#f4d03f] transition-all duration-300">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diamond">Diamond</SelectItem>
                        <SelectItem value="sapphire">Sapphire</SelectItem>
                        <SelectItem value="ruby">Ruby</SelectItem>
                        <SelectItem value="emerald">Emerald</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mb-6">
                  <Label className="text-gray-900 dark:text-white font-medium block mb-3">
                    Jewelry type (Multiple options) <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Ring/Band", "Earrings", "Pendant", "Bracelets", "Necklace"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`type-${type}`} 
                          checked={formData.jewelryTypes.includes(type)}
                          onCheckedChange={() => toggleJewelryType(type)}
                        />
                        <Label
                          htmlFor={`type-${type}`}
                          className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer hover:text-[#d4af37] dark:hover:text-[#f4d03f] transition-colors"
                        >
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="metal-type" className="text-gray-900 dark:text-white font-medium">
                      Metal type <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      required
                      value={formData.metalType}
                      onValueChange={(val) => setFormData({ ...formData, metalType: val })}
                    >
                      <SelectTrigger id="metal-type" className="mt-2 border-[#d4af37]/30 dark:border-[#d4af37]/30 focus:border-[#d4af37] dark:focus:border-[#f4d03f] transition-all duration-300">
                        <SelectValue placeholder="Select metal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yellow-gold">Yellow Gold</SelectItem>
                        <SelectItem value="white-gold">White Gold</SelectItem>
                        <SelectItem value="rose-gold">Rose Gold</SelectItem>
                        <SelectItem value="platinum">Platinum</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="budget" className="text-gray-900 dark:text-white font-medium">
                      Budget <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      required
                      value={formData.budget}
                      onValueChange={(val) => setFormData({ ...formData, budget: val })}
                    >
                      <SelectTrigger id="budget" className="mt-2 border-[#d4af37]/30 dark:border-[#d4af37]/30 focus:border-[#d4af37] dark:focus:border-[#f4d03f] transition-all duration-300">
                        <SelectValue placeholder="Please Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-500">Under $500</SelectItem>
                        <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                        <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                        <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                        <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                        <SelectItem value="over-10000">Over $10,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mb-6">
                  <Label htmlFor="comments" className="text-gray-900 dark:text-white font-medium">
                    Comments
                  </Label>
                  <Textarea
                    id="comments"
                    placeholder="Tell us something about it..."
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    className="mt-2 h-32 border-[#d4af37]/30 dark:border-[#d4af37]/30 focus:border-[#d4af37] dark:focus:border-[#f4d03f] focus:ring-2 focus:ring-[#d4af37]/20 transition-all duration-300"
                  />
                </div>

                <div className="mb-8">
                  <Label className="text-gray-900 dark:text-white font-medium block mb-3">
                    Upload Reference Images <span className="text-red-500">*</span>
                  </Label>
                  <div className="border-2 border-dashed border-[#d4af37]/50 dark:border-[#d4af37]/50 rounded-xl p-8 text-center hover:bg-[#f8f4e8]/50 dark:hover:bg-[#2d2d2d]/50 hover:border-[#d4af37] dark:hover:border-[#f4d03f] transition-all duration-300">
                    <input 
                      type="file" 
                      id="file-upload" 
                      className="hidden" 
                      multiple 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4d03f] flex items-center justify-center mb-4 shadow-lg">
                        {uploading ? (
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        ) : (
                          <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                        )}
                      </div>
                      <span className="text-[#d4af37] hover:text-[#f4d03f] dark:text-[#d4af37] dark:hover:text-[#f4d03f] font-medium text-lg transition-colors">
                        {uploading ? 'Uploading...' : 'Upload Reference Images'}
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Drag and drop files here or click to browse
                      </p>
                    </label>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                      {uploadedImages.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 group">
                          <Image src={url} alt={`Upload ${idx + 1}`} fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <CloseIcon className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading || uploading}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-black font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2 border-2 border-[#d4af37]/20 disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        SUBMITTING...
                      </>
                    ) : (
                      <>
                        SUBMIT REQUEST
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-2 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Button>
              </form>
            </div>

            <div className="order-1 lg:order-2">
              <div className="sticky top-24">
                <div ref={processRef} className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl p-8 md:p-10 mb-8 hover:shadow-[#d4af37]/20 dark:hover:shadow-[#f4d03f]/20 transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40">
                  <h2 className="text-3xl font-serif italic font-bold text-[#d4af37] dark:text-[#f4d03f] mb-8 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Custom Design Process</h2>
                  <div className="space-y-6">
                    <div ref={(el) => { processStepsRef.current[0] = el }} className="flex items-start group">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4d03f] text-white flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        1
                      </div>
                      <div className="ml-6">
                        <h3 className="text-xl font-serif italic font-bold text-gray-900 dark:text-white group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors mb-2 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                          Submit Your Ideas
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          Fill out the form with your design ideas, preferences, and reference images.
                        </p>
                      </div>
                    </div>

                    <div ref={(el) => { processStepsRef.current[1] = el }} className="flex items-start group">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4d03f] text-white flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        2
                      </div>
                      <div className="ml-6">
                        <h3 className="text-xl font-serif italic font-bold text-gray-900 dark:text-white group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors mb-2 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                          Design Consultation
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          Our designers will contact you to discuss your vision in detail.
                        </p>
                      </div>
                    </div>

                    <div ref={(el) => { processStepsRef.current[2] = el }} className="flex items-start group">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4d03f] text-white flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        3
                      </div>
                      <div className="ml-6">
                        <h3 className="text-xl font-serif italic font-bold text-gray-900 dark:text-white group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors mb-2 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                          Design Approval
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          Review and approve sketches or 3D renderings of your custom piece.
                        </p>
                      </div>
                    </div>

                    <div ref={(el) => { processStepsRef.current[3] = el }} className="flex items-start group">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4d03f] text-white flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        4
                      </div>
                      <div className="ml-6">
                        <h3 className="text-xl font-serif italic font-bold text-gray-900 dark:text-white group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors mb-2 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                          Crafting Your Piece
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          Our skilled artisans will handcraft your custom jewelry with precision and care.
                        </p>
                      </div>
                    </div>

                    <div ref={(el) => { processStepsRef.current[4] = el }} className="flex items-start group">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4d03f] text-white flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        5
                      </div>
                      <div className="ml-6">
                        <h3 className="text-xl font-serif italic font-bold text-gray-900 dark:text-white group-hover:text-[#d4af37] dark:group-hover:text-[#f4d03f] transition-colors mb-2 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                          Final Delivery
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          Receive your one-of-a-kind jewelry piece, beautifully packaged and ready to cherish.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-[#1e1e1e] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative max-w-7xl">
          <div ref={faqHeadingRef} className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                Have Questions?
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-bold mb-6 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h3>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-serif italic font-medium" style={{ fontFamily: 'var(--font-serif)' }}>
              Find answers to common questions about our 
              <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium ml-1">custom design process</span>.
            </p>
          </div>

          <div ref={faqSectionRef} className="max-w-4xl mx-auto bg-gradient-to-br from-[#faf8f3] to-white dark:from-[#1a1a1a] dark:to-[#2a2a2a] p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800">
            <CustomOrderFAQ />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  )
}