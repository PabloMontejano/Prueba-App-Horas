import { useState, useMemo } from 'react'
import { Clock, Calendar, Users, Settings2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTimesheetPermissions } from '../hooks/useTimesheetPermissions'
import { useTimesheetWeek, useMyTimesheetHistory, useTimesheetMutations } from '../hooks/useTimesheet'
import { useToast } from '../components/ui/ToastProvider'
import Tabs from '../components/ui/Tabs'
import WeekSelector from '../components/timesheet/WeekSelector'
import TimesheetForm from '../components/timesheet/TimesheetForm'
import TimesheetHistory from '../components/timesheet/TimesheetHistory'
import TeamOverview from '../components/timesheet/TeamOverview'
import InternalActivitiesManager from '../components/timesheet/InternalActivitiesManager'

export default function Timesheet() {
  const { user } = useAuth()
  const { viewAll, manageActivities } = useTimesheetPermissions()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState('log')
  const [selectedWeek, setSelectedWeek] = useState('')

  // Fetch the selected week's data (if it exists)
  const {
    data: existingWeek,
    isLoading: weekLoading,
  } = useTimesheetWeek(selectedWeek || null, user?.id)

  // Fetch history to know which weeks are already submitted
  const { data: history } = useMyTimesheetHistory()

  const submittedWeeks = useMemo(
    () => (history || []).map((w) => w.week_start),
    [history]
  )

  const { submitWeek, updateWeek } = useTimesheetMutations()

  const handleSubmit = async (formData) => {
    try {
      if (formData.weekId) {
        await updateWeek.mutateAsync(formData)
        toast.success('Timesheet updated successfully')
      } else {
        await submitWeek.mutateAsync(formData)
        toast.success('Timesheet submitted successfully')
      }
      // Reset selection to prompt for next week
      setSelectedWeek('')
    } catch (err) {
      toast.error(err.message || 'Failed to save timesheet')
    }
  }

  // Build tabs based on permissions
  const tabs = [
    { id: 'log', label: 'Log Hours', icon: Clock },
    { id: 'history', label: 'My History', icon: Calendar },
    ...(viewAll
      ? [{ id: 'team', label: 'Team', icon: Users }]
      : []),
    ...(manageActivities
      ? [{ id: 'activities', label: 'Internal Activities', icon: Settings2 }]
      : []),
  ]

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Timesheet</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Track your weekly hours across projects
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      <div className="mt-1">
        {activeTab === 'log' && (
          <div className="space-y-4">
            <WeekSelector
              value={selectedWeek}
              onChange={setSelectedWeek}
              submittedWeeks={submittedWeeks}
            />

            {weekLoading && selectedWeek ? (
              <div className="rounded-xl border border-gray-200 bg-white p-8">
                <div className="flex justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                </div>
              </div>
            ) : (
              <TimesheetForm
                weekStart={selectedWeek || null}
                existingWeek={existingWeek}
                onSubmit={handleSubmit}
                isSubmitting={
                  submitWeek.isPending || updateWeek.isPending
                }
              />
            )}
          </div>
        )}

        {activeTab === 'history' && <TimesheetHistory />}

        {activeTab === 'team' && viewAll && <TeamOverview />}

        {activeTab === 'activities' && manageActivities && (
          <InternalActivitiesManager />
        )}
      </div>
    </div>
  )
}
