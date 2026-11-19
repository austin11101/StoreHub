import { Link } from 'react-router-dom'

function ForgotPasswordPage() {
  return (
    <section className="mx-auto max-w-md px-5 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">
          Reset your password
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Password recovery will be available once the account recovery
          API is integrated.
        </p>

        <Link
          to="/login"
          className="mt-8 inline-block text-sm font-semibold text-indigo-600"
        >
          Return to sign in
        </Link>
      </div>
    </section>
  )
}

export default ForgotPasswordPage
