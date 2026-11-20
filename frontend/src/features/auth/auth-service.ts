import { apiRequest, initializeCsrfCookie } from '../../lib/api-client'

export interface AuthUser {
  id: number
  name: string
  email: string
  email_verified_at: string | null
}

interface AuthUserResponse {
  data: {
    user: AuthUser
  }
}

interface LogoutResponse {
  message: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export async function login(
  credentials: LoginCredentials,
): Promise<AuthUser> {
  await initializeCsrfCookie()

  const response = await apiRequest<AuthUserResponse>('auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  return response.data.user
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await apiRequest<AuthUserResponse>('auth/user')

  return response.data.user
}

export async function logout(): Promise<void> {
  await apiRequest<LogoutResponse>('auth/logout', {
    method: 'POST',
  })
}
