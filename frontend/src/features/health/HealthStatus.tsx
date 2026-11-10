import { useEffect, useState } from 'react'
import { getLiveness, getReadiness } from './health-service'

type CheckStatus = 'checking' | 'healthy' | 'unavailable'

interface HealthState {
  api: CheckStatus
  database: CheckStatus
}

function StatusIndicator({
  label,
  status,
}: {
  label: string
  status: CheckStatus
}) {
  const statusText = {
    checking: 'Checking',
    healthy: 'Operational',
    unavailable: 'Unavailable',
  }[status]

  const statusColor = {
    checking: 'bg-amber-400',
    healthy: 'bg-emerald-500',
    unavailable: 'bg-red-500',
  }[status]

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className="flex items-center gap-2 text-sm text-slate-500">
        <span className={`size-2 rounded-full ${statusColor}`} />
        {statusText}
      </span>
    </div>
  )
}

export default function HealthStatus() {
  const [health, setHealth] = useState<HealthState>({
    api: 'checking',
    database: 'checking',
  })

  useEffect(() => {
    let active = true

    async function checkHealth() {
      const [apiResult, databaseResult] = await Promise.allSettled([
        getLiveness(),
        getReadiness(),
      ])

      if (!active) {
        return
      }

      setHealth({
        api:
          apiResult.status === 'fulfilled' && apiResult.value.status === 'ok'
            ? 'healthy'
            : 'unavailable',
        database:
          databaseResult.status === 'fulfilled' &&
          databaseResult.value.status === 'ok' &&
          databaseResult.value.dependencies.database === 'ok'
            ? 'healthy'
            : 'unavailable',
      })
    }

    void checkHealth()

    return () => {
      active = false
    }
  }, [])

  return (
    <section
      aria-label="System status"
      className="mb-10 rounded-xl border border-slate-200 bg-white p-6"
    >
      <div className="mb-5">
        <h2 className="font-semibold text-slate-900">System status</h2>
        <p className="mt-1 text-sm text-slate-500">
          Live connectivity checks for the application infrastructure.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatusIndicator label="Backend API" status={health.api} />
        <StatusIndicator label="Database" status={health.database} />
      </div>
    </section>
  )
}
