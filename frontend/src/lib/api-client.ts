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

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const normalizedPath = path.replace(/^\/+/, '')
  const headers = new Headers(options.headers)

  headers.set('Accept', 'application/json')

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
