'use client';

import { useState } from 'react';

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  read: boolean;
};

export function NotificationsList({ items }: { items: NotificationItem[] }) {
  const [notifications, setNotifications] = useState(items);

  async function markRead(notificationId: string, read: boolean) {
    setNotifications((current) => current.map((item) => (item.id === notificationId ? { ...item, read } : item)));
    await fetch('/api/account/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId, read })
    });
  }

  return (
    <div className="space-y-2">
      {notifications.map((n) => (
        <div key={n.id} className="atlas-card text-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <strong>{n.title}</strong>
              <p className="mt-2">{n.body}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`rounded-full px-3 py-1 text-xs ${n.read ? 'bg-neutral-100 text-neutral-600' : 'bg-amber-100 text-amber-800'}`}>
                {n.read ? 'Letta' : 'Nuova'}
              </span>
              <button onClick={() => markRead(n.id, !n.read)} className="text-xs underline">
                {n.read ? 'Segna non letta' : 'Segna letta'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
