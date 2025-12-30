export type AdminOrder = {
  id: string
  customer: string
  total: number
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
}

export const adminOrders: AdminOrder[] = [
  { id: 'O-10021', customer: 'Ayesha Khan', total: 2599, status: 'processing', createdAt: '2025-10-23' },
  { id: 'O-10022', customer: 'Ali Raza', total: 899, status: 'shipped', createdAt: '2025-10-24' },
  { id: 'O-10023', customer: 'Sara Ahmed', total: 349, status: 'delivered', createdAt: '2025-10-25' },
]


