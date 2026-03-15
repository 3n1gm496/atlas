export default function MethodologyPage() {
  return (
    <section className="space-y-6">
      <div className="atlas-card atlas-hero space-y-4">
        <p className="atlas-kicker">Research protocol</p>
        <h1 className="atlas-title">Metodologia</h1>
        <p className="max-w-3xl text-sm text-neutral-700">
          La metodologia di ATLAS combina raccolta strutturata, classificazione tassonomica e revisione editoriale per trasformare osservazioni sparse in un corpus leggibile e comparabile.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ['1. Raccolta', 'Il form multimetadato guida l acquisizione di geografie, formati, fonti, tempi e contesti culturali.'],
          ['2. Classificazione', 'Ogni entry viene collocata dentro gruppi tassonomici che ne rendono visibili famiglie concettuali e relazioni.'],
          ['3. Revisione', 'Il workflow editoriale gestisce bozze, review, richieste di modifica, approvazione e pubblicazione.'],
          ['4. Consultazione', 'I dati vengono restituiti attraverso mappa, archivio, ricerca e collezioni curate.']
        ].map(([title, body]) => (
          <article key={title} className="atlas-card">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-neutral-700">{body}</p>
          </article>
        ))}
      </div>
      <div className="atlas-card text-sm text-neutral-700">
        Il metodo e pensato per reggere sia l uso accademico sia quello curatoriale: le entry non sono soltanto schede descrittive, ma nodi di un atlante critico che puo essere interrogato da prospettive diverse.
      </div>
    </section>
  );
}
