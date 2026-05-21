import { getCurrentUser } from '@/lib/auth/session';
import { SavedSearchesManager } from '@/components/account/saved-searches-manager';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';
import { getSavedSearchList } from '@/lib/services/workspaces';

export const dynamic = 'force-dynamic';

export default async function AccountSavedSearchesPage() {
  const user = await getCurrentUser();
  const searches = user ? await getSavedSearchList(user.id) : [];
  const { t } = getI18n();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('accountSaved.eyebrow')}
        title={t('accountSaved.title')}
        description={t('accountSaved.description')}
        breadcrumb={t('accountSaved.breadcrumb')}
      />
      <SavedSearchesManager
        initialItems={searches.map((s) => ({
          id: s.id,
          label: s.label,
          summary: typeof s.query === 'object' && s.query && 'summary' in s.query ? String(s.query.summary) : t('accountSaved.defaultSummary')
        }))}
      />
    </section>
  );
}
