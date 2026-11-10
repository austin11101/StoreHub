import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('CommerceHub application shell', () => {
  it('renders the CommerceHub brand', () => {
    render(<App />)

    expect(screen.getAllByText('CommerceHub').length).toBeGreaterThan(0)
  })

  it('renders the workspace overview', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        name: 'Welcome to CommerceHub',
      }),
    ).toBeInTheDocument()
  })

  it('renders the main navigation', () => {
    render(<App />)

    const navigation = screen.getByRole('navigation', {
      name: 'Main navigation',
    })

    expect(within(navigation).getByText('Overview')).toBeInTheDocument()
  })

  it('renders the planned platform modules', () => {
    render(<App />)

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
})
