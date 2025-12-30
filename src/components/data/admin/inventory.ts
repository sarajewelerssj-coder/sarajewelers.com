export type AdminInventoryItem = {
  sku: string
  product: string
  stock: number
  threshold: number
}

export const adminInventory: AdminInventoryItem[] = [
  { sku: 'DR-1001', product: 'Diamond Ring', stock: 24, threshold: 10 },
  { sku: 'GN-2001', product: 'Gold Necklace', stock: 12, threshold: 8 },
  { sku: 'SE-3001', product: 'Stud Earrings', stock: 50, threshold: 20 },
]


