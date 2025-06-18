"use client"

import React from "react"
import { useProtectedRoute } from "@/hooks/use-protected-route"

type ProtectedRouteProps = {
  children: React.ReactNode
  allowedUserTypes?: Array<'owner' | 'company' | 'employee'>
  redirectTo?: string
}

/**
 * A wrapper component that protects routes requiring authentication.
 * Can be used to wrap any client component or page that requires auth.
 * 
 * @example
 * ```tsx
 * // For a page that any authenticated user can access
 * export default function DashboardPage() {
 *   return (
 *     <ProtectedRoute>
 *       <YourDashboardContent />
 *     </ProtectedRoute>
 *   )
 * }
 * 
 * // For a page that only owners and companies can access
 * export default function AdminPage() {
 *   return (
 *     <ProtectedRoute allowedUserTypes={['owner', 'company']}>
 *       <YourAdminContent />
 *     </ProtectedRoute>
 *   )
 * }
 * ```
 */
export function ProtectedRoute({
  children,
  allowedUserTypes,
  redirectTo = '/auth/login'
}: ProtectedRouteProps) {
  const { user, loading, isAuthorized } = useProtectedRoute(redirectTo, allowedUserTypes)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    // Don't render anything while waiting for redirect
    return null
  }

  return <>{children}</>
}
