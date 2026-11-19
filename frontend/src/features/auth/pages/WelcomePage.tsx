import { Link } from 'react-router-dom'

function WelcomePage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold tracking-wider text-indigo-600">
          COMMERCE MANAGEMENT, SIMPLIFIED
        </p>

        <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
          Run your business operations from one connected workspace.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">
          CommerceHub brings product management, inventory and order
          operations together in one platform designed to support growing
          businesses.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <Link
            to="/register"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Create an account
          </Link>
          <Link
            to="/login"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Sign in
          </Link>
        </div>
      </div>

      <div className="mt-20 grid gap-5 md:grid-cols-3">
        {[
          {
            title: 'Product management',
            description: 'Organise products, categories, SKUs and pricing.',
          },
          {
            title: 'Inventory visibility',
            description: 'Keep track of stock levels and inventory activity.',
          },
          {
            title: 'Order operations',
            description: 'Bring customer orders and fulfilment workflows together.',
          },
        ].map((feature) => (
          <article
            key={feature.title}
            className="rounded-xl border border-slate-200 bg-white p-6"
          >
            <h2 className="font-semibold text-slate-900">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default WelcomePage
