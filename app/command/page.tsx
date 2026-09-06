'use client';

import { useState } from 'react';
import { TopBar } from '@/components/shell/TopBar';
import { Icon } from '@/components/ds/Icon';
import s from './Command.module.css';
import { useT } from '@/components/i18n/I18nProvider';

const PROMPTS = [
  'Issue new card',
  'Compare monthly balances',
  'Show my largest expenses',
  'Draft a payment to a recipient',
];

export default function CommandPage() {
  const t = useT();
  const [value, setValue] = useState('');

  return (
    <>
      <TopBar />
      <main className={s.main}>
        <div className={s.inner}>
          <h1 className={s.heading}>{t('Where do you want to start?')}</h1>

          <form
            className={s.composer}
            onSubmit={(e) => {
              e.preventDefault();
              setValue('');
            }}
          >
            <Icon name="sparkles" size={16} />
            <input
              className={s.input}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t('Ask anything about your finances')}
              aria-label={t('Command message')}
            />
            <button className={s.send} type="submit" aria-label={t('Send message')} disabled={!value.trim()}>
              <Icon name="arrow-right" size={15} />
            </button>
          </form>

          <div className={s.promptsLabel}>{t('Try one of these prompts out:')}</div>
          <div className={s.prompts}>
            {PROMPTS.map((p) => (
              <button key={p} className={s.prompt} type="button" onClick={() => setValue(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
