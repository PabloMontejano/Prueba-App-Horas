import { Component, useState } from 'react'
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react'

function ErrorFallback({ error, resetError }) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
        <div className="bg-navy-900 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Something went wrong</h2>
              <p className="text-gray-300 text-sm">An unexpected error occurred</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            We're sorry for the inconvenience. You can try reloading the page or navigating back to the dashboard.
          </p>
          {error?.message && (
            <div className="mb-4">
              <button onClick={() => setShowDetails(!showDetails)} className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700">
                {showDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                Error details
              </button>
              {showDetails && (
                <div className="mt-2 rounded-lg bg-gray-50 border border-gray-200 p-3">
                  <code className="text-xs text-red-600 break-all whitespace-pre-wrap">{error.message}</code>
                </div>
              )}
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => { if (resetError) resetError(); window.location.reload() }} className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
              <RefreshCw className="h-4 w-4" /> Reload Page
            </button>
            <a href="/dashboard" className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Home className="h-4 w-4" /> Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} resetError={this.resetError} />
    }
    return this.props.children
  }
}
