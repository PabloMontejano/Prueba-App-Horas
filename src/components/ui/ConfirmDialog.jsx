import { useEffect, useRef } from 'react'
import { AlertTriangle, Trash2, HelpCircle } from 'lucide-react'

const variantConfig = {
  danger: { icon: Trash2, iconBg: 'bg-red-100', iconColor: 'text-red-600', confirmBg: 'bg-red-600 hover:bg-red-700', confirmText: 'text-white' },
  warning: { icon: AlertTriangle, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', confirmBg: 'bg-amber-500 hover:bg-amber-600', confirmText: 'text-white' },
  default: { icon: HelpCircle, iconBg: 'bg-navy-100', iconColor: 'text-navy-900', confirmBg: 'bg-navy-900 hover:bg-navy-800', confirmText: 'text-white' },
}

export default function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Are you sure?',
  message = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false,
}) {
  const cancelRef = useRef(null)
  const dialogRef = useRef(null)
  const config = variantConfig[variant] || variantConfig.default
  const Icon = config.icon

  useEffect(() => {
    if (!isOpen) return
    cancelRef.current?.focus()

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { onCancel(); return }
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll('button')
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus() }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus() }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 animate-[fadeIn_0.15s_ease-out]" onClick={onCancel} />
      <div ref={dialogRef} role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message" className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-[slideUp_0.2s_ease-out]">
        <div className="flex gap-4">
          <div className={`flex-shrink-0 h-10 w-10 rounded-full ${config.iconBg} flex items-center justify-center`}>
            <Icon className={`h-5 w-5 ${config.iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 id="confirm-title" className="text-base font-semibold text-gray-900">{title}</h3>
            {message && <p id="confirm-message" className="mt-2 text-sm text-gray-600">{message}</p>}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button ref={cancelRef} onClick={onCancel} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">{cancelText}</button>
          <button onClick={onConfirm} disabled={isLoading} className={`rounded-lg px-4 py-2 text-sm font-medium ${config.confirmBg} ${config.confirmText} disabled:opacity-50 disabled:cursor-not-allowed`}>{isLoading ? 'Processing...' : confirmText}</button>
        </div>
      </div>
    </div>
  )
}
