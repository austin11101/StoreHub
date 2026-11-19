import { Link } from 'react-router-dom'

function LoginPage() {
  return (
    <section className="mx-auto max-w-md px-5 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">Sign in</h1>
        <p className="mt-2 text-sm text-slate-500">
          Access your CommerceHub workspace.
        </p>

        <div className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              disabled
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm disabled:bg-slate-50"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              disabled
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm disabled:bg-slate-50"
            />
          </div>

          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            Authentication is not connected yet. Sign-in will become
            available after the backend integration.
          </p>

          <Link
            to="/forgot-password"
            className="block text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Forgot your password?
          </Link>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  )
}

export default LoginPage
