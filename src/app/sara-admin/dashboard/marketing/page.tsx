'use client'

import { useState, useEffect } from 'react'
import { Send, Users, FileText, Search, Plus, Filter, LayoutTemplate, MessageSquare, History, PenTool, Trash2, Mail, ArrowRight, Loader, X, Sparkles, Loader2, RefreshCw, CheckCircle2, AlertCircle, Edit3, Save } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

interface User {
  id: string
  name: string
  email: string
  totalOrders: number
}

interface Template {
  _id?: string
  name: string
  subject: string
  body: string
  placeholders: string[]
  type: 'system' | 'marketing'
}

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<'bulk' | 'templates'>('bulk')
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [savingTemplate, setSavingTemplate] = useState(false)
  const [generating, setGenerating] = useState(false)

  // Messaging State
  const [selectedTemplate, setSelectedTemplate] = useState<string>('custom')
  const [customSubject, setCustomSubject] = useState('')
  const [customBody, setCustomBody] = useState('')

  // Template Editor State
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [usersRes, templatesRes] = await Promise.all([
        fetch('/api/admin/customers'),
        fetch('/api/admin/marketing/templates')
      ])
      
      if (usersRes.ok) {
        const data = await usersRes.json()
        setUsers(data.customers || [])
      }
      
      if (templatesRes.ok) {
        const data = await templatesRes.json()
        setTemplates(data)
      }
    } catch (err) {
      toast.error("Failed to load marketing data")
    } finally {
      setLoading(false)
    }
  }

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    )
  }

  const selectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id))
    }
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendBulk = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user")
      return
    }

    let subject = customSubject
    let body = customBody

    if (selectedTemplate !== 'custom') {
      const template = templates.find(t => t._id === selectedTemplate)
      if (template) {
        subject = template.subject
        body = template.body
      }
    }

    if (!subject || !body) {
      toast.error("Message subject and body are required")
      return
    }

    setSending(true)
    try {
      const res = await fetch('/api/admin/marketing/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIds: selectedUsers,
          subject,
          body,
          templateId: selectedTemplate
        })
      })

      if (res.ok) {
        toast.success(`Success! Message sent to ${selectedUsers.length} users.`)
        setSelectedUsers([])
      } else {
        toast.error("Failed to send bulk messages")
      }
    } catch (err) {
      toast.error("An error occurred during bulk messaging")
    } finally {
      setSending(false)
    }
  }

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return
    
    if (!editingTemplate.name || !editingTemplate.name.trim()) {
      toast.error("Please enter a Template Name")
      return
    }

    setSavingTemplate(true)
    try {
      const method = editingTemplate._id ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/marketing/templates', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTemplate._id ? { id: editingTemplate._id, ...editingTemplate } : editingTemplate)
      })

      if (res.ok) {
        toast.success("Template saved successfully")
        setEditingTemplate(null)
        fetchData()
      } else {
        toast.error("Failed to save template")
      }
    } catch (err) {
      toast.error("An error occurred while saving")
    } finally {
      setSavingTemplate(false)
    }
  }

  const handleGenerateTemplate = async () => {
    if (!editingTemplate?.subject) {
      toast.error("Please enter a subject line first")
      return
    }

    setGenerating(true)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'template',
          prompt: editingTemplate.subject
        })
      })
      
      const data = await res.json()
      if (res.ok) {
        let generatedContent = data.content || ''
        
        // Handle new JSON format if available
        try {
          // If the AI returned a JSON string inside the content, or if we need to parse it
          // The API now returns a direct JSON object if successful, but let's be safe.
          // Wait, the API returns { content: "string" }.
          // The AI prompt was told to return a JSON object. 
          // So 'data.content' will likely be that JSON string.
          
          const parsed = JSON.parse(data.content)
          if (parsed.html && parsed.subject && parsed.name) {
             setEditingTemplate(prev => prev ? ({ 
               ...prev, 
               body: parsed.html, // Changed 'content' to 'body' to match Template interface
               subject: parsed.subject,
               name: parsed.name
             }) : null)
             toast.success("Template, Subject, and Name generated!")
             return
          }
        } catch (e) {
          // Fallback if not valid JSON (legacy support)
          console.log("Could not parse AI JSON, using raw content", e)
        }

        // Legacy/Fallback handling
        // Strip out any markdown code blocks if the AI accidentally included them despite instructions
        const cleanContent = generatedContent.replace(/```html/g, '').replace(/```/g, '')
        setEditingTemplate(prev => prev ? ({ ...prev, body: cleanContent.trim() }) : null) // Changed 'content' to 'body'
        toast.success("Template generated!")
      } else {
        toast.error(data.error || "Failed to generate template")
      }
    } catch (err) {
      toast.error("AI generation failed")
    } finally {
      setGenerating(false)
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return
    
    try {
      const res = await fetch(`/api/admin/marketing/templates?id=${templateId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast.success("Template deleted")
        setEditingTemplate(null)
        fetchData()
      } else {
        const error = await res.json()
        toast.error(error.error || "Failed to delete template")
      }
    } catch (err) {
      toast.error("An error occurred during deletion")
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Preparing Marketing Engine...</p>
      </div>
    )
  }

  // ... (keeping other functions)

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="relative">
          <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <div className="p-3 bg-[#d4af37]/10 rounded-2xl">
              <Mail className="w-8 h-8 text-[#d4af37]" />
            </div>
            Email & Marketing
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium ml-16 max-w-md">
            Manage bulk campaigns and configure automated system templates.
          </p>
        </div>
        
        <div className="relative flex items-center p-1.5 bg-gray-100 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50">
          <button 
            onClick={() => setActiveTab('bulk')}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all focus:outline-none flex items-center gap-2 ${activeTab === 'bulk' ? 'bg-white dark:bg-[#2a2a2a] text-[#d4af37] shadow-lg scale-105' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <Users className="w-4 h-4" />
            Bulk Messaging
          </button>
          <button 
            onClick={() => setActiveTab('templates')}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all focus:outline-none flex items-center gap-2 ${activeTab === 'templates' ? 'bg-white dark:bg-[#2a2a2a] text-[#d4af37] shadow-lg scale-105' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <Sparkles className="w-4 h-4" />
            Templates
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {activeTab === 'bulk' && (
          <>
            {/* User Selection List */}
            <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">
              <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col h-[700px]">
                <div className="p-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#d4af37]" />
                      Recipients
                    </h2>
                    <span className="bg-[#d4af37]/10 text-[#d4af37] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                      {selectedUsers.length} Selected
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => fetchData()}
                      className="ml-auto hover:bg-[#d4af37]/10 text-gray-400 hover:text-[#d4af37] h-8 w-8 rounded-full transition-all active:scale-95"
                      title="Refresh Users"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      placeholder="Search by name or email..." 
                      className="pl-10 h-10 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-[#d4af37]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-4 px-1">
                    <button 
                      onClick={selectAll}
                      className="text-xs font-black text-[#d4af37] hover:underline uppercase tracking-tighter"
                    >
                      {selectedUsers.length === filteredUsers.length ? 'Deselect All' : 'Select All Filtered'}
                    </button>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{filteredUsers.length} Total Users</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                  {filteredUsers.map((user) => (
                    <div 
                      key={user.id} 
                      onClick={() => toggleUser(user.id)}
                      className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all mb-1 ${selectedUsers.includes(user.id) ? 'bg-[#d4af37]/5 border border-[#d4af37]/20 shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${selectedUsers.includes(user.id) ? 'bg-[#d4af37] text-white shadow-md shadow-[#d4af37]/20 scale-110' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'}`}>
                          {selectedUsers.includes(user.id) ? <CheckCircle2 className="w-5 h-5" /> : user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className={`text-sm font-bold truncate ${selectedUsers.includes(user.id) ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-tighter">{user.totalOrders} Orders</p>
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="p-12 text-center flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                      </div>
                      <p className="text-gray-400 font-medium">No users found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Message Composer */}
            <div className="lg:col-span-12 xl:col-span-7 space-y-6">
              <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl p-8 flex flex-col h-[700px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-bl-full pointer-events-none" />
                
                <div className="flex items-center justify-between mb-8 relative">
                  <h2 className="text-xl font-black flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#d4af37]" />
                    Compose Campaign
                  </h2>
                  <div className="flex items-center gap-2">
                    <select 
                      className="bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-xs font-bold px-4 py-2 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-[#d4af37] outline-none cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                    >
                      <option value="custom">Custom Message</option>
                      {templates.map(t => (
                        <option key={t._id} value={t._id}>{t.name.replace(/_/g, ' ').toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-6 flex-1 flex flex-col relative">
                  <div>
                    <label className="text-xs font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest mb-2 block">Campaign Subject</label>
                    <Input 
                      placeholder="Great things are coming to you..." 
                      className="h-12 text-base font-bold bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 rounded-xl focus:bg-white dark:focus:bg-[#1a1a1a] transition-all focus:ring-[#d4af37]"
                      value={selectedTemplate === 'custom' ? customSubject : templates.find(t => t._id === selectedTemplate)?.subject || ''}
                      onChange={(e) => selectedTemplate === 'custom' && setCustomSubject(e.target.value)}
                      disabled={selectedTemplate !== 'custom'}
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <label className="text-xs font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest mb-2 block">Message Body (HTML Supported)</label>
                    <textarea 
                      placeholder="Write your beautiful message here..." 
                      className="flex-1 w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 text-gray-700 dark:text-gray-200 font-medium leading-relaxed focus:bg-white dark:focus:bg-[#1a1a1a] outline-none transition-all resize-none focus:ring-2 focus:ring-[#d4af37]/20"
                      value={selectedTemplate === 'custom' ? customBody : templates.find(t => t._id === selectedTemplate)?.body || ''}
                      onChange={(e) => selectedTemplate === 'custom' && setCustomBody(e.target.value)}
                      disabled={selectedTemplate !== 'custom'}
                    />
                  </div>
                  
                  <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl mt-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                        You can use <code className="bg-amber-500/10 px-1.5 py-0.5 rounded text-[#d4af37]">{"{{name}}"}</code> as a placeholder to personalize the message for each recipient.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Target Audience</span>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{selectedUsers.length} Users identified</span>
                  </div>
                  <Button 
                    onClick={handleSendBulk}
                    className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black h-12 px-8 rounded-2xl font-black text-sm shadow-xl shadow-[#d4af37]/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all text-xs"
                    disabled={sending}
                  >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    SEND CAMPAIGN
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'templates' && (
          <div className="lg:col-span-12 space-y-8 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Add New Template Card */}
              <div 
                onClick={() => setEditingTemplate({ name: '', subject: '', body: '', placeholders: [], type: 'marketing' })}
                className="group p-8 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-[#d4af37] hover:bg-[#d4af37]/5 transition-all cursor-pointer flex flex-col items-center justify-center text-center h-[280px]"
              >
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-[#d4af37] transition-all rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110">
                  <Plus className="w-8 h-8 text-gray-300 dark:text-gray-700 group-hover:text-[#d4af37] dark:group-hover:text-black transition-all" />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-1">New Template</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Create customized marketing email</p>
              </div>

              {/* Templates List */}
              {templates.map((template) => (
                <div 
                  key={template._id} 
                  className="group p-6 rounded-3xl bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/10 transition-all relative overflow-hidden h-[280px] flex flex-col hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 p-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${template.type === 'system' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-[#d4af37]/10 text-[#d4af37]'}`}>
                      {template.type}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${template.type === 'system' ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
                      {template.type === 'system' ? <FileText className="w-6 h-6 text-indigo-500" /> : <Sparkles className="w-6 h-6 text-[#d4af37]" />}
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">{template.name.replace(/_/g, ' ').toUpperCase()}</h3>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 italic">"{template.subject}"</p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex gap-1 flex-wrap max-w-[70%]">
                      {template.placeholders.map(p => (
                        <span key={p} className="text-[9px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono text-gray-500">{p}</span>
                      ))}
                    </div>
                    <Button 
                      onClick={() => setEditingTemplate(template)}
                      variant="ghost" 
                      className="text-[#d4af37] hover:bg-[#d4af37]/10 rounded-xl hover:scale-105 transition-all"
                    >
                      <Edit3 className="w-4 h-4 mr-2" /> Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Template Editor Modal */}
            {editingTemplate && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-gray-800 relative">
                  <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#d4af37]/10 rounded-2xl flex items-center justify-center">
                        <Edit3 className="w-6 h-6 text-[#d4af37]" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">
                          {editingTemplate._id ? 'Edit Template' : 'New Template'}
                        </h2>
                        <p className="text-xs text-gray-400 uppercase font-black tracking-widest">{editingTemplate.type} template management</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setEditingTemplate(null)}
                      className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all"
                    >
                      <X className="w-6 h-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                    </button>
                  </div>

                  <div className="p-8 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-500 tracking-widest">Internal Template Name</label>
                        <Input 
                          placeholder="e.g. spring_sale_2024"
                          value={editingTemplate.name}
                          onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                          className="h-12 bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 rounded-xl font-bold"
                          disabled={editingTemplate.type === 'system' && editingTemplate._id !== undefined}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-500 tracking-widest">Email Subject Line</label>
                        <Input 
                          placeholder="What your customers will see..."
                          value={editingTemplate.subject}
                          onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                          className="h-12 bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 rounded-xl font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-black uppercase text-gray-500 tracking-widest block">Template Message (HTML/Rich-text)</label>
                        <button
                          type="button"
                          onClick={handleGenerateTemplate}
                          disabled={generating}
                          className="text-xs flex items-center gap-1.5 text-indigo-500 hover:text-indigo-600 disabled:opacity-50 transition-colors font-bold uppercase tracking-wider"
                        >
                          {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                          {generating ? 'Writing...' : 'Auto-Write'}
                        </button>
                      </div>
                      <textarea 
                        className="w-full h-80 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 text-gray-700 dark:text-gray-200 font-medium leading-relaxed outline-none focus:bg-white dark:focus:bg-[#1a1a1a] transition-all resize-none font-mono text-sm"
                        value={editingTemplate.body}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                        placeholder="Write your email body here. Use {{placeholder}} for dynamic content..."
                      />
                    </div>

                    <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">Active Placeholders</p>
                          <p className="text-xs text-gray-500">Separated by commas for system automation</p>
                        </div>
                      </div>
                      <Input 
                        placeholder="name, orderId, date"
                        value={editingTemplate.placeholders.join(', ')}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, placeholders: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        className="max-w-[300px] h-10 bg-white dark:bg-gray-900 border-indigo-100 dark:border-indigo-900/30 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-8 border-t border-gray-50 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/30 dark:bg-gray-800/10">
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingTemplate(null)}
                      className="px-8 h-12 rounded-2xl font-bold border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                    {editingTemplate._id && editingTemplate.type !== 'system' && (
                      <Button 
                        onClick={() => handleDeleteTemplate(editingTemplate._id!)}
                        variant="ghost"
                        className="px-6 h-12 rounded-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                      >
                        Delete
                      </Button>
                    )}
                    <Button 
                      onClick={handleSaveTemplate}
                      className="px-10 h-12 rounded-2xl font-black bg-[#d4af37] hover:bg-[#b8941f] text-white shadow-xl shadow-[#d4af37]/20 flex items-center gap-2"
                      disabled={savingTemplate}
                    >
                      {savingTemplate ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      SAVE TEMPLATE
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
