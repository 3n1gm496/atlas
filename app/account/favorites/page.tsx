import { getCurrentUser } from '@/lib/auth/session';
import { FavoritesManager } from '@/components/account/favorites-manager';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';
import { getFavoriteEntries } from '@/lib/services/workspaces';

export const dynamic = 'force-dynamic';

export default async function AccountFavoritesPage() {
  const user = await getCurrentUser();
  const favorites = user ? await getFavoriteEntries(user.id) : [];
  const { t } = getI18n();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('accountFavorites.eyebrow')}
        title={t('accountFavorites.title')}
        description={t('accountFavorites.description')}
        breadcrumb={t('accountFavorites.breadcrumb')}
      />
      <FavoritesManager
        initialItems={favorites.map((f) => ({
          id: f.id,
          entryId: f.entry.id,
          slug: f.entry.slug,
          title: f.entry.title,
          abstract: f.entry.abstract
        }))}
      />
    </section>
  );
}
