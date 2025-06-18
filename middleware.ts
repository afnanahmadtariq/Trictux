import { NextRequest, NextResponse } from 'next/server'

// Public paths that don't require authentication
const publicPaths = [
  '/auth/login',
  '/auth/signup',
  '/_next',
  '/favicon.ico',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/logout',
  '/api/auth/me'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )
  
  // Get the authentication token from the cookies
  const authToken = request.cookies.get('auth_token')?.value
  
  // If it's not a public path and no auth token exists, redirect to login
  if (!isPublicPath && !authToken) {
    const url = new URL('/auth/login', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }
  
  // If it's a login/signup page and user is already logged in, redirect to dashboard
  if ((pathname === '/auth/login' || pathname === '/auth/signup') && authToken) {
    // We'll redirect to a generic dashboard, the actual user-specific redirect
    // will be handled on the client side by the auth context
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Continue to the requested page
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /_next (Next.js internals)
     * 2. /_static (inside /public)
     * 3. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!_next|_static|[\\w-]+\\.\\w+).*)',
  ],
}
