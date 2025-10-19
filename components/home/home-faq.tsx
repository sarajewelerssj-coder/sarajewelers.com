"use client"
import { useEffect, useRef } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function HomeFAQ() {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return

    const items = itemRefs.current.filter(Boolean)
    if (items.length === 0) return

    gsap.set(items, { y: 50, opacity: 0 })

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%",
      toggleActions: "play reverse play reverse",
      onEnter: () => {
        items.forEach((item, index) => {
          gsap.to(item, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: "back.out(1.7)"
          })
        })
      },
      onLeave: () => {
        gsap.to(items, { y: 50, opacity: 0, duration: 0.6, stagger: 0.05 })
      },
      onEnterBack: () => {
        items.forEach((item, index) => {
          gsap.to(item, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: "back.out(1.7)"
          })
        })
      },
      onLeaveBack: () => {
        gsap.to(items, { y: 50, opacity: 0, duration: 0.6, stagger: 0.05 })
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const faqs = [
    {
      question: "What makes Sara Jewelers different from other jewelry stores?",
      answer:
        "Sara Jewelers stands apart through our unique blend of heritage craftsmanship and contemporary innovation. Every piece is handcrafted by master artisans with over 25 years of experience, using only conflict-free diamonds and ethically sourced precious metals. We offer personalized consultations, lifetime warranties, complimentary resizing, and our exclusive 'Jewelry for Life' program where we maintain and restore your pieces forever. Our commitment extends beyond sales - we're your jewelry partners for life.",
    },
    {
      question: "How does your custom jewelry design process work?",
      answer:
        "Our bespoke design journey begins with a complimentary consultation where we discuss your vision, lifestyle, and budget. Using advanced 3D modeling technology, we create detailed renderings for your approval before crafting begins. You'll receive progress updates with photos throughout the 4-6 week creation process. Each custom piece includes a certificate of authenticity, detailed care instructions, and our signature presentation box. We also offer virtual consultations for international clients.",
    },
    {
      question: "What are your shipping and insurance policies?",
      answer:
        "We provide complimentary worldwide shipping with full insurance coverage on all orders. Domestic deliveries arrive within 1-3 business days via secure courier with signature confirmation. International orders take 5-10 business days with customs handling included. All shipments are tracked, insured for full value, and packaged in our signature security boxes. We also offer same-day delivery in major cities and can arrange special delivery for urgent occasions.",
    },
    {
      question: "How should I care for and maintain my jewelry?",
      answer:
        "Proper care ensures your jewelry's lasting beauty. Store pieces separately in our provided soft pouches to prevent scratching. Clean regularly with our complimentary jewelry cleaning solution and soft brush. Avoid contact with lotions, perfumes, and household chemicals. Remove jewelry before swimming, exercising, or sleeping. We offer free professional cleaning and inspection services every 6 months, plus complimentary rhodium re-plating for white gold pieces to maintain their lustrous finish.",
    },
    {
      question: "What is your return and exchange policy?",
      answer:
        "We offer a generous 60-day return policy for unworn items in original condition with all documentation. Custom and engraved pieces have a 14-day return window unless there's a manufacturing defect. All returns include free shipping and full refunds. We also provide lifetime exchanges for different sizes or styles with a small upgrade fee. Our 'Love Guarantee' ensures if you're not completely satisfied, we'll work with you to make it right - even years later.",
    },
    {
      question: "Do you offer financing options and payment plans?",
      answer:
        "Yes! We offer flexible financing through our partnership with leading financial institutions. Choose from 0% APR for 6-24 months, or extended payment plans up to 60 months. We accept all major credit cards, PayPal, wire transfers, and cryptocurrency. For high-value purchases, we offer layaway programs with just 20% down. Our financing specialists can help you find the perfect payment solution to make your dream jewelry affordable.",
    },
  ]

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div ref={containerRef} className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                ref={(el) => { itemRefs.current[index] = el }}
                value={`item-${index}`}
                className="border-b border-[#e0e0e0] dark:border-[#444444] overflow-hidden group"
              >
                <AccordionTrigger className="text-left text-gray-900 dark:text-gray-100 hover:text-[#d4af37] dark:hover:text-[#d4af37] py-4 transition-all duration-300">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400 bg-[#f8f4e8]/50 dark:bg-[#1e1e1e]/50 p-4 rounded-lg">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

