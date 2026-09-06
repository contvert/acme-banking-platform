'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { NoticeBanner } from './NoticeBanner';
import { AdvisorChatWidget } from './AdvisorChatWidget';

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
  '/payments/recipients/create',
  '/nda/link',
  '/profile',
];

export function isFlowRoute(pathname: string) {
  if (pathname.startsWith('/payments/recipients/') && pathname.endsWith('/verify')) return true;
  return FLOW_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));
}

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Sign-in stands alone: no sidebar, no top bar, nothing to click but the form.
  if (pathname === '/login') return <>{children}</>;

  // The profile screen (onboarding included) has no place for the notice.
  const showNotice = !pathname.startsWith('/profile');

  if (isFlowRoute(pathname)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {showNotice && <NoticeBanner />}
        {children}
        <AdvisorChatWidget />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {showNotice && <NoticeBanner />}
      <div style={{ display: 'flex', flex: 1, minWidth: 0 }}>
        <Sidebar />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
      <AdvisorChatWidget />
    </div>
  );
}
