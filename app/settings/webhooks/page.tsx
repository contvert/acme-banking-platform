'use client';

import { Page } from '@/components/ds/Page';
import { DataTable, Status, type Column } from '@/components/ds/DataTable';
import { WEBHOOKS, type Webhook } from '@/lib/mock/settingsData';
import { useT } from '@/components/i18n/I18nProvider';

const columns: Column<Webhook>[] = [
  { key: 'url', header: 'URL', sortValue: (r) => r.url },
  { key: 'status', header: 'Status', cell: (r) => <Status value={r.status} /> },
  { key: 'events', header: 'Events', muted: true },
  { key: 'created', header: 'Created date', muted: true, sortValue: (r) => r.created },
];

export default function WebhooksPage() {
  const tr = useT();
  return (
    <Page title={tr('Webhooks')} actions={[{ label: tr('Add webhook'), icon: 'plus', primary: true }]}>
      <DataTable rows={WEBHOOKS} columns={columns} countLabel={(n) => `${n} webhooks`} />
    </Page>
  );
}
