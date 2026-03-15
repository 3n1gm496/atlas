'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

const links = ['about', 'methodology', 'map', 'archive', 'collections', 'taxonomy', 'search', 'contributors', 'contact'];

export function Nav() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-atlas-muted bg-white/80 backdrop-blur">
      <div className="container flex items-center justify-between py-4 text-sm">
        <Link href="/" className="rounded-full border border-atlas-muted px-3 py-1 font-semibold">
          ATLAS
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex flex-wrap items-center gap-2">
          {links.map((l) => (
            <Link
              key={l}
              href={`/${l}`}
              className="rounded-full px-3 py-1 text-neutral-700 transition hover:bg-neutral-900 hover:text-white capitalize"
            >
              {l}
            </Link>
          ))}
          {session ? (
            <>
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
              key={l}
              href={`/${l}`}
              onClick={() => setOpen(false)}
              className="rounded px-3 py-2 capitalize text-neutral-700 hover:bg-neutral-100"
            >
              {l}
            </Link>
          ))}
          {session ? (
            <>
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

