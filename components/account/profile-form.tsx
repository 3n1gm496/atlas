'use client';

import { useState } from 'react';
import { useI18n } from '@/components/i18n-provider';

export function ProfileForm({ displayName, email }: { displayName: string; email: string }) {
  const { t } = useI18n();
  const [name, setName] = useState(displayName);
  const [status, setStatus] = useState('');

  async function onSave() {
    setStatus(t('accountProfile.form.saving'));
    const response = await fetch('/api/account/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: name })
    });
    const data = await response.json();
    setStatus(response.ok ? t('accountProfile.form.saved') : data.error?.message ?? t('accountProfile.form.error'));
  }

  return (
    <div className="atlas-card grid gap-3 max-w-xl">
      <label className="grid gap-1 text-sm">
        <span>{t('accountProfile.form.displayName')}</span>
        <input value={name} onChange={(event) => setName(event.target.value)} className="atlas-input" />
      </label>
      <label className="grid gap-1 text-sm">
        <span>{t('accountProfile.form.email')}</span>
        <input value={email} readOnly className="atlas-input bg-[rgba(0,0,0,0.04)] text-[color:var(--atlas-ink-3)]" />
      </label>
      <button type="button" onClick={onSave} className="atlas-link-primary w-fit">{t('accountProfile.form.save')}</button>
      {status ? <p className="text-sm text-[color:var(--atlas-ink-2)]">{status}</p> : null}
    </div>
  );
}
