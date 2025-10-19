"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

export default function CustomOrderFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs: FAQItem[] = [
    {
      question: "What do custom orders entail?",
      answer:
        "Custom orders are an excellent option when you don't find a specific piece of jewelry in our store that perfectly matches your vision but appreciate our craftsmanship, stones, and style of work. Custom orders allow you to bring your unique jewelry ideas to life. If you have specific designs, reference images, or ideas you'd like to see realized, simply share them with us. We will work with you to transform these ideas into a beautiful, personalized piece of jewelry. To start this process, please submit your ideas and requirements through the form provided on  To start this process, please submit your ideas and requirements through the form provided on our website.",
    },
    {
      question: "What is the process for placing custom orders?",
      answer:
        "Our custom order process begins when you submit the form with your ideas and requirements. Within 48 hours, one of our design consultants will contact you to discuss your vision in detail. We'll then create preliminary sketches or 3D renderings for your approval. Once you're satisfied with the design, we'll provide a detailed quote and timeline. After receiving your deposit (typically 50% of the total cost), our artisans will begin crafting your piece. Throughout the process, we'll keep you updated with progress photos. When your piece is complete, we'll send final photos for approval before shipping it to you.",
    },
    {
      question: "What is the processing time for a custom order?",
      answer:
        "The processing time for custom orders varies depending on the complexity of the design, the materials used, and our current workload. Simple designs may take 3-4 weeks, while more complex pieces can take 6-8 weeks or longer. During your initial consultation, we'll provide a more accurate timeline based on your specific project. We appreciate your patience as each piece is meticulously handcrafted to ensure the highest quality and attention to detail.",
    },
    {
      question: "What options are available for custom jewelry orders?",
      answer:
        "We offer a wide range of options for custom jewelry orders. You can choose from various metals including yellow gold, white gold, rose gold, platinum, and silver in different karats. We work with diamonds, sapphires, rubies, emeralds, and many other gemstones, both natural and lab-created. Our craftsmen can create rings, earrings, necklaces, bracelets, and other jewelry pieces in styles ranging from classic to contemporary. We can incorporate personal elements such as birthstones, engravings, or even transform heirloom pieces into new designs. During your consultation, we'll discuss all available options to create a piece that perfectly matches your vision and budget.",
    },
    {
      question: "Are returns, refunds, or exchanges available for custom orders?",
      answer:
        "Due to the personalized nature of custom orders, they are generally non-returnable and non-refundable. However, we stand behind the quality of our work. If there are any manufacturing defects, we will repair or remake the piece at no additional cost. If you're not completely satisfied with the final product due to a discrepancy between the approved design and the finished piece, we'll work with you to address your concerns. We recommend thoroughly reviewing and approving the design before production begins to ensure the final piece meets your expectations. For sizing issues with rings, we offer one free resize within 30 days of delivery.",
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="border-b border-[#e0e0e0] dark:border-[#444444] pb-4 group">
          <button
            className="flex justify-between items-center w-full text-left py-4 group-hover:text-[#d4af37] transition-colors"
            onClick={() => toggleFAQ(index)}
          >
            <span className="text-lg font-medium text-[#333333] dark:text-[#f5f5f5] group-hover:text-[#d4af37] transition-colors">
              {index + 1}. {faq.question}
            </span>
            {openIndex === index ? (
              <ChevronUp className="flex-shrink-0 text-[#d4af37] dark:text-[#d4af37]" />
            ) : (
              <ChevronDown className="flex-shrink-0 text-[#d4af37] dark:text-[#d4af37]" />
            )}
          </button>

          {openIndex === index && (
            <div className="mt-2 text-[#555555] dark:text-[#cccccc] pb-4 bg-white/50 dark:bg-[#121212]/50 p-4 rounded-lg">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

