import Link from 'next/link';

const links = ['about','methodology','map','archive','collections','taxonomy','search','contributors','contact'];

export function Nav() {
  return (
    <nav className="border-b border-atlas-muted bg-white/80">
      <div className="container flex flex-wrap gap-3 py-4 text-sm">
        <Link href="/" className="font-semibold">ATLAS</Link>
        {links.map((l)=><Link key={l} href={`/${l}`} className="hover:underline capitalize">{l}</Link>)}
      </div>
    </nav>
  );
}
