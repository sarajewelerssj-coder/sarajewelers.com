'use client'

import { useState, useEffect } from 'react'
import { Search, RefreshCw, Trash2, Eye, Copy, Filter, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface CustomDesign {
  _id: string
  name: string
  email: string
  phone: string
  stoneType: string
  jewelryTypes: string[]
  metalType: string
  budget: string
  status: 'pending' | 'reviewed' | 'contacted' | 'completed' | 'cancelled'
  createdAt: string
}

export default function CustomDesignsPage() {
  const [designs, setDesigns] = useState<CustomDesign[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    fetchDesigns()
  }, [pagination.page, statusFilter])

  const fetchDesigns = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/custom-designs?page=${pagination.page}&limit=${pagination.limit}&search=${searchQuery}&status=${statusFilter}`)
      if (response.ok) {
        const data = await response.json()
        setDesigns(data.designs || [])
        setPagination(prev => ({ ...prev, total: data.pagination.total, pages: data.pagination.pages }))
      }
    } catch (error) {
      toast.error('Failed to fetch custom designs')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchDesigns()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this search request?')) return

    try {
      const response = await fetch(`/api/admin/custom-designs/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Request deleted')
        fetchDesigns()
      }
    } catch (error) {
      toast.error('Failed to delete request')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'reviewed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'contacted': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Custom Design Submissions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage bespoke jewelry requests from your customers
          </p>
        </div>
        <button
          onClick={() => { setRefreshing(true); fetchDesigns(); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-[#333] transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <form onSubmit={handleSearch} className="md:col-span-8 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or stone type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#d4af37] outline-none transition-all"
          />
        </form>
        <div className="md:col-span-4 relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#d4af37] outline-none transition-all appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="contacted">Contacted</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 text-sm font-bold text-gray-500 dark:text-gray-400">Customer</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 dark:text-gray-400">Type & Metal</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 dark:text-gray-400">Budget</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 dark:text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {loading && !refreshing ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="w-8 h-8 text-[#d4af37] animate-spin" />
                      <p className="text-gray-500">Loading submissions...</p>
                    </div>
                  </td>
                </tr>
              ) : designs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-500">
                    No custom design submissions found
                  </td>
                </tr>
              ) : (
                designs.map((design) => (
                  <tr key={design._id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-gray-100">{design.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{design.email}</p>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(design.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <p className="text-gray-800 dark:text-gray-200 font-medium">
                        {design.jewelryTypes.join(', ')}
                      </p>
                      <p className="text-xs text-[#d4af37]">{design.metalType}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-300">
                      {design.budget}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(design.status)}`}>
                        {design.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/sara-admin/dashboard/custom-designs/${design._id}`}
                          className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(design._id)}
                          className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                          title="Delete Request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-50"
          >
            Previous
          </button>
          <span className="flex items-center px-4 text-sm text-gray-500">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
