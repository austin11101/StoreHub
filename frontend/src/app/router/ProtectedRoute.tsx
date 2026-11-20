import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/auth-context'

function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div
        role="status"
        className="flex min-h-screen items-center justify-center text-sm text-slate-500"
      >
        Checking your session...
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    )
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
        <h1 className="text-lg font-semibold text-slate-900">
          We couldn&apos;t verify your session
        </h1>
        <p className="mt-2 max-w-md text-sm text-slate-600">
          Check your connection and try again. Your session has not been
          changed.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Retry
        </button>
      </div>
    )
  }

  return <Outlet />
}

export default ProtectedRoute
