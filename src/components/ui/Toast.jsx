import { useEffect, useRef } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const variantConfig = {
  success: { icon: CheckCircle, bg: 'bg-green-50', border: 'border-green-200', iconColor: 'text-green-500', titleColor: 'text-green-800', messageColor: 'text-green-700', timeout: 4000 },
  error: { icon: XCircle, bg: 'bg-red-50', border: 'border-red-200', iconColor: 'text-red-500', titleColor: 'text-red-800', messageColor: 'text-red-700', timeout: 6000 },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', iconColor: 'text-amber-500', titleColor: 'text-amber-800', messageColor: 'text-amber-700', timeout: 5000 },
  info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', iconColor: 'text-blue-500', titleColor: 'text-blue-800', messageColor: 'text-blue-700', timeout: 4000 },
}

export default function Toast({ id, type = 'info', title, message, onDismiss, timeout }) {
  const config = variantConfig[type] || variantConfig.info
  const Icon = config.icon
  const timerRef = useRef(null)
  const toastRef = useRef(null)

  useEffect(() => {
    requestAnimationFrame(() => {
      if (toastRef.current) {
        toastRef.current.style.transform = 'translateX(0)'
        toastRef.current.style.opacity = '1'
      }
    })

    const duration = timeout ?? config.timeout
    timerRef.current = setTimeout(() => handleDismiss(), duration)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleDismiss = () => {
    if (toastRef.current) {
      toastRef.current.style.transform = 'translateX(110%)'
      toastRef.current.style.opacity = '0'
    }
    setTimeout(() => onDismiss(id), 200)
  }

  return (
    <div
      ref={toastRef}
      role="alert"
      style={{ transform: 'translateX(110%)', opacity: 0, transition: 'transform 0.3s ease-out, opacity 0.3s ease-out' }}
      className={`pointer-events-auto w-80 rounded-lg border ${config.border} ${config.bg} p-4 shadow-lg`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
        <div className="flex-1 min-w-0">
          {title && <p className={`text-sm font-semibold ${config.titleColor}`}>{title}</p>}
          {message && <p className={`text-sm ${config.messageColor} ${title ? 'mt-1' : ''}`}>{message}</p>}
        </div>
        <button onClick={handleDismiss} className={`flex-shrink-0 p-0.5 rounded ${config.iconColor} hover:opacity-70`}>
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
