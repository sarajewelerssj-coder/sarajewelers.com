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
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover:bg-transparent">
      {theme === "dark" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-[#d8a48f]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-[#b17a65]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

