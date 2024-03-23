// middleware.ts
import { verifyRequestOrigin } from 'lucia';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

import {
  DEFAULT_LOGIN_REDIRECT,
  apiPrefix,
  authRoutes,
  publicRoutes,
} from '@/routes';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { nextUrl } = request;
  const isLoggedIn =
    !!cookies().get('auth_session') && !!cookies().get('auth_session')?.value;
  const isApiRoute = nextUrl.pathname.startsWith(apiPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiRoute) {
    return null;
  }
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL('/auth/login', nextUrl));
  }

  if (request.method === 'GET') {
    return NextResponse.next();
  }
  const originHeader = request.headers.get('Origin');
  // NOTE: You may need to use `X-Forwarded-Host` instead
  const hostHeader =
    request.headers.get('Host') || request.headers.get('x-forwarded-host');
  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return new NextResponse(null, {
      status: 403,
    });
  }
  return NextResponse.next();
}
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
