import { getCurrentUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export default async function AccountProfilePage() {
  const user = await getCurrentUser();

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Profilo</h1>
      <form className="atlas-card grid gap-3 max-w-xl">
        <input defaultValue={user?.displayName ?? ''} className="rounded border border-atlas-muted px-3 py-2" />
        <input defaultValue={user?.email ?? ''} className="rounded border border-atlas-muted px-3 py-2" />
        <button type="button" className="rounded-full bg-neutral-900 px-4 py-2 text-white">Salva modifiche</button>
      </form>
    </section>
  );
}

