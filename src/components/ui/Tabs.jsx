export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="border-b border-gray-200 overflow-x-auto">
      <nav className="flex -mb-px gap-1" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 ${
                isActive
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span className={`${isActive ? '' : 'hidden sm:inline'}`}>{tab.label}</span>
              {tab.count != null && (
                <span
                  className={`ml-1 rounded-full px-1.5 py-0.5 text-xs font-medium ${
                    isActive
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
