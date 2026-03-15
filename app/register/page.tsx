'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Errore durante la registrazione.');
      } else {
        router.push('/login?registered=1');
      }
    } catch {
      setError('Errore di rete. Riprova.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Registrazione contributore</h1>
      <form onSubmit={handleSubmit} className="atlas-card grid gap-3 max-w-xl">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <input
          placeholder="Nome visualizzato"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          minLength={2}
          className="rounded border border-atlas-muted px-3 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded border border-atlas-muted px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password (min. 8 caratteri)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="rounded border border-atlas-muted px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-neutral-900 px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? 'Creazione in corso…' : 'Crea account'}
        </button>
      </form>
      <p className="text-xs text-neutral-600">
        Hai già un account?{' '}
        <Link href="/login" className="underline">
          Accedi
        </Link>
      </p>
    </section>
  );
}

