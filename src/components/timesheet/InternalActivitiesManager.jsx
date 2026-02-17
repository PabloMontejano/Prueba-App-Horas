import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, X, ToggleLeft, ToggleRight } from 'lucide-react'
import { useInternalActivities, useInternalActivityMutations } from '../../hooks/useInternalActivities'
import { useToast } from '../ui/ToastProvider'
import ConfirmDialog from '../ui/ConfirmDialog'
import EmptyState from '../ui/EmptyState'

export default function InternalActivitiesManager() {
  const [showInactive, setShowInactive] = useState(false)
  const { data: activities, isLoading } = useInternalActivities(showInactive)
  const { addActivity, updateActivity, deleteActivity } = useInternalActivityMutations()
  const { toast } = useToast()

  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleAdd = async () => {
    const trimmed = newName.trim()
    if (!trimmed) return

    try {
      await addActivity.mutateAsync({ name: trimmed })
      setNewName('')
      toast.success('Activity created')
    } catch (err) {
      toast.error(err.message || 'Failed to create activity')
    }
  }

  const handleUpdate = async (id) => {
    const trimmed = editName.trim()
    if (!trimmed) return

    try {
      await updateActivity.mutateAsync({ id, name: trimmed })
      setEditingId(null)
      toast.success('Activity updated')
    } catch (err) {
      toast.error(err.message || 'Failed to update activity')
    }
  }

  const handleToggleActive = async (activity) => {
    try {
      await updateActivity.mutateAsync({
        id: activity.id,
        is_active: !activity.is_active,
      })
      toast.success(
        activity.is_active ? 'Activity deactivated' : 'Activity activated'
      )
    } catch (err) {
      toast.error(err.message || 'Failed to toggle activity')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteActivity.mutateAsync({ id: deleteTarget.id })
      setDeleteTarget(null)
      toast.success('Activity deleted')
    } catch (err) {
      toast.error(err.message || 'Failed to delete activity')
    }
  }

  return (
    <>
      <div className="space-y-4">
        {/* Add new */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Add Internal Activity
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="e.g. Vacaciones, Business Development..."
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
            />
            <button
              onClick={handleAdd}
              disabled={!newName.trim() || addActivity.isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        {/* List */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Internal Activities
            </h3>
            <button
              onClick={() => setShowInactive(!showInactive)}
              className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
            >
              {showInactive ? (
                <ToggleRight className="h-4 w-4 text-orange-500" />
              ) : (
                <ToggleLeft className="h-4 w-4" />
              )}
              {showInactive ? 'Showing all' : 'Active only'}
            </button>
          </div>

          {isLoading ? (
            <div className="p-5 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 rounded-lg bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : !activities || activities.length === 0 ? (
            <EmptyState
              title="No activities"
              description="Add internal activities above for employees to log non-project hours."
            />
          ) : (
            <div className="divide-y divide-gray-100">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  {editingId === activity.id ? (
                    <>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdate(activity.id)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                        autoFocus
                        className="flex-1 rounded-lg border border-orange-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      />
                      <button
                        onClick={() => handleUpdate(activity.id)}
                        className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span
                        className={`flex-1 text-sm ${
                          activity.is_active ? 'text-gray-900' : 'text-gray-400 line-through'
                        }`}
                      >
                        {activity.name}
                      </span>

                      {!activity.is_active && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400">
                          Inactive
                        </span>
                      )}

                      <button
                        onClick={() => handleToggleActive(activity)}
                        className="p-1.5 text-gray-300 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        title={activity.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {activity.is_active ? (
                          <ToggleRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ToggleLeft className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(activity.id)
                          setEditName(activity.name)
                        }}
                        className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(activity)}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        title="Delete Activity"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will not affect existing timesheet entries that reference it.`}
        confirmText="Delete"
        variant="danger"
        isLoading={deleteActivity.isPending}
      />
    </>
  )
}
