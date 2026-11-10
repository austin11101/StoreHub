import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, apiRequest } from './api-client'

afterEach(() => {
  vi.unstubAllGlobals()
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
