import HealthStatus from '../../health/HealthStatus'

const modules = [
  {
    name: 'Product catalogue',
    description: 'Manage products, categories, pricing and SKUs.',
    status: 'Planned',
    code: '01',
  },
  {
    name: 'Inventory management',
    description: 'Track stock levels, movements and reservations.',
    status: 'Planned',
    code: '02',
  },
  {
    name: 'Orders and sales',
    description: 'Manage customer orders, fulfilment and payments.',
    status: 'Planned',
    code: '03',
  },
]

function OverviewPage() {
  return (
    <>
      <div className="mb-10">
        <p className="mb-3 text-sm font-semibold text-indigo-600">
          YOUR COMMERCE WORKSPACE
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Welcome to CommerceHub
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
          A central workspace for managing products, inventory,
          customers, orders and business operations.
        </p>
      </div>

      <section
        aria-labelledby="foundation-heading"
        className="mb-10 overflow-hidden rounded-2xl border border-indigo-100 bg-white"
      >
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 px-6 py-8 text-white sm:px-9 sm:py-10">
          <p className="text-sm font-medium text-indigo-100">
            APPLICATION FOUNDATION
          </p>
          <h2
            id="foundation-heading"
            className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Your business operations, connected.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
            CommerceHub is being built as a multi-tenant commerce
            and inventory management platform.
          </p>
        </div>

        <div className="grid gap-4 px-6 py-6 sm:grid-cols-3 sm:px-9">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Architecture
            </p>
            <p className="mt-1 font-semibold text-slate-800">
              Modular monolith
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Backend
            </p>
            <p className="mt-1 font-semibold text-slate-800">
              Laravel REST API
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Frontend
            </p>
            <p className="mt-1 font-semibold text-slate-800">
              React + TypeScript
            </p>
          </div>
        </div>
      </section>

      <HealthStatus />

      <section aria-labelledby="modules-heading">
        <div className="mb-5">
          <h2
            id="modules-heading"
            className="text-lg font-bold text-slate-900"
          >
            Platform modules
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Planned capabilities for the CommerceHub platform.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <article
              key={module.code}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-700">
                  {module.code}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                  {module.status}
                </span>
              </div>

              <h3 className="mt-5 font-semibold text-slate-900">
                {module.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {module.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <footer className="mt-12 border-t border-slate-200 pt-6">
        <p className="text-xs text-slate-400">
          CommerceHub · Application foundation · Development environment
        </p>
      </footer>
    </>
  )
}

export default OverviewPage
