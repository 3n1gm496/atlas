import { getAppMode } from '@/lib/app-mode';
import { getEnv } from '@/lib/env';
import { getRequestOrigin } from '@/lib/http/request-origin';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const { t } = getI18n();
  let appUrl = t('adminSettings.status.unconfigured');
  let appMode = t('adminSettings.status.unconfigured');
  try {
    appUrl = (await getRequestOrigin()) ?? getEnv().NEXT_PUBLIC_APP_URL;
    appMode = getAppMode();
  } catch {
    appUrl = t('adminSettings.status.error');
  }

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('adminSettings.eyebrow')}
        title={t('adminSettings.title')}
        description={t('adminSettings.description')}
        breadcrumb={t('adminSettings.breadcrumb')}
      />
      <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <section className="atlas-poster-panel min-w-0 space-y-5">
          <div className="space-y-3">
            <p className="atlas-kicker">{t('adminSettings.hero.kicker')}</p>
            <h2 className="atlas-section-title text-5xl text-white">{t('adminSettings.hero.title')}</h2>
            <p className="atlas-body max-w-2xl">{t('adminSettings.hero.body')}</p>
          </div>
          <div className="atlas-stat-rail border-t border-white/10 pt-5">
            <article>
              <p className="atlas-meta">{t('adminSettings.stats.mode')}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{appMode}</p>
            </article>
            <article>
              <p className="atlas-meta">{t('adminSettings.stats.url')}</p>
              <p className="mt-2 text-lg font-semibold text-white break-all">{appUrl}</p>
            </article>
          </div>
        </section>
        <section className="atlas-section-shell min-w-0 space-y-4 text-sm text-[color:var(--atlas-ink-2)]">
          <div>
            <p className="atlas-kicker">{t('adminSettings.checks.kicker')}</p>
            <h2 className="text-2xl font-semibold text-[color:var(--atlas-ink-1)]">{t('adminSettings.checks.title')}</h2>
          </div>
          <div className="atlas-plain-list">
            <div className="atlas-plain-row">
              <p className="font-semibold text-[color:var(--atlas-ink-1)]">{t('adminSettings.checks.item1.title')}</p>
              <p>{t('adminSettings.checks.item1.body')}</p>
            </div>
            <div className="atlas-plain-row">
              <p className="font-semibold text-[color:var(--atlas-ink-1)]">{t('adminSettings.checks.item2.title')}</p>
              <p>{t('adminSettings.checks.item2.body')}</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
