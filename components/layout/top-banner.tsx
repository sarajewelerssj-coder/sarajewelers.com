"use client"

import { useState } from "react"
import { Phone } from "lucide-react"
import Link from "next/link"

export default function TopBanner() {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) return null

  return (
    <div className="w-full hidden sm:flex bg-gradient-to-r from-[#b17a65] to-[#d4af37] text-white py-3 px-4 justify-between items-center">
      <Link href="/contact" className="text-sm hover:underline">
        Book Consultation
      </Link>
      <div className="text-center text-sm md:text-base font-medium">Handcrafted Excellence | Free Shipping $100+ | Expert Jewelry Services</div>
      <div className="flex items-center gap-2">
        <Phone size={16} />
        <a href="tel:+16098559100" className="text-sm md:text-base hover:underline">+1 (609) 855-9100</a>
      </div>
    </div>
  )
}

