import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiRequest } from '../../lib/api-client'
import { getLiveness, getReadiness } from './health-service'

vi.mock('../../lib/api-client', () => ({
  apiRequest: vi.fn(),
}))

const mockedApiRequest = vi.mocked(apiRequest)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Health service', () => {
  it('requests the backend liveness endpoint', async () => {
    const response = {
      status: 'ok',
      service: 'commercehub-api',
    } as const

    mockedApiRequest.mockResolvedValue(response)

    await expect(getLiveness()).resolves.toEqual(response)

    expect(mockedApiRequest).toHaveBeenCalledWith('health/live')
  })

  it('requests the backend readiness endpoint', async () => {
    const response = {
      status: 'ok',
      dependencies: {
        database: 'ok',
      },
    } as const

    mockedApiRequest.mockResolvedValue(response)

    await expect(getReadiness()).resolves.toEqual(response)

    expect(mockedApiRequest).toHaveBeenCalledWith('health/ready')
  })

  it('preserves an unavailable database response', async () => {
    const response = {
      status: 'error',
      dependencies: {
        database: 'unavailable',
      },
    } as const

    mockedApiRequest.mockResolvedValue(response)

    await expect(getReadiness()).resolves.toEqual(response)
  })
})
