import type { AuthUser } from '../../features/auth/auth-service'

interface HeaderProps {
  title?: string
  user: AuthUser
  isLoggingOut: boolean
  logoutError: string | null
  onMenuClick: () => void
  onLogout: () => void
}

function Header({
  title = 'Workspace overview',
  user,
  isLoggingOut,
  logoutError,
  onMenuClick,
  onLogout,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="flex h-20 items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation"
            aria-haspopup="true"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-5"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <span className="font-bold tracking-tight text-slate-950">
            CommerceHub
          </span>
        </div>

        <div className="hidden lg:block">
          <p className="text-sm font-medium text-slate-500">{title}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 sm:inline-flex">
            Development
          </span>

          <div className="flex size-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="hidden min-w-0 sm:block">
            <p className="max-w-40 truncate text-sm font-semibold text-slate-900">
              {user.name}
            </p>
            <p className="max-w-40 truncate text-xs text-slate-500">
              {user.email}
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoggingOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </div>

      {logoutError && (
        <div className="px-5 pb-3 sm:px-8">
          <p role="alert" className="text-sm text-red-600">
            {logoutError}
          </p>
        </div>
      )}
    </header>
  )
}

export default Header
