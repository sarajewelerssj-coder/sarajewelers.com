'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Download, Eye, RefreshCcw, Filter, Loader2, RotateCcw, Truck, Copy, Check, Trash2 } from 'lucide-react'
import * as XLSX from 'xlsx'
import { toast } from 'sonner'

export default function OrdersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  // Tracking Modal State
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [trackingData, setTrackingData] = useState({ carrier: '', trackingId: '' })
  const [updating, setUpdating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [pagination.page, statusFilter])

  const fetchOrders = async (isRefreshing = false) => {
    if (isRefreshing) setRefreshing(true)
    else setLoading(true)
    
    try {
      const response = await fetch(`/api/admin/orders?page=${pagination.page}&limit=${pagination.limit}&search=${searchQuery}&status=${statusFilter}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
        setPagination(data.pagination)
      }
    } catch (error) {
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const exportToExcel = () => {
    const data = orders.map(order => ({
      'Order Number': order.orderNumber || order._id,
      'Customer': `${order.customer.firstName} ${order.customer.lastName}`,
      'Email': order.customer.email,
      'Total': `$${order.total.toFixed(2)}`,
      'Status': order.orderStatus,
      'Payment': order.paymentStatus,
      'Created At': new Date(order.createdAt).toLocaleDateString()
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Orders')
    XLSX.writeFile(wb, `orders_export_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const handleOrderClick = (orderId: string) => {
    router.push(`/sara-admin/dashboard/orders/${orderId}`)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const openTrackingModal = (order: any) => {
    setSelectedOrder(order)
    setTrackingData({ 
      carrier: order.carrier || '', 
      trackingId: order.trackingId || '' 
    })
    setShowTrackingModal(true)
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone and will remove the order for both admin and customer.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Order deleted successfully')
        setOrders(prev => prev.filter(order => order._id !== orderId))
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to delete order')
      }
    } catch (error) {
      toast.error('Error deleting order')
    }
  }

  const handleSendUpdate = async () => {
    if (!selectedOrder) return
    setUpdating(true)

    try {
      const response = await fetch(`/api/admin/orders/${selectedOrder._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderStatus: 'shipped',
          carrier: trackingData.carrier,
          trackingId: trackingData.trackingId,
          notifyCustomer: true // Force email send
        })
      })

      if (response.ok) {
        toast.success('Order updated & email sent!')
        setShowTrackingModal(false)
        fetchOrders(true) // Refresh list
      } else {
        toast.error('Failed to update order')
      }
    } catch (error) {
      toast.error('Error updating order')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Orders</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="p-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-all disabled:opacity-50 cursor-pointer"
            title="Refresh List"
          >
            <RotateCcw className={`w-5 h-5 text-gray-700 dark:text-gray-300 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={exportToExcel}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black px-4 py-2 rounded-xl shadow hover:shadow-xl transition-all font-semibold"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <form onSubmit={(e) => { e.preventDefault(); fetchOrders(); }}>
            <input
              type="text"
              placeholder="Search by ID, customer, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/90 dark:bg-[#1e1e1e]/90 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </form>
        </div>
        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 bg-white/90 dark:bg-[#1e1e1e]/90 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100"
          >
            <option value="">All Statuses</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-[#2a2a2a]/50">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Order Status</th>
                <th className="p-4 font-semibold">Payment Status</th>
                <th className="p-4 font-semibold">Placed</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <Loader2 className="w-10 h-10 text-[#d4af37] animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading orders...</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-500 dark:text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr 
                    key={o._id} 
                    className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-[#2a2a2a]/30 transition-colors group relative"
                  >
                    <td className="p-4 text-gray-900 dark:text-gray-100 font-medium font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <Link href={`/sara-admin/dashboard/orders/${o._id}`} className="hover:text-[#d4af37] transition-colors cursor-pointer block">
                          {o._id.substring(0, 8)}...
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(o._id, o._id)
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-[#3a3a3a] rounded transition-colors"
                          title="Copy Full ID"
                        >
                          {copiedId === o._id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{o.customer.firstName} {o.customer.lastName}</div>
                      <div className="text-xs text-gray-500">{o.customer.email}</div>
                    </td>
                    <td className="p-4 text-gray-900 dark:text-gray-100 font-semibold">${o.total.toFixed(2)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          o.orderStatus === 'processing' ? 'bg-amber-500/10 text-amber-600' : 
                          o.orderStatus === 'shipped' ? 'bg-blue-500/10 text-blue-600' : 
                          o.orderStatus === 'delivered' ? 'bg-emerald-500/10 text-emerald-600' : 
                          'bg-red-500/10 text-red-600'
                        }`}>
                          {o.orderStatus}
                        </span>
                        {(o.trackingId || o.carrier) && (
                          <span title={`Tracking: ${o.trackingId} (${o.carrier})`}>
                            <Truck className="w-4 h-4 text-blue-500/50" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        o.paymentStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-600' : 
                        o.paymentStatus === 'pending' ? 'bg-amber-500/10 text-amber-600' : 
                        'bg-red-500/10 text-red-600'
                      }`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700 dark:text-gray-300 text-xs">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/sara-admin/dashboard/orders/${o._id}`}
                          className="flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-[#d4af37] hover:bg-[#d4af37]/10 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openTrackingModal(o)}
                          className="flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Send Update"
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(o._id)}
                          className="flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete Order"
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
        
        {pagination.pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#2a2a2a]/50 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={pagination.page === 1}
                onClick={() => setPagination({...pagination, page: pagination.page - 1})}
                className="px-3 py-1 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={pagination.page === pagination.pages}
                onClick={() => setPagination({...pagination, page: pagination.page + 1})}
                className="px-3 py-1 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tracking Modal */}
      {showTrackingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-gray-100">Send Delivery Update</h3>
            <p className="text-sm text-gray-500 mb-4">Updates status to Shipped & emails customer.</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Carrier Name</label>
                <input 
                  placeholder="e.g. FedEx, TCS, DHL"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  value={trackingData.carrier}
                  onChange={e => setTrackingData({...trackingData, carrier: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Tracking Number</label>
                <input 
                  placeholder="Tracking ID"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  value={trackingData.trackingId}
                  onChange={e => setTrackingData({...trackingData, trackingId: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => setShowTrackingModal(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendUpdate}
                  disabled={updating}
                  className="flex-1 py-2.5 rounded-xl font-bold bg-[#d4af37] text-white hover:bg-[#b89628] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                  Send Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

