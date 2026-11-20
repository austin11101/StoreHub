import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import { useAuth } from '../../features/auth/auth-context'

function DashboardLayout() {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function closeMobileNavigation() {
    setMobileNavigationOpen(false)
  }

  async function handleLogout() {
    setLogoutError(null)
    setIsLoggingOut(true)

    try {
      await logout()
      navigate('/login', { replace: true })
    } catch {
      setLogoutError(
        'Unable to sign out. Please check your connection and try again.',
      )
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar
          mobileOpen={mobileNavigationOpen}
          onClose={closeMobileNavigation}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            user={user}
            isLoggingOut={isLoggingOut}
            logoutError={logoutError}
            onMenuClick={() => setMobileNavigationOpen(true)}
            onLogout={() => void handleLogout()}
          />

          <main className="flex-1 px-5 py-10 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-6xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
