# CommerceHub Frontend

CommerceHub is a multi-tenant e-commerce and inventory management SaaS platform.

This directory contains the React frontend. It provides the user interface and communicates with the Laravel REST API.

## Technology

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Vitest
- React Testing Library
- ESLint

## Prerequisites

- Node.js
- npm
- CommerceHub Laravel backend for API integration

## Installation

Run `npm ci` to install the locked dependencies.

## Development

Run `npm run dev` to start the Vite development server.

The application is available at http://localhost:5173.

## API Configuration

Copy `.env.example` to `.env.local` when a local override is required.

Example:

`VITE_API_BASE_URL=http://localhost:8000/api/v1`

The default API base URL is `http://localhost:8000/api/v1`.

## Quality Checks

- `npm run test:run` - run automated tests.
- `npm run lint` - run ESLint.
- `npm run build` - run TypeScript checks and create a production build.

## Project Structure

    src/
    |-- components/    Shared UI components
    |-- features/      Business feature modules
    |-- layouts/       Application layouts
    |-- lib/           Shared utilities and API client
    |-- services/      API and integration services
    |-- test/          Test configuration
    |-- types/         Shared TypeScript types
    |-- App.tsx        Application shell
    |-- index.css      Global styles and Tailwind
    |-- main.tsx       Application entry point

Feature directories and shared modules will be introduced incrementally.

## Architecture

- Laravel owns business rules, authentication, authorization and persistence.
- The frontend consumes versioned REST endpoints under `/api/v1`.
- Browser authentication is planned around Laravel Sanctum stateful cookies and CSRF protection.
- Tenant authorization and business access decisions remain backend responsibilities.
