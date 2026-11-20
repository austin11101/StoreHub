
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  apiRequest,
  initializeCsrfCookie,
} from '../../lib/api-client'
import {
  getCurrentUser,
  login,
  logout,
} from './auth-service'

vi.mock('../../lib/api-client', () => ({
  apiRequest: vi.fn(),
  initializeCsrfCookie: vi.fn(),
}))

const mockedApiRequest = vi.mocked(apiRequest)
const mockedInitializeCsrfCookie = vi.mocked(initializeCsrfCookie)

const user = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  email_verified_at: null,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Authentication service', () => {
  it('initialises CSRF before logging in and returns the user', async () => {
    mockedInitializeCsrfCookie.mockResolvedValue(undefined)
    mockedApiRequest.mockResolvedValue({
      data: { user },
    })

    await expect(
      login({
        email: 'test@example.com',
        password: 'password',
      }),
    ).resolves.toEqual(user)

    expect(mockedInitializeCsrfCookie).toHaveBeenCalledOnce()

    expect(mockedApiRequest).toHaveBeenCalledWith('auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password',
      }),
    })

    expect(mockedInitializeCsrfCookie.mock.invocationCallOrder[0])
      .toBeLessThan(mockedApiRequest.mock.invocationCallOrder[0]!)
  })

  it('does not attempt login when CSRF initialisation fails', async () => {
    mockedInitializeCsrfCookie.mockRejectedValue(
      new Error('CSRF initialisation failed'),
    )

    await expect(
      login({
        email: 'test@example.com',
        password: 'password',
      }),
    ).rejects.toThrow('CSRF initialisation failed')

    expect(mockedApiRequest).not.toHaveBeenCalled()
  })

  it('retrieves the currently authenticated user', async () => {
    mockedApiRequest.mockResolvedValue({
      data: { user },
    })

    await expect(getCurrentUser()).resolves.toEqual(user)

    expect(mockedApiRequest).toHaveBeenCalledWith('auth/user')
  })

  it('logs out the current user', async () => {
    mockedApiRequest.mockResolvedValue({
      message: 'Logged out successfully.',
    })

    await expect(logout()).resolves.toBeUndefined()

    expect(mockedApiRequest).toHaveBeenCalledWith('auth/logout', {
      method: 'POST',
    })
  })
})
