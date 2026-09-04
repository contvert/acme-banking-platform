'use client';

import { use } from 'react';
import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { BRAND } from '@/lib/brand';
import p from '@/components/ds/Page.module.css';
import t from '@/components/dashboard/TransactionsTable.module.css';

export default function NdaViewerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return (
    <Page title="Mutual NDA">
      <Card style={{ maxWidth: 680 }}>
        <div className={t.muted} style={{ fontSize: 13, marginBottom: 12 }}>Link: {slug}</div>
        <p style={{ marginTop: 0, fontSize: 16, lineHeight: 1.7 }}>
          This agreement is between {BRAND.productName} and the counterparty receiving this
          link. Both parties agree to keep confidential information disclosed during
          discussions private, and to use it solely to evaluate a potential relationship.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.7 }}>
          This content is illustrative and is not a real agreement.
        </p>
        <div className={p.headActions} style={{ marginTop: 20 }}>
          <button className={p.btn} type="button">Decline</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button">Sign</button>
        </div>
      </Card>
    </Page>
  );
}
