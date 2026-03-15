'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

const links = [
  { href: '/map', label: 'Mappa' },
  { href: '/archive', label: 'Archivio' },
  { href: '/collections', label: 'Collezioni' },
  { href: '/taxonomy', label: 'Tassonomie' },
  { href: '/search', label: 'Ricerca' },
  { href: '/contributors', label: 'Team' },
  { href: '/about', label: 'Progetto' }
];

export function Nav() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const role = session?.user?.role;
  const canReview = role === 'editor' || role === 'research_admin' || role === 'super_admin';
  const canAdmin = role === 'super_admin' || role === 'research_admin';

  return (
    <header className="sticky top-0 z-30 border-b border-atlas-muted bg-white/85 backdrop-blur">
      <div className="container flex items-center justify-between gap-4 py-4 text-sm">
        <Link href="/" className="flex min-w-0 items-center gap-3 rounded-full border border-atlas-muted bg-white/80 px-4 py-2">
          <span className="atlas-kicker hidden sm:block">Fashion Writing Atlas</span>
          <span className="text-base font-semibold">ATLAS</span>
        </Link>

        <nav className="hidden md:flex flex-wrap items-center gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1 text-neutral-700 transition hover:bg-neutral-900 hover:text-white capitalize"
            >
              {l.label}
            </Link>
          ))}
          {session ? (
            <>
              <Link href="/submit/new" className="rounded-full border border-atlas-muted px-3 py-1 text-neutral-700 transition hover:bg-white">
                Nuova entry
              </Link>
              {canReview ? (
                <Link href="/review" className="rounded-full px-3 py-1 text-neutral-700 transition hover:bg-neutral-900 hover:text-white">
                  Review
                </Link>
              ) : null}
              {canAdmin ? (
                <Link href="/admin" className="rounded-full px-3 py-1 text-neutral-700 transition hover:bg-neutral-900 hover:text-white">
                  Admin
                </Link>
              ) : null}
              <Link href="/account" className="rounded-full px-3 py-1 text-neutral-700 transition hover:bg-neutral-900 hover:text-white">
                {session.user.name ?? 'Account'}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="rounded-full px-3 py-1 text-neutral-700 transition hover:bg-neutral-900 hover:text-white"
              >
                Esci
              </button>
            </>
          ) : (
            <Link href="/login" className="rounded-full bg-neutral-900 px-3 py-1 text-white transition hover:bg-neutral-700">
              Accedi
            </Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden rounded-full border border-atlas-muted px-3 py-1 text-neutral-700"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Chiudi menu' : 'Apri menu'}
          aria-expanded={open}
        >
          <span aria-hidden="true">{open ? '✕' : '☰'}</span>
          <span className="sr-only">{open ? 'Chiudi menu' : 'Apri menu'}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-atlas-muted bg-white/95 px-4 py-3 flex flex-col gap-2 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded px-3 py-2 text-neutral-700 hover:bg-neutral-100"
            >
              {l.label}
            </Link>
          ))}
          {session ? (
            <>
              <Link href="/submit/new" onClick={() => setOpen(false)} className="rounded px-3 py-2 text-neutral-700 hover:bg-neutral-100">
                Nuova entry
              </Link>
              {canReview ? (
                <Link href="/review" onClick={() => setOpen(false)} className="rounded px-3 py-2 text-neutral-700 hover:bg-neutral-100">
                  Review
                </Link>
              ) : null}
              {canAdmin ? (
                <Link href="/admin" onClick={() => setOpen(false)} className="rounded px-3 py-2 text-neutral-700 hover:bg-neutral-100">
                  Admin
                </Link>
              ) : null}
              <Link href="/account" onClick={() => setOpen(false)} className="rounded px-3 py-2 text-neutral-700 hover:bg-neutral-100">
                {session.user.name ?? 'Account'}
              </Link>
              <button
                onClick={() => { setOpen(false); signOut({ callbackUrl: '/' }); }}
                className="rounded px-3 py-2 text-left text-neutral-700 hover:bg-neutral-100"
              >
                Esci
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className="rounded px-3 py-2 font-semibold text-neutral-900 hover:bg-neutral-100">
              Accedi
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
