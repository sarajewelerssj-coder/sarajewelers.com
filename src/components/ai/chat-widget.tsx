"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Send, X, MessageCircle, Loader2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AIChatWidget() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  
  // Hide on admin pages
  if (pathname?.startsWith('/sara-admin')) {
    return null
  }
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm Sara, your personal jewelry consultant. How can I assist you with our exquisite collections today?" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user' as const, content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
        })
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
    } catch (error) {
      toast.error("Unable to connect to AI assistant")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed bottom-24 md:bottom-6 right-6 z-[60] flex flex-col items-end print:hidden">
      {/* Chat Window */}
      <div 
        className={cn(
          "bg-white dark:bg-[#1e1e1e] border border-[#d4af37]/20 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right mb-4 flex flex-col",
          isOpen ? "w-[350px] sm:w-[380px] h-[500px] opacity-100 scale-100" : "w-0 h-0 opacity-0 scale-90 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-black">
            <div>
              <h3 className="font-bold text-sm leading-none">Sara Jewelers AI</h3>
              <p className="text-[10px] opacity-80 font-medium">Virtual Consultant</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-black hover:bg-black/10 h-8 w-8 rounded-full"
            onClick={() => setIsOpen(false)}
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#252525]" ref={scrollRef}>
          {messages.map((m, i) => (
            <div 
              key={i} 
              className={cn(
                "max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed",
                m.role === 'user' 
                  ? "ml-auto bg-[#d4af37] text-white rounded-tr-none" 
                  : "bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none shadow-sm"
              )}
            >
              <div dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, '<br/>') }} />
            </div>
          ))}
          {isLoading && (
            <div className="bg-white dark:bg-[#2a2a2a] w-12 p-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-center">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-[#1e1e1e] border-t border-gray-100 dark:border-gray-800 shrink-0">
          <div className="relative flex items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about rings, prices..."
              className="w-full bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
            />
            <Button 
              size="icon" 
              className="absolute right-1 w-8 h-8 rounded-full bg-[#d4af37] hover:bg-[#b8941f] text-white shadow-md transition-all"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3 ml-0.5" />}
            </Button>
          </div>
          <div className="text-[10px] text-center text-gray-400 mt-2">
            AI can make mistakes. Please verify important details.
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group relative bg-gradient-to-br from-[#d4af37] to-[#f4d03f] text-black cursor-pointer",
          isOpen && "rotate-180"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  )
}
