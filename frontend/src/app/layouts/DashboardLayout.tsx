import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'

function DashboardLayout() {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)

  function closeMobileNavigation() {
    setMobileNavigationOpen(false)
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
            onMenuClick={() => setMobileNavigationOpen(true)}
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
