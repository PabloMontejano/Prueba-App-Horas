import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from './ToastProvider'

export default function SessionHandler() {
  const { sessionExpired, clearSessionExpired } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (sessionExpired) {
      toast.info('Session expired. Please sign in again.', 'Session Expired')
      clearSessionExpired()
      navigate('/login', { replace: true })
    }
  }, [sessionExpired])

  return null
}
