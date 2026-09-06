'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import p from '@/components/ds/Page.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';
import { useT } from '@/components/i18n/I18nProvider';

export default function RequestRecipientPage() {
  const tr = useT();
  return (
    <Page title={tr('Request payment details')}>
      <Card style={{ maxWidth: 560 }}>
        <label className={f.label} htmlFor="recipient-name">{tr('Recipient name')}</label>
        <input id="recipient-name" className={f.select} placeholder={tr('Company or person')} />
        <label className={f.label} htmlFor="email">{tr('Email')}</label>
        <input id="email" className={f.select} placeholder="name@example.invalid" />
        <label className={f.label} htmlFor="message">{tr('Message')}</label>
        <input id="message" className={f.select} placeholder={tr('Optional note')} />

        <div className={f.actions}>
          <button className={p.btn} type="button">{tr('Back')}</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button">{tr('Send request')}</button>
        </div>
      </Card>
    </Page>
  );
}
