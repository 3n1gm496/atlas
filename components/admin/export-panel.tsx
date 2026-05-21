'use client';

import { useI18n } from '@/components/i18n-provider';

export function ExportPanel() {
  const { t } = useI18n();
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <a href="/api/export/entries?format=json" className="atlas-feature-tile block text-sm">
        <span className="atlas-chip atlas-chip-success">{t('adminExport.panel.jsonTag')}</span>
        <p className="mt-4 font-[family-name:var(--font-atlas-display)] text-3xl font-semibold text-[color:var(--atlas-ink-1)]">{t('adminExport.panel.jsonTitle')}</p>
        <p className="mt-3 text-[color:var(--atlas-ink-2)]">{t('adminExport.panel.jsonBody')}</p>
      </a>
      <a href="/api/export/entries?format=csv" className="atlas-result-card block text-sm">
        <span className="atlas-chip">{t('adminExport.panel.csvTag')}</span>
        <p className="mt-4 font-[family-name:var(--font-atlas-display)] text-3xl font-semibold text-[color:var(--atlas-ink-1)]">{t('adminExport.panel.csvTitle')}</p>
        <p className="mt-3 text-[color:var(--atlas-ink-2)]">{t('adminExport.panel.csvBody')}</p>
      </a>
      <a href="/api/export/taxonomy" className="atlas-dark-card block text-sm md:col-span-2">
        <span className="atlas-chip">{t('adminExport.panel.taxonomyTag')}</span>
        <p className="mt-4 font-[family-name:var(--font-atlas-display)] text-3xl font-semibold text-white">{t('adminExport.panel.taxonomyTitle')}</p>
        <p className="mt-3 text-white/80">{t('adminExport.panel.taxonomyBody')}</p>
      </a>
    </div>
  );
}
