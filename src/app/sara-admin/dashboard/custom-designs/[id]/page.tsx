'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Phone, Calendar, DollarSign, Gem, Hammer, MessageSquare, Copy, Trash2, CheckCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface CustomDesign {
  _id: string
  name: string
  email: string
  phone: string
  stoneType: string
  jewelryTypes: string[]
  metalType: string
  budget: string
  comments: string
  images: string[]
  status: 'pending' | 'reviewed' | 'contacted' | 'completed' | 'cancelled'
  createdAt: string
}

export default function CustomDesignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [design, setDesign] = useState<CustomDesign | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchDesign()
  }, [id])

  const fetchDesign = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/custom-designs/${id}`)
      if (response.ok) {
        const data = await response.json()
        setDesign(data)
      } else {
        toast.error('Request not found')
        router.push('/sara-admin/dashboard/custom-designs')
      }
    } catch (error) {
      toast.error('Failed to fetch request details')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (status: string) => {
    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/custom-designs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (response.ok) {
        toast.success(`Status updated to ${status}`)
        fetchDesign()
      }
    } catch (error) {
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const copyDetails = () => {
    if (!design) return
    const details = `
Customer Name: ${design.name}
Email: ${design.email}
Phone: ${design.phone || 'N/A'}
Jewelry Types: ${design.jewelryTypes.join(', ')}
Stone Type: ${design.stoneType}
Metal Type: ${design.metalType}
Budget: ${design.budget}
Comments: ${design.comments || 'No comments'}
    `.trim()
    
    navigator.clipboard.writeText(details)
    toast.success('Details copied to clipboard')
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Clock className="w-12 h-12 text-[#d4af37] animate-pulse" />
        <p className="text-gray-500">Loading request details...</p>
      </div>
    )
  }

  if (!design) return null

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/sara-admin/dashboard/custom-designs')}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#d4af37] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to list
        </button>
        <div className="flex gap-3">
          <button
            onClick={copyDetails}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-[#333] transition-all cursor-pointer"
          >
            <Copy className="w-4 h-4" />
            Copy Details
          </button>
          <select
            value={design.status}
            onChange={(e) => handleUpdateStatus(e.target.value)}
            disabled={updating}
            className="px-4 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#d4af37] outline-none font-semibold text-sm"
          >
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="contacted">Contacted</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Customer Info & Preferences */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">Customer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email</p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{design.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Phone</p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{design.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Submitted On</p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {new Date(design.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">Design Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#d4af37]/10 rounded-lg flex items-center justify-center text-[#d4af37]">
                    <Hammer className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Metal Type</p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{design.metalType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#d4af37]/10 rounded-lg flex items-center justify-center text-[#d4af37]">
                    <Gem className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Stone Type</p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{design.stoneType}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#d4af37]/10 rounded-lg flex items-center justify-center text-[#d4af37]">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Budget Range</p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{design.budget}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#d4af37]/10 rounded-lg flex items-center justify-center text-[#d4af37]">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Jewelry Types</p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{design.jewelryTypes.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 mt-1">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Comments/Instructions</p>
                  <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    {design.comments || "No specific instructions provided."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Images */}
        <div className="space-y-6">
          <div className="bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm h-full">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">Reference Images</h3>
            {design.images && design.images.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {design.images.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group shadow-md border dark:border-gray-800">
                    <img
                      src={url}
                      alt={`Reference ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity"
                    >
                      Open Original
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400 bg-gray-50 dark:bg-black/20 rounded-2xl">
                <Gem className="w-12 h-12 mb-4 opacity-20" />
                <p>No reference images uploaded</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
