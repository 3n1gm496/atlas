'use client';

import { useState } from 'react';
import { useI18n } from '@/components/i18n-provider';

type MediaItem = {
  id: string;
  kind: string;
  url: string;
  altText: string;
  entryId: string;
};

function isDatasetAsset(item: MediaItem) {
  return item.url.startsWith('/dataset/media/');
}

export function MediaManager({
  initialItems,
  entryOptions
}: {
  initialItems: MediaItem[];
  entryOptions: { id: string; label: string }[];
}) {
  const { t } = useI18n();
  const [items, setItems] = useState(initialItems);
  const [entryId, setEntryId] = useState(entryOptions[0]?.id ?? '');
  const [kind, setKind] = useState('image');
  const [url, setUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [status, setStatus] = useState('');
  const itemsMissingAlt = items.filter((item) => !item.altText?.trim()).length;
  const datasetItems = items.filter(isDatasetAsset);
  const editorialItems = items.filter((item) => !isDatasetAsset(item));

  async function onCreate() {
    if (!entryId || !url.trim()) {
      setStatus(t('adminMedia.form.validation'));
      return;
    }
    setStatus(t('adminMedia.form.creating'));
    const response = await fetch('/api/admin/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entryId, kind, url, altText })
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error?.message ?? t('adminMedia.form.error'));
      return;
    }
    setItems((current) => [data.data, ...current]);
    setEntryId('');
    setUrl('');
    setAltText('');
    setStatus(t('adminMedia.form.created'));
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="atlas-dark-card grid gap-3 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <p className="atlas-kicker">{t('adminMedia.hero.kicker')}</p>
            <h2 className="text-3xl font-semibold text-white">{t('adminMedia.hero.title')}</h2>
            <p className="text-sm text-white/74">{t('adminMedia.hero.body')}</p>
          </div>
          <label className="grid gap-1 text-sm">
            <span className="text-white/80">{t('adminMedia.form.entry')}</span>
            <select value={entryId} onChange={(event) => setEntryId(event.target.value)} className="atlas-select">
              <option value="">{t('adminMedia.form.entryPlaceholder')}</option>
              {entryOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-white/80">{t('adminMedia.form.kind')}</span>
            <input value={kind} onChange={(event) => setKind(event.target.value)} className="atlas-input" placeholder={t('adminMedia.form.kindPlaceholder')} />
          </label>
          <label className="grid gap-1 text-sm md:col-span-2">
            <span className="text-white/80">{t('adminMedia.form.url')}</span>
            <input value={url} onChange={(event) => setUrl(event.target.value)} className="atlas-input" placeholder={t('adminMedia.form.urlPlaceholder')} />
          </label>
          <label className="grid gap-1 text-sm md:col-span-2">
            <span className="text-white/80">{t('adminMedia.form.alt')}</span>
            <input value={altText} onChange={(event) => setAltText(event.target.value)} className="atlas-input" placeholder={t('adminMedia.form.altPlaceholder')} />
          </label>
          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            <button type="button" onClick={onCreate} className="atlas-link-primary w-fit">{t('adminMedia.form.submit')}</button>
            {status ? <p className="text-sm text-white/76" aria-live="polite">{status}</p> : null}
          </div>
        </div>

        <div className="atlas-section-shell space-y-4">
          <div>
            <p className="atlas-kicker">{t('adminMedia.checks.kicker')}</p>
            <h2 className="text-2xl font-semibold text-[color:var(--atlas-ink-1)]">{t('adminMedia.checks.title')}</h2>
          </div>
          <div className="atlas-metric-grid">
            <article className="atlas-metric-card">
              <p className="atlas-meta">{t('adminMedia.checks.visible')}</p>
              <strong>{items.length}</strong>
            </article>
            <article className="atlas-metric-card">
              <p className="atlas-meta">{t('adminMedia.checks.missingAlt')}</p>
              <strong>{itemsMissingAlt}</strong>
            </article>
            <article className="atlas-metric-card">
              <p className="atlas-meta">Dataset import</p>
              <strong>{datasetItems.length}</strong>
            </article>
            <article className="atlas-metric-card">
              <p className="atlas-meta">Editorial manual</p>
              <strong>{editorialItems.length}</strong>
            </article>
          </div>
          <div className="atlas-plain-list">
            <div className="atlas-plain-row">
              <p className="font-semibold text-[color:var(--atlas-ink-1)]">{t('adminMedia.checks.item1.title')}</p>
              <p className="text-sm text-[color:var(--atlas-ink-2)]">{t('adminMedia.checks.item1.body')}</p>
            </div>
            <div className="atlas-plain-row">
              <p className="font-semibold text-[color:var(--atlas-ink-1)]">{t('adminMedia.checks.item2.title')}</p>
              <p className="text-sm text-[color:var(--atlas-ink-2)]">{t('adminMedia.checks.item2.body')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item, index) => (
          <div key={item.id} className={`${index === 0 ? 'atlas-feature-tile' : 'atlas-result-card'} text-sm`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="atlas-chip">{item.kind}</span>
              <span className={`atlas-chip ${isDatasetAsset(item) ? 'atlas-chip-active' : ''}`}>{isDatasetAsset(item) ? 'dataset import' : 'editorial'}</span>
              {!item.altText?.trim() ? <span className="atlas-chip atlas-chip-warning">{t('adminMedia.card.missingAlt')}</span> : null}
            </div>
            <p className="mt-3 break-all font-medium text-[color:var(--atlas-ink-1)]">{item.url}</p>
            <p className="mt-3 text-[color:var(--atlas-ink-3)]">{t('adminMedia.card.entryId', { id: item.entryId })}</p>
            <p className="mt-2 text-[color:var(--atlas-ink-2)]">{item.altText?.trim() || t('adminMedia.card.noDescription')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
