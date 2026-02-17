import { Loader2 } from 'lucide-react'

const variantClasses = {
  primary: 'bg-navy-900 text-white hover:bg-orange-500',
  secondary: 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  warning: 'bg-orange-500 text-white hover:bg-orange-600',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  children,
  className = '',
  ...props
}) {
  const isDisabled = disabled || isLoading

  return (
    <button
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : Icon ? (
        <Icon className="h-4 w-4" />
      ) : null}
      {children}
    </button>
  )
}
