import { DataTable } from '@/components/admin/data-table';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';
import { getAuditFeed } from '@/lib/services/workspaces';

export const dynamic = 'force-dynamic';

export default async function AdminAuditPage() {
  const logs = await getAuditFeed();
  const recentActions = logs.slice(0, 3);
  const { t, locale } = getI18n();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('adminAudit.eyebrow')}
        title={t('adminAudit.title')}
        description={t('adminAudit.description')}
        breadcrumb={t('adminAudit.breadcrumb')}
      />
      <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <section className="atlas-poster-panel min-w-0 space-y-5">
          <div className="space-y-3">
            <p className="atlas-kicker">{t('adminAudit.hero.kicker')}</p>
            <h2 className="atlas-section-title text-5xl text-white">{t('adminAudit.hero.title')}</h2>
            <p className="atlas-body max-w-2xl">{t('adminAudit.hero.body')}</p>
          </div>
          <div className="atlas-stat-rail border-t border-white/10 pt-5">
            <article>
              <p className="atlas-meta">{t('adminAudit.stats.events')}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{logs.length}</p>
            </article>
            <article>
              <p className="atlas-meta">{t('adminAudit.stats.latest')}</p>
              <p className="mt-2 text-lg font-semibold text-white">
                {logs[0] ? logs[0].createdAt.toLocaleDateString(locale) : t('adminAudit.stats.none')}
              </p>
            </article>
          </div>
        </section>

        <section className="atlas-section-shell min-w-0 space-y-4">
          <div>
            <p className="atlas-kicker">{t('adminAudit.recent.kicker')}</p>
            <h2 className="text-2xl font-semibold text-[color:var(--atlas-ink-1)]">{t('adminAudit.recent.title')}</h2>
          </div>
          {recentActions.length === 0 ? (
            <div className="atlas-empty">{t('adminAudit.recent.empty')}</div>
          ) : (
            <div className="atlas-plain-list">
              {recentActions.map((log) => (
                <div key={log.id} className="atlas-plain-row">
                  <div className="min-w-0 space-y-1">
                    <p className="font-semibold text-[color:var(--atlas-ink-1)]">{log.action}</p>
                    <p className="text-sm text-[color:var(--atlas-ink-2)] break-words">{log.actor.displayName} · {log.createdAt.toLocaleString(locale)}</p>
                    <p className="text-sm text-[color:var(--atlas-ink-3)]">{summarizePayload(log.payload, t)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <DataTable
        caption={t('adminAudit.table.caption')}
        rows={logs}
        emptyMessage={t('adminAudit.table.empty')}
        columns={[
          { key: 'action', header: t('adminAudit.table.action'), render: (l) => <span className="font-semibold">{l.action}</span> },
          { key: 'actor', header: t('adminAudit.table.actor'), render: (l) => l.actor.displayName },
          { key: 'payload', header: t('adminAudit.table.details'), render: (l) => summarizePayload(l.payload, t) },
          { key: 'createdAt', header: t('adminAudit.table.when'), render: (l) => l.createdAt.toLocaleString(locale) }
        ]}
      />
    </section>
  );
}

function summarizePayload(payload: unknown, t: (key: string) => string) {
  if (!payload || typeof payload !== 'object') return t('adminAudit.payload.none');
  return Object.entries(payload as Record<string, unknown>)
    .slice(0, 4)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(' · ');
}
