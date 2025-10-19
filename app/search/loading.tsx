import LogoLoader from "@/components/ui/logo-loader"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f3] via-white to-[#f8f4e8] dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#2a2a2a]">
      <LogoLoader />
    </div>
  )
}

