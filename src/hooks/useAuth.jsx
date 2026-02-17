import { createContext, useContext } from 'react'

const DEMO_USER = {
  id: 'demo-user-1',
  email: 'pablo.montejano@azcapital.com',
}

const DEMO_EMPLOYEE = {
  id: 'demo-user-1',
  name: 'Pablo Montejano',
  initials: 'PM',
  email: 'pablo.montejano@azcapital.com',
  crm_role: 'admin',
  timesheet_role: 'admin',
  is_active: true,
}

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const value = {
    user: DEMO_USER,
    employee: DEMO_EMPLOYEE,
    loading: false,
    sessionExpired: false,
    role: 'admin',
    signIn: async () => ({ data: DEMO_USER, error: null }),
    signUp: async () => ({ data: DEMO_USER, error: null }),
    signOut: async () => ({ error: null }),
    refetchEmployee: async () => {},
    clearSessionExpired: () => {},
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
