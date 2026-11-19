interface HeaderProps {
  title?: string
  onMenuClick: () => void
}

function Header({
  title = 'Workspace overview',
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
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
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
          Development
        </span>

        <div
          aria-label="Development workspace"
          className="flex size-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700"
        >
          C
        </div>
      </div>
    </header>
  )
}

export default Header
