import { getCurrentUser } from '@/lib/auth/session';
import { NotificationsList } from '@/components/account/notifications-list';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';
import { getNotificationFeed } from '@/lib/services/workspaces';

export const dynamic = 'force-dynamic';

export default async function AccountNotificationsPage() {
  const user = await getCurrentUser();
  const notifications = user ? await getNotificationFeed(user.id) : [];
  const { t } = getI18n();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('accountNotifications.eyebrow')}
        title={t('accountNotifications.title')}
        description={t('accountNotifications.description')}
        breadcrumb={t('accountNotifications.breadcrumb')}
      />
      {notifications.length === 0 ? <div className="atlas-empty">{t('accountNotifications.empty')}</div> : <NotificationsList items={notifications} />}
    </section>
  );
}
