import { useMemo } from 'react'
import { useDemoStore } from '../lib/demoStore'

function makeMutation(fn) {
  return { mutateAsync: fn, isPending: false }
}

export const useInternalActivities = (showInactive = false) => {
  const { activities } = useDemoStore()

  const data = useMemo(() => {
    if (showInactive) return activities
    return activities.filter((a) => a.is_active)
  }, [activities, showInactive])

  return { data, isLoading: false, error: null }
}

export const useInternalActivityMutations = () => {
  const store = useDemoStore()

  const addActivity = makeMutation(async ({ name }) => {
    return store.addInternalActivity(name)
  })

  const updateActivity = makeMutation(async ({ id, ...values }) => {
    return store.updateInternalActivity(id, values)
  })

  const deleteActivity = makeMutation(async ({ id }) => {
    store.deleteInternalActivity(id)
  })

  return { addActivity, updateActivity, deleteActivity }
}
