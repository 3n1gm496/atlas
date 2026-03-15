'use client';

export function ExportPanel() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <a href="/api/export/entries?format=json" className="atlas-card block text-sm">
        <p className="font-semibold">Export entries JSON</p>
        <p className="mt-2 text-neutral-700">Scarica il corpus in formato JSON per analisi o backup.</p>
      </a>
      <a href="/api/export/entries?format=csv" className="atlas-card block text-sm">
        <p className="font-semibold">Export entries CSV</p>
        <p className="mt-2 text-neutral-700">Versione tabellare rapida per QA, fogli di lavoro e data cleaning.</p>
      </a>
      <a href="/api/export/taxonomy" className="atlas-card block text-sm md:col-span-2">
        <p className="font-semibold">Export tassonomie</p>
        <p className="mt-2 text-neutral-700">Scarica gruppi e termini tassonomici in JSON strutturato.</p>
      </a>
    </div>
  );
}
