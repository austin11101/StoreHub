import { Link } from 'react-router-dom'

function RegisterPage() {
  return (
    <section className="mx-auto max-w-md px-5 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">Create an account</h1>
        <p className="mt-2 text-sm text-slate-500">
          Get started with CommerceHub.
        </p>

        <p className="mt-8 rounded-lg bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          Account registration is not available yet. The registration
          workflow will be connected to the backend identity and
          account-management services.
        </p>

        <Link
          to="/login"
          className="mt-6 inline-block text-sm font-semibold text-indigo-600"
        >
          Return to sign in
        </Link>
      </div>
    </section>
  )
}

export default RegisterPage
