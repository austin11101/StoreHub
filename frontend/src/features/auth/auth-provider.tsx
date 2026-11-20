import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  getCurrentUser,
  login as loginUser,
  logout as logoutUser,
  type AuthUser,
  type LoginCredentials,
} from './auth-service'
import { AuthContext, type AuthStatus } from './auth-context'
import { ApiError } from '../../lib/api-client'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')
  const authOperation = useRef(0)

  useEffect(() => {
    let active = true

    async function restoreSession() {
      const operation = authOperation.current

      try {
        const currentUser = await getCurrentUser()

        if (active && operation === authOperation.current) {
          setUser(currentUser)
          setStatus('authenticated')
        }
      } catch (error) {
        if (active && operation === authOperation.current) {
          setUser(null)
          setStatus(
            error instanceof ApiError && error.status === 401
              ? 'unauthenticated'
              : 'error',
          )
        }
      }
    }

    void restoreSession()

    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const authenticatedUser = await loginUser(credentials)

    authOperation.current += 1
    setUser(authenticatedUser)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(async () => {
    await logoutUser()

    authOperation.current += 1
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  const value = useMemo(
    () => ({
      user,
      status,
      login,
      logout,
    }),
    [user, status, login, logout],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
