"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

/**
 * A hook to protect routes that require authentication.
 * Can be used in any client component to require authentication.
 * 
 * @param redirectTo - The path to redirect to if the user is not authenticated (defaults to /auth/login)
 * @param allowedUserTypes - Optional array of user types that are allowed to access the route
 * @returns User object if authenticated and authorized, otherwise redirects
 */
export function useProtectedRoute(
  redirectTo = '/auth/login',
  allowedUserTypes?: Array<'owner' | 'company' | 'employee'>
) {
  const { user, loading, checkAuth } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const verifyAuth = async () => {
      // Check auth if we don't have a user yet
      if (!user && !loading) {
        const isAuthenticated = await checkAuth()
        if (!isAuthenticated) {
          router.push(redirectTo)
          return
        }
      }

      // If we have specific user types allowed, check them
      if (user && allowedUserTypes && allowedUserTypes.length > 0) {
        if (!allowedUserTypes.includes(user.userType)) {
          // Redirect based on user type if they're not allowed
          const redirectMap = {
            owner: '/company-dashboard',
            company: '/company-dashboard',
            employee: '/employee-dashboard',
          }
          router.push(redirectMap[user.userType])
          return
        }
      }

      setIsAuthorized(true)
    }

    verifyAuth()
  }, [user, loading, redirectTo, allowedUserTypes, router, checkAuth])

  return { user, loading, isAuthorized }
}
