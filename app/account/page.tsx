import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const user = await getCurrentUser();
  const submissions = user ? await prisma.entry.count({ where: { contributorId: user.id } }).catch(() => 0) : 0;

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Account</h1>
      <div className="atlas-card text-sm">
        <p><strong>Utente:</strong> {user?.displayName ?? 'N/D'}</p>
        <p><strong>Email:</strong> {user?.email ?? 'N/D'}</p>
        <p><strong>Ruolo:</strong> {user?.role?.name ?? 'N/D'}</p>
        <p><strong>Submission:</strong> {submissions}</p>
      </div>
    </section>
  );
}

