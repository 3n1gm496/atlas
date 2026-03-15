import Link from 'next/link';

const links = ['about', 'methodology', 'map', 'archive', 'collections', 'taxonomy', 'search', 'contributors', 'contact'];

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-atlas-muted bg-white/80 backdrop-blur">
      <div className="container flex flex-wrap items-center gap-3 py-4 text-sm">
        <Link href="/" className="rounded-full border border-atlas-muted px-3 py-1 font-semibold">
          ATLAS
        </Link>
        {links.map((l) => (
          <Link
            key={l}
            href={`/${l}`}
            className="rounded-full px-3 py-1 text-neutral-700 transition hover:bg-neutral-900 hover:text-white capitalize"
          >
            {l}
          </Link>
        ))}
      </div>
    </header>
  );
}
