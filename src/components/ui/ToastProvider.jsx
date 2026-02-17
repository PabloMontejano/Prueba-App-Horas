import { createContext, useContext, useState, useCallback, useRef } from 'react'
import Toast from './Toast'

const ToastContext = createContext(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idCounter = useRef(0)
  const MAX_TOASTS = 5

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(({ type = 'info', title, message, timeout }) => {
    const id = ++idCounter.current
    setToasts((prev) => {
      const next = [...prev, { id, type, title, message, timeout }]
      return next.slice(-MAX_TOASTS)
    })
    return id
  }, [])

  const toast = useCallback(
    (opts) => {
      if (typeof opts === 'string') return addToast({ message: opts })
      return addToast(opts)
    },
    [addToast]
  )

  toast.success = (message, title) => addToast({ type: 'success', message, title })
  toast.error = (message, title) => addToast({ type: 'error', message, title })
  toast.warning = (message, title) => addToast({ type: 'warning', message, title })
  toast.info = (message, title) => addToast({ type: 'info', message, title })

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <Toast key={t.id} id={t.id} type={t.type} title={t.title} message={t.message} timeout={t.timeout} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
