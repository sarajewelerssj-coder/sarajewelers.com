"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

export default function DiamondsFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs: FAQItem[] = [
    {
      question: "What are Lab Grown Diamonds?",
      answer:
        "Lab-grown diamonds are real diamonds produced in controlled laboratory environments, mimicking natural diamond formation. Created through advanced techniques like High Pressure High Temperature (HPHT) or Chemical Vapor Deposition (CVD), these diamonds possess the same properties as mined diamonds. Offering a sustainable and ethical alternative, lab-grown diamonds are becoming popular in jewelry, combining eco-friendliness with affordability.",
    },
    {
      question: "Are there any other names for Lab Grown Diamonds?",
      answer:
        "Yes, lab-grown diamonds are also known as synthetic diamonds, cultured diamonds, man-made diamonds, or created diamonds. Despite these various names, they all refer to diamonds that have been created in a laboratory setting rather than mined from the earth. It's important to note that these are genuine diamonds with the same physical, chemical, and optical properties as natural diamonds, not to be confused with diamond simulants like cubic zirconia or moissanite.",
    },
    {
      question: "Are Lab Grown Diamonds Real?",
      answer:
        "Yes, lab-grown diamonds are absolutely real diamonds. They have the same chemical composition (pure carbon), crystal structure, optical properties, and physical characteristics as natural diamonds. The only difference is their origin – lab-grown diamonds are created in controlled laboratory environments rather than formed naturally in the earth over billions of years. They are graded using the same criteria (the 4Cs: cut, color, clarity, and carat) and will test positive as diamonds on diamond testing equipment.",
    },
    {
      question: "Are Diamondrensu's Lab Grown Diamonds Certified?",
      answer:
        "Yes, all our lab-grown diamonds come with certification from reputable gemological laboratories. Each diamond is accompanied by a detailed certificate that verifies its authenticity and provides information about its characteristics, including the 4Cs (cut, color, clarity, and carat weight). These certificates ensure that you're getting exactly what you pay for and provide transparency about the quality and specifications of your diamond.",
    },
    {
      question: "Do Lab Grown Diamonds test the same as Natural Diamonds or Moissanite?",
      answer:
        "Lab-grown diamonds test exactly the same as natural diamonds on all standard diamond testing equipment because they have identical physical and chemical properties. Both are pure carbon with the same crystal structure. In contrast, moissanite (silicon carbide) is a different material altogether and will be identified as non-diamond on proper testing equipment. While some basic thermal conductivity testers might confuse moissanite with diamond, more sophisticated testers that measure electrical conductivity or spectroscopic properties can easily distinguish between diamonds (both natural and lab-grown) and diamond simulants like moissanite.",
    },
    {
      question: "Do you offer Colored Lab Grown Diamonds?",
      answer:
        "Yes, we offer a beautiful selection of colored lab-grown diamonds. These colored diamonds are created through the same processes as colorless lab-grown diamonds, but with specific modifications that introduce color during formation. Our collection includes fancy colors such as pink, blue, yellow, and other hues. Colored lab-grown diamonds provide a more affordable alternative to natural colored diamonds, which are extremely rare and expensive, while offering the same stunning visual impact and ethical benefits.",
    },
    {
      question: "Do you offer Custom Lab Grown Diamonds and Jewelry?",
      answer:
        "We specialize in creating custom lab-grown diamond jewelry tailored to your specific preferences and design ideas. Whether you're looking for a unique engagement ring, a special anniversary gift, or a personalized piece of jewelry, our team of expert designers will work closely with you to bring your vision to life. We can customize every aspect of your jewelry, from selecting the perfect lab-grown diamond to designing the setting and choosing the metal. Our custom design process ensures that you receive a one-of-a-kind piece that perfectly reflects your style and story.",
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

