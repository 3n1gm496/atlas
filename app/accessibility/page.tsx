export default function AccessibilityPage() {
  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-4">
        <p className="atlas-kicker">Inclusive access</p>
        <h1 className="atlas-title">Accessibilità</h1>
        <p className="text-sm text-neutral-700">
          ATLAS considera accessibilita e leggibilita come componenti strutturali del progetto, non come aggiunte finali.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="atlas-card text-sm text-neutral-700">
          <h2 className="text-lg font-semibold">Baseline attive</h2>
          <p className="mt-2">Interfacce responsive, navigazione da tastiera, gerarchie semantiche e contrasto leggibile fanno parte della baseline del progetto.</p>
        </article>
        <article className="atlas-card text-sm text-neutral-700">
          <h2 className="text-lg font-semibold">Lavoro in corso</h2>
          <p className="mt-2">Stiamo incrementando audit WCAG su mappe, form avanzati, focus states e dashboard ad alta densita informativa.</p>
        </article>
      </div>
      <div className="atlas-card text-sm text-neutral-700">
        Se incontri un problema di accessibilita, puoi segnalarlo al team editoriale e tecnico tramite la pagina contatti.
      </div>
    </section>
  );
}
