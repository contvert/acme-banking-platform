import { NextResponse } from 'next/server';
import { requireUser, isDenied } from '@/lib/auth/guard';
import { isProfileComplete } from '@/lib/auth/types';
import { readConfig, updateConfig } from '@/lib/config/store';
import { verifyRecipientOtp } from '@/lib/recipients/otp';
import { foreignOrigin } from '@/lib/http/origin';
import { getTranslator } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };


export async function POST(request: Request, context: Ctx) {
  const t = await getTranslator();
  const auth = await requireUser('client');
  if (isDenied(auth)) return auth.response;
  if (!isProfileComplete(auth.user)) {
    return NextResponse.json({ error: t('Complete your profile first.') }, { status: 403 });
  }
  if (foreignOrigin(request)) {
    return NextResponse.json({ error: t('Invalid request origin.') }, { status: 403 });
  }

  let body: { code?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: t('Body must be JSON.') }, { status: 400 });
  }

  const code = typeof body.code === 'string' ? body.code.replace(/\s/g, '') : '';
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: t('Enter the six-digit code.') }, { status: 400 });
  }

  const { id } = await context.params;
  const config = await readConfig();
  const recipient = (config.recipients ?? []).find(
    (item) => item.id === id && item.ownerUserId === auth.user.id,
  );
  if (!recipient) {
    return NextResponse.json({ error: t('Recipient not found.') }, { status: 404 });
  }
  if (recipient.verificationStatus === 'verified' && recipient.verifiedAt) {
    return NextResponse.json({ recipient });
  }

  const result = await verifyRecipientOtp(auth.user.id, id, code);
  if (result.status === 'missing' || result.status === 'expired') {
    return NextResponse.json(
      { error: t('This code has expired. Request a new one.') },
      { status: 410 },
    );
  }
  if (result.status === 'locked') {
    return NextResponse.json(
      { error: t('Too many attempts. Request a new code.') },
      { status: 429 },
    );
  }
  if (result.status === 'invalid') {
    return NextResponse.json(
      { error: result.attemptsRemaining === 1
            ? t('Incorrect code. 1 attempt remaining.')
            : t('Incorrect code. {remaining} attempts remaining.', { remaining: result.attemptsRemaining }) },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  let verifiedRecipient = null;
  await updateConfig((next) => {
    next.recipients = (next.recipients ?? []).map((item) => {
      if (item.id !== id || item.ownerUserId !== auth.user.id) return item;
      verifiedRecipient = {
        ...item,
        verificationStatus: 'verified' as const,
        verifiedAt: now,
        updatedAt: now,
      };
      return verifiedRecipient;
    });
    return next;
  });

  if (!verifiedRecipient) {
    return NextResponse.json({ error: t('Recipient not found.') }, { status: 404 });
  }

  return NextResponse.json({ recipient: verifiedRecipient });
}
