import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';
import { getStatusLabel } from '@/lib/content/labels';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';
import { getContributorDrafts } from '@/lib/services/workspaces';

export const dynamic = 'force-dynamic';

export default async function AccountSubmissionsPage() {
  const user = await getCurrentUser();
  const submissions = user ? await getContributorDrafts(user.id) : [];
  const { t, locale } = getI18n();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('accountSubmissions.eyebrow')}
        title={t('accountSubmissions.title')}
        description={t('accountSubmissions.description')}
        breadcrumb={t('accountSubmissions.breadcrumb')}
      />
      <div className="grid gap-3 md:grid-cols-2">
        {submissions.map((submission, index) => (
          <div key={submission.id} className={index === 0 ? 'atlas-dark-card text-sm' : 'atlas-result-card text-sm'}>
            <p className={`font-[family-name:var(--font-atlas-display)] text-3xl font-semibold ${index === 0 ? 'text-white' : 'text-[color:var(--atlas-ink-1)]'}`}>{submission.title}</p>
            <p className={`mt-2 ${index === 0 ? 'text-white/78' : 'text-[color:var(--atlas-ink-2)]'}`}>{getStatusLabel(submission.status, locale)}</p>
            {['draft', 'changes_requested'].includes(submission.status) ? (
              <Link href={`/submit/new?draft=${submission.id}`} className={`mt-4 inline-flex ${index === 0 ? 'atlas-link-secondary border-white/20 text-white hover:bg-white/10' : 'atlas-link-secondary'}`}>
                {t('accountSubmissions.resume')}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
      {submissions.length === 0 ? <div className="atlas-empty">{t('accountSubmissions.empty')}</div> : null}
    </section>
  );
}
