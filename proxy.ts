import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { getAuthSecret } from '@/lib/env';

const authMiddleware = withAuth({
  pages: {
    signIn: '/login'
  },
  secret: getAuthSecret()
});

export default async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/login' && request.method === 'GET') {
    try {
      const csrfResponse = await fetch(new URL('/api/auth/csrf', request.url), { cache: 'no-store' });
      if (csrfResponse.ok) {
        const payload = (await csrfResponse.json()) as { csrfToken?: string };
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-atlas-csrf-token', payload.csrfToken ?? '');

        const response = NextResponse.next({ request: { headers: requestHeaders } });
        const setCookie = csrfResponse.headers.get('set-cookie');
        if (setCookie) {
          response.headers.append('set-cookie', setCookie);
        }
        return response;
      }
    } catch {
      // Fall through to a plain response if the CSRF prefetch fails.
    }
  }

  if (
    request.nextUrl.pathname.startsWith('/account') ||
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/review') ||
    request.nextUrl.pathname === '/submit/new'
  ) {
    return authMiddleware(request as never, {} as never);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/account/:path*', '/admin/:path*', '/review/:path*', '/submit/new']
};
