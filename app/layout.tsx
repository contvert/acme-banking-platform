import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AppFrame } from '@/components/shell/AppFrame';
import { ShellProvider } from '@/components/shell/ShellContext';
import { BRAND } from '@/lib/brand';
import { THEME_INIT_SCRIPT } from '@/lib/theme';
import { ConfigProvider } from '@/components/config/ConfigProvider';
import { readConfig } from '@/lib/config/store';
import { scopeConfig } from '@/lib/config/scope';
import { getSession } from '@/lib/auth/session';
import { findById } from '@/lib/auth/store';
import { toPublicUser } from '@/lib/auth/types';
import '@/styles/globals.css';

/**
 * The original uses Arcadia Text / Arcadia Display, which are licensed and
 * not redistributable. Inter is the closest free variable substitute and
 * supports the unusual 360/380/480 weights the design system asks for.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-substitute',
  axes: ['opsz'],
});

export const metadata: Metadata = {
  title: `${BRAND.productName} | ${BRAND.tagline}`,
  description: 'Dashboard',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read on the server so the first paint already has the right numbers — no
  // loading flash — and scoped to whoever is signed in, so a client's own
  // markup never carries accounts they are not entitled to see.
  const session = await getSession();
  const user = session ? await findById(session.userId) : null;
  const publicUser = user && !user.disabled ? toPublicUser(user) : null;
  const config = scopeConfig(await readConfig(), publicUser);

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Paints the stored theme before first paint, so there is no flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <ConfigProvider initial={config} user={publicUser}>
          <ShellProvider>
            <AppFrame>{children}</AppFrame>
          </ShellProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
