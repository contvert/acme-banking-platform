'use client';

import Link from 'next/link';
import { Page, SectionTitle } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { Icon } from '@/components/ds/Icon';
import p from '@/components/ds/Page.module.css';
import t from '@/components/dashboard/TransactionsTable.module.css';
import { useT } from '@/components/i18n/I18nProvider';

export default function SafePage() {
  const translate = useT();
  return (
    <Page title={translate('SAFEs')} actions={[{ label: translate('Issue SAFE'), icon: 'file-contract', primary: true, href: '/safe/create' }]}>
      <Card style={{ maxWidth: 640, marginBottom: 24 }}>
        <p style={{ marginTop: 0, fontSize: 16, lineHeight: 1.6 }}>
          Issue a Simple Agreement for Future Equity to an investor, sign it, and track it
          alongside your other financing.
        </p>
        <Link className={`${p.btn} ${p.btnPrimary}`} href="/safe/create">
          <Icon name="plus" size={13} />{translate('Create a SAFE')}</Link>
      </Card>
      <SectionTitle>{translate('Issued SAFEs')}</SectionTitle>
      <Card style={{ maxWidth: 640 }}>
        <span className={t.muted} style={{ fontSize: 15 }}>{translate('No SAFEs issued yet.')}</span>
      </Card>
    </Page>
  );
}
