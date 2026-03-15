import { prisma } from '@/lib/prisma';
import { getDemoContributor } from '@/lib/demo-user';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const user = await getDemoContributor();
  const submissions = user ? await prisma.entry.count({ where: { contributorId: user.id } }).catch(() => 0) : 0;

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Account</h1>
      <div className="atlas-card text-sm">
        <p><strong>Utente:</strong> {user?.displayName ?? 'N/D'}</p>
        <p><strong>Email:</strong> {user?.email ?? 'N/D'}</p>
        <p><strong>Submission:</strong> {submissions}</p>
      </div>
    </section>
  );
}
