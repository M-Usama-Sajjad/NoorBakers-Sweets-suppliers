import { NextResponse } from 'next/server'

// List of public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/forgot-password']

export function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  console.log('token', token)

  // Check if the current route is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If user is not logged in and tries to access any non-public route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user is logged in and tries to access a public route
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}
