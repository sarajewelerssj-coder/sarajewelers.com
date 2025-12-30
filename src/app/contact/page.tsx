"use client"

import Image from "next/image"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ContactPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const contactHeadingRef = useRef<HTMLDivElement>(null)
  const locationHeadingRef = useRef<HTMLDivElement>(null)
  const contactCardsRef = useRef<(HTMLDivElement | null)[]>([])
  const mapRef = useRef<HTMLDivElement>(null)
  const accordionRef = useRef<HTMLDivElement>(null)
  const faqHeadingRef = useRef<HTMLDivElement>(null)
  
  // Ported refs from About section
  const storyRef = useRef<HTMLDivElement>(null)
  const storyTextRef = useRef<HTMLDivElement>(null)
  const storyImageRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)
  const teamRef = useRef<HTMLDivElement>(null)
  const ownerImageRef = useRef<HTMLDivElement>(null)
  const ownerContentRef = useRef<HTMLDivElement>(null)

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

    const headings = [contactHeadingRef, locationHeadingRef, valuesRef, teamRef]
    
    headings.forEach((headingRef) => {
      if (headingRef.current) {
        gsap.set(headingRef.current, { y: 50, opacity: 0 })
        
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

    // Story section animations
    if (storyTextRef.current) {
      gsap.set(storyTextRef.current, { x: -80, opacity: 0 })
      ScrollTrigger.create({
        trigger: storyRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(storyTextRef.current, {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "back.out(1.7)"
        })
      })
    }

    if (storyImageRef.current) {
      gsap.set(storyImageRef.current, { x: 80, opacity: 0, scale: 0.8 })
      ScrollTrigger.create({
        trigger: storyRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(storyImageRef.current, {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          delay: 0.3,
          ease: "back.out(1.7)"
        })
      })
    }

    // Owner image animation from left
    if (ownerImageRef.current) {
      gsap.set(ownerImageRef.current, { x: -100, opacity: 0 })
      ScrollTrigger.create({
        trigger: ownerImageRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(ownerImageRef.current, {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "back.out(1.7)"
        })
      })
    }

    // Owner content animation from right
    if (ownerContentRef.current) {
      gsap.set(ownerContentRef.current, { x: 100, opacity: 0 })
      ScrollTrigger.create({
        trigger: ownerContentRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(ownerContentRef.current, {
          x: 0,
          opacity: 1,
          duration: 1.2,
          delay: 0.2,
          ease: "back.out(1.7)"
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

    if (accordionRef.current) {
      gsap.set(accordionRef.current, { y: 50, opacity: 0 })
      ScrollTrigger.create({
        trigger: accordionRef.current,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        animation: gsap.to(accordionRef.current, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "back.out(1.7)"
        })
      })
    }

    if (faqHeadingRef.current) {
      gsap.set(faqHeadingRef.current, { y: 50, opacity: 0 })
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

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const faqs = [
    {
      question: "What makes Sara Jewelers different from other jewelry stores?",
      answer: "Sara Jewelers stands apart through our unique blend of heritage craftsmanship and contemporary innovation. Every piece is handcrafted by master artisans with over 25 years of experience, using only conflict-free diamonds and ethically sourced precious metals. We offer personalized consultations, lifetime warranties, complimentary resizing, and our exclusive 'Jewelry for Life' program where we maintain and restore your pieces forever."
    },
    {
      question: "How does your custom jewelry design process work?",
      answer: "Our bespoke design journey begins with a complimentary consultation where we discuss your vision, lifestyle, and budget. Using advanced 3D modeling technology, we create detailed renderings for your approval before crafting begins. You'll receive progress updates with photos throughout the 4-6 week creation process. Each custom piece includes a certificate of authenticity, detailed care instructions, and our signature presentation box."
    },
    {
      question: "What are your shipping and insurance policies?",
      answer: "We provide complimentary worldwide shipping with full insurance coverage on all orders. Domestic deliveries arrive within 1-3 business days via secure courier with signature confirmation. International orders take 5-10 business days with customs handling included. All shipments are tracked, insured for full value, and packaged in our signature security boxes."
    },
    {
      question: "How should I care for and maintain my jewelry?",
      answer: "Proper care ensures your jewelry's lasting beauty. Store pieces separately in our provided soft pouches to prevent scratching. Clean regularly with our complimentary jewelry cleaning solution and soft brush. Avoid contact with lotions, perfumes, and household chemicals. Remove jewelry before swimming, exercising, or sleeping. We offer free professional cleaning and inspection services every 6 months."
    },
    {
      question: "What is your return and exchange policy?",
      answer: "We offer a generous 60-day return policy for unworn items in original condition with all documentation. Custom and engraved pieces have a 14-day return window unless there's a manufacturing defect. All returns include free shipping and full refunds. We also provide lifetime exchanges for different sizes or styles with a small upgrade fee."
    },
    {
      question: "Do you offer financing options and payment plans?",
      answer: "Yes! We offer flexible financing through our partnership with leading financial institutions. Choose from 0% APR for 6-24 months, or extended payment plans up to 60 months. We accept all major credit cards, PayPal, wire transfers, and cryptocurrency. For high-value purchases, we offer layaway programs with just 20% down."
    },
    {
      question: "What certifications do your diamonds have?",
      answer: "All our diamonds come with certificates from internationally recognized gemological institutes including GIA, AGS, and Gübelin. Each certificate details the diamond's cut, color, clarity, and carat weight. We only source conflict-free diamonds that meet the Kimberley Process standards, ensuring ethical and responsible sourcing."
    },
    {
      question: "Do you offer jewelry repair and restoration services?",
      answer: "Absolutely! Our master jewelers provide comprehensive repair and restoration services for all types of jewelry, regardless of where it was purchased. Services include ring resizing, stone replacement, chain repair, clasp replacement, and antique jewelry restoration. We also offer rhodium re-plating for white gold pieces to maintain their lustrous finish."
    }
  ]

  return (
    <div className="min-h-screen bg-[#F6F1E8] dark:bg-gradient-to-br dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
      {/* Hero Section */}
      <div className="relative h-[65vh] min-h-[450px] overflow-hidden">
        <Image
          src="/images/banners/Banenr.png"
          alt="Contact Sara Jewelers"
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
                  Legacy & Connection
                </span>
                <div className="w-16 h-[2px] bg-[#d4af37]" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-serif italic font-bold text-white mb-6 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                <span className="bg-gradient-to-r from-white via-white to-[#d4af37] bg-clip-text text-transparent">
                  Meet Us & Our Story
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8">
                Discover the <span className="text-[#d4af37] font-semibold">artisan heritage</span> behind our jewelry and connect with us to find your next masterpiece.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Contact & Details */}
      <section className="py-20 bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a] relative overflow-hidden">
        <div className="container mx-auto px-4 relative max-w-7xl">
          <div ref={contactHeadingRef} className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                Connect With Us
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-bold mb-6 text-gray-900 dark:text-white">
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Visit Our Showroom
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div ref={(el) => { contactCardsRef.current[0] = el }} className="bg-white dark:bg-[#1e1e1e] p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 hover:shadow-[#d4af37]/20 transition-all duration-500 group text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                <MapPin className="text-white" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-3 dark:text-white">Our Location</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Hamilton Mall<br />4403 Black Horse Pike<br />K225 Mays Landing, NJ 08330
              </p>
            </div>

            <div ref={(el) => { contactCardsRef.current[1] = el }} className="bg-white dark:bg-[#1e1e1e] p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 hover:shadow-[#d4af37]/20 transition-all duration-500 group text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                <Phone className="text-white" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-3 dark:text-white">Direct Line</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg font-semibold">
                609-855-9100
              </p>
            </div>

            <div ref={(el) => { contactCardsRef.current[2] = el }} className="bg-white dark:bg-[#1e1e1e] p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 hover:shadow-[#d4af37]/20 transition-all duration-500 group text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                <Mail className="text-white" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-3 dark:text-white">Email Us</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm break-all">
                S.wcollections2@gmail.com
              </p>
            </div>

            <div ref={(el) => { contactCardsRef.current[3] = el }} className="bg-white dark:bg-[#1e1e1e] p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 hover:shadow-[#d4af37]/20 transition-all duration-500 group text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                <Clock className="text-white" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-3 dark:text-white">Store Hours</h3>
              <div className="text-gray-600 dark:text-gray-300 text-xs space-y-1">
                <p>Mon-Fri: 10AM - 8PM</p>
                <p>Sat: 10AM - 6PM</p>
                <p>Sun: 12PM - 5PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Owner Section (Ported from About) */}
      <section className="py-20 bg-white dark:bg-[#1e1e1e] relative overflow-hidden">
        <div className="container mx-auto px-4 relative max-w-7xl">
          <div ref={teamRef} className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                Meet The Owner
              </span>
              <div className="w-16 h-[2px] bg-[#d4af37]" />
            </div>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-bold mb-6 text-gray-900 dark:text-white">
              The Artisan Behind Our Jewelry
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center justify-items-center">
            <div ref={ownerImageRef} className="relative group w-full max-w-[400px]">
              {/* Premium Decorative Frame */}
              <div className="relative p-2 rounded-[2.5rem] bg-gradient-to-br from-[#d4af37]/30 via-transparent to-[#d4af37]/30 border border-white/10 backdrop-blur-sm shadow-2xl transition-all duration-700 hover:scale-[1.02] hover:shadow-[#d4af37]/10">
                <div className="relative rounded-[2rem] overflow-hidden bg-[#1a1a1a]">
                  <div className="aspect-[2/3] relative">
                    <Image 
                      src="/images/OwnerIMG/owner.png"
                      alt="Waqar Ahmed" 
                      fill 
                      className="object-cover object-top scale-[1.02]" 
                      priority
                    />
                    {/* Shadow Overlay to blend bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  </div>
                </div>
                
                {/* Accent Elements */}
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#d4af37]/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#d4af37]/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            </div>
            
            <div ref={ownerContentRef} className="space-y-6 text-center lg:text-left w-full max-w-xl">
              <div>
                <h4 className="text-4xl font-serif italic font-bold text-gray-900 dark:text-white mb-3">
                  Waqar Ahmed
                </h4>
                <p className="text-[#d4af37] dark:text-[#f4d03f] text-xl font-semibold mb-6">
                  Owner & Master Jeweler
                </p>
              </div>
              
              <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  With over <span className="text-[#d4af37] dark:text-[#f4d03f] font-semibold">15 years of experience</span> since founding Sara Jewelers in 2019, 
                  Waqar brings exceptional craftsmanship and attention to detail to every piece.
                </p>
                <p>
                  Specializing in <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">custom designs and fine jewelry</span>, our passion for excellence 
                  ensures that each creation meets the highest standards of quality and beauty.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
                <div className="bg-gradient-to-r from-[#d4af37]/10 to-[#f4d03f]/10 px-4 py-2 rounded-full border border-[#d4af37]/20 text-[#d4af37] dark:text-[#f4d03f] font-medium text-sm">
                  Custom Design Expert
                </div>
                <div className="bg-gradient-to-r from-[#d4af37]/10 to-[#f4d03f]/10 px-4 py-2 rounded-full border border-[#d4af37]/20 text-[#d4af37] dark:text-[#f4d03f] font-medium text-sm">
                  Master Craftsman
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story (Ported from About) */}
      <section className="py-20 bg-[#F6F1E8] dark:bg-[#1a1a1a] relative overflow-hidden">
        <div className="container mx-auto px-4 relative max-w-7xl">
          <div ref={storyRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div ref={storyTextRef}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-[2px] bg-[#d4af37]" />
                <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                  Our Heritage
                </span>
                <div className="w-16 h-[2px] bg-[#d4af37]" />
              </div>
              
              <h3 className="text-4xl md:text-5xl font-serif italic font-bold mb-6 text-gray-900 dark:text-white">
                A Legacy of Excellence
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Founded in <span className="text-[#d4af37] dark:text-[#f4d03f] font-semibold">2019</span>, Sara Jewelers began with a vision to create 
                exceptional jewelry pieces. With a passion for <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">unparalleled craftsmanship</span> and an eye for timeless design, 
                we established a reputation for quality that will be treasured for generations.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Each piece in our collection is meticulously crafted with <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">years of dedication</span>,
                using only the finest materials and ethically sourced stones.
              </p>
            </div>
            <div ref={storyImageRef}>
              <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105">
                <Image
                  src="/images/banners/contactpage.png"
                  alt="Our Heritage"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative max-w-4xl">
          <div ref={faqHeadingRef} className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                Frequently Asked Questions
              </span>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-bold mb-6 text-gray-900 dark:text-white">
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Common Inquiries
              </span>
            </h2>
          </div>

          <Accordion ref={accordionRef} type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 hover:-translate-y-1 transition-all duration-500 overflow-hidden group"
              >
                <AccordionTrigger className="text-left text-gray-900 dark:text-gray-100 hover:text-[#d4af37] dark:hover:text-[#f4d03f] px-6 py-4 transition-all duration-300 font-serif italic font-bold text-lg tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400 bg-gradient-to-br from-[#faf8f3]/50 to-white/50 dark:from-[#1a1a1a]/50 dark:to-[#2a2a2a]/50 px-6 pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white dark:bg-[#1e1e1e]">
        <div className="container mx-auto px-4 relative max-w-7xl">
          <div ref={locationHeadingRef} className="text-center mb-16">
            <h2 className="text-4xl font-serif italic font-bold mb-4 text-gray-900 dark:text-white">Find Us In Person</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Located in the heart of Hamilton Mall, K225 Mays Landing.</p>
          </div>
          
          <div ref={mapRef} className="max-w-5xl mx-auto bg-white dark:bg-[#2a2a2a] p-4 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 cursor-pointer group" onClick={() => window.open('https://www.google.com/maps/place/Sara+Jewelers/@39.4538746,-74.6456739,17z/data=!3m1!4b1!4m6!3m5!1s0x89c0dd7f793257ff:0x181a54b70c73c791!8m2!3d39.4538746!4d-74.6456739!16s%2Fg%2F11c5qx8y8q', '_blank')}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3080.6839615650388!2d-74.6456739!3d39.4538746!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c0dd7f793257ff%3A0x181a54b70c73c791!2sSara%20Jewelers!5e0!3m2!1sen!2s!4v1760858723121!5m2!1sen!2s" 
              width="100%" 
              height="450" 
              style={{border: 0, pointerEvents: 'none'}} 
              allowFullScreen 
              loading="lazy" 
              className="rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </section>
    </div>
  )
}