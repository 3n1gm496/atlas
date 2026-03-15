import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { demoEntries, demoUsers, getRoleLabel, getStatusLabel } from '@/lib/demo-content';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const user = await getCurrentUser();
  const demoUser = demoUsers.find((item) => item.email === user?.email);
  const fallbackSubmissions = demoEntries.filter((entry) => entry.contributorId === user?.id).length;
  const submissions = user ? await prisma.entry.count({ where: { contributorId: user.id } }).catch(() => fallbackSubmissions) : 0;
  const recentEntries = user
    ? await prisma.entry
        .findMany({ where: { contributorId: user.id }, orderBy: { updatedAt: 'desc' }, take: 3 })
        .catch(() =>
          demoEntries
            .filter((entry) => entry.contributorId === user.id)
            .slice(0, 3)
            .map((entry) => ({ id: entry.id, title: entry.title, status: entry.status }))
        )
    : [];

  return (
    <section className="space-y-5">
      <div className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Workspace personale</p>
        <h1 className="atlas-title">Account</h1>
        <p className="text-sm text-neutral-700">
          Dashboard sintetica per il tuo ruolo, con accesso rapido alle attivita utili e stato del lavoro editoriale.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="atlas-card space-y-3 text-sm">
          <p><strong>Utente:</strong> {user?.displayName ?? 'N/D'}</p>
          <p><strong>Email:</strong> {user?.email ?? 'N/D'}</p>
          <p><strong>Ruolo:</strong> {getRoleLabel(user?.role?.name ?? 'guest')}</p>
          <p><strong>Submission:</strong> {submissions}</p>
          {demoUser ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
              Sessione disponibile anche in fallback demo locale.
            </p>
          ) : null}
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <article className="atlas-stat">
            <p className="text-sm text-neutral-600">Bozze e invii</p>
            <p className="mt-2 text-3xl font-semibold">{submissions}</p>
          </article>
          <article className="atlas-stat">
            <p className="text-sm text-neutral-600">Ruolo</p>
            <p className="mt-2 text-lg font-semibold">{getRoleLabel(user?.role?.name ?? 'guest')}</p>
          </article>
          <article className="atlas-stat">
            <p className="text-sm text-neutral-600">Prossima azione</p>
            <p className="mt-2 text-sm font-semibold">
              {user?.role?.name === 'contributor' ? 'Completa e invia nuove entry' : 'Monitora review e contenuti'}
            </p>
          </article>
        </section>
      </div>

      <section className="atlas-card space-y-4">
        <div>
          <p className="atlas-kicker">Attivita recente</p>
          <h2 className="text-2xl font-semibold">Le tue entry</h2>
        </div>
        {recentEntries.length === 0 ? (
          <div className="atlas-empty">Ancora nessuna attivita registrata per questo account.</div>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            {recentEntries.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-atlas-muted bg-white p-4">
                <p className="font-semibold">{entry.title}</p>
                <p className="mt-2 text-sm text-neutral-600">{getStatusLabel(entry.status)}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
