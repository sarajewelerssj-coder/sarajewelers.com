'use client'

import { useState, useEffect } from 'react'
import { X, Keyboard, Sparkles, DollarSign, MessageSquare, Zap, HelpCircle } from 'lucide-react'

export default function AdminHelpModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+I or Shift+H
      if (e.ctrlKey && e.key.toLowerCase() === 'i') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }

    const handleOpenHelp = () => setIsOpen(true)
    window.addEventListener('open-admin-help', handleOpenHelp)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-admin-help', handleOpenHelp)
    }
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#1e1e1e] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#d4af37]/10 rounded-xl">
              <Zap className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Admin Command Center</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Power features & shortcuts</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Section: Pricing Rule */}
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/20 rounded-xl p-5">
            <div className="flex gap-3">
              <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-500 shrink-0" />
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">
                  ⚠️ Price Variations Rule
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  If you are adding specific prices to variations (e.g., Gold +$50), you should ideally:
                  <br />
                  <span className="font-semibold block mt-1">• Set the base Inventory Price to 0</span>
                  <br />
                  This ensures the calculated price is correct (0 + 50 = $50). If you leave base price as $100, the total will be $150.
                </p>
              </div>
            </div>
          </div>

          {/* Section: Shortcuts */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Keyboard Shortcuts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl border border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Open Instructions</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-mono font-bold text-gray-500 dark:text-gray-400">Ctrl + I</kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Section: AI Features */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Power Features
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-2 bg-[#d4af37]/10 rounded-lg h-fit">
                  <Sparkles className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">Smart Name Polish</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Use the Polish button to rewrite product names. It keeps the core type (e.g. Ring) but makes it sound amazing. Length restricted to 3-9 words.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-2 bg-blue-500/10 rounded-lg h-fit">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">Guided Generation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Click "Guided" to tell AI exactly what to do. Example: <i>"Suggest sizes 4-9"</i> or <i>"Focus on VS1 Clarity"</i>.
                  </p>
                </div>
              </div>

               <div className="flex gap-4 p-4 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-2 bg-green-500/10 rounded-lg h-fit">
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">Dynamic Pricing</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    The lowest price variation is automatically shown by default on the product page.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#2a2a2a]/50 flex justify-end">
          <button 
            onClick={() => setIsOpen(false)}
            className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
