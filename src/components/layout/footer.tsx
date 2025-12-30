"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube, Linkedin } from "lucide-react"

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false)
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <footer ref={footerRef} className="bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a] relative overflow-hidden pt-16 pb-8">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1 */}
          <div className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <img 
              src="/logo.webp" 
              alt="Sara Jewelers" 
              className="w-56 h-28 object-contain mb-6"
            />
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Crafting exquisite jewelry pieces that celebrate life's special moments since 2019. Our commitment to
              quality and craftsmanship is unmatched.
            </p>
            <div className="flex space-x-4">
              {[Instagram, Facebook, Twitter, Youtube, Linkedin].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#d4af37] dark:hover:text-[#f4d03f] transition-colors duration-300"
                >
                  <Icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2 */}
          <div className={`transition-all duration-1000 ease-out delay-150 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h4 className="text-lg font-serif italic font-bold text-gray-900 dark:text-white mb-6 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Shop</h4>
            <ul className="space-y-3">
              {[
                { name: "Engagement Rings", link: "/categories/engagement-rings" },
                { name: "Wedding Rings", link: "/categories/wedding-rings" },
                { name: "Diamonds", link: "/diamonds" },
                { name: "Gifts Galore", link: "/products?collection=gifts" },
                { name: "Custom Design", link: "/custom-design" },
                { name: "New Arrivals", link: "/categories/new-arrivals" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    className="text-gray-600 dark:text-gray-300 hover:text-[#d4af37] dark:hover:text-[#f4d03f] transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div className={`transition-all duration-1000 ease-out delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h4 className="text-lg font-serif italic font-bold text-gray-900 dark:text-white mb-6 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Customer Service</h4>
            <ul className="space-y-3">
              {[
                { name: "Experience & Contact", link: "/contact" },
                { name: "Information Hub", link: "/policies" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    className="text-gray-600 dark:text-gray-300 hover:text-[#d4af37] dark:hover:text-[#f4d03f] transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 */}
          <div className={`transition-all duration-1000 ease-out delay-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h4 className="text-lg font-serif italic font-bold text-gray-900 dark:text-white mb-6 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="mr-3 text-[#d4af37] dark:text-[#f4d03f] mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">Hamilton Mall, Sara Jewelers<br />4403 Black Horse Pike, K225 Mays Landing, NJ 08330</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-3 text-[#d4af37] dark:text-[#f4d03f] flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">609-855-9100</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-3 text-[#d4af37] dark:text-[#f4d03f] flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">S.wcollections2@gmail.com</span>
              </li>
            </ul>

            <div className="mt-6 bg-gradient-to-br from-white to-[#faf8f3] dark:from-[#2a2a2a] dark:to-[#1a1a1a] p-4 rounded-lg border border-[#d4af37]/20 shadow-lg">
              <h5 className="font-serif italic font-bold text-[#d4af37] dark:text-[#f4d03f] mb-2 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Store Hours</h5>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Mon-Fri: 10AM - 8PM</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Sat: 10AM - 6PM</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Sun: 12PM - 5PM</p>
            </div>
          </div>
        </div>

        <div className={`border-t border-[#d4af37]/20 pt-8 mt-8 transition-all duration-1000 ease-out delay-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col items-center space-y-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2025 Sara Jewelers. All rights reserved.
            </p>
            <p className="text-sm">
              Developed by <a href="https://alihamzapro.com" target="_blank" rel="noopener noreferrer" className="text-[#d4af37] dark:text-[#f4d03f] font-semibold hover:underline">AliHamza Pro</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}