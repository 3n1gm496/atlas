import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { demoUsers, getRoleLabel } from '@/lib/demo-content';

export const dynamic = 'force-dynamic';

type UserWithRole = Prisma.UserGetPayload<{ include: { role: true } }>;

export default async function ContributorsPage() {
  const users: UserWithRole[] = await prisma.user
    .findMany({ include: { role: true }, orderBy: { displayName: 'asc' }, take: 50 })
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
      <div className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Persone e ruoli</p>
        <h1 className="atlas-title">Contributori</h1>
        <p className="text-sm text-neutral-700">Vista dedicata al team editoriale e di ricerca che alimenta il progetto.</p>
      </div>
      <div className="atlas-card">
        <ul className="grid gap-3 text-sm md:grid-cols-2">
          {users.map((u) => (
            <li key={u.id} className="rounded-2xl border border-atlas-muted bg-white p-4">
              <p className="font-semibold">{u.displayName}</p>
              <p className="mt-1 text-neutral-600">{u.email}</p>
              <span className="mt-2 inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs uppercase tracking-wide text-neutral-700">
                {getRoleLabel(u.role.name)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
