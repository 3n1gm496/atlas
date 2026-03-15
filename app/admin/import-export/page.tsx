import { prisma } from '@/lib/prisma';
import { demoEntries } from '@/lib/demo-content';
import { ExportPanel } from '@/components/admin/export-panel';

export const dynamic = 'force-dynamic';

export default async function AdminImportExportPage() {
  const entries = await prisma.entry.count().catch(() => demoEntries.length);
  const terms = await prisma.taxonomyTerm.count().catch(() => 0);

  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Data portability</p>
        <h1 className="atlas-title">Import / Export</h1>
      </div>
      <div className="atlas-card text-sm space-y-2">
        <p>Record esportabili (entries): {entries}</p>
        <p>Termini esportabili (tassonomie): {terms}</p>
        <p>Endpoint disponibili: <code>/api/entries</code>, <code>/api/taxonomy/groups</code>.</p>
        <p>Usa questa schermata come checkpoint operativo prima di migrazioni bulk, sincronizzazioni o backup curatoriali.</p>
      </div>
      <ExportPanel />
    </section>
  );
}
