import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { demoUsers, getRoleLabel } from '@/lib/demo-content';

export const dynamic = 'force-dynamic';

type UserWithRole = Prisma.UserGetPayload<{ include: { role: true } }>;

export default async function AdminUsersPage() {
  const users: UserWithRole[] = await prisma.user
    .findMany({ include: { role: true }, orderBy: { createdAt: 'desc' }, take: 50 })
    .catch(() =>
      demoUsers.map((user) => ({
        id: user.id,
        email: user.email,
        passwordHash: '',
        displayName: user.displayName,
        roleId: user.roleName,
        role: {
          id: `role-${user.roleName}`,
          name: user.roleName,
          description: `Demo role ${user.roleName}`
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })) as UserWithRole[]
    );

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Gestione utenti</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {users.map((u) => (
          <div key={u.id} className="atlas-card text-sm">
            <p className="font-semibold">{u.displayName}</p>
            <p className="mt-1 text-neutral-600">{u.email}</p>
            <p className="mt-2 uppercase tracking-wide text-neutral-500">{getRoleLabel(u.role.name)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
