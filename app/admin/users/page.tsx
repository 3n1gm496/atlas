import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type UserWithRole = Prisma.UserGetPayload<{ include: { role: true } }>;

export default async function AdminUsersPage() {
  const users: UserWithRole[] = await prisma.user
    .findMany({ include: { role: true }, orderBy: { createdAt: 'desc' }, take: 50 })
    .catch(() => []);

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Gestione utenti</h1>
      {users.map((u) => (
        <div key={u.id} className="atlas-card text-sm">
          {u.displayName} · {u.email} · {u.role.name}
        </div>
      ))}
    </section>
  );
}
