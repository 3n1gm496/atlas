'use client';
/* eslint-disable @next/next/no-img-element */

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

const mediaKindOptions = [
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'link', label: 'Link' },
  { value: 'document', label: 'Document' }
] as const;

function isRenderablePreview(url: string) {
  return /^https?:\/\//i.test(url) || url.startsWith('/');
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
  const trimmedUrl = url.trim();
  const previewable = isRenderablePreview(trimmedUrl);

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
            <select value={kind} onChange={(event) => setKind(event.target.value)} className="atlas-select">
              {mediaKindOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
          <div className="md:col-span-2 rounded-[1.4rem] border border-white/10 bg-white/8 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="atlas-meta text-white/70">{t('adminMedia.form.kind')}</p>
              <span className="atlas-chip atlas-chip-active">{kind}</span>
            </div>
            <div className="mt-3 overflow-hidden rounded-[1.1rem] border border-white/10 bg-black/18">
              {previewable && trimmedUrl ? (
                kind === 'video' ? (
                  <video controls className="aspect-video w-full bg-black object-cover" src={trimmedUrl} />
                ) : kind === 'image' ? (
                  // The preview is editorial tooling, not the published card surface.
                  <img className="aspect-video w-full object-cover" src={trimmedUrl} alt={altText || 'Media preview'} />
                ) : (
                  <div className="grid aspect-video place-items-center px-6 text-center text-sm text-white/74">
                    <span>{kind} asset ready to link</span>
                  </div>
                )
              ) : (
                <div className="grid aspect-video place-items-center px-6 text-center text-sm text-white/74">
                  <span>{t('adminMedia.form.urlPlaceholder')}</span>
                </div>
              )}
            </div>
            <p className="mt-3 text-sm text-white/72">
              {trimmedUrl ? trimmedUrl : t('adminMedia.form.urlPlaceholder')}
            </p>
            <p className="mt-1 text-xs text-white/56">
              {altText.trim() ? altText : t('adminMedia.form.altPlaceholder')}
            </p>
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
            {item.kind === 'video' ? (
              <video controls className="mt-3 aspect-video w-full rounded-[1rem] border border-[rgba(112,83,61,0.12)] bg-black object-cover" src={item.url} />
            ) : item.kind === 'image' && (item.url.startsWith('http') || item.url.startsWith('/')) ? (
              <img className="mt-3 aspect-video w-full rounded-[1rem] border border-[rgba(112,83,61,0.12)] object-cover" src={item.url} alt={item.altText || 'Media asset preview'} />
            ) : null}
            <p className="mt-3 break-all font-medium text-[color:var(--atlas-ink-1)]">{item.url}</p>
            <p className="mt-3 text-[color:var(--atlas-ink-3)]">{t('adminMedia.card.entryId', { id: item.entryId })}</p>
            <p className="mt-2 text-[color:var(--atlas-ink-2)]">{item.altText?.trim() || t('adminMedia.card.noDescription')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
