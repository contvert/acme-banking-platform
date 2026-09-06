import { NextResponse } from 'next/server';
import { requireUser, isDenied } from '@/lib/auth/guard';
import { updateConfig } from '@/lib/config/store';
import { getTranslator } from '@/lib/i18n/server';
import type { TransactionConfig } from '@/lib/config/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const t = await getTranslator();
  const auth = await requireUser('client');
  if (isDenied(auth)) return auth.response;

  let body: { from: string; to: string; amount: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: t('Body must be JSON.') }, { status: 400 });
  }

  const { from, to, amount } = body;
  if (!from || !to || typeof amount !== 'number' || amount <= 0) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  await updateConfig((config) => {
    const fromAcc = config.accounts.find(a => a.name === from);
    const toAcc = config.accounts.find(a => a.name === to);

    if (fromAcc && toAcc) {
      fromAcc.balance -= amount;
      fromAcc.available -= amount;
      toAcc.balance += amount;
      toAcc.available += amount;

      const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); // "Sep 5"

      // Add a debit transaction on the from account
      const debitTransaction: TransactionConfig = {
        id: `txn-${Date.now()}-1`,
        date,
        party: `Transfer to ${to}`,
        amount: -amount,
        accountId: fromAcc.id,
        method: 'Internal Transfer',
        status: 'completed',
      };

      // Add a credit transaction on the to account
      const creditTransaction: TransactionConfig = {
        id: `txn-${Date.now()}-2`,
        date,
        party: `Transfer from ${from}`,
        amount: amount,
        accountId: toAcc.id,
        method: 'Internal Transfer',
        status: 'completed',
      };

      config.transactions = [debitTransaction, creditTransaction, ...config.transactions];
    }
    return config;
  });

  return NextResponse.json({ status: 'ok' });
}
