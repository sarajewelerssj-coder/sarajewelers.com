"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right" // Moved to bottom-right for the "right-to-left" feel
      richColors
      closeButton
      icons={{
        success: <CircleCheckIcon className="size-4 text-[#d4af37]" />,
        info: <InfoIcon className="size-4 text-[#d4af37]" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-500" />,
        error: <OctagonXIcon className="size-4 text-rose-500" />,
        loading: <Loader2Icon className="size-4 animate-spin text-[#d4af37]" />,
      }}
      toastOptions={{
        className: "group hover:scale-[1.02] transition-all duration-300 md:w-[380px] w-[calc(100vw-32px)] !mb-[70px] md:!mb-0", // Responsive width and mobile bottom offset
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid rgba(212, 175, 55, 0.4)", // Enhanced gold border
          borderRadius: "1.25rem",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
          padding: "16px",
          fontFamily: "inherit",
          fontSize: "14px",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
