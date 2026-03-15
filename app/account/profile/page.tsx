import { getCurrentUser } from '@/lib/auth/session';
import { getRoleLabel } from '@/lib/demo-content';
import { ProfileForm } from '@/components/account/profile-form';

export const dynamic = 'force-dynamic';

export default async function AccountProfilePage() {
  const user = await getCurrentUser();

  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Identita e ruolo</p>
        <h1 className="atlas-title">Profilo</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="atlas-card space-y-3 text-sm">
          <p><strong>Nome visualizzato:</strong> {user?.displayName ?? 'N/D'}</p>
          <p><strong>Email:</strong> {user?.email ?? 'N/D'}</p>
          <p><strong>Ruolo:</strong> {getRoleLabel(user?.role?.name ?? 'guest')}</p>
          <p><strong>Stato account:</strong> Attivo</p>
        </section>
        <ProfileForm displayName={user?.displayName ?? ''} email={user?.email ?? ''} />
      </div>
    </section>
  );
}
