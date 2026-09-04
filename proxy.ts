import { NextResponse, type NextRequest } from 'next/server';
import {
  hostnameForPortal,
  portalForHostname,
  roleMatchesPortal,
  SESSION_COOKIE,
} from '@/lib/auth/portal';

/**
 * Optimistic route gate. The signed token is verified again by every server
 * data boundary; this proxy only avoids rendering routes the visitor cannot
 * use and keeps the admin/client host realms separated.
 */

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout', '/api/auth/first-run'];
const PORTAL_HEADER = 'x-mercury-auth-portal';

function nextWithPortal(request: NextRequest, portal: 'admin' | 'client' | 'shared') {
  const headers = new Headers(request.headers);
  // Always overwrite a caller-supplied value. Downstream authentication code
  // can then trust that this realm was derived from the public request host.
  headers.set(PORTAL_HEADER, portal);
  return NextResponse.next({ request: { headers } });
}

function decodePayload(
  token: string | undefined,
): { role?: string; profileComplete?: boolean; exp?: number } | null {
  if (!token) return null;
  const [body] = token.split('.');
  if (!body) return null;
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { hostname, pathname } = request.nextUrl;
  // `nextUrl.hostname` can be the internal server host in development or
  // behind a proxy. The HTTP Host header is the public browser origin and the
  // owner of the host-only cookie, so it defines the authentication realm.
  const portal = portalForHostname(request.headers.get('host') ?? hostname);
  const payload = decodePayload(request.cookies.get(SESSION_COOKIE)?.value);
  const signedIn = !!payload?.exp && payload.exp * 1000 > Date.now();
  const wrongPortal = signedIn && !roleMatchesPortal(payload?.role, portal);

  // Keep old bookmarks useful without letting a client cookie on the shared
  // localhost origin bounce an administrator away from their control panel.
  // The canonical admin host owns a separate cookie and will ask for an admin
  // sign-in only when that dedicated session is missing.
  const adminPage = pathname === '/admin' || pathname.startsWith('/admin/');
  if (portal === 'shared' && adminPage && !(signedIn && payload?.role === 'admin')) {
    const url = request.nextUrl.clone();
    url.hostname = hostnameForPortal('admin');
    return NextResponse.redirect(url);
  }

  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + '/'))) {
    return nextWithPortal(request, portal);
  }

  if (!signedIn) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (wrongPortal) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Session incompatible avec ce portail' }, { status: 403 });
    }
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = '';
    const response = NextResponse.redirect(url);
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  const profilePage = pathname === '/profile' || pathname.startsWith('/profile/');
  if (
    payload?.role === 'client' &&
    payload.profileComplete !== true &&
    !profilePage &&
    !pathname.startsWith('/api/')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/profile';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (pathname === '/' && portal !== 'shared') {
    const url = request.nextUrl.clone();
    url.pathname = portal === 'admin' ? '/admin' : '/dashboard';
    return NextResponse.redirect(url);
  }

  const adminOnly = adminPage || pathname.startsWith('/api/admin');

  if (adminOnly && payload?.role !== 'admin') {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Réservé à l’administrateur' }, { status: 403 });
    }
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return nextWithPortal(request, portal);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)'],
};
