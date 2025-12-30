"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronDown, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"

interface FilterBarProps {
  totalItems: number
  sortBy: string
  onSortChange: (value: string) => void
  priceRange: number[]
  setPriceRange: (value: number[]) => void
  selectedMaterials: string[]
  toggleMaterial: (material: string) => void
  selectedStyles: string[]
  toggleStyle: (style: string) => void
  applyFilters: () => void
  resetFilters: () => void
}

export default function FilterBar({
  totalItems,
  sortBy,
  onSortChange,
  priceRange,
  setPriceRange,
  selectedMaterials,
  toggleMaterial,
  selectedStyles,
  toggleStyle,
  applyFilters,
  resetFilters,
}: FilterBarProps) {
  const [filterOpen, setFilterOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const materials = ["Gold", "Silver", "Rose Gold", "Platinum", "White Gold"]
  const styles = [
    { name: "Bezel", count: 15 },
    { name: "Halo", count: 120 },
    { name: "Hidden Halo", count: 62 },
    { name: "Nature Inspired", count: 16 },
    { name: "Pave", count: 231 },
    { name: "Side Stones", count: 112 },
    { name: "Solitaire", count: 122 },
    { name: "Three Stone", count: 60 },
    { name: "Toi Et Moi", count: 7 },
    { name: "Vintage", count: 22 },
  ]

  const shapes = [
    { name: "Antique Cut", count: 56 },
    { name: "Asscher", count: 11 },
    { name: "Baguette", count: 4 },
    { name: "Cushion", count: 42 },
    { name: "Dutch Marquise", count: 15 },
  ]

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value)
  }

  const handleApplyFilters = () => {
    applyFilters()
    setFilterOpen(false)
  }

  return (
    <>
      {/* Filter bar */}
      <div
        className={`bg-white dark:bg-[#1e1e1e] border-b border-[#e0e0e0] dark:border-[#444444] py-3 transition-all duration-300 ${isScrolled ? "sticky top-[72px] z-40 shadow-sm" : ""}`}
      >
        <div className="container mx-auto px-4 max-w-7xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 overflow-hidden">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 dark:border-[#f4d03f] dark:text-[#f4d03f] dark:hover:bg-[#f4d03f]/10 transition-all"
            onClick={() => setFilterOpen(true)}
          >
            <SlidersHorizontal size={16} />
            Filter By
          </Button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <span className="text-foreground font-medium text-sm">{totalItems} Items</span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">SORT BY</span>
              <div className="relative flex-grow">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="w-full appearance-none bg-background border border-input rounded-md py-1.5 pl-3 pr-8 text-sm text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="best-selling">Best Selling</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter sidebar */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="left" className="w-[350px] sm:w-[400px] p-0 overflow-y-auto">
          <SheetHeader className="p-4 border-b border-border sticky top-0 bg-background z-10">
            <div className="flex justify-between items-center">
              <SheetTitle className="text-lg font-bold text-foreground">FILTER BY</SheetTitle>
              <SheetClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-accent transition-colors">
                <X size={18} />
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="p-4 space-y-6">
            {/* Price Range */}
            <div className="animate-fade-in">
              <h3 className="text-gray-900 dark:text-white font-medium mb-4">PRICE RANGE</h3>
              <Slider
                defaultValue={[0, 5000]}
                max={5000}
                step={100}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Style */}
            <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
              <h3 className="text-gray-900 dark:text-white font-medium mb-4">STYLE</h3>
              <div className="space-y-3">
                {styles.map((style) => (
                  <div key={style.name} className="flex items-center">
                    <Checkbox
                      id={`style-${style.name}`}
                      checked={selectedStyles.includes(style.name)}
                      onCheckedChange={() => toggleStyle(style.name)}
                      className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-[#d4af37] data-[state=checked]:border-[#d4af37] dark:data-[state=checked]:bg-[#f4d03f] dark:data-[state=checked]:border-[#f4d03f]"
                    />
                    <Label
                      htmlFor={`style-${style.name}`}
                      className="ml-2 text-gray-700 dark:text-gray-300 cursor-pointer text-sm flex-1 hover:text-[#d4af37] dark:hover:text-[#f4d03f] transition-colors"
                    >
                      {style.name}
                    </Label>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({style.count})</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Shape */}
            <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
              <h3 className="text-gray-900 dark:text-white font-medium mb-4">SHAPE</h3>
              <div className="space-y-3">
                {shapes.map((shape) => (
                  <div key={shape.name} className="flex items-center">
                    <Checkbox
                      id={`shape-${shape.name}`}
                      className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-[#d4af37] data-[state=checked]:border-[#d4af37] dark:data-[state=checked]:bg-[#f4d03f] dark:data-[state=checked]:border-[#f4d03f]"
                    />
                    <Label
                      htmlFor={`shape-${shape.name}`}
                      className="ml-2 text-gray-700 dark:text-gray-300 cursor-pointer text-sm flex-1 hover:text-[#d4af37] dark:hover:text-[#f4d03f] transition-colors"
                    >
                      {shape.name}
                    </Label>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({shape.count})</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Material */}
            <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
              <h3 className="text-gray-900 dark:text-white font-medium mb-4">MATERIAL</h3>
              <div className="space-y-3">
                {materials.map((material) => (
                  <div key={material} className="flex items-center">
                    <Checkbox
                      id={`material-${material}`}
                      checked={selectedMaterials.includes(material)}
                      onCheckedChange={() => toggleMaterial(material)}
                      className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-[#d4af37] data-[state=checked]:border-[#d4af37] dark:data-[state=checked]:bg-[#f4d03f] dark:data-[state=checked]:border-[#f4d03f]"
                    />
                    <Label
                      htmlFor={`material-${material}`}
                      className="ml-2 text-gray-700 dark:text-gray-300 cursor-pointer text-sm hover:text-[#d4af37] dark:hover:text-[#f4d03f] transition-colors"
                    >
                      {material}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="sticky bottom-0 bg-background pt-4 pb-6 flex gap-3 animate-fade-in"
              style={{ animationDelay: "400ms" }}
            >
              <Button
                variant="outline"
                className="flex-1 border-input hover:bg-accent hover:text-accent-foreground transition-all"
                onClick={resetFilters}
              >
                Reset
              </Button>
              <Button
                className="flex-1 bg-[#d4af37] hover:bg-[#d4af37]/90 dark:bg-[#f4d03f] dark:hover:bg-[#f4d03f]/90 text-white dark:text-black transition-all"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

