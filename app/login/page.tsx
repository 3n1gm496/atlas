'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    <section className="space-y-4">
      <h1 className="atlas-title">Login</h1>
      <form onSubmit={handleSubmit} className="atlas-card grid gap-3 max-w-xl">
        {error && <p className="text-sm text-red-600">{error}</p>}
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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded border border-atlas-muted px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-neutral-900 px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? 'Accesso in corso…' : 'Accedi'}
        </button>
      </form>
      <p className="text-xs text-neutral-600">
        Non hai un account?{' '}
        <Link href="/register" className="underline">
          Registrati
        </Link>
      </p>
    </section>
  );
}

