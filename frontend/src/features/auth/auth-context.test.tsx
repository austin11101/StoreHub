
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from './auth-context'
import { AuthProvider } from './auth-provider'
import { ApiError } from '../../lib/api-client'
import {
  getCurrentUser,
  login as loginUser,
  logout as logoutUser,
} from './auth-service'

vi.mock('./auth-service', () => ({
  getCurrentUser: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
}))

const mockedGetCurrentUser = vi.mocked(getCurrentUser)
const mockedLogin = vi.mocked(loginUser)
const mockedLogout = vi.mocked(logoutUser)

const testUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  email_verified_at: null,
}

function AuthConsumer() {
  const { user, status, login, logout } = useAuth()

  return (
    <div>
      <p data-testid="status">{status}</p>
      <p data-testid="user">{user?.email ?? 'No user'}</p>

      <button
        onClick={() => {
          void login({
            email: 'test@example.com',
            password: 'password',
          })
        }}
      >
        Login
      </button>

      <button
        onClick={() => {
          void logout().catch(() => {
            // The test verifies that failed logout preserves authentication.
          })
        }}
      >
        Logout
      </button>
    </div>
  )
}

function renderAuthConsumer() {
  return render(
    <AuthProvider>
      <AuthConsumer />
    </AuthProvider>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Authentication context', () => {
  it('restores an existing authenticated session', async () => {
    mockedGetCurrentUser.mockResolvedValue(testUser)

    renderAuthConsumer()

    expect(screen.getByTestId('status')).toHaveTextContent('loading')

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent(
        'authenticated',
      )
    })

    expect(screen.getByTestId('user')).toHaveTextContent(testUser.email)
  })

  it('becomes unauthenticated when session restoration returns 401', async () => {
    mockedGetCurrentUser.mockRejectedValue(
      new ApiError(401, { message: 'Unauthenticated' }),
    )

    renderAuthConsumer()

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent(
        'unauthenticated',
      )
    })

    expect(screen.getByTestId('user')).toHaveTextContent('No user')
  })

  it.each([
    ['a network error', new TypeError('Failed to fetch')],
    ['a server error', new ApiError(503, { message: 'Unavailable' })],
    ['an unexpected error', new Error('Unexpected failure')],
  ])('sets an error status for %s during session restoration', async (_, error) => {
    mockedGetCurrentUser.mockRejectedValue(error)

    renderAuthConsumer()

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('error')
    })

    expect(screen.getByTestId('user')).toHaveTextContent('No user')
  })

  it('updates authentication state after login', async () => {
    mockedGetCurrentUser.mockRejectedValue(
      new ApiError(401, { message: 'Unauthenticated' }),
    )
    mockedLogin.mockResolvedValue(testUser)

    const user = userEvent.setup()

    renderAuthConsumer()

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent(
        'unauthenticated',
      )
    })

    await user.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent(
        'authenticated',
      )
    })

    expect(screen.getByTestId('user')).toHaveTextContent(testUser.email)
  })

  it('preserves successful login when an older session restoration returns 401', async () => {
    let rejectSessionRestore!: (error: Error) => void

    mockedGetCurrentUser.mockReturnValue(
      new Promise((_, reject) => {
        rejectSessionRestore = reject
      }),
    )

    mockedLogin.mockResolvedValue(testUser)

    const user = userEvent.setup()

    renderAuthConsumer()

    expect(screen.getByTestId('status')).toHaveTextContent('loading')

    await user.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent(
        'authenticated',
      )
    })

    rejectSessionRestore(
      new ApiError(401, { message: 'Unauthenticated' }),
    )

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent(
        'authenticated',
      )
    })

    expect(screen.getByTestId('user')).toHaveTextContent(testUser.email)
  })

  it('clears authentication state after logout', async () => {
    mockedGetCurrentUser.mockResolvedValue(testUser)
    mockedLogout.mockResolvedValue(undefined)

    const user = userEvent.setup()

    renderAuthConsumer()

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent(
        'authenticated',
      )
    })

    await user.click(screen.getByRole('button', { name: 'Logout' }))

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent(
        'unauthenticated',
      )
    })

    expect(screen.getByTestId('user')).toHaveTextContent('No user')
  })

  it('retains authentication state if logout fails', async () => {
    mockedGetCurrentUser.mockResolvedValue(testUser)
    mockedLogout.mockRejectedValue(new Error('Logout failed'))

    const user = userEvent.setup()

    renderAuthConsumer()

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent(
        'authenticated',
      )
    })

    await user.click(screen.getByRole('button', { name: 'Logout' }))

    expect(screen.getByTestId('status')).toHaveTextContent('authenticated')
    expect(screen.getByTestId('user')).toHaveTextContent(testUser.email)
  })
})
