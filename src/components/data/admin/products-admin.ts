export type AdminProduct = {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  status: 'active' | 'draft' | 'archived'
}

export const adminProducts: AdminProduct[] = [
  { id: 'p1', name: 'Diamond Ring', sku: 'DR-1001', category: 'Rings', price: 1299, stock: 24, status: 'active' },
  { id: 'p2', name: 'Gold Necklace', sku: 'GN-2001', category: 'Necklaces', price: 899, stock: 12, status: 'active' },
  { id: 'p3', name: 'Stud Earrings', sku: 'SE-3001', category: 'Earrings', price: 199, stock: 50, status: 'draft' },
  { id: 'p4', name: 'Tennis Bracelet', sku: 'TB-4001', category: 'Bracelets', price: 649, stock: 8, status: 'active' },
]


