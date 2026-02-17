import { ChevronDown, LogOut, User, Menu } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Header({ onMobileMenuClick }) {
  const { user, employee, signOut } = useAuth()
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const userDropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
  }

  const getInitials = () => {
    if (employee?.initials) return employee.initials
    if (employee?.name) {
      const parts = employee.name.trim().split(' ')
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    if (user?.email) return user.email.substring(0, 2).toUpperCase()
    return 'U'
  }

  return (
    <header className="pwa-safe-header sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="flex items-center justify-between h-12 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuClick}
            className="lg:hidden p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-sm font-semibold text-gray-900">
            AZ Timesheet
          </h1>
        </div>

        {/* User dropdown */}
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {employee?.avatar_url ? (
              <img
                src={employee.avatar_url}
                alt={employee?.name || 'User'}
                className="w-7 h-7 rounded-full object-cover border-2 border-orange-200"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-[10px] font-semibold">
                {getInitials()}
              </div>
            )}
            <span className="hidden sm:inline font-medium max-w-[100px] truncate">
              {employee?.name || user?.email?.split('@')[0]}
            </span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showUserDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserDropdown(false)} />
              <div className="absolute right-0 z-50 w-52 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
                <div className="p-1.5">
                  <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-50 mb-1">
                    {user?.email}
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center w-full gap-2 px-3 py-2 text-xs text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-3 h-3" />
                    Profile
                  </Link>
                  <div className="border-t border-gray-50 mt-1 pt-1">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full gap-2 px-3 py-2 text-xs text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-3 h-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
