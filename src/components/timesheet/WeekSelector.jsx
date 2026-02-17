import { useMemo } from 'react'
import { ChevronDown, Check, Lock } from 'lucide-react'
import {
  startOfWeek,
  addWeeks,
  format,
  isBefore,
  isAfter,
  isSameDay,
  endOfWeek,
} from 'date-fns'

/**
 * Generates all available weeks from Jan 5 2026 (first Monday of Jan 2026)
 * up to the current week. Returns array of { weekStart: Date, label: string }.
 */
function generateWeeks() {
  const firstMonday = new Date(2026, 0, 5) // Mon Jan 5 2026
  const today = new Date()
  const currentMonday = startOfWeek(today, { weekStartsOn: 1 })

  const weeks = []
  let current = firstMonday

  while (!isAfter(current, currentMonday)) {
    const sunday = endOfWeek(current, { weekStartsOn: 1 })
    const label = `${format(current, 'd MMM')} – ${format(sunday, 'd MMM yyyy')}`
    weeks.push({
      weekStart: current,
      weekStartISO: format(current, 'yyyy-MM-dd'),
      label,
    })
    current = addWeeks(current, 1)
  }

  return weeks.reverse() // Most recent first
}

export default function WeekSelector({
  value,
  onChange,
  submittedWeeks = [],
  disabled = false,
}) {
  const weeks = useMemo(() => generateWeeks(), [])

  const submittedSet = useMemo(
    () => new Set(submittedWeeks.map((w) => w)),
    [submittedWeeks]
  )

  const selectedWeek = weeks.find((w) => w.weekStartISO === value)

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        Select Week
      </label>
      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-10 text-sm text-gray-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
        >
          <option value="">Choose a week...</option>
          {weeks.map((week) => {
            const isSubmitted = submittedSet.has(week.weekStartISO)
            return (
              <option key={week.weekStartISO} value={week.weekStartISO}>
                {week.label}
                {isSubmitted ? ' ✓' : ''}
              </option>
            )
          })}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {selectedWeek && submittedSet.has(value) && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600">
          <Lock className="h-3.5 w-3.5" />
          <span>This week has already been submitted. You can edit it below.</span>
        </div>
      )}
    </div>
  )
}
