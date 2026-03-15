export default function PrivacyPage() {
  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-4">
        <p className="atlas-kicker">Data care</p>
        <h1 className="atlas-title">Privacy</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Dati raccolti', 'ATLAS tratta dati minimi necessari a contributi, revisione editoriale, autenticazione e sicurezza della piattaforma.'],
          ['Dati pubblici', 'I dataset pubblici non includono informazioni sensibili degli utenti e privilegiano contenuti editoriali e metadati culturali.'],
          ['Diritti e richieste', 'Per richieste GDPR o chiarimenti sul trattamento dei dati puoi contattare atlas@incursivefashionheritage.com.']
        ].map(([title, body]) => (
          <article key={title} className="atlas-card text-sm text-neutral-700">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2">{body}</p>
          </article>
        ))}
      </div>
      <div className="atlas-card text-sm text-neutral-700">
        La logica del progetto privilegia tracciabilita editoriale e minimizzazione del dato personale, in modo da mantenere il focus sul corpus culturale e non sugli utenti come oggetto di profilazione.
      </div>
    </section>
  );
}
