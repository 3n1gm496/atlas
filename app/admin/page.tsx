import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getCurrentUser } from '@/lib/auth/session';
import { getI18n } from '@/lib/i18n/server';
import { getAdminOverview } from '@/lib/services/workspaces';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || !['research_admin', 'super_admin'].includes(user.role.name)) {
    redirect('/account');
  }

  const overview = await getAdminOverview();
  const { t } = getI18n();

  const alerts = [
    overview.unassignedReview > 0
      ? {
          label: t('admin.alerts.unassigned', { count: overview.unassignedReview }),
          href: '/review'
        }
      : null,
    overview.highPriorityReview > 0
      ? {
          label: t('admin.alerts.urgent', { count: overview.highPriorityReview }),
          href: '/review'
        }
      : null,
    overview.draftEntries > 0
      ? {
          label: t('admin.alerts.drafts', { count: overview.draftEntries }),
          href: '/admin/entries'
        }
      : null
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('admin.eyebrow')}
        title={t('admin.title')}
        description={t('admin.description')}
        breadcrumb={t('admin.breadcrumb')}
        actions={[{ href: '/review', label: t('admin.actions.review'), variant: 'secondary' }]}
      />

      <div className="grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
        <section className="atlas-card space-y-4">
          <div>
            <p className="atlas-kicker">{t('admin.today.kicker')}</p>
            <h2 className="text-2xl font-semibold text-[color:var(--atlas-ink-1)]">{t('admin.today.title')}</h2>
          </div>
          {alerts.length === 0 ? (
            <div className="atlas-empty">{t('admin.today.empty')}</div>
          ) : (
            <div className="atlas-plain-list">
              {alerts.map((alert) => (
                <Link key={alert.label} href={alert.href} className="atlas-plain-row">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <span className="atlas-chip atlas-chip-warning">{t('admin.today.check')}</span>
                      <p className="font-semibold text-[color:var(--atlas-ink-1)]">{alert.label}</p>
                    </div>
                    <span className="atlas-link-secondary">{t('admin.today.open')}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="atlas-poster-panel space-y-5">
          <div className="atlas-stat-rail border-t border-white/10 pt-5">
            {[
              [t('admin.stats.cards'), overview.entries],
              [t('admin.stats.users'), overview.users],
              [t('admin.stats.collections'), overview.collections],
              [t('admin.stats.terms'), overview.taxonomyTerms]
            ].map(([label, value]) => (
              <article key={String(label)}>
                <p className="atlas-meta">{label}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <article className="atlas-feature-tile">
              <p className="atlas-kicker">{t('admin.pipeline.inProgress')}</p>
              <p className="mt-3 font-[family-name:var(--font-atlas-display)] text-5xl font-semibold text-[color:var(--atlas-ink-1)]">{overview.underReview}</p>
            </article>
            <article className="atlas-feature-tile">
              <p className="atlas-kicker">{t('admin.pipeline.published')}</p>
              <p className="mt-3 font-[family-name:var(--font-atlas-display)] text-5xl font-semibold text-[color:var(--atlas-ink-1)]">{overview.published}</p>
            </article>
          </div>

          <div className="atlas-card space-y-4">
            <div>
              <p className="atlas-kicker">{t('admin.quick.kicker')}</p>
            </div>
            <div className="atlas-plain-list">
              <Link href="/admin/users" className="atlas-plain-row">
                <p className="font-semibold text-[color:var(--atlas-ink-1)]">{t('admin.quick.users')}</p>
              </Link>
              <Link href="/admin/taxonomies" className="atlas-plain-row">
                <p className="font-semibold text-[color:var(--atlas-ink-1)]">{t('admin.quick.taxonomy')}</p>
              </Link>
              <Link href="/admin/entries" className="atlas-plain-row">
                <p className="font-semibold text-[color:var(--atlas-ink-1)]">{t('admin.quick.cards')}</p>
              </Link>
              <Link href="/map" className="atlas-plain-row">
                <p className="font-semibold text-[color:var(--atlas-ink-1)]">{t('admin.quick.map')}</p>
              </Link>
              <Link href="/admin/import-export" className="atlas-plain-row">
                <p className="font-semibold text-[color:var(--atlas-ink-1)]">{t('admin.quick.export')}</p>
              </Link>
            </div>
          </div>
        </section>
    </section>
  );
}
