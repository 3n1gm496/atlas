import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';
import { getStatusLabel } from '@/lib/content/labels';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';
import { getContributorDrafts } from '@/lib/services/workspaces';

export const dynamic = 'force-dynamic';

export default async function SubmitPage() {
  const contributor = await getCurrentUser();
  const drafts = contributor ? await getContributorDrafts(contributor.id) : [];
  const draftCount = drafts.filter((entry) => entry.status === 'draft').length;
  const submittedCount = drafts.filter((entry) => entry.status === 'submitted').length;
  const changesRequestedCount = drafts.filter((entry) => entry.status === 'changes_requested').length;
  const { t, locale } = getI18n();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('submitDashboard.eyebrow')}
        title={t('submitDashboard.title')}
        description={t('submitDashboard.description')}
        breadcrumb={t('submitDashboard.breadcrumb')}
        signals={[
          { label: t('submitDashboard.stats.drafts'), value: String(draftCount) },
          { label: t('submitDashboard.stats.submitted'), value: String(submittedCount) },
          { label: t('submitDashboard.stats.changes'), value: String(changesRequestedCount) }
        ]}
        actions={[
          { href: '/submit/new', label: t('submitDashboard.actions.new') },
          { href: '/account/submissions', label: t('submitDashboard.actions.history'), variant: 'secondary' }
        ]}
      />
      <div className="grid gap-3 md:grid-cols-3">
        <article className="atlas-stat">
          <p className="atlas-meta">{t('submitDashboard.stats.drafts')}</p>
          <p className="mt-2 text-3xl font-semibold">{draftCount}</p>
        </article>
        <article className="atlas-stat">
          <p className="atlas-meta">{t('submitDashboard.stats.submitted')}</p>
          <p className="mt-2 text-3xl font-semibold">{submittedCount}</p>
        </article>
        <article className="atlas-stat">
          <p className="atlas-meta">{t('submitDashboard.stats.changes')}</p>
          <p className="mt-2 text-3xl font-semibold">{changesRequestedCount}</p>
        </article>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {drafts.map((entry, index) => (
          <div key={entry.id} className={index === 0 ? 'atlas-dark-card text-sm' : 'atlas-result-card text-sm'}>
            <p className={`font-[family-name:var(--font-atlas-display)] text-3xl font-semibold ${index === 0 ? 'text-white' : 'text-[color:var(--atlas-ink-1)]'}`}>{entry.title}</p>
            <p className={`mt-2 ${index === 0 ? 'text-white/78' : 'text-[color:var(--atlas-ink-2)]'}`}>{getStatusLabel(entry.status, locale)}</p>
            <p className={`mt-3 text-xs ${index === 0 ? 'text-white/56' : 'text-[color:var(--atlas-ink-3)]'}`}>
              {t('submitDashboard.updated')} {entry.updatedAt.toLocaleDateString(locale)}
            </p>
            {['draft', 'changes_requested'].includes(entry.status) ? (
              <Link href={`/submit/new?draft=${entry.id}`} className={`mt-4 inline-flex ${index === 0 ? 'atlas-link-secondary border-white/20 text-white hover:bg-white/10' : 'atlas-link-secondary'}`}>
                {t('submitDashboard.resume')}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
      {drafts.length === 0 ? <div className="atlas-empty">{t('submitDashboard.empty')}</div> : null}
    </section>
  );
}
