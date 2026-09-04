'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';

/**
 * Money-movement and creation flows render as full-screen overlays on the
 * original — no sidebar, no top bar. Everything else gets the app shell.
 */
const FLOW_ROUTES = [
  '/send-money',
  '/add-funds',
  '/issue-card',
  '/invoicing/create-invoice',
  '/safe/create',
  '/wire-drawdowns/recipient-details',
  '/nda/link',
  '/profile',
];

export function isFlowRoute(pathname: string) {
  return FLOW_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));
}

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Sign-in stands alone: no sidebar, no top bar, nothing to click but the form.
  if (pathname === '/login') return <>{children}</>;
  if (isFlowRoute(pathname)) return <>{children}</>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}
