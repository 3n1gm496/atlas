import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { demoNotifications } from '@/lib/demo-content';
import { NotificationsList } from '@/components/account/notifications-list';

export const dynamic = 'force-dynamic';

export default async function AccountNotificationsPage() {
  const user = await getCurrentUser();
  const notifications: Awaited<ReturnType<typeof prisma.notification.findMany>> = user
    ? await prisma.notification
        .findMany({ where: { userId: user.id }, orderBy: { id: 'desc' }, take: 50 })
        .catch(() =>
          demoNotifications
            .filter((notification) => notification.userId === user.id)
            .map((notification) => ({
              id: notification.id,
              title: notification.title,
              body: notification.body,
              read: notification.read,
              userId: user.id
            })) as Awaited<ReturnType<typeof prisma.notification.findMany>>
        )
    : [];

  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Inbox editoriale</p>
        <h1 className="atlas-title">Notifiche</h1>
        <p className="text-sm text-neutral-700">Aggiornamenti su review, submission, bootstrap e attivita dei ruoli collegati al tuo account.</p>
      </div>
      {notifications.length === 0 ? <div className="atlas-empty">Nessuna notifica.</div> : <NotificationsList items={notifications} />}
    </section>
  );
}
