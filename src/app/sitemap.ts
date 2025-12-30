import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://sarajeweler.com'

  // Static routes
  const staticRoutes = [
    '',
    '/contact',
    '/policies',
    '/products',
    '/categories',
    '/custom-design',
    '/diamonds',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic routes (Products)
  // Note: In a real environment, you'd fetch these from your DB/API
  // For now, providing a structured approach
  let productRoutes: any[] = []
  try {
    const response = await fetch(`${baseUrl}/api/products`)
    const data = await response.json()
    if (data.success && data.products) {
      productRoutes = data.products.map((product: any) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product.updatedAt || new Date()),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.warn('Sitemap: Failed to fetch products for dynamic routes')
  }

  // Dynamic routes (Categories)
  let categoryRoutes: any[] = []
  try {
    const response = await fetch(`${baseUrl}/api/collections?type=shop-by-category`)
    const data = await response.json()
    if (data.success && data.collections) {
      const categories = data.collections[0]?.categories || []
      categoryRoutes = categories.map((cat: any) => ({
        url: `${baseUrl}/categories/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    }
  } catch (error) {
    console.warn('Sitemap: Failed to fetch categories for dynamic routes')
  }

  return [...staticRoutes, ...productRoutes, ...categoryRoutes]
}
