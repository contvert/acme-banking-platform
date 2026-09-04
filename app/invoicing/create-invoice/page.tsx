'use client';

import { useState } from 'react';
import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { Money } from '@/components/ds/Money';
import { Icon } from '@/components/ds/Icon';
import { CUSTOMERS, CATALOG } from '@/lib/mock/invoicingExtras';
import p from '@/components/ds/Page.module.css';
import t from '@/components/dashboard/TransactionsTable.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';

interface Line { id: number; item: string; quantity: number; unitPrice: number }

let nextId = 1;

export default function CreateInvoicePage() {
  const [customer, setCustomer] = useState('');
  const [lines, setLines] = useState<Line[]>([
    { id: nextId++, item: CATALOG[0]?.item ?? '', quantity: 1, unitPrice: CATALOG[0]?.unitPrice ?? 0 },
  ]);

  const total = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);

  function updateLine(id: number, patch: Partial<Line>) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function pickItem(id: number, itemName: string) {
    const cat = CATALOG.find((c) => c.item === itemName);
    updateLine(id, { item: itemName, unitPrice: cat?.unitPrice ?? 0 });
  }

  return (
    <Page title="Create invoice" actions={[{ label: 'Send invoice', icon: 'paper-plane', primary: true, href: '/invoicing' }]}>
      <Card style={{ maxWidth: 820 }}>
        <label className={f.label} htmlFor="customer">Customer</label>
        <select
          id="customer"
          className={f.select}
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        >
          <option value="">Select a customer</option>
          {CUSTOMERS.map((c) => (
            <option key={c.email} value={c.name}>{c.name}</option>
          ))}
        </select>

        <div style={{ marginTop: 24, overflowX: 'auto' }}>
          <table className={t.table} style={{ minWidth: 520 }}>
            <thead>
              <tr>
                <th>Item</th>
                <th className={t.numeric}>Quantity</th>
                <th className={t.numeric}>Unit price</th>
                <th className={t.numeric}>Total</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => (
                <tr key={l.id}>
                  <td>
                    <select
                      className={f.select}
                      value={l.item}
                      onChange={(e) => pickItem(l.id, e.target.value)}
                    >
                      {CATALOG.map((c) => (
                        <option key={c.item} value={c.item}>{c.item}</option>
                      ))}
                    </select>
                  </td>
                  <td className={t.numeric}>
                    <input
                      className={f.select}
                      style={{ width: 80, textAlign: 'right' }}
                      type="number"
                      min={1}
                      value={l.quantity}
                      onChange={(e) => updateLine(l.id, { quantity: Math.max(1, Number(e.target.value)) })}
                      aria-label="Quantity"
                    />
                  </td>
                  <td className={t.numeric}><Money value={l.unitPrice} /></td>
                  <td className={t.numeric}><Money value={l.quantity * l.unitPrice} /></td>
                  <td className={t.numeric}>
                    <button
                      className={p.btn}
                      type="button"
                      aria-label="Remove line"
                      onClick={() => setLines((prev) => prev.filter((x) => x.id !== l.id))}
                      disabled={lines.length === 1}
                    >
                      <Icon name="trash-can" size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className={t.numeric} style={{ fontWeight: 400 }}>Total</td>
                <td className={t.numeric}><Money value={total} /></td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>

        <button
          className={p.btn}
          type="button"
          style={{ marginTop: 16 }}
          onClick={() =>
            setLines((prev) => [
              ...prev,
              { id: nextId++, item: CATALOG[0]?.item ?? '', quantity: 1, unitPrice: CATALOG[0]?.unitPrice ?? 0 },
            ])
          }
        >
          <Icon name="plus" size={13} /> Add line
        </button>
      </Card>
    </Page>
  );
}
