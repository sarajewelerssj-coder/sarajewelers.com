'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Truck, Building2, Users2, Plus, Trash2, Camera, Upload, Globe, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { uploadFileAction } from "@/app/actions/media-actions"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [settings, setSettings] = useState({
    companyName: '',
    companyLogo: '',
    standardShippingFee: 0,
    freeShippingThreshold: 0
  })
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' })
  const [creatingAdmin, setCreatingAdmin] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [deletingLogo, setDeletingLogo] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [settingsRes, adminsRes] = await Promise.all([
        fetch('/api/admin/settings'),
        fetch('/api/admin/users')
      ])
      
      if (settingsRes.ok) setSettings(await settingsRes.json())
      if (adminsRes.ok) setAdmins(await adminsRes.json())
    } catch (error) {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (res.ok) {
        toast.success('Settings updated successfully!')
      } else {
        throw new Error('Failed to update')
      }
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'branding')

    try {
      const result = await uploadFileAction(formData)
      if (result.success) {
        setSettings({ ...settings, companyLogo: result.url || '' })
        toast.success('Logo uploaded!')
      } else {
        toast.error(result.error || 'Upload failed')
      }
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCreateAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      return toast.error('All fields are required')
    }
    setCreatingAdmin(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin)
      })
      if (res.ok) {
        toast.success('Sub-admin user created!')
        setShowAddAdmin(false)
        setNewAdmin({ name: '', email: '', password: '' })
        fetchData()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to create sub-admin')
      }
    } catch (error) {
      toast.error('Error creating admin')
    } finally {
      setCreatingAdmin(false)
    }
  }

  const handleDeleteAdmin = async (adminId: string, adminEmail: string) => {
    if (!confirm(`Are you sure you want to delete ${adminEmail}?`)) return
    
    setDeletingUserId(adminId)
    try {
      const res = await fetch(`/api/admin/users?id=${adminId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        toast.success('Admin deleted successfully!')
        fetchData()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to delete admin')
      }
    } catch (error) {
      toast.error('Error deleting admin')
    } finally {
      setDeletingUserId(null)
    }
  }

  // Check if current user is main admin (has 'admin' role)
  const isMainAdmin = session?.user && (session.user as any).role === 'admin'

  const handleDeleteLogo = async () => {
    if (!confirm('Are you sure you want to delete the company logo?')) return
    
    setDeletingLogo(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteLogo: true })
      })
      
      if (res.ok) {
        toast.success('Logo deleted successfully!')
        setSettings({ ...settings, companyLogo: '' })
      } else {
        toast.error('Failed to delete logo')
      }
    } catch (error) {
      toast.error('Error deleting logo')
    } finally {
      setDeletingLogo(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#d4af37]" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Store Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your brand identity, logistics, and team.</p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black px-8 py-3 rounded-2xl font-bold shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 active:scale-95 transition-all flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Identity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Brand Identity */}
          <section className="bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-[#d4af37]/10 rounded-xl text-[#d4af37]">
                <Building2 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Brand Identity</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Company Name</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-[#d4af37] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Default Company Logo</label>
                <div className="flex items-center gap-6">
                  <div className="relative group w-20 h-20 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-[#2a2a2a]">
                    {settings.companyLogo ? (
                      <img src={settings.companyLogo} alt="Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                      <Camera className="w-6 h-6 text-gray-400" />
                    )}
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Upload className="w-5 h-5 text-white" />
                      <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                    </label>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-2">Recommended: 200x60 PNG with transparency.</p>
                    {isUploading && <span className="text-xs text-[#d4af37] font-medium animate-pulse flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Uploading...</span>}
                    
                    {settings.companyLogo && !isUploading && (
                      <button
                        onClick={handleDeleteLogo}
                        disabled={deletingLogo}
                        className="mt-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-1.5 w-fit"
                      >
                        {deletingLogo ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                        Delete Logo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Logistics */}
          <section className="bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                <Truck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Logistics & Shipping</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Standard Shipping Fee ($)</label>
                <input
                  type="number"
                  value={settings.standardShippingFee}
                  onChange={(e) => setSettings({ ...settings, standardShippingFee: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-[#d4af37] outline-none transition-all"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Free Shipping Threshold ($)</label>
                <input
                  type="number"
                  value={settings.freeShippingThreshold}
                  onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-[#d4af37] outline-none transition-all"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Team */}
        <div className="space-y-8">
          <section className="bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                  <Users2 className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold">Admin Team</h2>
              </div>
              <button
                onClick={() => setShowAddAdmin(true)}
                className="p-2 hover:bg-[#d4af37]/10 text-[#d4af37] rounded-xl transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {admins.map(admin => (
                <div key={admin._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#2a2a2a] rounded-2xl group border border-transparent hover:border-[#d4af37]/20 transition-all">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4d03f] flex items-center justify-center text-black font-bold text-xs flex-shrink-0">
                      {admin.name[0].toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold truncate">{admin.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{admin.email}</p>
                    </div>
                  </div>
                  {isMainAdmin && admin.email !== session?.user?.email && (
                    <button 
                      onClick={() => handleDeleteAdmin(admin._id, admin.email)}
                      disabled={deletingUserId === admin._id}
                      className="p-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all disabled:opacity-50"
                    >
                      {deletingUserId === admin._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Add Admin Modal */}
      <AnimatePresence>
        {showAddAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#1e1e1e] rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl border border-white/20"
            >
              <h3 className="text-2xl font-bold mb-6">Create New Sub-Admin</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Full Name</label>
                  <input
                    type="text"
                    value={newAdmin.name}
                    onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-[#d4af37]"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Email Address</label>
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-[#d4af37]"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Temporary Password</label>
                  <input
                    type="password"
                    value={newAdmin.password}
                    onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-[#d4af37]"
                    placeholder="••••••••"
                  />
                </div>
                <div className="pt-4 flex gap-4">
                  <button
                    onClick={() => setShowAddAdmin(false)}
                    className="flex-1 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAdmin}
                    disabled={creatingAdmin}
                    className="flex-1 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold flex items-center justify-center gap-2"
                  >
                    {creatingAdmin ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
