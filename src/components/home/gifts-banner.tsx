"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GiftsBanner() {
  const contentVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as any,
      },
    },
  }

  const imageVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1] as any,
      },
    },
  }

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
      <div className="absolute inset-0 opacity-5 select-none pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 relative max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={contentVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:order-1 flex flex-col justify-center"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm font-semibold tracking-[0.2em] uppercase">
                Perfect Gifts
              </span>
              <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>

            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-serif italic font-bold leading-tight mb-6 tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
                Gifts for Every Occasion
              </span>
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              Find the perfect gift for life's special moments. From birthdays to anniversaries, our curated collection
              offers something meaningful for everyone you love.
            </p>

            <Link href="/gifts-galore">
              <Button className="group relative overflow-hidden bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-black font-bold px-8 py-5 rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/30 transition-all duration-500 hover:scale-105 active:scale-95 border-2 border-[#d4af37]/20">
                <span className="relative z-10 flex items-center gap-3 text-lg">
                  Explore Gifts
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:order-2 relative group"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 group-hover:shadow-[#d4af37]/40 dark:group-hover:shadow-[#f4d03f]/40">
              <Image
                src="/images/banners/Perfect Gifts.webp"
                alt="Gifts for Every Occasion"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>

            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-[#d4af37]/20 rounded-full blur-3xl -z-10 group-hover:bg-[#d4af37]/30 transition-colors duration-700" />
            <div className="absolute -top-8 -left-8 w-48 h-48 bg-[#f4d03f]/10 rounded-full blur-3xl -z-10 group-hover:bg-[#f4d03f]/20 transition-colors duration-700" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}