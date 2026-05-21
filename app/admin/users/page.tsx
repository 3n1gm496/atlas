import { getRoleLabel } from '@/lib/content/labels';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';
import { getTeamDirectory } from '@/lib/services/workspaces';
import { DataTable } from '@/components/admin/data-table';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await getTeamDirectory();
  const editors = users.filter((user) => ['editor', 'research_admin', 'super_admin'].includes(user.role.name)).length;
  const { t, locale } = getI18n();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('adminUsers.eyebrow')}
        title={t('adminUsers.title')}
        description={t('adminUsers.description')}
        breadcrumb={t('adminUsers.breadcrumb')}
      />
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="atlas-poster-panel space-y-5">
          <div className="space-y-3">
            <p className="atlas-kicker">{t('adminUsers.hero.kicker')}</p>
            <h2 className="atlas-section-title text-5xl text-white">{t('adminUsers.hero.title')}</h2>
            <p className="atlas-body max-w-2xl">{t('adminUsers.hero.body')}</p>
          </div>
          <div className="atlas-stat-rail border-t border-white/10 pt-5">
            <article>
              <p className="atlas-meta">{t('adminUsers.stats.people')}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{users.length}</p>
            </article>
            <article>
              <p className="atlas-meta">{t('adminUsers.stats.editors')}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{editors}</p>
            </article>
          </div>
        </section>

        <section className="atlas-section-shell space-y-4">
          <div>
            <p className="atlas-kicker">{t('adminUsers.watch.kicker')}</p>
            <h2 className="text-2xl font-semibold text-[color:var(--atlas-ink-1)]">{t('adminUsers.watch.title')}</h2>
          </div>
          <div className="atlas-plain-list">
            <div className="atlas-plain-row">
              <p className="font-semibold text-[color:var(--atlas-ink-1)]">{t('adminUsers.watch.item1.title')}</p>
              <p className="text-sm text-[color:var(--atlas-ink-2)]">{t('adminUsers.watch.item1.body')}</p>
            </div>
            <div className="atlas-plain-row">
              <p className="font-semibold text-[color:var(--atlas-ink-1)]">{t('adminUsers.watch.item2.title')}</p>
              <p className="text-sm text-[color:var(--atlas-ink-2)]">{t('adminUsers.watch.item2.body')}</p>
            </div>
          </div>
        </section>
      </div>
      <DataTable
        caption={t('adminUsers.table.caption')}
        rows={users}
        emptyMessage={t('adminUsers.table.empty')}
        columns={[
          { key: 'displayName', header: t('adminUsers.table.name'), render: (u) => <span className="font-semibold">{u.displayName}</span> },
          { key: 'email', header: t('adminUsers.table.email'), render: (u) => u.email },
          { key: 'role', header: t('adminUsers.table.role'), render: (u) => getRoleLabel(u.role.name, locale) },
          { key: 'createdAt', header: t('adminUsers.table.created'), render: (u) => u.createdAt.toLocaleDateString(locale) }
        ]}
      />
    </section>
  );
}
