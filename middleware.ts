import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

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

  // Get the auth token
  const token = request.cookies.get('auth.token')?.value;

  // If it's a protected route
  if (isProtectedRoute) {
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      // Verify the token
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      // Token is invalid, redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // If it's a login/signup page and user is already logged in
  if ((pathname === '/auth/login' || pathname === '/auth/signup' || pathname === '/auth/register') && token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      // Token is valid, redirect to app
      return NextResponse.redirect(new URL('/app', request.url));
    } catch (error) {
      // Token is invalid, allow access to auth pages
    }
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
