import type React from "react"
import type { Metadata } from "next"
import { Inter, Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import ConditionalLayout from "@/components/layout/conditional-layout"
import { Toaster } from "@/components/ui/sonner"
import AuthProvider from "@/components/auth/session-provider"
import ConfigNotification from "@/components/config-notification"
// Import to trigger auto-initialization (runs once globally)

const inter = Inter({ subsets: ["latin"] })
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: "Sara Jewelers | Fine Diamond Jewelry & Custom Designs Hamilton NJ",
  description: "Discover exquisite diamond engagement rings, gold jewelry & custom designs at Sara Jewelers. Expert craftsmanship in Hamilton Mall. Shop luxury collections.",
  keywords: ["diamond jewelry", "custom rings", "gold jewelry", "engagement rings", "Hamilton NJ", "Sara Jewelers", "wedding bands", "jewelry store"],
  authors: [{ name: "Sara Jewelers" }],
  creator: "Sara Jewelers",
  publisher: "Sara Jewelers",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sarajeweler.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Sara Jewelers | Fine Diamond Jewelry & Custom Designs",
    description: "Discover exquisite diamond engagement rings and custom jewelry designs. Quality craftsmanship and certified stones.",
    url: 'https://sarajeweler.com',
    siteName: 'Sara Jewelers',
    images: [
      {
        url: '/logo.webp',
        width: 800,
        height: 600,
        alt: 'Sara Jewelers Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sara Jewelers | Fine Diamond Jewelry",
    description: "Discover exquisite diamond engagement rings and custom jewelry designs.",
    images: ['/logo.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.webp',
    shortcut: '/logo.webp',
    apple: '/logo.webp',
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  "name": "Sara Jewelers",
  "image": "https://sarajeweler.com/logo.webp",
  "@id": "https://sarajeweler.com",
  "url": "https://sarajeweler.com",
  "telephone": "+1-609-677-1111", // Placeholder - adjust if needed
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "4403 Black Horse Pike",
    "addressLocality": "K225 Mays Landing",
    "addressRegion": "NJ",
    "postalCode": "08330",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 39.4538746,
    "longitude": -74.6456739
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "opens": "10:00",
    "closes": "21:00"
  },
  "sameAs": [
    "https://www.facebook.com/sarajewelers",
    "https://www.instagram.com/sarajewelers"
  ]
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('admin-theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.className} ${cormorant.variable} min-h-screen antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
          <ConfigNotification />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
