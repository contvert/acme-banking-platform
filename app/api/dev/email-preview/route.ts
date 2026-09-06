import { NextResponse } from 'next/server';
import { recipientOtpHtml } from '@/lib/email/templates/recipient-otp';
import { credentialsHtml } from '@/lib/email/templates/client-credentials';
import { getLocale, getTranslator } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

/**
 * Renders an email template for visual review. Development only.
 *
 * `?template=credentials` shows the delayed client-credentials email;
 * otherwise the recipient OTP template is shown, previewed in whatever
 * language the reviewer has picked.
 */
export async function GET(request: Request) {
  const t = await getTranslator();
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: t('Not available.') }, { status: 404 });
  }

  const template = new URL(request.url).searchParams.get('template');

  if (template === 'credentials') {
    const html = credentialsHtml({
      displayName: 'Marie Dupont',
      username: 'marie.dupont@example.com',
      password: 'mxC4-XMCW-3BYp',
      loginUrl: process.env.PROVISIONING_LOGIN_URL || 'http://client.localhost:3210/login',
    });
    return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  const locale = await getLocale();

  const html = recipientOtpHtml(t, locale, {
    code: '482915',
    recipientName: 'Fournisseur Dupont SARL',
    ibanLast4: '0189',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    validForMinutes: 10,
  });

  return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}
