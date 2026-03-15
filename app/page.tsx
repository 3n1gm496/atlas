import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="space-y-10">
      <div className="atlas-card space-y-4">
        <span className="atlas-chip">Digital Humanities · Fashion Studies</span>
        <h1 className="atlas-title">ATLAS</h1>
        <p className="max-w-3xl text-neutral-700">
          Cartografia dinamica delle scritture digitali della moda: archivio partecipativo, osservatorio critico e spazio
          curatoriale multilingue.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/map" className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
            Esplora la mappa
          </Link>
          <Link href="/archive" className="rounded-full border border-atlas-muted bg-white px-4 py-2 text-sm font-medium">
            Consulta archivio
          </Link>
          <Link href="/submit/new" className="rounded-full border border-atlas-muted bg-white px-4 py-2 text-sm font-medium">
            Invia una entry
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Geografie', 'Traccia relazioni tra territori mediterranei e pratiche visuali emergenti.'],
          ['Tassonomie', 'Classificazione editoriale governata, multilingue e orientata alla ricerca.'],
          ['Workflow', 'Dalla bozza alla pubblicazione con revisione critica e audit trail.']
        ].map(([title, text]) => (
          <article key={title} className="atlas-card">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-neutral-700">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
