import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userSession = request.cookies.get('user_session');
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ['/', '/analysis', '/app', '/archive', '/about'];
  const authRoutes = ['/login', '/sign-up'];

  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAuthRoute = authRoutes.includes(pathname);

  // If user is logged in and trying to access auth pages, redirect to home
  if (userSession && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is not logged in and trying to access protected routes, redirect to login
  if (!userSession && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/analysis/:path*',
    '/app/:path*',
    '/archive/:path*',
    '/about/:path*',
    '/login',
    '/sign-up'
  ],
};