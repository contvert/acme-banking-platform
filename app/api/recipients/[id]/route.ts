import { NextResponse } from 'next/server';
import { requireUser, isDenied } from '@/lib/auth/guard';
import { updateConfig } from '@/lib/config/store';
import { clearRecipientOtp } from '@/lib/recipients/otp';
import { foreignOrigin } from '@/lib/http/origin';
import { getTranslator } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };


export async function DELETE(request: Request, context: Ctx) {
  const t = await getTranslator();
  const auth = await requireUser('client');
  if (isDenied(auth)) return auth.response;
  if (foreignOrigin(request)) {
    return NextResponse.json({ error: t('Invalid request origin.') }, { status: 403 });
  }

  const { id } = await context.params;
  let found = false;

  await updateConfig((config) => {
    config.recipients ??= [];
    const index = config.recipients.findIndex(
      (recipient) => recipient.id === id && recipient.ownerUserId === auth.user.id,
    );
    if (index >= 0) {
      found = true;
      config.recipients.splice(index, 1);
    }
    return config;
  });

  if (!found) {
    return NextResponse.json({ error: t('Recipient not found.') }, { status: 404 });
  }

  await clearRecipientOtp(auth.user.id, id);
  return NextResponse.json({ ok: true });
}
