export type AdminCategory = {
  id: string
  name: string
  slug: string
  products: number
}

export const adminCategories: AdminCategory[] = [
  { id: 'c1', name: 'Rings', slug: 'rings', products: 340 },
  { id: 'c2', name: 'Necklaces', slug: 'necklaces', products: 210 },
  { id: 'c3', name: 'Earrings', slug: 'earrings', products: 180 },
  { id: 'c4', name: 'Bracelets', slug: 'bracelets', products: 95 },
]


