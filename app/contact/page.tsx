"use client"

import Image from "next/image"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ContactPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const contactHeadingRef = useRef<HTMLDivElement>(null)
  const locationHeadingRef = useRef<HTMLDivElement>(null)
  const contactCardsRef = useRef<(HTMLDivElement | null)[]>([])
  const formRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)

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

    const headings = [contactHeadingRef, locationHeadingRef]
    
    headings.forEach((headingRef) => {
      if (headingRef.current) {
        gsap.set(headingRef.current, { y: -50, opacity: 0 })
        
        ScrollTrigger.create({
          trigger: headingRef.current,
          start: "top 85%",
          toggleActions: "play reverse play reverse",
          animation: gsap.to(headingRef.current, { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            ease: "back.out(1.7)" 
          })
        })
      }
    })

    // Contact cards animation
    const contactCards = contactCardsRef.current.filter(Boolean)
    if (contactCards.length > 0) {
      gsap.set(contactCards, { y: 60, opacity: 0 })
      
      contactCards.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          toggleActions: "play reverse play reverse",
          animation: gsap.to(card, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: "back.out(1.7)"
          })
        })
      })
    }

    // Form animation
    if (formRef.current) {
      gsap.set(formRef.current, { x: 50, opacity: 0 })
      
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

    // Map animation
    if (mapRef.current) {
      gsap.set(mapRef.current, { scale: 0.8, opacity: 0 })
      
      ScrollTrigger.create({
        trigger: mapRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(mapRef.current, {
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
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1472&auto=format&fit=crop"
          alt="Contact Sara Jewelers"
          fill
          className="object-cover scale-110 transition-transform duration-6000 ease-out"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 max-w-7xl">
            <div ref={heroRef} className="backdrop-blur-sm bg-white/10 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-[2px] bg-[#d4af37]" />
                <span className="text-[#d4af37] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                  Get In Touch
                </span>
                <div className="w-16 h-[2px] bg-[#d4af37]" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-white to-[#d4af37] bg-clip-text text-transparent">
                  Contact Us
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                We're here to help you find the <span className="text-[#d4af37] font-semibold">perfect piece</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <section className="py-20 bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative max-w-7xl">
          <div ref={contactHeadingRef} className="text-center mb-16">
            {/* Enhanced Subtitle */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                Visit Us
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            {/* Main Heading with Gradient */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Visit Our Showroom
              </span>
            </h2>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience our 
              <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">exquisite collection</span> in person and let our experts help you find the perfect piece.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div ref={(el) => { contactCardsRef.current[0] = el }} className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-[#d4af37]/20 hover:-translate-y-2 hover:scale-105 transition-all duration-500 group">
                  <div className="flex items-center mb-3">
                    <MapPin className="text-[#d4af37] dark:text-[#f4d03f] mr-3 group-hover:scale-110 transition-transform duration-300" size={20} />
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#d4af37] transition-colors duration-300">Address</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Hamilton Mall, Sara Jewelers<br />4403 Black Horse Pike<br />Mays Landing, New Jersey 08330
                  </p>
                </div>
                
                <div ref={(el) => { contactCardsRef.current[1] = el }} className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-[#d4af37]/20 hover:-translate-y-2 hover:scale-105 transition-all duration-500 group">
                  <div className="flex items-center mb-3">
                    <Phone className="text-[#d4af37] dark:text-[#f4d03f] mr-3 group-hover:scale-110 transition-transform duration-300" size={20} />
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#d4af37] transition-colors duration-300">Phone</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">609-855-9100</p>
                </div>
                
                <div ref={(el) => { contactCardsRef.current[2] = el }} className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-[#d4af37]/20 hover:-translate-y-2 hover:scale-105 transition-all duration-500 group">
                  <div className="flex items-center mb-3">
                    <Mail className="text-[#d4af37] dark:text-[#f4d03f] mr-3 group-hover:scale-110 transition-transform duration-300" size={20} />
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#d4af37] transition-colors duration-300">Email</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">S.wcollections2@gmail.com</p>
                </div>
                
                <div ref={(el) => { contactCardsRef.current[3] = el }} className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-[#d4af37]/20 hover:-translate-y-2 hover:scale-105 transition-all duration-500 group">
                  <div className="flex items-center mb-3">
                    <Clock className="text-[#d4af37] dark:text-[#f4d03f] mr-3 group-hover:scale-110 transition-transform duration-300" size={20} />
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#d4af37] transition-colors duration-300">Store Hours</h3>
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                    <p>Monday - Friday: 10AM - 8PM</p>
                    <p>Saturday: 10AM - 6PM</p>
                    <p>Sunday: 12PM - 5PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div ref={formRef} className="bg-white dark:bg-[#1e1e1e] p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-[#d4af37]/10 transition-all duration-500">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-hover:text-[#d4af37] transition-colors duration-300">First Name</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent dark:bg-[#2a2a2a] dark:text-white hover:border-[#d4af37]/50 hover:shadow-lg hover:shadow-[#d4af37]/10 transition-all duration-300" />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-hover:text-[#d4af37] transition-colors duration-300">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent dark:bg-[#2a2a2a] dark:text-white hover:border-[#d4af37]/50 hover:shadow-lg hover:shadow-[#d4af37]/10 transition-all duration-300" />
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-hover:text-[#d4af37] transition-colors duration-300">Email</label>
                  <input type="email" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent dark:bg-[#2a2a2a] dark:text-white hover:border-[#d4af37]/50 hover:shadow-lg hover:shadow-[#d4af37]/10 transition-all duration-300" />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-hover:text-[#d4af37] transition-colors duration-300">Subject</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent dark:bg-[#2a2a2a] dark:text-white hover:border-[#d4af37]/50 hover:shadow-lg hover:shadow-[#d4af37]/10 transition-all duration-300" />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-hover:text-[#d4af37] transition-colors duration-300">Message</label>
                  <textarea rows={5} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent dark:bg-[#2a2a2a] dark:text-white hover:border-[#d4af37]/50 hover:shadow-lg hover:shadow-[#d4af37]/10 transition-all duration-300"></textarea>
                </div>
                
                <Button className="group relative overflow-hidden w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-black font-semibold py-3 rounded-lg transition-all duration-500 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#d4af37]/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative z-10">
                    Send Message
                  </span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-white dark:bg-[#1e1e1e] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.08),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative max-w-7xl">
          <div ref={locationHeadingRef} className="text-center mb-16">
            {/* Enhanced Subtitle */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                Find Us
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            {/* Main Heading with Gradient */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Visit Our Store Location
              </span>
            </h2>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Located in the heart of Hamilton Mall, we're easy to find and 
              <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">ready to serve you</span>.
            </p>
          </div>
          
          <div className="flex justify-center">
            <div ref={mapRef} className="w-full max-w-4xl bg-white dark:bg-[#2a2a2a] p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:shadow-[#d4af37]/20 transition-all duration-500 cursor-pointer group" onClick={() => window.open('https://www.google.com/maps/place/Sara+Jewelers/@39.4538746,-74.6456739,17z/data=!3m1!4b1!4m6!3m5!1s0x89c0dd7f793257ff:0x181a54b70c73c791!8m2!3d39.4538746!4d-74.6456739!16s%2Fg%2F11c5qx8y8q', '_blank')}>
              <div className="relative overflow-hidden rounded-xl">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3080.6839615650388!2d-74.6456739!3d39.4538746!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c0dd7f793257ff%3A0x181a54b70c73c791!2sSara%20Jewelers!5e0!3m2!1sen!2s!4v1760858723121!5m2!1sen!2s" 
                  width="100%" 
                  height="450" 
                  style={{border: 0, pointerEvents: 'none'}} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                  <div className="bg-[#d4af37] text-black px-4 py-2 rounded-lg font-semibold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Click to open in Google Maps
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}