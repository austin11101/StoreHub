import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'
import userEvent from '@testing-library/user-event'

function renderAtPath(path: string) {
  window.history.pushState({}, '', path)
  return render(<App />)
}

describe('CommerceHub application routing', () => {
  it('renders the public welcome page at the root route', () => {
    renderAtPath('/')

    expect(
      screen.getByRole('heading', {
        name: /run your business operations/i,
      }),
    ).toBeInTheDocument()
  })

  it('renders the sign-in page', () => {
    renderAtPath('/login')

    expect(
      screen.getByRole('heading', { name: 'Sign in' }),
    ).toBeInTheDocument()
  })

  it('renders the registration page', () => {
    renderAtPath('/register')

    expect(
      screen.getByRole('heading', { name: 'Create an account' }),
    ).toBeInTheDocument()
  })

  it('renders the password recovery page', () => {
    renderAtPath('/forgot-password')

    expect(
      screen.getByRole('heading', { name: 'Reset your password' }),
    ).toBeInTheDocument()
  })

  it('renders the CommerceHub dashboard brand', () => {
    renderAtPath('/app')

    expect(screen.getAllByText('CommerceHub').length).toBeGreaterThan(0)
  })
  it('opens mobile navigation and navigates to Products', async () => {
  const user = userEvent.setup()

  renderAtPath('/app')

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

  it('renders the workspace overview', () => {
    renderAtPath('/app')

    expect(
      screen.getByRole('heading', {
        name: 'Welcome to CommerceHub',
      }),
    ).toBeInTheDocument()
  })

  it('renders the main dashboard navigation', () => {
    renderAtPath('/app')

    const navigation = screen.getByRole('navigation', {
      name: 'Main navigation',
    })

    expect(within(navigation).getByRole('link', {
      name: /overview/i,
    })).toHaveAttribute('href', '/app')

    expect(within(navigation).getByRole('link', {
      name: /products/i,
    })).toHaveAttribute('href', '/app/products')

    expect(within(navigation).getByRole('link', {
      name: /inventory/i,
    })).toHaveAttribute('href', '/app/inventory')

    expect(within(navigation).getByRole('link', {
      name: /orders/i,
    })).toHaveAttribute('href', '/app/orders')
  })

  it('renders the planned platform modules', () => {
    renderAtPath('/app')

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

  it('renders the products page', () => {
    renderAtPath('/app/products')

    expect(
      screen.getByRole('heading', { name: 'Products' }),
    ).toBeInTheDocument()
  })

  it('renders the inventory page', () => {
    renderAtPath('/app/inventory')

    expect(
      screen.getByRole('heading', { name: 'Inventory' }),
    ).toBeInTheDocument()
  })

  it('renders the orders page', () => {
    renderAtPath('/app/orders')

    expect(
      screen.getByRole('heading', { name: 'Orders' }),
    ).toBeInTheDocument()
  })

  it('renders a not-found page for unknown routes', () => {
    renderAtPath('/this-route-does-not-exist')

    expect(
      screen.getByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument()
  })
})
