import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function SecondPromoBanner() {
  return (
    <section className="py-12 md:py-16 bg-[#f8f4e8] dark:bg-[#1a1a1a]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] dark:text-[#f5f5f5] mb-4">
              Craftsmanship That <span className="text-[#d4af37]">Lasts a Lifetime</span>
            </h2>
            <p className="text-[#555555] dark:text-[#cccccc] text-lg mb-6">
              Each piece in our collection is meticulously crafted by master jewelers with decades of experience. We use
              only the finest materials and ethically sourced gemstones to create jewelry that will be treasured for
              generations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/about-us">
                <Button className="bg-[#d4af37] hover:bg-[#b8860b] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  Our Story <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/custom-design">
                <Button
                  variant="outline"
                  className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-white dark:border-[#d4af37] dark:text-[#d4af37] dark:hover:bg-[#d4af37] dark:hover:text-white"
                >
                  Custom Design
                </Button>
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2 relative">
            <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1470&auto=format&fit=crop"
                alt="Jewelry Craftsmanship"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#d4af37]/20 rounded-full blur-xl z-0"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#d4af37]/20 rounded-full blur-xl z-0"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

