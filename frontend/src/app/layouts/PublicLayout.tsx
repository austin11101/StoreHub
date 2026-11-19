import { Link, Outlet } from 'react-router-dom'

function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid size-10 grid-cols-2 gap-1 rounded-xl bg-indigo-600 p-2">
              <span className="rounded-sm bg-white" />
              <span className="rounded-sm bg-indigo-200" />
              <span className="rounded-sm bg-indigo-200" />
              <span className="rounded-sm bg-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-950">
              CommerceHub
            </span>
          </Link>

          <nav aria-label="Public navigation" className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 hover:text-indigo-700"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 text-xs text-slate-400 sm:px-8">
          CommerceHub · Commerce management platform
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout
