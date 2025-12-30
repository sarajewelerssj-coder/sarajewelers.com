"use client"

import { useState, useRef, useEffect } from "react"
import { Send, X, Bot, Loader2, Minimize2, BarChart3, GripHorizontal, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AdminChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "<b>Admin AI:</b> System connected. I have access to real-time sales, inventory, and order data. How can I help you manage the store today?" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Resizing State
  const [width, setWidth] = useState(400)
  const [height, setHeight] = useState(600)
  const [isResizing, setIsResizing] = useState(false)
  const resizeRef = useRef<{ startX: number, startY: number, startW: number, startH: number } | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  // Handle Resize Mouse Events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeRef.current) return
      
      const deltaX = resizeRef.current.startX - e.clientX
      const deltaY = resizeRef.current.startY - e.clientY

      const newWidth = Math.min(Math.max(resizeRef.current.startW + deltaX, 300), 800)
      const newHeight = Math.min(Math.max(resizeRef.current.startH + deltaY, 400), 900)

      setWidth(newWidth)
      setHeight(newHeight)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      resizeRef.current = null
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'nw-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: width,
      startH: height
    }
  }

  const resetDimensions = () => {
    setWidth(400)
    setHeight(600)
  }

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsLoading(false)
      toast.info("Generation stopped")
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user' as const, content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    
    // Create new abort controller for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      const response = await fetch('/api/ai/admin-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
        }),
        signal: abortController.signal
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Request cancelled user, do nothing or show stopped state
      } else {
        toast.error("Admin AI System Error")
        console.error(error)
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
      {/* Chat Window */}
      <div 
        className={cn(
          "bg-[#0f172a] border border-slate-700 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right mb-4 flex flex-col font-mono relative",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
        )}
        style={{ width: isOpen ? `${width}px` : '0px', height: isOpen ? `${height}px` : '0px' }}
      >
        {/* Resize Handle (Top-Left Corner) */}
        {isOpen && (
          <div 
            className="absolute top-0 left-0 w-6 h-6 cursor-nw-resize z-50 hover:bg-white/10 flex items-start justify-start p-1"
            onMouseDown={startResize}
            title="Drag to resize"
          >
             <div className="w-2 h-2 border-t-2 border-l-2 border-slate-500 rounded-tl-sm"></div>
          </div>
        )}

        {/* Header - Technical/Admin Style */}
        <div className="bg-slate-900 p-3 flex items-center justify-between shrink-0 border-b border-slate-700 pl-8">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
               <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">ADMIN COMMAND</h3>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <p className="text-[10px] text-slate-400 font-medium">SYSTEM ONLINE</p>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
             <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-400 hover:text-white hover:bg-slate-800 h-8 w-8 rounded"
              onClick={resetDimensions}
              title="Reset Size"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
             <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-400 hover:text-white hover:bg-slate-800 h-8 w-8 rounded"
              onClick={() => setIsOpen(false)}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f172a]" ref={scrollRef}>
          {messages.map((m, i) => (
            <div 
              key={i} 
              className={cn(
                "max-w-[90%] rounded p-3 text-sm leading-relaxed border",
                m.role === 'user' 
                  ? "ml-auto bg-blue-600 text-white border-blue-500 rounded-tr-none" 
                  : "bg-slate-800 text-slate-200 border-slate-700 rounded-tl-none shadow-sm"
              )}
            >
              <div dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, '<br/>') }} />
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2">
              <div className="bg-slate-800 w-12 p-3 rounded rounded-tl-none border border-slate-700 shadow-sm flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleStop}
                className="text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8"
              >
                Stop
              </Button>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 bg-slate-900 border-t border-slate-700 shrink-0">
          <div className="relative flex items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Query database (e.g., 'Revenue this month?')"
              className="w-full bg-slate-800 border border-slate-700 rounded-md pl-3 pr-10 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
            <Button 
              size="icon" 
              className="absolute right-1 w-7 h-7 rounded bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Toggle Button - Distinct from Customer Chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-12 h-12 bg-slate-900 border border-slate-700 text-blue-400 rounded-full shadow-xl hover:bg-slate-800 hover:text-white transition-all hover:scale-105"
          title="Open Admin AI"
        >
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0f172a]"></span>
        </button>
      )}
    </div>
  )
}
