import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function ContributorsPage() {
  const users = await prisma.user.findMany({ include: { role: true }, orderBy: { displayName: 'asc' }, take: 50 }).catch(() => []);

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Contributori</h1>
      <div className="atlas-card">
        <ul className="space-y-2 text-sm">
          {users.map((u) => (
            <li key={u.id}>{u.displayName} · <span className="text-neutral-600">{u.role.name}</span></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
