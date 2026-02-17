const shimmerClass = 'animate-[shimmer_1.5s_infinite] bg-[length:200%_100%] bg-[linear-gradient(90deg,#f0f0f0_25%,#e0e0e0_50%,#f0f0f0_75%)]'

export function SkeletonBlock({ className = '' }) {
  return <div className={`rounded ${shimmerClass} ${className}`} />
}

export function SkeletonText({ lines = 3, widths }) {
  const defaultWidths = ['w-full', 'w-5/6', 'w-4/6', 'w-full', 'w-3/4']
  return (
    <div className="space-y-2.5">
      {Array.from({ length: lines }).map((_, i) => {
        const width = widths?.[i] || defaultWidths[i % defaultWidths.length]
        return <div key={i} className={`h-4 rounded ${shimmerClass} ${width}`} />
      })}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className={`h-10 w-10 rounded-full ${shimmerClass}`} />
        <div className="flex-1 space-y-2">
          <div className={`h-4 w-1/3 rounded ${shimmerClass}`} />
          <div className={`h-3 w-1/2 rounded ${shimmerClass}`} />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  )
}

export function SkeletonTable({ rows = 5, columns = 4 }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className={`h-4 rounded ${shimmerClass}`} style={{ width: `${100 / columns}%` }} />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex gap-4 px-4 py-3 border-b border-gray-100 last:border-b-0">
          {Array.from({ length: columns }).map((_, col) => (
            <div key={col} className={`h-4 rounded ${shimmerClass}`} style={{ width: `${100 / columns}%` }} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonStats({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5">
          <div className={`h-3 w-20 rounded mb-3 ${shimmerClass}`} />
          <div className={`h-8 w-24 rounded mb-2 ${shimmerClass}`} />
          <div className={`h-3 w-16 rounded ${shimmerClass}`} />
        </div>
      ))}
    </div>
  )
}
