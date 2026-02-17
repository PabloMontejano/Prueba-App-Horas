import { Inbox } from 'lucide-react'

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data',
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500 max-w-sm">{description}</p>}
      {action && (
        <button onClick={action.onClick} className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
          {action.label}
        </button>
      )}
    </div>
  )
}
