import { useState, useMemo } from 'react'
import {
  Users,
  Calendar,
  Clock,
  ChevronDown,
  ChevronRight,
  Check,
  AlertCircle,
  Download,
  Filter,
} from 'lucide-react'
import {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  addWeeks,
  isSameDay,
} from 'date-fns'
import { useTeamTimesheets } from '../../hooks/useTimesheet'
import { useTimesheetProjects } from '../../hooks/useTimesheetProjects'
import { useEmployees } from '../../hooks/useEmployees'
import EmptyState from '../ui/EmptyState'

const TYPE_COLORS = {
  deal: 'bg-orange-100 text-orange-700',
  pitch: 'bg-purple-100 text-purple-700',
  idea: 'bg-amber-100 text-amber-700',
  internal: 'bg-blue-100 text-blue-700',
}

function generateRecentWeeks(count = 8) {
  const today = new Date()
  const currentMonday = startOfWeek(today, { weekStartsOn: 1 })
  const weeks = []
  for (let i = 0; i < count; i++) {
    const monday = addWeeks(currentMonday, -i)
    weeks.push(format(monday, 'yyyy-MM-dd'))
  }
  return weeks
}

function EmployeeRow({ employee, weekData, projectMap, onToggle, isExpanded }) {
  const isUnder40 = weekData && weekData.total_hours < 40
  const entries = weekData?.entries || []

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        disabled={!weekData}
        className="w-full flex items-center gap-4 px-5 py-3 text-left hover:bg-gray-50 transition-colors disabled:hover:bg-white disabled:cursor-default"
      >
        {weekData ? (
          isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )
        ) : (
          <span className="w-4" />
        )}

        {/* Avatar */}
        <div className="h-7 w-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-semibold text-orange-600">
            {employee.initials || employee.name?.substring(0, 2).toUpperCase()}
          </span>
        </div>

        <span className="flex-1 text-sm font-medium text-gray-900 truncate">
          {employee.name}
        </span>

        {weekData ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {entries.length} project{entries.length !== 1 ? 's' : ''}
            </span>
            <div
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                isUnder40
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-green-50 text-green-600'
              }`}
            >
              <Clock className="h-3 w-3" />
              {weekData.total_hours}h
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-red-400">
            <AlertCircle className="h-3.5 w-3.5" />
            Not submitted
          </div>
        )}
      </button>

      {isExpanded && weekData && (
        <div className="bg-gray-50 px-5 py-2 pl-16">
          <div className="space-y-1.5">
            {[...entries]
              .sort((a, b) => b.hours - a.hours)
              .map((entry) => {
                const key = `${entry.project_type}:${entry.project_id}`
                const projectName = projectMap[key] || 'Unknown project'
                return (
                  <div key={entry.id} className="flex items-center gap-2 text-xs">
                    <span
                      className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        TYPE_COLORS[entry.project_type]
                      }`}
                    >
                      {entry.project_type}
                    </span>
                    <span className="flex-1 text-gray-600 truncate">{projectName}</span>
                    <span className="font-semibold text-gray-900">{entry.hours}h</span>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function TeamOverview() {
  const recentWeeks = useMemo(() => generateRecentWeeks(8), [])
  const [selectedWeek, setSelectedWeek] = useState(recentWeeks[0])
  const [expandedEmployee, setExpandedEmployee] = useState(null)

  const { data: employees, isLoading: empLoading } = useEmployees()
  const { data: teamData, isLoading: teamLoading } = useTeamTimesheets({
    weekStart: selectedWeek,
  })
  const { data: projects } = useTimesheetProjects()

  const projectMap = useMemo(() => {
    if (!projects) return {}
    const map = {}
    for (const p of projects.all) {
      map[`${p.type}:${p.id}`] = p.name
    }
    return map
  }, [projects])

  // Map: employeeId → week data
  const weekByEmployee = useMemo(() => {
    if (!teamData) return {}
    const map = {}
    for (const week of teamData) {
      map[week.employee_id] = week
    }
    return map
  }, [teamData])

  const isLoading = empLoading || teamLoading

  // Stats
  const totalEmployees = employees?.length || 0
  const submittedCount = Object.keys(weekByEmployee).length
  const pendingCount = totalEmployees - submittedCount

  const selectedWeekDate = parseISO(selectedWeek)
  const selectedWeekEnd = endOfWeek(selectedWeekDate, { weekStartsOn: 1 })
  const weekLabel = `${format(selectedWeekDate, 'd MMM')} – ${format(selectedWeekEnd, 'd MMM yyyy')}`

  return (
    <div className="space-y-4">
      {/* Week selector + stats */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Week
          </label>
          <div className="relative">
            <select
              value={selectedWeek}
              onChange={(e) => {
                setSelectedWeek(e.target.value)
                setExpandedEmployee(null)
              }}
              className="w-full sm:w-72 appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-10 text-sm text-gray-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
            >
              {recentWeeks.map((w) => {
                const d = parseISO(w)
                const end = endOfWeek(d, { weekStartsOn: 1 })
                return (
                  <option key={w} value={w}>
                    {format(d, 'd MMM')} – {format(end, 'd MMM yyyy')}
                  </option>
                )
              })}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 min-w-[100px]">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Submitted
            </p>
            <p className="text-xl font-bold text-green-600">{submittedCount}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 min-w-[100px]">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Pending
            </p>
            <p className={`text-xl font-bold ${pendingCount > 0 ? 'text-red-500' : 'text-gray-300'}`}>
              {pendingCount}
            </p>
          </div>
        </div>
      </div>

      {/* Employee list */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Team — {weekLabel}
            </h3>
          </div>
        </div>

        {isLoading ? (
          <div className="p-6">
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 rounded-lg bg-gray-100 animate-pulse" />
              ))}
            </div>
          </div>
        ) : !employees || employees.length === 0 ? (
          <EmptyState icon={Users} title="No employees" description="No active employees found." />
        ) : (
          <div>
            {/* Employees sorted: pending first, then by name */}
            {[...employees]
              .sort((a, b) => {
                const aSubmitted = !!weekByEmployee[a.id]
                const bSubmitted = !!weekByEmployee[b.id]
                if (aSubmitted !== bSubmitted) return aSubmitted ? 1 : -1
                return a.name.localeCompare(b.name)
              })
              .map((emp) => (
                <EmployeeRow
                  key={emp.id}
                  employee={emp}
                  weekData={weekByEmployee[emp.id] || null}
                  projectMap={projectMap}
                  isExpanded={expandedEmployee === emp.id}
                  onToggle={() =>
                    setExpandedEmployee(expandedEmployee === emp.id ? null : emp.id)
                  }
                />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
