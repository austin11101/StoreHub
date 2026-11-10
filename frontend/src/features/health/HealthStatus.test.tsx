import { render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getLiveness, getReadiness } from './health-service'
import HealthStatus from './HealthStatus'

vi.mock('./health-service', () => ({
  getLiveness: vi.fn(),
  getReadiness: vi.fn(),
}))

const mockedGetLiveness = vi.mocked(getLiveness)
const mockedGetReadiness = vi.mocked(getReadiness)

describe('HealthStatus', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('displays healthy API and database statuses', async () => {
    mockedGetLiveness.mockResolvedValue({
      status: 'ok',
      service: 'commercehub-api',
    })

    mockedGetReadiness.mockResolvedValue({
      status: 'ok',
      dependencies: { database: 'ok' },
    })

    render(<HealthStatus />)

    const panel = screen.getByRole('region', { name: 'System status' })

    await waitFor(() => {
      expect(within(panel).getAllByText('Operational')).toHaveLength(2)
    })
  })

  it('shows the database as unavailable when readiness fails', async () => {
    mockedGetLiveness.mockResolvedValue({
      status: 'ok',
      service: 'commercehub-api',
    })

    mockedGetReadiness.mockResolvedValue({
      status: 'error',
      dependencies: { database: 'unavailable' },
    })

    render(<HealthStatus />)

    const panel = screen.getByRole('region', { name: 'System status' })

    await waitFor(() => {
      expect(within(panel).getByText('Backend API')).toBeInTheDocument()
      expect(within(panel).getByText('Database')).toBeInTheDocument()
      expect(within(panel).getByText('Unavailable')).toBeInTheDocument()
    })

    expect(within(panel).getByText('Operational')).toBeInTheDocument()
  })

  it('shows both services as unavailable when the API cannot be reached', async () => {
    mockedGetLiveness.mockRejectedValue(new Error('Connection failed'))
    mockedGetReadiness.mockRejectedValue(new Error('Connection failed'))

    render(<HealthStatus />)

    const panel = screen.getByRole('region', { name: 'System status' })

    await waitFor(() => {
      expect(within(panel).getAllByText('Unavailable')).toHaveLength(2)
    })
  })
})
