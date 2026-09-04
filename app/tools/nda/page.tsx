'use client';

import Link from 'next/link';
import { Page, SectionTitle } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { Icon } from '@/components/ds/Icon';
import p from '@/components/ds/Page.module.css';
import t from '@/components/dashboard/TransactionsTable.module.css';

export default function NdaToolPage() {
  return (
    <Page title="NDA tool" actions={[{ label: 'Create NDA', icon: 'file-contract', primary: true, href: '/nda/link/mock-nda-viewer-link-slug' }]}>
      <Card style={{ maxWidth: 640, marginBottom: 24 }}>
        <p style={{ marginTop: 0, fontSize: 16, lineHeight: 1.6 }}>
          Generate a mutual NDA, share it as a link, and collect a signature without leaving
          the dashboard.
        </p>
        <Link className={p.btn} href="/nda/link/mock-nda-viewer-link-slug">
          <Icon name="link" size={13} /> Preview a shared link
        </Link>
      </Card>
      <SectionTitle>Sent NDAs</SectionTitle>
      <Card style={{ maxWidth: 640 }}>
        <span className={t.muted} style={{ fontSize: 15 }}>No NDAs sent yet.</span>
      </Card>
    </Page>
  );
}
