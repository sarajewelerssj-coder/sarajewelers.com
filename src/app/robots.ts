import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/sara-admin/',
        '/api/',
        '/account/',
        '/cart',
        '/wishlist',
      ],
    },
    sitemap: 'https://www.sarajeweler.com/sitemap.xml',
  }
}
