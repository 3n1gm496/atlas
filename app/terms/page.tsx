export default function TermsPage() {
  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-4">
        <p className="atlas-kicker">Editorial framework</p>
        <h1 className="atlas-title">Termini di utilizzo</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Contributi', 'I contenuti inviati devono rispettare finalita di ricerca, correttezza delle fonti, diritti d autore e accuratezza contestuale.'],
          ['Moderazione', 'La redazione puo richiedere revisioni, rifiutare o archiviare materiali non coerenti con il mandato scientifico ed editoriale del progetto.'],
          ['Riutilizzo', 'L uso dei dati pubblici e dei materiali editoriali deve citare il progetto ATLAS e preservarne il contesto.']
        ].map(([title, body]) => (
          <article key={title} className="atlas-card text-sm text-neutral-700">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
