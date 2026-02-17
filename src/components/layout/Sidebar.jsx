import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Clock, Menu } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const navigation = [
  { name: 'Timesheet', href: '/timesheet', icon: Clock },
]

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const location = useLocation()
  const { employee } = useAuth()
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebarCollapsed') === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try { localStorage.setItem('sidebarCollapsed', collapsed) } catch {}
  }, [collapsed])

  useEffect(() => {
    if (mobileOpen && onMobileClose) onMobileClose()
  }, [location.pathname])

  const renderNavItem = (item) => {
    const isActive = location.pathname === item.href

    return (
      <Link
        key={item.name}
        to={item.href}
        title={collapsed ? item.name : undefined}
        className={`flex items-center rounded-lg text-xs font-medium transition-all duration-150 ${
          collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'
        } ${
          isActive
            ? 'bg-orange-50 text-orange-600'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
        }`}
      >
        <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
        {!collapsed && <span>{item.name}</span>}
      </Link>
    )
  }

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onMobileClose} />
      )}

      <div className={`
        flex h-screen flex-col bg-white/95 backdrop-blur-xl border-r border-gray-100 transition-all duration-200
        ${collapsed ? 'w-16' : 'w-56'}
        fixed lg:relative inset-y-0 left-0 z-50
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="relative px-3 py-3 border-b border-gray-100">
          {!collapsed ? (
            <>
              <div className="flex flex-col gap-0.5 pr-8">
                <img
                  src="/logo.png"
                  alt="AZ Capital"
                  className="h-7 w-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextElementSibling.style.display = 'block'
                  }}
                />
                <h1 className="hidden text-base font-semibold text-gray-800">
                  <span className="text-navy-900">AZ</span>{' '}
                  <span className="text-orange-500">Capital</span>
                </h1>
                <span className="text-[10px] font-semibold text-orange-500 tracking-wider">
                  TIMESHEET
                </span>
              </div>
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                title="Collapse menu"
              >
                <Menu className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                title="Expand menu"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto ${collapsed ? 'p-2' : 'p-3'}`}>
          <div className="space-y-0.5">
            {navigation.map(renderNavItem)}
          </div>
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">AZ Timesheet v1.0</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-orange-100 text-orange-600">
                Demo
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
