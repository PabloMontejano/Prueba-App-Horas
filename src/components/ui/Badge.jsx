const variantClasses = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  outline: 'bg-transparent border border-gray-300 text-gray-600',
}

const sizeClasses = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
}

export default function Badge({ variant = 'default', size = 'sm', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.sm}`}
    >
      {children}
    </span>
  )
}
