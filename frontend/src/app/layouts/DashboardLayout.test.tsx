
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import DashboardLayout from './DashboardLayout'
import type { AuthUser } from '../../features/auth/auth-service'

const { mockLogout } = vi.hoisted(() => ({
  mockLogout: vi.fn(),
}))

vi.mock('../../features/auth/auth-context', () => ({
  useAuth: () => ({
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      email_verified_at: null,
    },
    logout: mockLogout,
  }),
}))

vi.mock('../../components/layout/Sidebar', () => ({
  default: () => <aside>Sidebar</aside>,
}))

const testUser: AuthUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  email_verified_at: null,
}

function renderDashboard() {
  return render(
    <MemoryRouter initialEntries={['/app']}>
      <Routes>
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<h1>Dashboard content</h1>} />
        </Route>
        <Route path="/login" element={<h1>Login page</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('DashboardLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLogout.mockResolvedValue(undefined)
  })

  it('displays the authenticated user identity', () => {
    renderDashboard()

    expect(screen.getByText(testUser.name)).toBeInTheDocument()
    expect(screen.getByText(testUser.email)).toBeInTheDocument()
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('renders the dashboard content', () => {
    renderDashboard()

    expect(
      screen.getByRole('heading', { name: 'Dashboard content' }),
    ).toBeInTheDocument()
  })

  it('logs out and redirects to login', async () => {
    const user = userEvent.setup()

    renderDashboard()

    await user.click(screen.getByRole('button', { name: 'Sign out' }))

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledOnce()
    })

    expect(
      await screen.findByRole('heading', { name: 'Login page' }),
    ).toBeInTheDocument()
  })

  it('displays an error when logout fails', async () => {
    const user = userEvent.setup()

    mockLogout.mockRejectedValueOnce(new Error('Network failure'))

    renderDashboard()

    await user.click(screen.getByRole('button', { name: 'Sign out' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to sign out. Please check your connection and try again.',
    )

    expect(
      screen.getByRole('heading', { name: 'Dashboard content' }),
    ).toBeInTheDocument()
  })
})
