"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { X, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm Sara, your jewelry assistant. How can I help you find the perfect piece today?",
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  
  const chatboxRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const button = buttonRef.current
    const chatbox = chatboxRef.current
    
    if (!button || !chatbox) return

    if (isOpen) {
      gsap.fromTo(chatbox,
        { scale: 0, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      )
      gsap.to(button, {
        rotation: 180,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.out"
      })
    } else {
      gsap.to(chatbox, {
        scale: 0,
        opacity: 0,
        y: 50,
        duration: 0.3,
        ease: "power2.in"
      })
      gsap.to(button, {
        rotation: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const botResponses = [
    "I'd be happy to help you find the perfect jewelry piece! What type are you looking for?",
    "Our engagement rings are crafted with exceptional quality. Would you like to see our collections?",
    "We offer lifetime warranty on all our pieces. Is there a specific style you're interested in?",
    "Our expert jewelers can create custom designs. What's your vision?",
    "We have beautiful collections in gold, platinum, and silver. What's your preference?"
  ]

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue("")
    setIsTyping(true)

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <>
      {/* Chat Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-white rounded-full shadow-lg hover:shadow-xl hover:shadow-[#d4af37]/30 transition-all duration-300 flex items-center justify-center group"
        aria-label="Open chat"
      >
        {isOpen ? (
          <X size={24} className="transition-transform duration-300" />
        ) : (
          <Bot size={24} className="transition-transform duration-300 group-hover:scale-110" />
        )}
        
        {/* Pulse animation when closed */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-[#d4af37] animate-ping opacity-20" />
        )}
      </button>

      {/* Chat Box */}
      <div
        ref={chatboxRef}
        className="fixed bottom-24 right-6 z-40 w-80 h-96 bg-white dark:bg-[#292929] rounded-2xl shadow-2xl border border-[#d4af37]/20 overflow-hidden"
        style={{ opacity: 0, transform: "scale(0)" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="font-semibold">Sara Assistant</h3>
              <p className="text-xs opacity-90">Online now</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 h-64 overflow-y-auto space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
            >
              <div className={`flex items-start gap-2 max-w-[80%] ${message.isBot ? "" : "flex-row-reverse"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  message.isBot 
                    ? "bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-white" 
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}>
                  {message.isBot ? <Bot size={12} /> : <User size={12} />}
                </div>
                <div className={`px-3 py-2 rounded-2xl ${
                  message.isBot
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    : "bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-white"
                }`}>
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2 max-w-[80%]">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-white flex items-center justify-center">
                  <Bot size={12} />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={handleSendMessage}
              className="w-8 h-8 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}