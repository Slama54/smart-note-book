import { NextRequest, NextResponse } from 'next/server';

// Routes that don't require authentication
const publicRoutes = ['/auth/login', '/auth/signup', '/auth/register', '/'];

// Routes that require authentication
const protectedRoutes = ['/app', '/notebooks', '/scan', '/profile'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route) || pathname === route);

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Get the auth token from cookies
  const token = request.cookies.get('auth.token')?.value;

  // If it's a protected route
  if (isProtectedRoute) {
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    // Token exists, allow access (detailed validation happens in API routes)
  }

  // If it's a login/signup page and user is already logged in
  if ((pathname === '/auth/login' || pathname === '/auth/signup' || pathname === '/auth/register') && token) {
    // Token is valid, redirect to app
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
