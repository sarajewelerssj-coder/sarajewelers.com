'use client'

import { X } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  type?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  type = 'info'
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white'
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white'
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 w-full max-w-md mx-4 border border-gray-100 dark:border-gray-800 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-all ${getTypeStyles()}`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-[#333] transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}