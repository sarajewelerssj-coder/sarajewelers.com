'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, ShoppingBag, Package, MapPin, Calendar, Copy, Check, Loader2, Mail, Phone, ExternalLink, Star } from 'lucide-react'
import { toast } from 'sonner'
import LogoLoader from '@/components/ui/logo-loader'

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const customerId = params.id as string
  
  const [customerData, setCustomerData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      try {
        const res = await fetch(`/api/admin/customers/${customerId}`)
        if (res.ok) {
          const data = await res.json()
          setCustomerData(data)
        } else {
          toast.error("Failed to load customer details")
        }
      } catch (err) {
        console.error("Error fetching customer:", err)
        toast.error("An error occurred while fetching customer details")
      } finally {
        setIsLoading(false)
      }
    }
    if (customerId) fetchCustomerDetail()
  }, [customerId])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LogoLoader />
      </div>
    )
  }

  if (!customerData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Customer Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400">The customer you're looking for doesn't exist.</p>
        <button
          onClick={() => router.push('/sara-admin/dashboard/customers')}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black rounded-xl font-bold hover:shadow-lg transition-all"
        >
          Back to Customers
        </button>
      </div>
    )
  }

  const { profile, orders, summary } = customerData

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/sara-admin/dashboard/customers')}
            className="p-2.5 hover:bg-white dark:hover:bg-[#2a2a2a] rounded-xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">{profile.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded uppercase tracking-wider">ID: {customerId}</span>
              <button 
                onClick={() => copyToClipboard(customerId, 'id')}
                className="hover:text-[#d4af37] transition-colors"
                title="Copy Customer ID"
              >
                {copiedId === 'id' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="text-right hidden sm:block">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer Since</p>
             <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{new Date(summary.firstOrderDate || profile.createdAt).toLocaleDateString()}</p>
           </div>
           <div className="w-12 h-12 bg-[#d4af37]/10 rounded-2xl flex items-center justify-center border border-[#d4af37]/20">
              <User className="w-6 h-6 text-[#d4af37]" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Consolidated Customer Profile Box */}
          <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-xl p-8 relative group overflow-hidden shadow-2xl shadow-[#d4af37]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#d4af37]/10 to-transparent blur-3xl -z-10"></div>
            
            <div className="flex items-center gap-4 mb-8">
               <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-2xl flex items-center justify-center shadow-xl shadow-[#d4af37]/20">
                  <User className="w-8 h-8 text-black" />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Customer Profile</h3>
                  <p className="text-sm text-gray-500 font-medium">Verified Account Information</p>
               </div>
            </div>

            <div className="space-y-4">
              {/* Email Row */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700/50 hover:border-[#d4af37]/30 transition-all group/item">
                <div className="flex items-center gap-4">
                   <div className="p-2.5 bg-blue-500/10 rounded-xl">
                      <Mail className="w-5 h-5 text-blue-500" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                      <p className="text-gray-900 dark:text-gray-100 font-bold">{profile.email}</p>
                   </div>
                </div>
                <button 
                  onClick={() => copyToClipboard(profile.email, 'email')}
                  className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all shadow-sm border border-transparent hover:border-[#d4af37]/20"
                >
                  {copiedId === 'email' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-[#d4af37]" />}
                </button>
              </div>

              {/* Phone Row */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700/50 hover:border-[#d4af37]/30 transition-all group/item">
                <div className="flex items-center gap-4">
                   <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                      <Phone className="w-5 h-5 text-emerald-500" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                      <p className="text-gray-900 dark:text-gray-100 font-bold">{profile.phone || 'Not Provided'}</p>
                   </div>
                </div>
                <button 
                  onClick={() => copyToClipboard(profile.phone || 'N/A', 'phone')}
                  className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all shadow-sm border border-transparent hover:border-[#d4af37]/20"
                >
                  {copiedId === 'phone' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-[#d4af37]" />}
                </button>
              </div>

              {/* Address Row */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#d4af37]/5 border border-[#d4af37]/10 hover:border-[#d4af37]/30 transition-all group/item">
                <div className="flex items-center gap-4">
                   <div className="p-2.5 bg-[#d4af37]/10 rounded-xl">
                      <MapPin className="w-5 h-5 text-[#d4af37]" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">Primary Address</p>
                      <p className="text-gray-900 dark:text-gray-100 font-bold">
                        {profile.address ? `${profile.address}, ${profile.city} ${profile.zipCode}` : 'No address provided'}
                      </p>
                   </div>
                </div>
                <button 
                  onClick={() => copyToClipboard(profile.address ? `${profile.address}, ${profile.city} ${profile.zipCode}` : 'N/A', 'address')}
                  className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all shadow-sm border border-transparent hover:border-[#d4af37]/20"
                >
                  {copiedId === 'address' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-[#d4af37]" />}
                </button>
              </div>
            </div>
          </div>
          {/* Order History */}
          <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-lg p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-[#d4af37]" />
                Order History
              </h3>
              <span className="bg-[#d4af37] text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#d4af37]/20">
                {orders.length} total orders
              </span>
            </div>

            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/30 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 font-bold">No order history found for this customer</p>
                </div>
              ) : (
                orders.map((order: any, idx: number) => (
                  <div 
                    key={order.id || idx} 
                    className="p-6 border border-gray-100 dark:border-gray-800 rounded-2xl hover:bg-white dark:hover:bg-[#252525] hover:shadow-2xl transition-all group border-l-[6px] border-l-[#d4af37] relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <ExternalLink className="w-4 h-4 text-[#d4af37]" />
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-700">
                            <span className="text-xs font-black text-[#d4af37] font-mono">#{idx + 1}</span>
                         </div>
                         <div>
                            <p className="font-black text-gray-900 dark:text-gray-100 text-base font-mono">{order.id}</p>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                         </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">${order.total.toFixed(2)}</p>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
                          order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500' : 
                          order.status === 'processing' ? 'bg-amber-500/10 text-amber-600' :
                          'bg-red-500/10 text-red-600'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none">
                       {order.items?.map((item: any, i: number) => (
                         <div key={i} className="flex-shrink-0 w-16 h-16 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm" title={item.name}>
                            <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                         </div>
                       ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 flex justify-end">
                       <Link 
                        href={`/sara-admin/dashboard/orders/${order.id}`}
                        target="_blank"
                        className="text-[11px] font-black text-[#d4af37] flex items-center gap-2 hover:bg-[#d4af37]/10 px-4 py-2 rounded-xl transition-all border border-transparent hover:border-[#d4af37]/30"
                       >
                         VIEW ORDER DETAILS <ExternalLink className="w-3.5 h-3.5" />
                       </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-lg p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Star className="w-6 h-6 text-[#d4af37]" />
                Reviews History
              </h3>
              <span className="bg-[#d4af37] text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#d4af37]/20">
                {customerData.reviews?.length || 0} total reviews
              </span>
            </div>

            <div className="space-y-6">
              {!customerData.reviews || customerData.reviews.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/30 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 font-bold">No review history found for this customer</p>
                </div>
              ) : (
                customerData.reviews.map((review: any, idx: number) => (
                  <div 
                    key={idx} 
                    className="p-6 border border-gray-100 dark:border-gray-800 rounded-2xl hover:bg-white dark:hover:bg-[#252525] transition-all group border-l-[6px] border-l-[#d4af37]/30 hover:border-l-[#d4af37]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-shrink-0">
                          <img src={review.productImage || '/placeholder.svg'} alt={review.productName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <Link 
                            href={`/sara-admin/dashboard/products/${review.productId}`}
                            target="_blank"
                            className="font-black text-gray-900 dark:text-gray-100 hover:text-[#d4af37] transition-colors line-clamp-1"
                          >
                            {review.productName}
                          </Link>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-[#d4af37] fill-[#d4af37]' : 'text-gray-300 dark:text-gray-600'}`} />
                            ))}
                            <span className="text-[10px] text-gray-400 font-bold ml-1">{review.date}</span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-2">{review.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 italic">"{review.content}"</p>
                        </div>
                      </div>
                      <Link 
                        href={`/sara-admin/dashboard/products/${review.productId}`}
                        target="_blank"
                        className="p-2 hover:bg-[#d4af37]/10 rounded-xl transition-all"
                        title="View Product"
                      >
                        <ExternalLink className="w-4 h-4 text-[#d4af37]" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-lg p-6 overflow-hidden relative group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#d4af37]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            
            <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              Spend Analysis
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Lifetime Value</p>
                <p className="text-3xl font-black text-[#d4af37] tracking-tight">${summary.totalSpent.toFixed(2)}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Orders</p>
                  <p className="text-xl font-black text-gray-900 dark:text-gray-100">{summary.totalOrders}</p>
                </div>
                <div className="p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Average</p>
                  <p className="text-xl font-black text-gray-900 dark:text-gray-100">
                    ${summary.totalOrders > 0 ? (summary.totalSpent / summary.totalOrders).toFixed(0) : '0'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                 <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-gray-400 font-bold uppercase tracking-tighter">Last Active</span>
                    <span className="text-gray-900 dark:text-gray-100 font-bold">{summary.lastOrderDate ? new Date(summary.lastOrderDate).toLocaleDateString() : 'N/A'}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
