import Link from "next/link"
import Image from "next/image"
import LogoLoader from "@/components/ui/logo-loader"
import NewsletterSection from "@/components/layout/newsletter-section"

interface Category {
  _id: string
  name: string
  slug: string
  description: string
  image: string
  isActive: boolean
}

async function getCategories(): Promise<Category[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/categories`)
    if (response.ok) {
      const data = await response.json()
      return data.categories || []
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
  return []
}

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const categoriesData = await getCategories()


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative max-w-7xl">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]" />
            <span className="text-[#d4af37] dark:text-[#f4d03f] text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
              Explore Our
            </span>
            <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-[#d4af37] to-gray-900 dark:from-white dark:via-[#f4d03f] dark:to-white bg-clip-text text-transparent">
              Jewelry Categories
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explore our extensive collection of fine jewelry, each piece crafted with 
            <span className="text-[#d4af37] dark:text-[#f4d03f] font-medium">precision and care</span>.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-white dark:bg-[#1e1e1e] relative overflow-hidden min-h-[600px]">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative max-w-7xl">
          {categoriesData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {categoriesData.map((category, index) => (
                <Link
                  href={`/categories/${category.slug}`}
                  key={category._id}
                  className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-[#d4af37]/20 dark:hover:shadow-[#f4d03f]/20 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-[#d4af37]/40 dark:hover:border-[#f4d03f]/40"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/10 to-[#f4d03f]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-white/80 text-sm md:text-base opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#f4d03f]/20 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4d03f] flex items-center justify-center">
                  <span className="text-2xl">💎</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                No Categories Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                We're currently updating our jewelry categories. Please check back soon to explore our beautiful collections.
              </p>
            </div>
          )}
        </div>
      </section>

      <NewsletterSection />
    </div>
  )
}

