import { useState, useEffect, useMemo } from 'react'
import { Plus, Trash2, Save, AlertTriangle, Search } from 'lucide-react'
import { useTimesheetProjects } from '../../hooks/useTimesheetProjects'
import ConfirmDialog from '../ui/ConfirmDialog'

const TYPE_COLORS = {
  deal: 'bg-orange-100 text-orange-700',
  pitch: 'bg-purple-100 text-purple-700',
  idea: 'bg-amber-100 text-amber-700',
  internal: 'bg-blue-100 text-blue-700',
}

const TYPE_ORDER = ['deal', 'pitch', 'idea', 'internal']
const TYPE_LABELS = { deal: 'Deals', pitch: 'Pitches', idea: 'Ideas', internal: 'Internal' }

function ProjectSelector({ value, onChange, excludeIds = [], autoFocus = false }) {
  const { data: projects, isLoading } = useTimesheetProjects()
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const selectedProject = useMemo(() => {
    if (!value || !projects) return null
    return projects.all.find(
      (p) => p.id === value.projectId && p.type === value.projectType
    )
  }, [value, projects])

  const filteredGroups = useMemo(() => {
    if (!projects) return {}
    const groups = {}
    const searchLower = search.toLowerCase()

    for (const type of TYPE_ORDER) {
      const items = (projects.grouped[type] || []).filter((p) => {
        const excluded = excludeIds.some(
          (ex) => ex.projectId === p.id && ex.projectType === p.type
        )
        if (excluded) return false
        if (!search) return true
        return p.name.toLowerCase().includes(searchLower)
      })
      if (items.length > 0) groups[type] = items
    }

    return groups
  }, [projects, search, excludeIds])

  if (isLoading) {
    return (
      <div className="h-10 rounded-lg bg-gray-100 animate-pulse" />
    )
  }

  return (
    <div className="relative">
      {selectedProject ? (
        <button
          type="button"
          onClick={() => { onChange(null); setIsOpen(true) }}
          className="w-full flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-left hover:border-gray-300"
        >
          <span
            className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${TYPE_COLORS[selectedProject.type]}`}
          >
            {selectedProject.typeLabel}
          </span>
          <span className="flex-1 truncate text-gray-900">{selectedProject.name}</span>
        </button>
      ) : (
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setIsOpen(true) }}
              onFocus={() => setIsOpen(true)}
              autoFocus={autoFocus}
              placeholder="Search project..."
              className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
            />
          </div>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
              <div className="absolute z-20 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {Object.keys(filteredGroups).length === 0 ? (
                  <div className="px-3 py-4 text-center text-sm text-gray-400">
                    No projects found
                  </div>
                ) : (
                  Object.entries(filteredGroups).map(([type, items]) => (
                    <div key={type}>
                      <div className="sticky top-0 bg-gray-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                        {TYPE_LABELS[type]}
                      </div>
                      {items.map((project) => (
                        <button
                          key={`${project.type}-${project.id}`}
                          type="button"
                          onClick={() => {
                            onChange({
                              projectId: project.id,
                              projectType: project.type,
                            })
                            setSearch('')
                            setIsOpen(false)
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-orange-50 transition-colors"
                        >
                          <span
                            className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${TYPE_COLORS[project.type]}`}
                          >
                            {project.typeLabel}
                          </span>
                          <span className="flex-1 truncate text-gray-700">
                            {project.name}
                          </span>
                          {project.status && (
                            <span className="text-[10px] text-gray-400">
                              {project.status}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function TimesheetForm({
  weekStart,
  existingWeek,
  onSubmit,
  isSubmitting = false,
}) {
  const [entries, setEntries] = useState([])
  const [notes, setNotes] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  // Initialize from existing data when editing
  useEffect(() => {
    if (existingWeek?.entries?.length > 0) {
      setEntries(
        existingWeek.entries.map((e) => ({
          id: e.id,
          projectType: e.project_type,
          projectId: e.project_id,
          hours: e.hours,
          notes: e.notes || '',
        }))
      )
      setNotes(existingWeek.notes || '')
    } else if (!existingWeek) {
      setEntries([])
      setNotes('')
    }
  }, [existingWeek])

  const totalHours = entries.reduce((sum, e) => sum + (e.hours || 0), 0)
  const isUnder40 = totalHours > 0 && totalHours < 40
  const isValid =
    entries.length > 0 &&
    entries.every((e) => e.projectId && e.hours > 0) &&
    weekStart

  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      { id: null, projectType: '', projectId: '', hours: '', notes: '' },
    ])
  }

  const removeEntry = (index) => {
    setEntries((prev) => prev.filter((_, i) => i !== index))
  }

  const updateEntry = (index, field, value) => {
    setEntries((prev) =>
      prev.map((e, i) => (i === index ? { ...e, [field]: value } : e))
    )
  }

  const handleProjectChange = (index, project) => {
    if (project) {
      setEntries((prev) =>
        prev.map((e, i) =>
          i === index
            ? { ...e, projectType: project.projectType, projectId: project.projectId }
            : e
        )
      )
    } else {
      setEntries((prev) =>
        prev.map((e, i) =>
          i === index ? { ...e, projectType: '', projectId: '' } : e
        )
      )
    }
  }

  const handleSubmit = () => {
    if (!isValid) return
    if (isUnder40) {
      setShowConfirm(true)
      return
    }
    doSubmit()
  }

  const doSubmit = () => {
    setShowConfirm(false)
    onSubmit({
      weekId: existingWeek?.id || null,
      weekStart,
      entries: entries.map((e) => ({
        projectType: e.projectType,
        projectId: e.projectId,
        hours: parseInt(e.hours, 10),
        notes: e.notes || null,
      })),
      notes: notes || null,
    })
  }

  // Exclude already-selected projects from other rows' dropdowns
  const excludeIds = entries
    .filter((e) => e.projectId)
    .map((e) => ({ projectId: e.projectId, projectType: e.projectType }))

  if (!weekStart) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-gray-400">Select a week above to start logging hours.</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {existingWeek ? 'Edit Timesheet' : 'Log Hours'}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Add projects and allocate hours for this week
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-400">Total Hours</p>
              <p
                className={`text-xl font-bold ${
                  isUnder40 && totalHours > 0
                    ? 'text-amber-500'
                    : totalHours >= 40
                    ? 'text-green-600'
                    : 'text-gray-900'
                }`}
              >
                {totalHours}
              </p>
            </div>
          </div>
        </div>

        {/* Entries */}
        <div className="p-5 space-y-3">
          {entries.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-sm text-gray-400 mb-3">No projects added yet.</p>
              <button
                type="button"
                onClick={addEntry}
                className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Project
              </button>
            </div>
          ) : (
            <>
              {/* Column headers */}
              <div className="grid grid-cols-[1fr_100px_auto] gap-3 px-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Project
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Hours
                </span>
                <span className="w-8" />
              </div>

              {entries.map((entry, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_100px_auto] gap-3 items-start"
                >
                  <ProjectSelector
                    value={
                      entry.projectId
                        ? {
                            projectId: entry.projectId,
                            projectType: entry.projectType,
                          }
                        : null
                    }
                    onChange={(project) => handleProjectChange(index, project)}
                    excludeIds={excludeIds.filter(
                      (ex) =>
                        !(
                          ex.projectId === entry.projectId &&
                          ex.projectType === entry.projectType
                        )
                    )}
                    autoFocus={!entry.projectId}
                  />
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={entry.hours}
                    onChange={(e) =>
                      updateEntry(index, 'hours', e.target.value ? parseInt(e.target.value, 10) : '')
                    }
                    placeholder="0"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-center text-gray-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeEntry(index)}
                    className="mt-1.5 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addEntry}
                className="flex items-center gap-1.5 text-sm font-medium text-orange-500 hover:text-orange-600 mt-2"
              >
                <Plus className="h-3.5 w-3.5" />
                Add another project
              </button>
            </>
          )}
        </div>

        {/* Warning banner */}
        {isUnder40 && totalHours > 0 && (
          <div className="mx-5 mb-3 flex items-start gap-2.5 rounded-lg bg-amber-50 border border-amber-200 p-3">
            <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Less than 40 hours logged
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                You have {totalHours} hours. The standard work week is 40 hours.
                You will be asked to confirm before submitting.
              </p>
            </div>
          </div>
        )}

        {/* Notes + Submit */}
        {entries.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Week Notes <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Any notes about this week..."
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none resize-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="h-4 w-4" />
                {isSubmitting
                  ? 'Saving...'
                  : existingWeek
                  ? 'Update Timesheet'
                  : 'Submit Timesheet'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Under-40 confirmation dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onConfirm={doSubmit}
        onCancel={() => setShowConfirm(false)}
        title="Less than 40 hours"
        message={`You are submitting ${totalHours} hours for this week, which is below the standard 40 hours. Are you sure this is correct?`}
        confirmText="Yes, submit"
        cancelText="Go back"
        variant="warning"
        isLoading={isSubmitting}
      />
    </>
  )
}
