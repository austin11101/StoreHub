import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-indigo-600">404 ERROR</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-950">
          Page not found
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-500">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Return home
        </Link>
      </div>
    </main>
  )
}

export default NotFoundPage
