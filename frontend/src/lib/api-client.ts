import { API_BASE_URL } from './env'

export class ApiError extends Error {
  public readonly status: number
  public readonly data: unknown

  constructor(status: number, data: unknown) {
    super(`API request failed with status ${status}`)

    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

function getXsrfToken(): string | null {
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith('XSRF-TOKEN='))

  if (!cookie) {
    return null
  }

  return decodeURIComponent(cookie.substring('XSRF-TOKEN='.length))
}

export async function initializeCsrfCookie(): Promise<void> {
  const csrfUrl = new URL('/sanctum/csrf-cookie', API_BASE_URL)

  const response = await fetch(csrfUrl.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new ApiError(response.status, {
      message: 'Unable to initialise the CSRF cookie.',
    })
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const normalizedPath = path.replace(/^\/+/, '')
  const headers = new Headers(options.headers)
  const method = (options.method ?? 'GET').toUpperCase()

  headers.set('Accept', 'application/json')

  if (UNSAFE_METHODS.has(method)) {
    const xsrfToken = getXsrfToken()

    if (xsrfToken) {
      headers.set('X-XSRF-TOKEN', xsrfToken)
    }
  }

  const response = await fetch(
    `${API_BASE_URL}/${normalizedPath}`,
    {
      ...options,
      headers,
      credentials: options.credentials ?? 'include',
    },
  )

  const contentType = response.headers.get('content-type') ?? ''

  const data: unknown = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    throw new ApiError(response.status, data)
  }

  return data as T
}
