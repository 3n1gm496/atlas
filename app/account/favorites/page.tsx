import Link from 'next/link';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getDemoContributor } from '@/lib/demo-user';

export const dynamic = 'force-dynamic';

type FavoriteWithEntry = Prisma.FavoriteGetPayload<{ include: { entry: true } }>;

export default async function AccountFavoritesPage() {
  const user = await getDemoContributor();
  let favorites: FavoriteWithEntry[] = [];

  if (user) {
    favorites = await prisma.favorite
      .findMany({ where: { userId: user.id }, include: { entry: true }, take: 50 })
      .catch(() => []);
  }

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Preferiti</h1>
      <div className="space-y-2">
        {favorites.map((f) => (
          <Link key={f.id} href={`/entry/${f.entry.slug}`} className="atlas-card block">
            {f.entry.title}
          </Link>
        ))}
        {favorites.length === 0 ? <div className="atlas-card text-sm text-neutral-600">Nessun preferito salvato.</div> : null}
      </div>
    </section>
  );
}
