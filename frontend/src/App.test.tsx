import { render, screen, within, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import App from './App'
import { getCurrentUser } from './features/auth/auth-service'
import { ApiError } from './lib/api-client'

vi.mock('./features/auth/auth-service', () => ({
  getCurrentUser: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
}))

const testUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  email_verified_at: null,
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(getCurrentUser).mockResolvedValue(testUser)
})

async function renderAtPath(path: string) {
  window.history.pushState({}, '', path)

  const result = render(<App />)

  await waitFor(() => {
    expect(
      screen.queryByText('Checking your session...'),
    ).not.toBeInTheDocument()
  })

  return result
}

describe('CommerceHub application routing', () => {
  it('renders the public welcome page at the root route', async () => {
    await renderAtPath('/')

    expect(
      screen.getByRole('heading', {
        name: /run your business operations/i,
      }),
    ).toBeInTheDocument()
  })

  it('renders the sign-in page', async () => {
    await renderAtPath('/login')

    expect(
      screen.getByRole('heading', { name: 'Sign in' }),
    ).toBeInTheDocument()
  })

  it('renders the registration page', async () => {
    await renderAtPath('/register')

    expect(
      screen.getByRole('heading', { name: 'Create an account' }),
    ).toBeInTheDocument()
  })

  it('renders the password recovery page', async () => {
    await renderAtPath('/forgot-password')

    expect(
      screen.getByRole('heading', { name: 'Reset your password' }),
    ).toBeInTheDocument()
  })

  it('renders the CommerceHub dashboard brand', async () => {
    await renderAtPath('/app')

    expect(screen.getAllByText('CommerceHub').length).toBeGreaterThan(0)
  })

  it('opens mobile navigation and navigates to Products', async () => {
    const user = userEvent.setup()

    await renderAtPath('/app')

    await user.click(
      screen.getByRole('button', { name: 'Open navigation' }),
    )

    const mobileNavigation = screen.getByRole('complementary', {
      name: 'Mobile navigation menu',
    })

    await user.click(
      within(mobileNavigation).getByRole('link', { name: /products/i }),
    )

    expect(
      screen.getByRole('heading', { name: 'Products' }),
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('complementary', {
        name: 'Mobile navigation menu',
      }),
    ).not.toBeInTheDocument()
  })

  it('renders the workspace overview', async () => {
    await renderAtPath('/app')

    expect(
      screen.getByRole('heading', {
        name: 'Welcome to CommerceHub',
      }),
    ).toBeInTheDocument()
  })

  it('renders the main dashboard navigation', async () => {
    await renderAtPath('/app')

    const navigation = screen.getByRole('navigation', {
      name: 'Main navigation',
    })

    expect(
      within(navigation).getByRole('link', { name: /overview/i }),
    ).toHaveAttribute('href', '/app')

    expect(
      within(navigation).getByRole('link', { name: /products/i }),
    ).toHaveAttribute('href', '/app/products')

    expect(
      within(navigation).getByRole('link', { name: /inventory/i }),
    ).toHaveAttribute('href', '/app/inventory')

    expect(
      within(navigation).getByRole('link', { name: /orders/i }),
    ).toHaveAttribute('href', '/app/orders')
  })

  it('renders the planned platform modules', async () => {
    await renderAtPath('/app')

    expect(
      screen.getByRole('heading', { name: 'Platform modules' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'Product catalogue' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'Inventory management' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'Orders and sales' }),
    ).toBeInTheDocument()
  })

  it('renders the products page', async () => {
    await renderAtPath('/app/products')

    expect(
      screen.getByRole('heading', { name: 'Products' }),
    ).toBeInTheDocument()
  })

  it('renders the inventory page', async () => {
    await renderAtPath('/app/inventory')

    expect(
      screen.getByRole('heading', { name: 'Inventory' }),
    ).toBeInTheDocument()
  })

  it('renders the orders page', async () => {
    await renderAtPath('/app/orders')

    expect(
      screen.getByRole('heading', { name: 'Orders' }),
    ).toBeInTheDocument()
  })

  it('redirects unauthenticated users to login', async () => {
    vi.mocked(getCurrentUser).mockRejectedValueOnce(
      new ApiError(401, { message: 'Unauthenticated' }),
    )

    await renderAtPath('/app/products')

    expect(
      await screen.findByRole('heading', { name: 'Sign in' }),
    ).toBeInTheDocument()

    expect(window.location.pathname).toBe('/login')
  })

  it('shows a session verification error for unexpected restoration failures', async () => {
    vi.mocked(getCurrentUser).mockRejectedValueOnce(
      new TypeError('Failed to fetch'),
    )

    await renderAtPath('/app/products')

    expect(
      await screen.findByRole('heading', {
        name: "We couldn't verify your session",
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
  })

  it('renders a not-found page for unknown routes', async () => {
    await renderAtPath('/this-route-does-not-exist')

    expect(
      screen.getByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument()
  })
})
