import { getEnv } from '@/lib/env';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  let appUrl = 'non configurato';
  try {
    appUrl = getEnv().NEXT_PUBLIC_APP_URL;
  } catch {
    appUrl = 'errore configurazione env';
  }

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Settings</h1>
      <div className="atlas-card text-sm space-y-1">
        <p>Applicazione URL: {appUrl}</p>
        <p>Per deploy produzione configurare anche DB, auth provider e storage media.</p>
      </div>
    </section>
  );
}
