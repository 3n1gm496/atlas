import { getCurrentUser } from '@/lib/auth/session';
import { getRoleLabel } from '@/lib/content/labels';
import { ProfileForm } from '@/components/account/profile-form';
import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

export default async function AccountProfilePage() {
  const user = await getCurrentUser();
  const { t, locale } = getI18n();

  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('accountProfile.eyebrow')}
        title={t('accountProfile.title')}
        description={t('accountProfile.description')}
        breadcrumb={t('accountProfile.breadcrumb')}
      />
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="atlas-dark-card space-y-3 text-sm">
          <p><strong>{t('accountProfile.displayName')}:</strong> {user?.displayName ?? t('accountProfile.missing')}</p>
          <p><strong>{t('accountProfile.email')}:</strong> {user?.email ?? t('accountProfile.missing')}</p>
          <p><strong>{t('accountProfile.role')}:</strong> {getRoleLabel(user?.role?.name ?? 'guest', locale)}</p>
          <p><strong>{t('accountProfile.status')}:</strong> {t('accountProfile.active')}</p>
        </section>
        <ProfileForm displayName={user?.displayName ?? ''} email={user?.email ?? ''} />
      </div>
    </section>
  );
}
