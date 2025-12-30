'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Crown, Diamond, Sparkles } from 'lucide-react'
import LogoLoader from '@/components/ui/logo-loader'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isInitializing, setIsInitializing] = useState(true)
  const [showLoader, setShowLoader] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Set dark mode immediately (blocking script prevents flash)
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('dark')
    }
    
    // Check auth and initialize with smart loading
    const initAuth = () => {
      const startTime = Date.now()
      // Prefill from local storage for easy login
      const savedEmail = localStorage.getItem('admin-email')
      const savedPassword = localStorage.getItem('admin-password')
      if (savedEmail) setEmail(savedEmail)
      if (savedPassword) setPassword(savedPassword)
      const lsAuth = localStorage.getItem('admin-auth')
      
      if (lsAuth === '1') {
        // If already logged in, check if fast enough
        const elapsed = Date.now() - startTime
        if (elapsed > 300) {
          setShowLoader(true)
        }
        router.push('/sara-admin/dashboard')
      } else {
        const elapsed = Date.now() - startTime
        if (elapsed > 300) {
          setShowLoader(true)
          setTimeout(() => {
            setIsInitializing(false)
            setShowLoader(false)
          }, 500)
        } else {
          setIsInitializing(false)
        }
      }
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initAuth, 50)
    
    return () => {
      clearTimeout(timer)
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setShowLoader(true)
    const startTime = Date.now()

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        const data = await res.json()
        console.log('Login successful:', data)
        // Set client-side auth indicator since cookie is httpOnly
        localStorage.setItem('admin-auth', '1')
        // Save credentials for easy login next time
        localStorage.setItem('admin-email', email)
        localStorage.setItem('admin-password', password)
        
        // Minimum loading time for better UX
        const elapsed = Date.now() - startTime
        const minDelay = 500
        if (elapsed < minDelay) {
          await new Promise(resolve => setTimeout(resolve, minDelay - elapsed))
        }
        
        window.location.href = '/sara-admin/dashboard'
        return
      } else {
        const data = await res.json()
        setError(data.error || 'Invalid credentials')
        setShowLoader(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Connection failed. Please try again.')
      setShowLoader(false)
    } finally {
      setLoading(false)
    }
  }

  if (isInitializing || showLoader) {
    return (
      <>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof document !== 'undefined') {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
          <LogoLoader />
        </div>
      </>
    )
  }

  return (
    <>
      {/* Blocking script to prevent dark mode flash */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              if (typeof document !== 'undefined') {
                document.documentElement.classList.add('dark');
              }
            })();
          `,
        }}
      />
      <div className="min-h-screen relative flex items-center justify-center p-3 sm:p-4 md:p-6 bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.12),transparent_50%)]" />
        </div>
        
        <div className="relative w-full max-w-md mx-auto">
          {/* Decorative Elements - Hidden on mobile */}
          <div className="hidden sm:block absolute -top-10 -left-10 text-[#d4af37] opacity-20">
            <Sparkles size={40} />
          </div>
          <div className="hidden sm:block absolute -top-5 -right-5 text-[#f4d03f] opacity-30">
            <Diamond size={30} />
          </div>
          <div className="hidden sm:block absolute -bottom-10 -right-10 text-[#d4af37] opacity-20">
            <Sparkles size={35} />
          </div>
          
          {/* Main Card */}
          <div className="bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 md:p-10 relative overflow-hidden">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 to-[#f4d03f]/10 rounded-2xl sm:rounded-3xl"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
                  <img src="/logo.webp" alt="Sara Jewelers" className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain" />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
                  <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">Sara Jewelers</span>
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">Admin Portal</p>
                <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] rounded-full mx-auto mt-2 sm:mt-3"></div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base bg-gray-50/80 dark:bg-[#2a2a2a]/80 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
                      placeholder="Email Address"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4">
                      <div className="w-2 h-2 bg-[#d4af37] rounded-full opacity-60"></div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base bg-gray-50/80 dark:bg-[#2a2a2a]/80 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
                      placeholder="Password"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4">
                      <div className="w-2 h-2 bg-[#f4d03f] rounded-full opacity-60"></div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-red-700 dark:text-red-300 text-xs sm:text-sm text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-black font-semibold py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border-2 border-[#d4af37]/30 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Enter Admin Portal</span>
                    </div>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-6 sm:mt-8 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Secure Admin Access • Sara Jewelers Management
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}