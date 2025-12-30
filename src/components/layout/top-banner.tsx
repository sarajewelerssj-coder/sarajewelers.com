"use client"

import { useState, useEffect } from "react"
import { Phone } from "lucide-react"
import Link from "next/link"

export default function TopBanner() {
  const [isOpen, setIsOpen] = useState(true)
  const [shippingThreshold, setShippingThreshold] = useState<number | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings')
        if (response.ok) {
          const data = await response.json()
          setShippingThreshold(data.freeShippingThreshold)
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      }
    }
    fetchSettings()
  }, [])

  if (!isOpen) return null

  return (
    <div className="w-full hidden sm:flex bg-gradient-to-r from-[#b17a65] to-[#d4af37] text-white py-3 px-4 justify-between items-center">
      <Link href="/contact" className="text-xs uppercase tracking-widest hover:text-white transition-colors duration-300 font-medium font-serif italic" style={{ fontFamily: 'var(--font-serif)' }}>
        Book Consultation
      </Link>
      <div className="text-center text-xs md:text-sm font-semibold tracking-[0.15em] uppercase">
        Handcrafted Excellence <span className="mx-2 opacity-50">|</span> Free Express Shipping Over ${shippingThreshold !== null ? shippingThreshold.toLocaleString() : "100"} <span className="mx-2 opacity-50">|</span> Expert Services
      </div>
      <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
        <Phone size={14} />
        <a href="tel:+16098559100" className="text-xs md:text-sm font-medium tracking-wide">+1 (609) 855-9100</a>
      </div>
    </div>
  )
}

