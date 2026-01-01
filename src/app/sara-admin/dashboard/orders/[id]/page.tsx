'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, Package, User, MapPin, CreditCard, 
  Calendar, CheckCircle, XCircle, Truck, Clock, 
  Copy, Check, Loader2, ExternalLink, RefreshCcw 
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [trackingData, setTrackingData] = useState({ carrier: '', trackingId: '' })

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
        // Pre-fill tracking data if exists
        if (data.carrier || data.trackingId) {
          setTrackingData({ carrier: data.carrier || '', trackingId: data.trackingId || '' })
        }
      } else {
        toast.error('Order not found')
      }
    } catch (error) {
      toast.error('Failed to fetch order details')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (field: string, value: string, extraData: any = {}) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value, ...extraData })
      })

      if (response.ok) {
        const updatedOrder = await response.json()
        setOrder(updatedOrder)
        toast.success(`Order ${field} updated to ${value}`)
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      toast.error('Error updating status')
    } finally {
      setUpdating(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin mb-4" />
        <p className="text-gray-500">Loading order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <XCircle className="w-16 h-16 text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Order Not Found</h2>
        <button
          onClick={() => router.push('/sara-admin/dashboard/orders')}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Back to Orders
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/sara-admin/dashboard/orders')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Order Details</h2>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">ID: {order._id}</p>
              <button 
                onClick={() => copyToClipboard(order._id, 'id-only')}
                className="p-1 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded transition-colors"
                title="Copy Order ID"
              >
                {copiedId === 'id-only' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const summary = `Order Summary\nID: ${order._id}\nCustomer: ${order.customer.firstName} ${order.customer.lastName}\nTotal: $${order.total.toFixed(2)}\nStatus: ${order.orderStatus}`;
              copyToClipboard(summary, 'all')
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm"
          >
            {copiedId === 'all' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
            Copy Details
          </button>
          <div className="flex items-center gap-2">
             <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border ${
              order.orderStatus === 'processing' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
              order.orderStatus === 'shipped' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 
              order.orderStatus === 'delivered' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
              'bg-red-500/10 text-red-600 border-red-500/20'
            }`}>
              {order.orderStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#d4af37]" />
              Order Items ({order.items.length})
            </h3>
            <div className="space-y-4">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 p-4 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50/50 dark:hover:bg-[#2a2a2a]/30 transition-colors">
                  <div className="w-16 h-16 relative bg-gray-100 dark:bg-[#2a2a2a] rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <Package className="w-8 h-8 text-gray-400 absolute inset-0 m-auto" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{item.name}</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.selectedVariations && Object.entries(item.selectedVariations).map(([key, value]) => (
                        <span key={key} className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-500">
                          {key}: {value as string}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-gray-100">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer & Shipping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#d4af37]" />
                  Customer
                </h3>
                <button
                  onClick={() => copyToClipboard(`${order.customer.firstName} ${order.customer.lastName}\n${order.customer.email}\n${order.customer.phone}`, 'cust')}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
                >
                  {copiedId === 'cust' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Name</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{order.customer.firstName} {order.customer.lastName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{order.customer.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{order.customer.phone}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#d4af37]" />
                  Shipping
                </h3>
                <button
                  onClick={() => copyToClipboard(`${order.customer.address}, ${order.customer.city}, ${order.customer.zipCode}`, 'addr')}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
                >
                  {copiedId === 'addr' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
              <div className="text-gray-700 dark:text-gray-300 space-y-2">
                <p className="font-medium">{order.customer.address}</p>
                <p>{order.customer.city}, {order.customer.zipCode}</p>
                <p className="text-xs text-gray-500 mt-2 italic">Standard Shipping</p>
              </div>
            </div>
            {/* Delivery Details - Only show if tracking exists */}
            {(order.trackingId || order.carrier) && (
              <div className="col-span-1 md:col-span-2 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6 shadow-sm relative overflow-hidden group">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10 transition-colors group-hover:bg-blue-500/10" />
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#d4af37]" />
                    Delivery Information
                  </h3>
                  <div className="flex gap-2">
                    <a 
                      href={`https://www.google.com/search?q=${order.carrier}+${order.trackingId}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors text-blue-500"
                      title="Track Package"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => copyToClipboard(order.trackingId, 'track')}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
                      title="Copy Tracking ID"
                    >
                      {copiedId === 'track' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Carrier Name</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{order.carrier || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tracking Number</p>
                    <p className="font-mono font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-[#2a2a2a] px-3 py-1 rounded-lg inline-block border border-gray-200 dark:border-gray-700">
                      {order.trackingId || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Transaction Screenshot */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#d4af37]" />
              Payment Verification
            </h3>
            {order.paymentScreenshot ? (
              <div className="space-y-4">
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800 bg-gray-50 shadow-inner group">
                  <Image src={order.paymentScreenshot} alt="Transaction Screenshot" fill className="object-contain" />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <a 
                    href={order.paymentScreenshot} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 p-3 bg-white/95 dark:bg-black/95 backdrop-blur-sm rounded-full shadow-2xl hover:scale-110 transition-transform border border-gray-100 dark:border-gray-800 group-hover:flex hidden items-center justify-center"
                    title="View Full Size"
                  >
                    <ExternalLink className="w-5 h-5 text-[#d4af37]" />
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">Payment Status</p>
                    <div className="flex items-center gap-3">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => handleUpdateStatus('paymentStatus', e.target.value)}
                        disabled={updating}
                        className="px-3 py-1.5 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#d4af37] cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        order.paymentStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                        order.paymentStatus === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/20 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <XCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No payment screenshot uploaded</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#d4af37]" />
              Financial Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium">${order.shipping.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-3">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-black text-[#d4af37]">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Management Controls */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <RefreshCcw className="w-5 h-5 text-[#d4af37]" />
              Manage Status
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">Order Lifecycle</label>
                <div className="grid grid-cols-2 gap-2">
                  {['processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        if (status === 'shipped') {
                          setShowTrackingModal(true)
                        } else {
                          handleUpdateStatus('orderStatus', status)
                        }
                      }}
                      disabled={updating || order.orderStatus === status}
                      className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                        order.orderStatus === status 
                        ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20 border-[#d4af37]' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-transparent hover:border-gray-300'
                      } border`}
                    >
                      {status}
                    </button>
                   ))}
                </div>

                {/* Tracking Modal */}
                {showTrackingModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800">
                      <h3 className="text-lg font-bold mb-4">Add Tracking Details</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Carrier Name</label>
                          <input 
                            placeholder="e.g. FedEx, DHL, TCS"
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                            value={trackingData.carrier}
                            onChange={e => setTrackingData({...trackingData, carrier: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Tracking Number</label>
                          <input 
                            placeholder="Tracking ID"
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                            value={trackingData.trackingId}
                            onChange={e => setTrackingData({...trackingData, trackingId: e.target.value})}
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button 
                            onClick={() => setShowTrackingModal(false)}
                            className="flex-1 py-2 rounded-xl font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => {
                              handleUpdateStatus('orderStatus', 'shipped', trackingData)
                              setShowTrackingModal(false)
                            }}
                            className="flex-1 py-2 rounded-xl font-bold bg-[#d4af37] text-white"
                          >
                            Update & Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-4 h-4" />
                  Placed: {new Date(order.createdAt).toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <Clock className="w-4 h-4" />
                  Updated: {new Date(order.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
