'use client';

import { useState } from 'react';
import { useI18n } from '@/components/i18n-provider';

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  read: boolean;
};

export function NotificationsList({ items }: { items: NotificationItem[] }) {
  const { t } = useI18n();
  const [notifications, setNotifications] = useState(items);
  const [status, setStatus] = useState('');

  async function markRead(notificationId: string, read: boolean) {
    setNotifications((current) => current.map((item) => (item.id === notificationId ? { ...item, read } : item)));
    await fetch('/api/account/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId, read })
    });
    setStatus(read ? t('accountNotifications.list.markRead') : t('accountNotifications.list.markUnread'));
  }

  return (
    <div className="space-y-3">
      {notifications.length > 0 ? (
        <div className="atlas-section-shell space-y-4">
          <div>
            <p className="atlas-kicker">{t('accountNotifications.list.kicker')}</p>
            <h2 className="text-2xl font-semibold text-[color:var(--atlas-ink-1)]">{t('accountNotifications.list.title')}</h2>
          </div>
          <div className="atlas-metric-grid">
            <article className="atlas-metric-card">
              <p className="atlas-meta">{t('accountNotifications.list.new')}</p>
              <strong>{notifications.filter((item) => !item.read).length}</strong>
            </article>
            <article className="atlas-metric-card">
              <p className="atlas-meta">{t('accountNotifications.list.total')}</p>
              <strong>{notifications.length}</strong>
            </article>
          </div>
        </div>
      ) : null}
      {notifications.map((n) => (
        <div key={n.id} className={`${n.read ? 'atlas-result-card' : 'atlas-dark-card'} text-sm`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <strong className={n.read ? 'text-[color:var(--atlas-ink-1)]' : 'text-white'}>{n.title}</strong>
              <p className={`mt-2 ${n.read ? 'text-[color:var(--atlas-ink-2)]' : 'text-white/80'}`}>{n.body}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`rounded-full px-3 py-1 text-xs ${n.read ? 'bg-black/5 text-[color:var(--atlas-ink-3)]' : 'bg-white/10 text-white'}`}>
                {n.read ? t('accountNotifications.list.read') : t('accountNotifications.list.unread')}
              </span>
              <button type="button" onClick={() => markRead(n.id, !n.read)} className={`text-xs underline ${n.read ? 'text-[color:var(--atlas-ink-3)]' : 'text-white/74'}`}>
                {n.read ? t('accountNotifications.list.setUnread') : t('accountNotifications.list.setRead')}
              </button>
            </div>
          </div>
        </div>
      ))}
      {status ? <p className="text-sm text-[color:var(--atlas-ink-2)]" aria-live="polite">{status}</p> : null}
    </div>
  );
}
