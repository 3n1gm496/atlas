import { PageIntentHeader } from '@/components/page-intent-header';
import { getCurrentUser } from '@/lib/auth/session';
import { getSubmissionFormData } from '@/lib/services/public-content';
import { getContributorResumeDraft } from '@/lib/services/workspaces';
import { getI18n } from '@/lib/i18n/server';
import { SubmitTrendForm } from './submit-trend-form';

export const dynamic = 'force-dynamic';

export default async function SubmitNewPage({
  searchParams
}: {
  searchParams?: Promise<{ draft?: string }>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const { countries, groups } = await getSubmissionFormData();
  const user = await getCurrentUser();
  const resumeDraft = user ? await getContributorResumeDraft(user.id, resolvedSearchParams.draft) : null;
  const { t } = getI18n();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('submitNew.eyebrow')}
        title={t('submitNew.title')}
        description={t('submitNew.description')}
        breadcrumb={t('submitNew.breadcrumb')}
        actions={[
          { href: '/submit', label: t('submitNew.actions.back'), variant: 'secondary' },
          { href: '/archive', label: t('submitNew.actions.archive') }
        ]}
      />
      <SubmitTrendForm countries={countries} groups={groups} initialDraft={resumeDraft} />
    </section>
  );
}
