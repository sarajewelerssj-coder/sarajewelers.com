"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="opacity-0">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      className="hover:bg-transparent cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
    >
      {theme === "dark" ? (
        <Moon className="h-6 w-6 text-[#d8a48f] drop-shadow-[0_0_8px_rgba(216,164,143,0.3)] transition-all" />
      ) : (
        <Sun className="h-6 w-6 text-[#b17a65] drop-shadow-[0_0_8px_rgba(177,122,101,0.3)] transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

