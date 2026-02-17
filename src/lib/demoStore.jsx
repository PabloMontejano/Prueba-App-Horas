// ============================================================
// Demo Store — React Context based, no infinite loops
// ============================================================
import { createContext, useContext, useState, useCallback } from 'react'

const DemoStoreContext = createContext(null)

// ---- Fixed CRM projects ----
export const MOCK_PROJECTS = {
  deal: [{ id: 'deal-1', name: 'D1 Prueba', type: 'deal', typeLabel: 'Deal', status: 'Active' }],
  pitch: [{ id: 'pitch-1', name: 'P1 Prueba', type: 'pitch', typeLabel: 'Pitch', status: 'Active' }],
  idea: [],
}

const INITIAL_ACTIVITIES = [
  { id: 'int-1', name: 'Vacaciones', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'int-2', name: 'Baja Médica', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'int-3', name: 'Business Development', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

// ---- Provider ----
export function DemoStoreProvider({ children }) {
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES)
  const [weeks, setWeeks] = useState([])
  const [activityCounter, setActivityCounter] = useState(4)

  // -- Internal Activities --
  const addInternalActivity = useCallback((name) => {
    const activity = {
      id: `int-${Date.now()}`,
      name,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setActivities((prev) => [...prev, activity])
    return activity
  }, [])

  const updateInternalActivity = useCallback((id, values) => {
    let updated = null
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a
        updated = { ...a, ...values, updated_at: new Date().toISOString() }
        return updated
      })
    )
    return updated
  }, [])

  const deleteInternalActivity = useCallback((id) => {
    setActivities((prev) => prev.filter((a) => a.id !== id))
  }, [])

  // -- Weeks --
  const addWeek = useCallback((weekData) => {
    const week = {
      id: `week-${Date.now()}`,
      employee_id: weekData.employeeId,
      week_start: weekData.weekStart,
      total_hours: weekData.entries.reduce((sum, e) => sum + e.hours, 0),
      notes: weekData.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      entries: weekData.entries.map((e, i) => ({
        id: `entry-${Date.now()}-${i}`,
        project_type: e.projectType,
        project_id: e.projectId,
        hours: e.hours,
        notes: e.notes || null,
      })),
    }
    setWeeks((prev) => [week, ...prev])
    return week
  }, [])

  const updateWeek = useCallback((weekId, weekData) => {
    let updated = null
    setWeeks((prev) =>
      prev.map((w) => {
        if (w.id !== weekId) return w
        updated = {
          ...w,
          total_hours: weekData.entries.reduce((sum, e) => sum + e.hours, 0),
          notes: weekData.notes || null,
          updated_at: new Date().toISOString(),
          entries: weekData.entries.map((e, i) => ({
            id: `entry-${Date.now()}-${i}`,
            week_id: weekId,
            project_type: e.projectType,
            project_id: e.projectId,
            hours: e.hours,
            notes: e.notes || null,
          })),
        }
        return updated
      })
    )
    return updated
  }, [])

  const deleteWeek = useCallback((weekId) => {
    setWeeks((prev) => prev.filter((w) => w.id !== weekId))
  }, [])

  const value = {
    activities,
    weeks,
    addInternalActivity,
    updateInternalActivity,
    deleteInternalActivity,
    addWeek,
    updateWeek,
    deleteWeek,
  }

  return (
    <DemoStoreContext.Provider value={value}>
      {children}
    </DemoStoreContext.Provider>
  )
}

export function useDemoStore() {
  const ctx = useContext(DemoStoreContext)
  if (!ctx) throw new Error('useDemoStore must be used within DemoStoreProvider')
  return ctx
}
