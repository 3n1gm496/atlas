import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { demoEntries } from '@/lib/demo-content';
import { FavoritesManager } from '@/components/account/favorites-manager';

export const dynamic = 'force-dynamic';

type FavoriteWithEntry = Prisma.FavoriteGetPayload<{ include: { entry: true } }>;

export default async function AccountFavoritesPage() {
  const user = await getCurrentUser();
  let favorites: FavoriteWithEntry[] = [];

  if (user) {
    favorites = await prisma.favorite
      .findMany({ where: { userId: user.id }, include: { entry: true }, take: 50 })
      .catch(() =>
        demoEntries.slice(0, 3).map((entry) => ({
          id: `favorite-${entry.id}`,
          userId: user.id,
          entryId: entry.id,
          entry: {
            id: entry.id,
            slug: entry.slug,
            title: entry.title,
            abstract: entry.abstract,
            description: entry.description,
            status: entry.status,
            countryId: 'demo-country',
            contributorId: entry.contributorId,
            canonicalLanguage: entry.canonicalLanguage,
            visibility: 'public',
            featured: entry.featured,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        } as FavoriteWithEntry))
      );
  }

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Preferiti</h1>
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
