import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { AuthProvider } from './hooks/useAuth'
import { DemoStoreProvider } from './lib/demoStore'
import ErrorBoundary from './components/ui/ErrorBoundary'
import ToastProvider from './components/ui/ToastProvider'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Timesheet from './pages/Timesheet'

function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f7]">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden w-full lg:w-auto">
        <Header onMobileMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <BrowserRouter>
            <AuthProvider>
              <DemoStoreProvider>
                <Routes>
                  <Route path="/" element={<Navigate to="/timesheet" replace />} />
                  <Route path="/timesheet" element={<Layout><Timesheet /></Layout>} />
                  <Route path="*" element={<Navigate to="/timesheet" replace />} />
                </Routes>
              </DemoStoreProvider>
            </AuthProvider>
          </BrowserRouter>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
