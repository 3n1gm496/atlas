import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminImportExportPage() {
  const entries = await prisma.entry.count().catch(() => 0);
  const terms = await prisma.taxonomyTerm.count().catch(() => 0);

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Import / Export</h1>
      <div className="atlas-card text-sm space-y-1">
        <p>Record esportabili (entries): {entries}</p>
        <p>Termini esportabili (tassonomie): {terms}</p>
        <p>Endpoint disponibili: <code>/api/entries</code>, <code>/api/taxonomy/groups</code>.</p>
      </div>
    </section>
  );
}
