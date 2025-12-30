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
            <h4 className="text-lg font-serif italic font-bold text-gray-900 dark:text-white mb-8 tracking-tight border-b border-[#d4af37]/20 pb-2 inline-block" style={{ fontFamily: 'var(--font-serif)' }}>Shop</h4>
            <ul className="space-y-4">
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
                    className="text-gray-600 dark:text-gray-300 hover:text-[#d4af37] dark:hover:text-[#f4d03f] transition-all duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-[#d4af37] mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div className={`transition-all duration-1000 ease-out delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h4 className="text-lg font-serif italic font-bold text-gray-900 dark:text-white mb-8 tracking-tight border-b border-[#d4af37]/20 pb-2 inline-block" style={{ fontFamily: 'var(--font-serif)' }}>Customer Service</h4>
            <ul className="space-y-4">
              {[
                { name: "Experience & Contact", link: "/contact" },
                { name: "Information Hub", link: "/policies" },
                { name: "Shipping Policy", link: "/policies#shipping" },
                { name: "Return Policy", link: "/policies#returns" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    className="text-gray-600 dark:text-gray-300 hover:text-[#d4af37] dark:hover:text-[#f4d03f] transition-all duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-[#d4af37] mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 */}
          <div className={`transition-all duration-1000 ease-out delay-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h4 className="text-lg font-serif italic font-bold text-gray-900 dark:text-white mb-8 tracking-tight border-b border-[#d4af37]/20 pb-2 inline-block" style={{ fontFamily: 'var(--font-serif)' }}>Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex items-start group">
                <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center mr-4 transition-colors group-hover:bg-[#d4af37]/20 flex-shrink-0">
                  <MapPin size={18} className="text-[#d4af37] dark:text-[#f4d03f]" />
                </div>
                <span className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  Hamilton Mall, Sara Jewelers<br />
                  4403 Black Horse Pike, K225 <br />
                  Mays Landing, NJ 08330
                </span>
              </li>
              <li className="flex items-center group">
                <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center mr-4 transition-colors group-hover:bg-[#d4af37]/20 flex-shrink-0">
                  <Phone size={18} className="text-[#d4af37] dark:text-[#f4d03f]" />
                </div>
                <span className="text-gray-600 dark:text-gray-300 text-sm">609-855-9100</span>
              </li>
              <li className="flex items-center group">
                <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center mr-4 transition-colors group-hover:bg-[#d4af37]/20 flex-shrink-0">
                  <Mail size={18} className="text-[#d4af37] dark:text-[#f4d03f]" />
                </div>
                <span className="text-gray-600 dark:text-gray-300 text-sm break-all">S.wcollections2@gmail.com</span>
              </li>
            </ul>

            <div className="mt-8 bg-white/50 dark:bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-[#d4af37]/10 shadow-sm transition-all hover:shadow-md hover:border-[#d4af37]/30 group">
              <h5 className="font-serif italic font-bold text-[#d4af37] dark:text-[#f4d03f] mb-3 tracking-wide flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse"></div>
                Store Hours
              </h5>
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500">Mon-Fri:</span>
                  <span className="text-gray-700 dark:text-gray-200 font-medium">10AM - 8PM</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500">Sat:</span>
                  <span className="text-gray-700 dark:text-gray-200 font-medium">10AM - 6PM</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500">Sun:</span>
                  <span className="text-gray-700 dark:text-gray-200 font-medium">12PM - 5PM</span>
                </div>
              </div>
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