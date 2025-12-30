"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Star } from "lucide-react"

export default function PromoBanner() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as any,
      },
    },
  }

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banners/Premium Collection.webp"
          alt="Luxury Jewelry"
          fill
          className="object-cover scale-110 transition-transform duration-700 hover:scale-100"
          priority
        />
        {/* Enhanced Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#d4af37]/20 via-transparent to-transparent" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-5 opacity-30 select-none pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          className="absolute top-20 left-10"
        >
          <Sparkles className="text-[#d4af37] w-8 h-8" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
          className="absolute top-40 right-20"
        >
          <Star className="text-[#d4af37] w-6 h-6" />
        </motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute top-1/3 right-1/3 w-32 h-32 border border-[#d4af37]/20 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-1/3 w-20 h-20 border border-[#d4af37]/30 rounded-full"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl"
        >
          {/* Enhanced Limited Time Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-3 bg-[#d4af37]/20 backdrop-blur-md border border-[#d4af37]/40 px-6 py-3 rounded-full mb-8 group cursor-default"
          >
            <div className="w-3 h-3 bg-[#d4af37] rounded-full relative">
              <div className="absolute inset-0 bg-[#d4af37] rounded-full animate-ping opacity-75" />
            </div>
            <span className="text-[#d4af37] text-sm md:text-base font-bold tracking-widest uppercase group-hover:tracking-[0.15em] transition-all duration-300">
              Limited Time Offer
            </span>
          </motion.div>

          {/* Main Heading with Animation */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic font-bold text-white mb-6 leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            <span className="block mb-2">Exclusive Collection</span>
            <span className="bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] bg-clip-text text-transparent inline-block animate-pulse text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              30% OFF
            </span>
          </motion.h2>

          {/* Enhanced Description */}
          <motion.p
            variants={itemVariants}
            className="text-white/90 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-3xl leading-relaxed"
          >
            Discover our exclusive collection of handcrafted jewelry pieces. Each piece is meticulously designed to
            bring out your unique style and elegance.
          </motion.p>

          {/* Enhanced CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6">
            <Link href="/categories">
              <Button className="group relative overflow-hidden bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-black font-bold px-8 sm:px-10 py-5 sm:py-7 text-lg sm:text-xl rounded-full shadow-2xl hover:shadow-[#d4af37]/50 transition-all duration-500 hover:scale-105 active:scale-95 border-2 border-[#d4af37]/30">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10 flex items-center gap-3">
                  Shop Now
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Button>
            </Link>

            <Link href="/custom-design">
              <Button className="group bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold px-8 sm:px-10 py-5 sm:py-7 text-lg sm:text-xl rounded-full border-2 border-white/30 hover:border-[#d4af37] transition-all duration-500 hover:scale-105 active:scale-95 hover:text-[#d4af37]">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Fade Effect - Optimized for luxury look */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/10 dark:from-black/20 to-transparent z-10" />
    </section>
  )
}
