import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';
import { getRoleLabel, getStatusLabel } from '@/lib/content/labels';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';
import { getAccountOverview } from '@/lib/services/workspaces';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const user = await getCurrentUser();
  const overview = user ? await getAccountOverview(user.id) : { submissions: 0, recentEntries: [] };
  const { t, locale } = getI18n();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('account.eyebrow')}
        title={t('account.title')}
        description={t('account.description')}
        breadcrumb={t('account.breadcrumb')}
        actions={[
          { href: '/submit/new', label: t('account.actions.newCard') },
          { href: '/account/profile', label: t('account.actions.editProfile'), variant: 'secondary' }
        ]}
      />

      <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="atlas-poster-panel space-y-4">
          <div>
            <p className="atlas-kicker">{t('account.profile.kicker')}</p>
            <h2 className="atlas-section-title text-4xl text-white">{user?.displayName ?? t('account.profile.missing')}</h2>
          </div>
          <div className="space-y-3 text-sm text-white/80">
            <p><strong>{t('account.profile.email')}:</strong> {user?.email ?? t('account.profile.missing')}</p>
            <p><strong>{t('account.profile.role')}:</strong> {getRoleLabel(user?.role?.name ?? 'guest', locale)}</p>
            <p><strong>{t('account.profile.cardsOpened')}:</strong> {overview.submissions}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4">
            <p className="atlas-meta">{t('account.nextAction.kicker')}</p>
            <p className="mt-2 font-semibold text-white">
              {user?.role?.name === 'contributor' ? t('account.nextAction.contributor') : t('account.nextAction.other')}
            </p>
          </div>
        </section>

        <section className="atlas-card space-y-4">
          <div>
            <p className="atlas-kicker">{t('account.quick.kicker')}</p>
            <h2 className="text-2xl font-semibold text-[color:var(--atlas-ink-1)]">{t('account.quick.title')}</h2>
          </div>
          <div className="atlas-stat-rail">
            <article className="atlas-stat">
              <p className="atlas-meta">{t('account.quick.cardsOpened')}</p>
              <p className="mt-2 text-3xl font-semibold">{overview.submissions}</p>
            </article>
            <article className="atlas-stat">
              <p className="atlas-meta">{t('account.quick.role')}</p>
              <p className="mt-2 text-lg font-semibold">{getRoleLabel(user?.role?.name ?? 'guest', locale)}</p>
            </article>
            <article className="atlas-stat">
              <p className="atlas-meta">{t('account.quick.latestStatus')}</p>
              <p className="mt-2 text-sm font-semibold text-[color:var(--atlas-ink-1)]">
                {overview.recentEntries[0] ? getStatusLabel(overview.recentEntries[0].status, locale) : t('account.quick.noActivity')}
              </p>
            </article>
          </div>
          <div className="atlas-plain-list">
            {[
              [
                '/account/profile',
                t('account.links.profile.title'),
                t('account.links.profile.description')
              ],
              [
                '/account/saved-searches',
                t('account.links.saved.title'),
                t('account.links.saved.description')
              ],
              [
                '/account/notifications',
                t('account.links.notifications.title'),
                t('account.links.notifications.description')
              ]
            ].map(([href, title, text]) => (
              <Link key={title} href={href} prefetch={false} className="atlas-plain-row">
                <div className="space-y-2">
                  <p className="font-semibold text-[color:var(--atlas-ink-1)]">{title}</p>
                  <p className="text-sm text-[color:var(--atlas-ink-2)]">{text}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="atlas-card space-y-4">
        <div>
          <p className="atlas-kicker">{t('account.recent.kicker')}</p>
          <h2 className="text-2xl font-semibold text-[color:var(--atlas-ink-1)]">{t('account.recent.title')}</h2>
        </div>
        {overview.recentEntries.length === 0 ? (
          <div className="atlas-empty">{t('account.recent.empty')}</div>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            {overview.recentEntries.map((entry) => (
              <article key={entry.id} className="atlas-panel">
                <p className="font-semibold text-[color:var(--atlas-ink-1)]">{entry.title}</p>
                <p className="mt-2 text-sm text-[color:var(--atlas-ink-2)]">{getStatusLabel(entry.status, locale)}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
