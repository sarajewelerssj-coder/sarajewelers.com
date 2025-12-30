'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, ArrowLeft, Gem } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-[#d4af37]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-[-5%] w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 space-y-8"
      >
        <div className="flex justify-center">
          <div className="relative">
            <Gem className="w-24 h-24 text-[#d4af37] animate-pulse" />
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-[#d4af37]/60" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-7xl md:text-9xl font-black text-[#1a1a1a] dark:text-white tracking-widest opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 select-none">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-black text-[#1a1a1a] dark:text-white">
            Lost in <span className="text-[#d4af37]">Elegance</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-lg leading-relaxed">
            The masterpiece you are looking for seems to have been misplaced. Your journey to timeless brilliance continues elsewhere.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="group flex items-center gap-2 px-8 py-4 bg-[#1a1a1a] dark:bg-[#d4af37] text-white dark:text-black rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10 dark:shadow-[#d4af37]/20"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Return Home
          </Link>
          
          <Link
            href="/shop"
            className="px-8 py-4 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 text-[#1a1a1a] dark:text-white rounded-2xl font-black transition-all hover:border-[#d4af37] dark:hover:border-[#d4af37] hover:text-[#d4af37] dark:hover:text-[#d4af37] hover:scale-105"
          >
            Explore Collections
          </Link>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-gray-400"
      >
        Sara Jewelers &copy; 2025
      </motion.div>
    </div>
  )
}
