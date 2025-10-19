"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    
    // Simulate Google login
    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true")
      setIsLoading(false)
      toast({
        title: "Welcome to Sara Jewelers!",
        description: "Successfully signed in with Google",
        duration: 3000,
      })
      window.location.reload()
    }, 1500)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo Section */}
      <div className="text-center mb-8">
        <div className="mb-6">
          <img 
            src="/logo.webp" 
            alt="Sara Jewelers" 
            className="w-24 h-24 object-contain mx-auto mb-4"
          />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#d4af37] to-[#f4d03f] bg-clip-text text-transparent mb-3">
          Easy Login to Order
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400 font-medium">
          Join our premium jewelry collection
        </p>
      </div>

      {/* Google Sign In Button */}
      <div className="space-y-4">
        <Button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-[#d4af37] transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </span>
            ) : (
              "Continue with Google"
            )}
          </div>
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              Secure & Fast Authentication
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-[#f8f4e8] dark:bg-gray-800 rounded-lg">
            <div className="text-[#d4af37] text-lg mb-1">🔒</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Secure Login</p>
          </div>
          <div className="p-3 bg-[#f8f4e8] dark:bg-gray-800 rounded-lg">
            <div className="text-[#d4af37] text-lg mb-1">⚡</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Quick Access</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}