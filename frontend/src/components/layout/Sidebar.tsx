import { NavLink } from 'react-router-dom'

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

const navigationItems = [
  { label: 'Overview', path: '/app', initial: 'O', end: true },
  { label: 'Products', path: '/app/products', initial: 'P', end: false },
  { label: 'Inventory', path: '/app/inventory', initial: 'I', end: false },
  { label: 'Orders', path: '/app/orders', initial: 'O', end: false },
]

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Workspace
      </p>

      <nav aria-label="Main navigation" className="space-y-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-indigo-50 font-semibold text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={[
                    'flex size-7 items-center justify-center rounded-md text-xs',
                    isActive ? 'bg-indigo-100' : 'bg-slate-100',
                  ].join(' ')}
                >
                  {item.initial}
                </span>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-9">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Coming later
        </p>

        <div className="space-y-1 text-sm text-slate-400">
          {['Customers', 'Reports'].map((item) => (
            <div
              key={item}
              aria-disabled="true"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5"
            >
              <span className="flex size-7 items-center justify-center rounded-md bg-slate-100 text-xs">
                {item.charAt(0)}
              </span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-6">
          <div className="grid size-10 grid-cols-2 gap-1 rounded-xl bg-indigo-600 p-2">
            <span className="rounded-sm bg-white" />
            <span className="rounded-sm bg-indigo-200" />
            <span className="rounded-sm bg-indigo-200" />
            <span className="rounded-sm bg-white" />
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight text-slate-950">
              CommerceHub
            </p>
            <p className="text-xs text-slate-500">Commerce management</p>
          </div>
        </div>

        <div className="flex-1 px-4 py-8">
          <NavigationLinks />
        </div>

        <div className="border-t border-slate-200 p-5">
          <p className="text-xs font-medium text-slate-500">CommerceHub</p>
          <p className="mt-1 text-xs text-slate-400">
            Application foundation
          </p>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40"
          />

          <aside
            aria-label="Mobile navigation menu"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-xl"
          >
            <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">
              <span className="text-lg font-bold tracking-tight text-slate-950">
                CommerceHub
              </span>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>

            <div className="flex-1 px-4 py-8">
              <NavigationLinks onNavigate={onClose} />
            </div>

            <div className="border-t border-slate-200 p-5">
              <p className="text-xs font-medium text-slate-500">
                CommerceHub
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Application foundation
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}

export default Sidebar
