import { NextResponse } from 'next/server'

// List of public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/forgot-password']

// List of public asset paths that should be accessible without authentication
const publicAssets = ['/images/', '/assets/', '/media/', '/fonts/']

export function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // Redirect '/' to '/home' if token exists
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  // Check if the path is for public assets
  if (publicAssets.some(assetPath => pathname.startsWith(assetPath))) {
    return NextResponse.next()
  }

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
     * - _next/data (data files)
     * - public (public files like robots.txt)
     * - images (image files)
     * - assets (asset files)
     * - media (media files)
     * - fonts (font files)
     - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|_next/data|public|images|assets|media|fonts|favicon.ico).*)'
  ]
}
