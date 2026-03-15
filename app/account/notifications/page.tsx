import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export default async function AccountNotificationsPage() {
  const user = await getCurrentUser();
  const notifications: Awaited<ReturnType<typeof prisma.notification.findMany>> = user
    ? await prisma.notification.findMany({ where: { userId: user.id }, orderBy: { id: 'desc' }, take: 50 }).catch(() => [])
    : [];

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Notifiche</h1>
      <div className="space-y-2">
        {notifications.map((n) => <div key={n.id} className="atlas-card text-sm"><strong>{n.title}</strong><p>{n.body}</p></div>)}
        {notifications.length === 0 ? <div className="atlas-card text-sm text-neutral-600">Nessuna notifica.</div> : null}
      </div>
    </section>
  );
}
