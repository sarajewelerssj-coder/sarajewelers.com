'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Sparkles } from 'lucide-react'

interface Variation {
  id: string
  title: string
  values: (string | { value: string, price: number })[]
}

interface ProductVariationsProps {
  variations: Variation[]
  setVariations: (variations: Variation[]) => void
  onGenerateAI?: () => void
}

export default function ProductVariations({ variations, setVariations, onGenerateAI }: ProductVariationsProps) {
  const [newVariationTitle, setNewVariationTitle] = useState('')
  const [variationInputValues, setVariationInputValues] = useState<Record<string, string>>({})
  const [savedVariations, setSavedVariations] = useState<string[]>([])

  useEffect(() => {
    loadSavedVariations()
  }, [])

  const loadSavedVariations = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('sara-admin-saved-variations') || '[]')
      setSavedVariations(saved)
    } catch (error) {
      console.error('Error loading saved variations:', error)
    }
  }

  const savePredefinedVariation = (title: string) => {
    if (!savedVariations.includes(title)) {
      const updated = [...savedVariations, title]
      setSavedVariations(updated)
      localStorage.setItem('sara-admin-saved-variations', JSON.stringify(updated))
    }
  }
  
  const removePredefinedVariation = (e: React.MouseEvent, title: string) => {
    e.stopPropagation()
    const updated = savedVariations.filter(t => t !== title)
    setSavedVariations(updated)
    localStorage.setItem('sara-admin-saved-variations', JSON.stringify(updated))
  }

  const addVariation = () => {
    if (newVariationTitle.trim()) {
      const title = newVariationTitle.trim()
      const newVar: Variation = {
        id: Date.now().toString(),
        title,
        values: []
      }
      setVariations([...variations, newVar])
      savePredefinedVariation(title)
      setNewVariationTitle('')
    }
  }

  const addVariationValue = (variationId: string) => {
    const value = variationInputValues[variationId]
    if (value && value.trim()) {
      setVariations(variations.map(v => 
        v.id === variationId 
          ? { ...v, values: [...v.values, value.trim()] }
          : v
      ))
      setVariationInputValues(prev => ({ ...prev, [variationId]: '' }))
    }
  }

  const handleInputChange = (variationId: string, value: string) => {
    setVariationInputValues(prev => ({ ...prev, [variationId]: value }))
  }

  const removeVariation = (variationId: string) => {
    setVariations(variations.filter(v => v.id !== variationId))
    const newInputs = { ...variationInputValues }
    delete newInputs[variationId]
    setVariationInputValues(newInputs)
  }

  const removeVariationValue = (variationId: string, valueIndex: number) => {
    setVariations(variations.map(v => 
      v.id === variationId 
        ? { ...v, values: v.values.filter((_, i) => i !== valueIndex) }
        : v
    ))
  }

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Product Variations</h3>
        <div className="flex items-center gap-3">
          {onGenerateAI && (
            <button
              type="button"
              onClick={onGenerateAI}
              className="text-xs flex items-center gap-1.5 text-[#d4af37] hover:text-[#b8941f] transition-colors font-bold uppercase tracking-wider cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              Auto-Fill
            </button>
          )}
          <button
            type="button"
            onClick={addVariation}
            className="inline-flex items-center gap-1 px-3 py-1 bg-[#d4af37] text-black rounded-lg hover:bg-[#b8941f] transition-colors text-sm font-medium cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Variation
          </button>
        </div>
      </div>
      
      <div className="mb-4 p-3 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newVariationTitle}
            onChange={(e) => setNewVariationTitle(e.target.value)}
            className="flex-1 px-3 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100"
            placeholder="Variation title (e.g., Sizes, Colors)"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addVariation()
              }
            }}
          />
        </div>
        {savedVariations.length > 0 && (
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick add:</p>
            <div className="flex flex-wrap gap-2">
              {savedVariations.map((title) => (
                <div key={title} className="inline-flex items-center bg-[#d4af37]/10 rounded-lg overflow-hidden border border-[#d4af37]/20">
                  <button
                    type="button"
                    onClick={() => {
                      const newVar: Variation = {
                        id: Date.now().toString(),
                        title,
                        values: []
                      }
                      setVariations([...variations, newVar])
                    }}
                    className="px-2 py-1 text-[#d4af37] text-xs hover:bg-[#d4af37]/20 transition-colors font-medium"
                  >
                    {title}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => removePredefinedVariation(e, title)}
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

      <div className="space-y-4">
        {variations.map((variation) => (
          <div key={variation.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">{variation.title}</h4>
              <button
                type="button"
                onClick={() => removeVariation(variation.id)}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                value={variationInputValues[variation.id] || ''}
                onChange={(e) => handleInputChange(variation.id, e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-900 dark:text-gray-100"
                placeholder={`Value (e.g., XL, Gold)`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addVariationValue(variation.id)
                  }
                }}
              />
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                  <input
                    type="number"
                    id={`price-${variation.id}`}
                    className="w-full pl-6 pr-3 py-2 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-sm text-gray-900 dark:text-gray-100"
                    placeholder="Extra Price (Optional)"
                    title="Additional price for this variation"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const priceInput = document.getElementById(`price-${variation.id}`) as HTMLInputElement;
                    const price = parseFloat(priceInput?.value || '0');
                    const value = variationInputValues[variation.id];
                    if (value && value.trim()) {
                      setVariations(variations.map(v => 
                        v.id === variation.id 
                          ? { ...v, values: [...v.values, { value: value.trim(), price }] }
                          : v
                      ))
                      setVariationInputValues(prev => ({ ...prev, [variation.id]: '' }))
                      if (priceInput) priceInput.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-[#d4af37] text-black rounded-lg hover:bg-[#b8941f] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {variation.values.map((val: any, index) => (
                <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 shadow-sm group/val">
                  {typeof val === 'string' ? val : val.value}
                  {typeof val !== 'string' && val.price > 0 && (
                    <span className="text-[#d4af37] font-bold text-xs">+$ {val.price}</span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeVariationValue(variation.id, index)}
                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        ))}
        
        {variations.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
            No variations added. Click "Add Variation" to create custom variations.
          </div>
        )}
      </div>
    </div>
  )
}