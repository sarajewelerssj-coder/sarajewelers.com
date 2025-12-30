export type AdminCustomer = {
  id: string
  name: string
  email: string
  orders: number
  spend: number
}

export const adminCustomers: AdminCustomer[] = [
  { id: 'u1', name: 'Ali Raza', email: 'ali@example.com', orders: 5, spend: 1899 },
  { id: 'u2', name: 'Ayesha Khan', email: 'ayesha@example.com', orders: 2, spend: 999 },
  { id: 'u3', name: 'Sara Ahmed', email: 'sara@example.com', orders: 1, spend: 349 },
]


