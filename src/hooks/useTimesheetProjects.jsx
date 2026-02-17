import { useMemo } from 'react'
import { useDemoStore, MOCK_PROJECTS } from '../lib/demoStore'

export const useTimesheetProjects = () => {
  const { activities } = useDemoStore()

  const data = useMemo(() => {
    const internal = activities
      .filter((a) => a.is_active)
      .map((a) => ({
        id: a.id,
        name: a.name,
        type: 'internal',
        typeLabel: 'Internal',
      }))

    return {
      all: [...MOCK_PROJECTS.deal, ...MOCK_PROJECTS.pitch, ...MOCK_PROJECTS.idea, ...internal],
      grouped: {
        deal: MOCK_PROJECTS.deal,
        pitch: MOCK_PROJECTS.pitch,
        idea: MOCK_PROJECTS.idea,
        internal,
      },
    }
  }, [activities])

  return { data, isLoading: false, error: null }
}
