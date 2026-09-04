'use client';

import { Icon } from '@/components/ds/Icon';
import { Money } from '@/components/ds/Money';
import { ACCOUNTS } from '@/lib/mock/accounts';
import s from './Fields.module.css';

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={s.field}>
      <span className={s.label}>{label}</span>
      {children}
    </div>
  );
}

/** Amount input with the dollar sign set inside the control, as on the original. */
export function AmountInput({
  value,
  onChange,
  id = 'amount',
}: {
  value: string;
  onChange: (v: string) => void;
  id?: string;
}) {
  return (
    <div className={s.amountWrap}>
      <span className={s.currency}>$</span>
      <input
        id={id}
        className={s.amount}
        inputMode="decimal"
        placeholder="0.00"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d.,]/g, ''))}
        aria-label="Amount"
      />
    </div>
  );
}

/** Account picker styled as the reference's combobox: value on the left, chevron right. */
export function AccountSelect({
  value,
  onChange,
  exclude,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  exclude?: string;
  id?: string;
}) {
  const options = ACCOUNTS.filter((a) => a.name !== exclude);
  const selected = ACCOUNTS.find((a) => a.name === value);

  return (
    <div className={s.selectWrap}>
      <select
        id={id}
        className={s.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Select an account"
      >
        <option value="">Select an account</option>
        {options.map((a) => (
          <option key={a.name} value={a.name}>{a.name}</option>
        ))}
      </select>
      <span className={s.selectFace} aria-hidden>
        {selected ? (
          <>
            <span className={s.selectName}>{selected.name}</span>
            <span className={s.selectMeta}>
              <Money value={selected.balance} />
              {selected.last4 && <> / Checking ••{selected.last4}</>}
            </span>
          </>
        ) : (
          <span className={s.placeholder}>Select an account</span>
        )}
      </span>
      <span className={s.chevron} aria-hidden><Icon name="chevron-down" size={14} /></span>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      className={s.toggleRow}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
    >
      <span className={[s.track, checked && s.trackOn].filter(Boolean).join(' ')}>
        <span className={s.knob} />
      </span>
      <span className={s.toggleLabel}>{label}</span>
    </button>
  );
}

export function DropZone({ hint }: { hint: string }) {
  return (
    <label className={s.drop}>
      <input type="file" className={s.fileInput} />
      <Icon name="file-arrow-up" size={20} />
      <span className={s.dropText}>
        <span className={s.dropTitle}>Drag and drop here or click to upload</span>
        <span className={s.dropHint}>{hint}</span>
      </span>
    </label>
  );
}

export function RadioCards({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className={s.radioRow}>
      {options.map((o) => (
        <label key={o} className={[s.radioCard, value === o && s.radioCardOn].filter(Boolean).join(' ')}>
          <input
            type="radio"
            name={name}
            checked={value === o}
            onChange={() => onChange(o)}
            className={s.radioInput}
          />
          <span className={s.radioDot} aria-hidden />
          {o}
        </label>
      ))}
    </div>
  );
}

export const fieldStyles = s;
