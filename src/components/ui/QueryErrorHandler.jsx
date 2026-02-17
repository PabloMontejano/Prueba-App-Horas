import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from './ToastProvider'

export default function QueryErrorHandler() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  useEffect(() => {
    const defaultOptions = queryClient.getDefaultOptions()
    queryClient.setDefaultOptions({
      ...defaultOptions,
      mutations: {
        ...defaultOptions.mutations,
        onError: (error) => {
          toast.error(
            error?.message || 'An unexpected error occurred',
            'Operation failed'
          )
        },
      },
    })
  }, [queryClient, toast])

  return null
}
