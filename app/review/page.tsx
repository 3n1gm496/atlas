import { PageIntentHeader } from '@/components/page-intent-header';
import { ReviewBoard } from '@/components/review-board';
import { getI18n } from '@/lib/i18n/server';
import { getEditorialAssignees, getReviewQueue } from '@/lib/services/workspaces';

export const dynamic = 'force-dynamic';

export default async function ReviewPage() {
  const [queue, reviewers] = await Promise.all([getReviewQueue(), getEditorialAssignees()]);
  const { t } = getI18n();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('review.page.eyebrow')}
        title={t('review.page.title')}
        description={t('review.page.description')}
        breadcrumb={t('review.page.breadcrumb')}
        actions={[{ href: '/admin', label: t('review.page.adminAction'), variant: 'secondary' }]}
      />

      {queue.length === 0 ? <div className="atlas-empty">{t('review.page.empty')}</div> : <ReviewBoard initialItems={queue} reviewers={reviewers} />}
    </section>
  );
}
