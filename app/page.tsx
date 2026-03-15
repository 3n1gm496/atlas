import Link from 'next/link';
import { demoCollections, demoEntries, demoUsers } from '@/lib/demo-content';

export default function HomePage() {
  const publishedEntries = demoEntries.filter((entry) => entry.status === 'published');

  return (
    <section className="space-y-8">
      <div className="atlas-card atlas-hero grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-5">
          <span className="atlas-chip">Digital Humanities · Fashion Studies · Mediterraneo</span>
          <div className="space-y-3">
            <p className="atlas-kicker">Archivio partecipativo</p>
            <h1 className="atlas-title">Cartografia viva delle scritture digitali della moda</h1>
            <p className="max-w-3xl text-base text-neutral-700 sm:text-lg">
              ATLAS unisce ricerca, curatela e contributi distribuiti per osservare come immagini, testi, hashtag e pratiche
              sartoriali costruiscono geografie culturali online.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/map" className="atlas-link-primary">
              Esplora la mappa
            </Link>
            <Link href="/archive" className="atlas-link-secondary">
              Consulta archivio
            </Link>
            <Link href="/submit/new" className="atlas-link-secondary">
              Invia una entry
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <article className="atlas-stat">
            <p className="text-sm text-neutral-600">Entry in evidenza</p>
            <p className="mt-2 text-3xl font-semibold">{publishedEntries.length}</p>
          </article>
          <article className="atlas-stat">
            <p className="text-sm text-neutral-600">Utenti e ruoli attivi</p>
            <p className="mt-2 text-3xl font-semibold">{demoUsers.length}</p>
          </article>
          <article className="atlas-stat">
            <p className="text-sm text-neutral-600">Percorsi curatoriali</p>
            <p className="mt-2 text-3xl font-semibold">{demoCollections.length}</p>
          </article>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Geografie', 'Dalle capitali mediterranee ai microarchivi di piattaforma, ogni entry e leggibile come nodo territoriale.'],
          ['Tassonomie', 'Classificazione multilingue pronta per ricerca qualitativa, filtri esplorativi e percorsi curatoriale.'],
          ['Workflow', 'Contributor, editor, admin e ricerca lavorano su dashboard distinte con segnali chiari di avanzamento.']
        ].map(([title, text]) => (
          <article key={title} className="atlas-card">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-neutral-700">{text}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="atlas-card space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="atlas-kicker">Adesso in archivio</p>
              <h2 className="text-2xl font-semibold">Entry da scoprire</h2>
            </div>
            <Link href="/archive" className="text-sm font-medium underline">
              Vedi tutto
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {publishedEntries.slice(0, 4).map((entry) => (
              <Link key={entry.id} href={`/entry/${entry.slug}`} className="rounded-2xl border border-atlas-muted bg-white p-4 transition hover:-translate-y-0.5">
                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  {entry.countryName} · {entry.timePeriodLabel}
                </p>
                <h3 className="mt-2 font-semibold">{entry.title}</h3>
                <p className="mt-2 text-sm text-neutral-700">{entry.abstract}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="atlas-card space-y-4">
          <div>
            <p className="atlas-kicker">Accessi demo</p>
            <h2 className="text-2xl font-semibold">Ruoli pronti da testare</h2>
          </div>
          <div className="space-y-3">
            {demoUsers.map((user) => (
              <article key={user.id} className="rounded-2xl border border-atlas-muted bg-white p-4">
                <p className="font-semibold">{user.displayName}</p>
                <p className="mt-1 text-sm text-neutral-600">{user.email}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-neutral-500">{user.roleName}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
