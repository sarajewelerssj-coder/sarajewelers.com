'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Chrome, ArrowRight } from 'lucide-react'
import gsap from 'gsap'

export default function AuthFlow() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const formRef = useRef(null)
  const [companyLogo, setCompanyLogo] = useState('/logo.webp')

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.companyLogo) setCompanyLogo(data.companyLogo)
      })
      .catch(err => console.error('Failed to load branding:', err))
  }, [])
  
  useEffect(() => {
    // Premium entrance animation
    gsap.fromTo(formRef.current, 
      { opacity: 0, y: 20, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out', delay: 0.1 }
    )
  }, [])

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      toast.error('Google login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto relative z-10">
      <motion.div 
        ref={formRef}
        className="relative bg-white/70 dark:bg-[#1a1a1a]/70 backdrop-blur-2xl border border-white/20 dark:border-gray-800/50 rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* Abstract Background Element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#d4af37]/10 dark:bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#d4af37]/10 dark:bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex justify-center mb-10">
            <div className="relative">
              <img 
                src={companyLogo}
                alt="Sara Jewelers" 
                className="w-24 h-24 object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif italic font-bold tracking-tight text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-serif)' }}>Welcome</h2>
            <p className="text-gray-500 dark:text-gray-400">Step into the world of luxury</p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-4 flex items-center justify-center gap-3 bg-white dark:bg-[#252525] border border-gray-100 dark:border-gray-800 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#d4af37]" />
              ) : (
                <>
                  <Chrome className="w-5 h-5 text-[#4285F4]" />
                  <span className="text-gray-700 dark:text-white">Continue with Google</span>
                </>
              )}
            </button>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="px-4 bg-white/0 text-gray-400">Secure & Fast</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-[#f8f4e8]/50 dark:bg-gray-800/50 rounded-2xl border border-[#d4af37]/10">
                <div className="text-[#d4af37] text-xl mb-1">🔒</div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Secure Login</p>
              </div>
              <div className="p-4 bg-[#f8f4e8]/50 dark:bg-gray-800/50 rounded-2xl border border-[#d4af37]/10">
                <div className="text-[#d4af37] text-xl mb-1">⚡</div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Quick Access</p>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-[10px] text-gray-400 dark:text-gray-500 max-w-[200px] mx-auto leading-relaxed">
                By signing in, you agree to our <span className="text-[#d4af37] cursor-pointer hover:underline">Terms of Service</span> and <span className="text-[#d4af37] cursor-pointer hover:underline">Privacy Policy</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
