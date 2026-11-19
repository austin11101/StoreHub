interface ModulePageProps {
  title: string
  description: string
  code: string
}

function ModulePage({ title, description, code }: ModulePageProps) {
  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-semibold text-indigo-600">
          COMMERCEHUB MODULE / {code}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
          {description}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-700">
          {code}
        </div>
        <h2 className="mt-5 text-lg font-semibold text-slate-900">
          Module foundation
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
          This module is part of the CommerceHub application roadmap.
          Its functionality will be implemented incrementally and
          integrated with the Laravel API.
        </p>
        <span className="mt-5 inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
          Development planned
        </span>
      </div>
    </section>
  )
}

export default ModulePage
