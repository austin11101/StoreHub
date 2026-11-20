
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../../lib/api-client'
import LoginPage from './LoginPage'

const { mockLogin } = vi.hoisted(() => ({
  mockLogin: vi.fn(),
}))

vi.mock('../auth-context', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}))

function renderLogin(
  initialEntry: string | { pathname: string; state?: unknown } = '/login',
) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/app"
          element={<h1>Workspace dashboard</h1>}
        />
        <Route
          path="/app/products"
          element={<h1>Products destination</h1>}
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLogin.mockResolvedValue(undefined)
  })

  it('renders the login form', () => {
    renderLogin()

    expect(screen.getByLabelText('Email address')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('submits credentials and redirects to the requested page', async () => {
    const user = userEvent.setup()

    renderLogin({
      pathname: '/login',
      state: {
        from: {
          pathname: '/app/products',
        },
      },
    })

    await user.type(
      screen.getByLabelText('Email address'),
      'test@example.com',
    )

    await user.type(
      screen.getByLabelText('Password'),
      'SecurePassword123!',
    )

    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'SecurePassword123!',
      })
    })

    expect(
      await screen.findByRole('heading', { name: 'Products destination' }),
    ).toBeInTheDocument()
  })

  it('disables the form while login is pending and re-enables it afterward', async () => {
    const user = userEvent.setup()
    let resolveLogin: (() => void) | undefined
    const loginPromise = new Promise<void>((resolve) => {
      resolveLogin = resolve
    })
    mockLogin.mockReturnValueOnce(loginPromise)

    renderLogin()

    const emailInput = screen.getByLabelText('Email address')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign in' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'SecurePassword123!')
    await user.click(submitButton)

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'SecurePassword123!',
    })
    expect(emailInput).toBeDisabled()
    expect(passwordInput).toBeDisabled()
    expect(
      screen.getByRole('button', { name: 'Signing in...' }),
    ).toBeDisabled()

    await act(async () => {
      resolveLogin?.()
    })

    expect(
      await screen.findByRole('heading', { name: 'Workspace dashboard' }),
    ).toBeInTheDocument()
  })

  it('redirects to the dashboard when no previous destination exists', async () => {
    const user = userEvent.setup()

    renderLogin()

    await user.type(screen.getByLabelText('Email address'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'SecurePassword123!')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(
      await screen.findByRole('heading', { name: 'Workspace dashboard' }),
    ).toBeInTheDocument()
  })

  it('displays an error when authentication fails', async () => {
    const user = userEvent.setup()

    mockLogin.mockRejectedValueOnce(
      new ApiError(401, {
        message: 'These credentials do not match our records.',
      }),
    )

    renderLogin()

    await user.type(screen.getByLabelText('Email address'), 'wrong@example.com')
    await user.type(screen.getByLabelText('Password'), 'WrongPassword123!')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent('These credentials do not match our records.')
  })
})
