import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  ApiError,
  apiRequest,
  initializeCsrfCookie,
} from './api-client'
import { API_BASE_URL } from './env'

afterEach(() => {
  vi.unstubAllGlobals()
  document.cookie = 'XSRF-TOKEN=; Max-Age=0; path=/'
})

describe('API client', () => {
  it('returns parsed JSON from a successful request', async () => {
    const expectedData = {
      status: 'ok',
      message: 'API is operational',
    }

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(expectedData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    vi.stubGlobal('fetch', fetchMock)

    const result = await apiRequest<typeof expectedData>('health/live')

    expect(result).toEqual(expectedData)
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('includes browser credentials by default', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    vi.stubGlobal('fetch', fetchMock)

    await apiRequest('health/live')

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/health\/live$/),
      expect.objectContaining({
        credentials: 'include',
      }),
    )
  })

  it('sets the Accept header to application/json', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    vi.stubGlobal('fetch', fetchMock)

    await apiRequest('health/live')

    const requestOptions = fetchMock.mock.calls[0]?.[1] as RequestInit
    const headers = new Headers(requestOptions.headers)

    expect(headers.get('Accept')).toBe('application/json')
  })

  it('attaches the XSRF token to POST requests', async () => {
    document.cookie = 'XSRF-TOKEN=test-token'

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'Success' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    vi.stubGlobal('fetch', fetchMock)

    await apiRequest('auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password',
      }),
    })

    const requestOptions = fetchMock.mock.calls[0]?.[1] as RequestInit
    const headers = new Headers(requestOptions.headers)

    expect(headers.get('X-XSRF-TOKEN')).toBe('test-token')
  })

  it('decodes the XSRF token before attaching it', async () => {
    document.cookie = 'XSRF-TOKEN=encoded%20token'

    const fetchMock = vi.fn().mockResolvedValue(
      new Response('{}', {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    vi.stubGlobal('fetch', fetchMock)

    await apiRequest('auth/logout', {
      method: 'POST',
    })

    const requestOptions = fetchMock.mock.calls[0]?.[1] as RequestInit
    const headers = new Headers(requestOptions.headers)

    expect(headers.get('X-XSRF-TOKEN')).toBe('encoded token')
  })

  it('does not attach an XSRF token to GET requests', async () => {
    document.cookie = 'XSRF-TOKEN=test-token'

    const fetchMock = vi.fn().mockResolvedValue(
      new Response('{}', {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    vi.stubGlobal('fetch', fetchMock)

    await apiRequest('auth/user')

    const requestOptions = fetchMock.mock.calls[0]?.[1] as RequestInit
    const headers = new Headers(requestOptions.headers)

    expect(headers.has('X-XSRF-TOKEN')).toBe(false)
  })

  it('initialises the Sanctum CSRF cookie using the API origin', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, { status: 204 }),
    )

    vi.stubGlobal('fetch', fetchMock)

    await initializeCsrfCookie()

    expect(fetchMock).toHaveBeenCalledWith(
      new URL('/sanctum/csrf-cookie', API_BASE_URL).toString(),
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      }),
    )
  })

  it('throws ApiError when CSRF initialisation fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, { status: 500 }),
    )

    vi.stubGlobal('fetch', fetchMock)

    await expect(initializeCsrfCookie()).rejects.toMatchObject({
      name: 'ApiError',
      status: 500,
    })
  })

  it('throws ApiError when the server returns an HTTP error', async () => {
    const errorData = {
      message: 'Validation failed',
    }

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(errorData), {
        status: 422,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    vi.stubGlobal('fetch', fetchMock)

    await expect(apiRequest('products')).rejects.toMatchObject({
      name: 'ApiError',
      status: 422,
      data: errorData,
    })
  })

  it('preserves the HTTP status and response data in ApiError', () => {
    const error = new ApiError(404, {
      message: 'Resource not found',
    })

    expect(error).toBeInstanceOf(Error)
    expect(error.status).toBe(404)
    expect(error.data).toEqual({
      message: 'Resource not found',
    })
    expect(error.name).toBe('ApiError')
  })
})
