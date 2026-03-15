import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="space-y-6">
      <h1 className="text-4xl font-bold">ATLAS</h1>
      <p className="max-w-3xl">Cartografia dinamica delle scritture digitali della moda: archivio partecipativo, osservatorio critico e spazio curatoriale multilingue.</p>
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/map" className="rounded border p-4">Esplora mappa</Link>
        <Link href="/archive" className="rounded border p-4">Esplora archivio</Link>
        <Link href="/submit/new" className="rounded border p-4">Contribuisci</Link>
      </div>
    </section>
  );
}
