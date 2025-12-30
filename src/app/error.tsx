'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Handled Global Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#fffafa] dark:bg-[#0d0a0a] flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900/20 rounded-[2.5rem] p-12 shadow-2xl shadow-red-500/5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
           <AlertCircle className="w-48 h-48 rotate-12" />
        </div>

        <div className="relative z-10 space-y-8">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-500/80" />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-black text-[#1a1a1a] dark:text-white">
              Unexpected <span className="text-red-500">Error</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
              We encountered a slight imperfection in your experience. Our artisans have been notified. Please try refreshing or returning home.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => reset()}
              className="group flex items-center gap-2 px-8 py-4 bg-red-500 text-white rounded-2xl font-black transition-all hover:bg-red-600 hover:scale-105 active:scale-95 shadow-xl shadow-red-500/20"
            >
              <RefreshCcw className="w-5 h-5 transition-transform group-hover:rotate-180" />
              Try Again
            </button>

            <Link
              href="/"
              className="flex items-center gap-2 px-8 py-4 bg-gray-100 dark:bg-gray-800 text-[#1a1a1a] dark:text-white rounded-2xl font-black transition-all hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </div>
          
          <div className="pt-4">
            <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest break-all">
               Error Digest: {error.digest || 'Internal Exception'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
