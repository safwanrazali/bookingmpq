import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

/**
 * Root-level Next.js Edge Middleware (Pages Router requires this file to
 * live at the project root, hence it's separate from /middleware/*.js which
 * holds shareable helper logic used by both this file and API routes).
 *
 * Redirects any unauthenticated visitor away from /admin/** to /login,
 * preserving where they were headed via ?callbackUrl.
 */
export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
