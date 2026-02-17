import { useState, useMemo } from 'react'
import { Calendar, Clock, ChevronDown, ChevronRight, FileText } from 'lucide-react'
import { format, parseISO, endOfWeek } from 'date-fns'
import { useMyTimesheetHistory } from '../../hooks/useTimesheet'
import { useTimesheetProjects } from '../../hooks/useTimesheetProjects'
import EmptyState from '../ui/EmptyState'

const TYPE_COLORS = {
  deal: 'bg-orange-100 text-orange-700',
  pitch: 'bg-purple-100 text-purple-700',
  idea: 'bg-amber-100 text-amber-700',
  internal: 'bg-blue-100 text-blue-700',
}

function WeekCard({ week, projectMap }) {
  const [expanded, setExpanded] = useState(false)
  const weekStartDate = parseISO(week.week_start)
  const weekEndDate = endOfWeek(weekStartDate, { weekStartsOn: 1 })

  const label = `${format(weekStartDate, 'd MMM')} – ${format(weekEndDate, 'd MMM yyyy')}`
  const isUnder40 = week.total_hours < 40

  const sortedEntries = useMemo(() => {
    if (!week.entries) return []
    return [...week.entries].sort((a, b) => b.hours - a.hours)
  }, [week.entries])

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">{label}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {week.entries?.length || 0} project{(week.entries?.length || 0) !== 1 ? 's' : ''}
          </span>
          <div
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isUnder40
                ? 'bg-amber-50 text-amber-600'
                : 'bg-green-50 text-green-600'
            }`}
          >
            <Clock className="h-3 w-3" />
            {week.total_hours}h
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100">
          <div className="divide-y divide-gray-50">
            {sortedEntries.map((entry) => {
              const key = `${entry.project_type}:${entry.project_id}`
              const projectName = projectMap[key] || 'Unknown project'
              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <span className="w-10 pl-1" />
                  <span
                    className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      TYPE_COLORS[entry.project_type]
                    }`}
                  >
                    {entry.project_type}
                  </span>
                  <span className="flex-1 text-sm text-gray-700 truncate">
                    {projectName}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {entry.hours}h
                  </span>
                </div>
              )
            })}
          </div>

          {week.notes && (
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
              <div className="flex items-start gap-2 pl-10">
                <FileText className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-500">{week.notes}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function TimesheetHistory() {
  const { data: weeks, isLoading } = useMyTimesheetHistory()
  const { data: projects } = useTimesheetProjects()

  // Build a lookup map: "type:id" → name
  const projectMap = useMemo(() => {
    if (!projects) return {}
    const map = {}
    for (const p of projects.all) {
      map[`${p.type}:${p.id}`] = p.name
    }
    return map
  }, [projects])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 rounded-xl border border-gray-200 bg-white animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (!weeks || weeks.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No timesheets yet"
        description="Your submitted timesheets will appear here once you start logging hours."
      />
    )
  }

  // Group by year-month for visual separation
  const grouped = {}
  for (const week of weeks) {
    const monthKey = format(parseISO(week.week_start), 'MMMM yyyy')
    if (!grouped[monthKey]) grouped[monthKey] = []
    grouped[monthKey].push(week)
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([month, monthWeeks]) => (
        <div key={month}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            {month}
          </h3>
          <div className="space-y-2">
            {monthWeeks.map((week) => (
              <WeekCard key={week.id} week={week} projectMap={projectMap} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
