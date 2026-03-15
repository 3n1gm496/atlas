export default function AboutPage() {
  return (
    <section className="space-y-6">
      <div className="atlas-card atlas-hero space-y-4">
        <p className="atlas-kicker">Manifesto</p>
        <h1 className="atlas-title">Manifesto ATLAS</h1>
        <p className="max-w-3xl text-sm text-neutral-700 sm:text-base">
          ATLAS e una cartografia critica e partecipativa delle scritture digitali della moda nel Mediterraneo, con focus su memoria,
          identita, diaspora e pratiche visuali emergenti.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Unita archivistica', 'La nostra unita di lavoro e l entry culturale, non il singolo account o la piattaforma isolata.'],
          ['Metodo editoriale', 'Tassonomie controllate, dati strutturati e revisione umana permettono una ricerca affidabile e riusabile.'],
          ['Missione pubblica', 'ATLAS vuole produrre un archivio aperto, tracciabile, multilingue e utile a ricerca, didattica e curatela.']
        ].map(([title, body]) => (
          <article key={title} className="atlas-card">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-neutral-700">{body}</p>
          </article>
        ))}
      </div>

      <div className="atlas-card space-y-3 text-sm text-neutral-700">
        <p>ATLAS osserva la moda come linguaggio culturale e infrastruttura narrativa: immagini, testi, hashtag, pratiche artigianali e comunitarie vengono letti come tracce di trasformazioni sociali e geografiche.</p>
        <p>Il progetto mette in dialogo contributori, editor, ricercatori e amministratori in un workflow unico, pensato per non perdere il rigore del dato mentre si costruisce una piattaforma accogliente e navigabile.</p>
      </div>
    </section>
  );
}
