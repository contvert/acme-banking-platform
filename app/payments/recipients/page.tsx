'use client';

import Link from 'next/link';
import { Page } from '@/components/ds/Page';
import { DataTable, Status, NameCell, type Column } from '@/components/ds/DataTable';
import { useConfig } from '@/components/config/ConfigProvider';
import { formatIban } from '@/lib/config/iban';
import type { RecipientConfig } from '@/lib/config/types';
import p from '@/components/ds/Page.module.css';
import { useT } from '@/components/i18n/I18nProvider';

const columns: Column<RecipientConfig>[] = [
  { key: 'name', header: 'Name', sortValue: (r) => r.name, cell: (r) => <NameCell name={r.name} /> },
  {
    key: 'iban', header: 'IBAN', sortValue: (r) => r.iban,
    cell: (r) => <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatIban(r.iban)}</span>,
  },
  { key: 'bankName', header: 'Bank', sortValue: (r) => r.bankName, muted: true,
    cell: (r) => r.bankName || '—' },
  { key: 'currency', header: 'Currency', sortValue: (r) => r.currency },
  {
    key: 'status',
    header: 'Status',
    cell: (recipient) => recipient.verificationStatus === 'verified' && recipient.verifiedAt
      ? <Status value="Ready" />
      : <Link className={p.btn} href={`/payments/recipients/${recipient.id}/verify`}>Verify RIB</Link>,
  },
];

export default function RecipientsPage() {
  const tr = useT();
  const { config } = useConfig();
  const recipients = config.recipients ?? [];

  return (
    <Page
      title={tr('Recipients')}
      actions={[{ label: tr('Add recipient RIB'), icon: 'user-plus', primary: true, href: '/payments/recipients/create' }]}
    >
      <DataTable
        rows={recipients}
        columns={columns}
        searchable
        searchKeys={(r) => `${r.name} ${r.iban} ${r.bic} ${r.bankName}`}
        emptyMessage="No recipients yet. Add a RIB to make your first transfer."
        countLabel={(n) => `${n} ${n === 1 ? 'recipient' : 'recipients'}`}
      />
    </Page>
  );
}
