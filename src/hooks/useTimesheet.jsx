import { useMemo } from 'react'
import { useDemoStore } from '../lib/demoStore'
import { useAuth } from './useAuth'

const MOCK_EMPLOYEES = {
  'demo-user-1': { id: 'demo-user-1', name: 'Pablo Montejano', initials: 'PM' },
  'demo-user-2': { id: 'demo-user-2', name: 'Ana García', initials: 'AG' },
  'demo-user-3': { id: 'demo-user-3', name: 'Carlos López', initials: 'CL' },
}

function makeMutation(fn) {
  return { mutateAsync: fn, isPending: false }
}

// ---- Queries ----

export const useTimesheetWeek = (weekStart, employeeId) => {
  const { weeks } = useDemoStore()

  const data = useMemo(() => {
    if (!weekStart || !employeeId) return null
    return weeks.find(
      (w) => w.week_start === weekStart && w.employee_id === employeeId
    ) || null
  }, [weeks, weekStart, employeeId])

  return { data, isLoading: false, error: null }
}

export const useMyTimesheetHistory = () => {
  const { user } = useAuth()
  const { weeks } = useDemoStore()

  const data = useMemo(() =>
    weeks
      .filter((w) => w.employee_id === user?.id)
      .sort((a, b) => b.week_start.localeCompare(a.week_start)),
    [weeks, user?.id]
  )

  return { data, isLoading: false, error: null }
}

export const useTeamTimesheets = (filters = {}) => {
  const { weeks } = useDemoStore()

  const data = useMemo(() => {
    let filtered = weeks
    if (filters.weekStart) {
      filtered = filtered.filter((w) => w.week_start === filters.weekStart)
    }
    if (filters.employeeId) {
      filtered = filtered.filter((w) => w.employee_id === filters.employeeId)
    }
    return filtered.map((w) => ({
      ...w,
      employee: MOCK_EMPLOYEES[w.employee_id] || { id: w.employee_id, name: 'Unknown', initials: '??' },
    }))
  }, [weeks, filters.weekStart, filters.employeeId])

  return { data, isLoading: false, error: null }
}

// ---- Mutations ----

export const useTimesheetMutations = () => {
  const { user } = useAuth()
  const store = useDemoStore()

  const submitWeek = makeMutation(async ({ weekStart, entries, notes }) => {
    return store.addWeek({ employeeId: user.id, weekStart, entries, notes })
  })

  const updateWeek = makeMutation(async ({ weekId, weekStart, entries, notes }) => {
    return store.updateWeek(weekId, { entries, notes })
  })

  const deleteWeek = makeMutation(async ({ weekId }) => {
    store.deleteWeek(weekId)
  })

  return { submitWeek, updateWeek, deleteWeek }
}
