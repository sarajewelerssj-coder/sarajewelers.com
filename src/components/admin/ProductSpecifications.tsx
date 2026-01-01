'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Sparkles, MessageSquare } from 'lucide-react'

interface Specification {
  id: string
  title: string
  value: string
  type: 'string' | 'number'
}

interface ProductSpecificationsProps {
  specifications: Specification[]
  setSpecifications: (specifications: Specification[]) => void
  onGenerateAI?: () => void
  showGuidedInput?: boolean
  onToggleGuided?: () => void
  guidedInstructions?: string
  onInstructionsChange?: (value: string) => void
}

export default function ProductSpecifications({ specifications, setSpecifications, onGenerateAI, showGuidedInput, onToggleGuided, guidedInstructions, onInstructionsChange }: ProductSpecificationsProps) {
  const [newSpecTitle, setNewSpecTitle] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')
  const [newSpecType, setNewSpecType] = useState<'string' | 'number'>('string')
  const [savedSpecifications, setSavedSpecifications] = useState<string[]>([])

  useEffect(() => {
    loadSavedSpecifications()
  }, [])

  const loadSavedSpecifications = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('sara-admin-saved-specifications') || '[]')
      setSavedSpecifications(saved)
    } catch (error) {
      console.error('Error loading saved specifications:', error)
    }
  }

  const savePredefinedSpecification = (title: string) => {
    if (!savedSpecifications.includes(title)) {
      const updated = [...savedSpecifications, title]
      setSavedSpecifications(updated)
      localStorage.setItem('sara-admin-saved-specifications', JSON.stringify(updated))
    }
  }

  const removePredefinedSpecification = (e: React.MouseEvent, title: string) => {
    e.stopPropagation()
    const updated = savedSpecifications.filter(t => t !== title)
    setSavedSpecifications(updated)
    localStorage.setItem('sara-admin-saved-specifications', JSON.stringify(updated))
  }

  const addSpecification = () => {
    if (newSpecTitle.trim() && newSpecValue.trim()) {
      const title = newSpecTitle.trim()
      const newSpec: Specification = {
        id: Date.now().toString(),
        title,
        value: newSpecValue.trim(),
        type: newSpecType
      }
      setSpecifications([...specifications, newSpec])
      savePredefinedSpecification(title)
      setNewSpecTitle('')
      setNewSpecValue('')
    }
  }

  const removeSpecification = (specId: string) => {
    setSpecifications(specifications.filter(s => s.id !== specId))
  }

  const updateSpecification = (specId: string, field: 'title' | 'value' | 'type', value: string) => {
    setSpecifications(specifications.map(s => 
      s.id === specId ? { ...s, [field]: value } : s
    ))
  }

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Specifications</h3>
        <div className="flex items-center gap-3">
          {onGenerateAI && (
            <>
              <button
                type="button"
                onClick={onGenerateAI}
                className="text-[10px] flex items-center gap-1 text-[#d4af37] hover:text-[#b8941f] transition-colors font-bold uppercase tracking-wider cursor-pointer"
                title="Quick Auto-Fill"
              >
                <Sparkles className="w-3 h-3" />
                Auto
              </button>
              {onToggleGuided && (
                <button
                  type="button"
                  onClick={onToggleGuided}
                  className={`text-[10px] flex items-center gap-1 transition-colors font-bold uppercase tracking-wider cursor-pointer ${showGuidedInput ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Guided AI with Instructions"
                >
                  <MessageSquare className="w-3 h-3" />
                  Guided
                </button>
              )}
            </>
          )}
          <button
            type="button"
            onClick={addSpecification}
            className="inline-flex items-center gap-1 px-3 py-1 bg-[#d4af37] text-black rounded-lg hover:bg-[#b8941f] transition-colors text-sm font-medium cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Specification
          </button>
        </div>
      </div>
      {showGuidedInput && (
        <div className="mb-4 animate-in fade-in slide-in-from-top-1 duration-200">
          <input 
            type="text"
            placeholder="e.g., Focus on diamond clarity and gold weight"
            value={guidedInstructions || ''}
            onChange={(e) => onInstructionsChange?.(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onGenerateAI?.())}
          />
        </div>
      )}
      
      <div className="mb-4 p-3 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          <input
            type="text"
            value={newSpecTitle}
            onChange={(e) => setNewSpecTitle(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100"
            placeholder="Title (e.g., Weight)"
            onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
          />
          <input
            type={newSpecType === 'number' ? 'number' : 'text'}
            value={newSpecValue}
            onChange={(e) => setNewSpecValue(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100"
            placeholder="Value"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addSpecification()
              }
            }}
          />
          <select
            value={newSpecType}
            onChange={(e) => setNewSpecType(e.target.value as 'string' | 'number')}
            className="px-3 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100"
          >
            <option value="string">Text</option>
            <option value="number">Number</option>
          </select>
        </div>
        {savedSpecifications.length > 0 && (
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick add:</p>
            <div className="flex flex-wrap gap-2">
              {savedSpecifications.map((title) => (
                <div key={title} className="inline-flex items-center bg-[#d4af37]/10 rounded-lg overflow-hidden border border-[#d4af37]/20">
                  <button
                    type="button"
                    onClick={() => setNewSpecTitle(title)}
                    className="px-2 py-1 text-[#d4af37] text-xs hover:bg-[#d4af37]/20 transition-colors font-medium"
                  >
                    {title}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => removePredefinedSpecification(e, title)}
                    className="px-1.5 py-1 text-[#d4af37]/60 hover:text-red-500 hover:bg-red-500/10 transition-colors border-l border-[#d4af37]/20"
                    title="Remove from quick add"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {specifications.map((spec) => (
          <div key={spec.id} className="grid grid-cols-12 gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg items-center">
            <input
              type="text"
              value={spec.title}
              onChange={(e) => updateSpecification(spec.id, 'title', e.target.value)}
              className="col-span-4 px-2 py-1 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100"
              placeholder="Title"
              onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
            />
            <input
              type={spec.type === 'number' ? 'number' : 'text'}
              value={spec.value}
              onChange={(e) => updateSpecification(spec.id, 'value', e.target.value)}
              className="col-span-4 px-2 py-1 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100"
              placeholder="Value"
              onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
            />
            <select
              value={spec.type}
              onChange={(e) => updateSpecification(spec.id, 'type', e.target.value)}
              className="col-span-3 px-2 py-1 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100"
            >
              <option value="string">Text</option>
              <option value="number">Number</option>
            </select>
            <button
              type="button"
              onClick={() => removeSpecification(spec.id)}
              className="col-span-1 text-red-500 hover:text-red-700 cursor-pointer flex justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        
        {specifications.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
            No specifications added. Click "Add Specification" to create custom specifications.
          </div>
        )}
      </div>
    </div>
  )
}