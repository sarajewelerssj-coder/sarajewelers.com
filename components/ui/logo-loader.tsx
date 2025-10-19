export default function LogoLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="w-20 h-20 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
        
        {/* Inner logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-white font-bold text-sm">SJ</span>
          </div>
        </div>
        
        {/* Floating dots */}
        <div className="absolute -top-2 -right-2 w-2 h-2 bg-[#d4af37] rounded-full animate-bounce"></div>
        <div className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-[#f4d03f] rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  )
}