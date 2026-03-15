'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { demoUsers } from '@/lib/demo-content';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password
    });
    setLoading(false);
    if (result?.error) {
      setError('Credenziali non valide. Riprova.');
    } else {
      router.push('/account');
      router.refresh();
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="atlas-card atlas-hero space-y-4">
        <p className="atlas-kicker">Autenticazione</p>
        <h1 className="atlas-title">Accedi al workspace ATLAS</h1>
        <p className="text-sm text-neutral-700">
          Il login ora supporta anche un fallback demo locale, cosi puoi entrare anche se il database non e ancora stato migrato o seedato.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {demoUsers.map((user) => (
            <div key={user.id} className="rounded-2xl border border-atlas-muted bg-white/90 p-4">
              <p className="font-semibold">{user.displayName}</p>
              <p className="mt-1 text-sm text-neutral-600">{user.email}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-neutral-500">{user.roleName}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="atlas-card grid gap-3">
          <div>
            <p className="atlas-kicker">Sign in</p>
            <h2 className="mt-2 text-2xl font-semibold">Bentornato</h2>
          </div>
          {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-2xl border border-atlas-muted px-4 py-3"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-2xl border border-atlas-muted px-4 py-3"
          />
          <button
            type="submit"
            disabled={loading}
            className="atlas-link-primary disabled:opacity-60"
          >
            {loading ? 'Accesso in corso…' : 'Accedi'}
          </button>
          <p className="text-xs text-neutral-600">
            Non hai un account?{' '}
            <Link href="/register" className="underline">
              Registrati
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
