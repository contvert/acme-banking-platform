'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Page, useTabs, Money } from '@/components/ds/Page';
import { useCards } from '@/lib/config/adapters';
import { Icon } from '@/components/ds/Icon';
import { CardArt } from '@/components/cards/CardArt';
import type {Card} from '@/lib/mock/cards';
import { RECEIPT_POLICY } from '@/lib/mock/cardFlow';
import p from '@/components/ds/Page.module.css';
import t from '@/components/dashboard/TransactionsTable.module.css';
import s from './Cards.module.css';

/** Budget chips, or an em dash when a card is not tied to one. */
function Budgets({ card }: { card: Card }) {
  if (!card.budgets) return <span className={t.muted}>—</span>;
  return (
    <span className={s.budgets}>
      {Array.from({ length: card.budgets }).map((_, i) => (
        <span key={i} className={[s.budgetChip, i === 1 && s.budgetChipAlt].filter(Boolean).join(' ')}>
          <Icon name={i === 1 ? 'computer' : 'utensils'} size={11} />
        </span>
      ))}
    </span>
  );
}

export default function CardsPage() {
  const CARDS = useCards();
  const tabs = useTabs([{ label: 'Manage' }, { label: 'Subscriptions' }]);
  const [receiptPolicy, setReceiptPolicy] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  return (
    <Page title="Cards" actions={[{ label: 'Create card', icon: 'plus', primary: true, href: '/issue-card' }]}>
      {!dismissed && (
        <section className={s.callout}>
          <div className={s.calloutBody}>
            <span className={s.badge}>{RECEIPT_POLICY.badge}</span>
            <div className={s.calloutHead}>
              <h2 className={s.calloutTitle}>{RECEIPT_POLICY.title}</h2>
              <button
                className={[s.switch, receiptPolicy && s.switchOn].filter(Boolean).join(' ')}
                type="button"
                role="switch"
                aria-checked={receiptPolicy}
                aria-label={RECEIPT_POLICY.title}
                onClick={() => setReceiptPolicy((v) => !v)}
              >
                <span className={s.knob} />
              </button>
            </div>
            <p className={s.calloutText}>
              Recommended because the IRS requires receipts for transactions $75 and over to be
              eligible for tax deductions. Change this setting at any time from your{' '}
              <Link href={RECEIPT_POLICY.policiesHref} className={s.link}>Policies page</Link>.
            </p>
          </div>

          {/* A flattened still of the receipt prompt the policy produces. */}
          <div className={s.calloutArt} aria-hidden>
            <div className={s.artPanel}>
              <div className={s.artRow}>
                <span className={s.artLabel}>Attachments</span>
                <span className={s.artFlag}>
                  <Icon name="triangle-exclamation" size={10} /> Receipt required
                </span>
              </div>
              <div className={s.artDrop}>
                <Icon name="file-arrow-up" size={14} />
                <span>Drag and drop here or click to upload</span>
              </div>
            </div>
          </div>

          <button className={s.dismiss} type="button" aria-label="Dismiss" onClick={() => setDismissed(true)}>
            <Icon name="xmark" size={14} />
          </button>
        </section>
      )}

      {tabs.node}

      {tabs.active === 'Manage' ? (
        <>
          <div className={s.filterBar}>
            <button className={p.btn} type="button">
              <Icon name="filter" size={13} /> Add filter
            </button>
            <span className={t.muted}>No filters applied</span>
          </div>

          <div className={t.wrap}>
            <div className={t.scroll}>
              <table className={t.table}>
                <thead>
                  <tr>
                    <th>Cardholder</th>
                    <th>Card</th>
                    <th>Budgets</th>
                    <th className={t.numeric}>Spent this month</th>
                    <th>Type</th>
                    <th>Account</th>
                  </tr>
                </thead>
                <tbody>
                  {CARDS.map((c, i) => {
                    // The original prints the name once per cardholder, not per row.
                    const startsGroup = i === 0 || CARDS[i - 1].holder !== c.holder;
                    return (
                    <tr key={`${c.last4}-${i}`}>
                      <td>
                        {startsGroup && c.holder && (
                          <span className={s.holder}>
                            {c.holder}
                            {c.holder === 'Jane Black' && <span className={s.you}>You</span>}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={s.cardCell}>
                          <CardArt size="thumb" variant={c.account.includes('Credit') ? 'credit' : 'debit'} />
                          <span className={s.cardNo}>••{c.last4}</span>
                          {c.label && <span className={s.cardLabel}>{c.label}</span>}
                          {c.status !== 'active' && (
                            <span className={`${t.status} ${t.statusPending}`}>
                              {c.status === 'frozen' ? 'Frozen' : 'Suspended'}
                            </span>
                          )}
                        </span>
                      </td>
                      <td><Budgets card={c} /></td>
                      <td className={t.numeric}><Money value={c.spentThisMonth} /></td>
                      <td className={t.muted} style={{ textTransform: 'capitalize' }}>{c.type}</td>
                      <td className={t.muted}>{c.account}</td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className={t.wrap}>
          <div className={t.empty}>No card subscriptions detected yet.</div>
        </div>
      )}
    </Page>
  );
}
