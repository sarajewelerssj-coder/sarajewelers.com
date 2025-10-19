"use client"

import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function FAQPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const accordionRef = useRef<HTMLDivElement>(null)

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[300px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1470&auto=format&fit=crop"
          alt="FAQ Sara Jewelers"
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
                  Have Questions?
                </span>
                <div className="w-16 h-[2px] bg-[#d4af37]" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-white to-[#d4af37] bg-clip-text text-transparent">
                  Frequently Asked Questions
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Find answers to common questions about our <span className="text-[#d4af37] font-semibold">products and services</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative max-w-4xl">
          <Accordion ref={accordionRef} type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 hover:-translate-y-1 transition-all duration-500 overflow-hidden group"
              >
                <AccordionTrigger className="text-left text-gray-900 dark:text-gray-100 hover:text-[#d4af37] dark:hover:text-[#f4d03f] px-6 py-4 transition-all duration-300 font-semibold">
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
    </div>
  )
}