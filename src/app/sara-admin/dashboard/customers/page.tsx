'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Download, Eye, Copy, Check, RotateCcw } from 'lucide-react'
import * as XLSX from 'xlsx'
import { toast } from 'sonner'
import LogoLoader from '@/components/ui/logo-loader'

export default function CustomersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [customers, setCustomers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers')
      if (res.ok) {
        const data = await res.json()
        setCustomers(data.customers)
      }
    } catch (err) {
      console.error("Failed to fetch customers")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers
    const query = searchQuery.toLowerCase()
    return customers.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.id.toLowerCase().includes(query)
    )
  }, [searchQuery, customers])

  const exportToExcel = () => {
    const data = filteredCustomers.map(customer => ({
      'ID': customer.id,
      'Name': customer.name,
      'Email': customer.email,
      'Phone': customer.phone,
      'Total Orders': customer.totalOrders,
      'Total Spent': `$${customer.totalSpent.toFixed(2)}`,
      'Joined': new Date(customer.joinedDate).toLocaleDateString()
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Customers')
    XLSX.writeFile(wb, `customers_export_${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Customers exported successfully!')
  }

  const handleCustomerClick = (customerId: string) => {
    router.push(`/sara-admin/dashboard/customers/${customerId}`)
  }

  const copyToClipboard = (text: string, type: string, customerId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(customerId + type)
    toast.success(`${type} copied to clipboard!`)
    setTimeout(() => setCopiedId(null), 2000)
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Customers</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and view customer information</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setIsLoading(true)
              fetchCustomers()
            }}
            className="p-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
            title="Refresh List"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={exportToExcel}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black px-4 py-2 rounded-xl shadow hover:shadow-xl transition-all font-semibold cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search customers by name, email, or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/90 dark:bg-[#1e1e1e]/90 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* Customers Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-[#2a2a2a]/50">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Phone</th>
                <th className="p-4 font-semibold">Orders</th>
                <th className="p-4 font-semibold">Spent</th>
                <th className="p-4 font-semibold">Joined</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-10 h-10 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse font-semibold">Loading customer data...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Search className="w-8 h-8 text-gray-300 dark:text-gray-700" />
                      <p>No customers found matching "{searchQuery}"</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr 
                    key={c.id} 
                    className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-[#2a2a2a]/30 transition-colors group relative"
                  >
                    <td className="p-4 text-gray-900 dark:text-gray-100 font-medium">
                      <Link href={`/sara-admin/dashboard/customers/${c.id}`} className="hover:text-[#d4af37] transition-colors cursor-pointer block">
                        {c.name}
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 group">
                        <span className="text-gray-700 dark:text-gray-300">{c.email}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(c.email, 'email', c.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#d4af37]/10 rounded transition-all"
                          title="Copy email"
                        >
                          {copiedId === c.id + 'email' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-[#d4af37]" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700 dark:text-gray-300">{c.phone}</td>
                    <td className="p-4 text-gray-900 dark:text-gray-100">{c.totalOrders}</td>
                    <td className="p-4 text-gray-900 dark:text-gray-100 font-semibold">${c.totalSpent.toFixed(2)}</td>
                    <td className="p-4 text-gray-500 text-xs">{new Date(c.joinedDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(c.name, 'name', c.id)
                          }}
                          className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-[#d4af37] hover:bg-[#d4af37]/10 rounded-lg transition-colors"
                          title="Copy name"
                        >
                          {copiedId === c.id + 'name' ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <Link
                          href={`/sara-admin/dashboard/customers/${c.id}`}
                          className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-[#d4af37] hover:bg-[#d4af37]/10 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filteredCustomers.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#2a2a2a]/50 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredCustomers.length} of {customers.length} customers
          </div>
        )}
      </div>
    </div>
  )
}
