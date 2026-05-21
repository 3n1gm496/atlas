'use client';

import { useState } from 'react';
import { useI18n } from '@/components/i18n-provider';

type SearchItem = {
  id: string;
  label: string;
  summary: string;
};

export function SavedSearchesManager({ initialItems }: { initialItems: SearchItem[] }) {
  const { t } = useI18n();
  const [items, setItems] = useState(initialItems);
  const [label, setLabel] = useState('');
  const [summary, setSummary] = useState('');
  const [status, setStatus] = useState('');

  async function addSearch() {
    if (!label.trim()) {
      setStatus(t('accountSaved.form.labelRequired'));
      return;
    }
    const response = await fetch('/api/account/saved-searches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, query: { summary } })
    });
    const data = await response.json();
    if (response.ok) {
      setItems((current) => [...current, { id: data.data.id, label: data.data.label, summary: String(data.data.query?.summary ?? summary) }]);
      setLabel('');
      setSummary('');
      setStatus(t('accountSaved.form.saved'));
      return;
    }
    setStatus(data.error?.message ?? t('accountSaved.form.saveError'));
  }

  async function removeSearch(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
    await fetch('/api/account/saved-searches', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    setStatus(t('accountSaved.form.removed'));
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="atlas-dark-card grid gap-3">
          <div className="space-y-2">
            <p className="atlas-kicker">{t('accountSaved.form.kicker')}</p>
            <h2 className="text-3xl font-semibold text-white">{t('accountSaved.form.title')}</h2>
          </div>
          <label className="grid gap-1 text-sm">
            <span className="text-white/80">{t('accountSaved.form.label')}</span>
            <input value={label} onChange={(event) => setLabel(event.target.value)} className="atlas-input" placeholder={t('accountSaved.form.labelPlaceholder')} />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-white/80">{t('accountSaved.form.note')}</span>
            <textarea value={summary} onChange={(event) => setSummary(event.target.value)} className="atlas-textarea" placeholder={t('accountSaved.form.notePlaceholder')} />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={addSearch} className="atlas-link-primary w-fit">{t('accountSaved.form.save')}</button>
            {status ? <p className="text-sm text-white/76" aria-live="polite">{status}</p> : null}
          </div>
        </div>

        <div className="atlas-section-shell space-y-4">
          <div>
            <p className="atlas-kicker">{t('accountSaved.memory.kicker')}</p>
            <h2 className="text-2xl font-semibold text-[color:var(--atlas-ink-1)]">{t('accountSaved.memory.title')}</h2>
          </div>
          <div className="atlas-metric-grid">
            <article className="atlas-metric-card">
              <p className="atlas-meta">{t('accountSaved.memory.count')}</p>
              <strong>{items.length}</strong>
            </article>
          </div>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item, index) => (
          <div key={item.id} className={`${index === 0 ? 'atlas-feature-tile' : 'atlas-result-card'} text-sm`}>
            <p className="font-[family-name:var(--font-atlas-display)] text-3xl font-semibold text-[color:var(--atlas-ink-1)]">{item.label}</p>
            <p className="mt-3 text-[color:var(--atlas-ink-2)]">{item.summary}</p>
            <button type="button" onClick={() => removeSearch(item.id)} className="mt-4 text-xs uppercase tracking-[0.16em] text-[color:var(--atlas-ink-3)] underline">
              {t('accountSaved.form.remove')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
