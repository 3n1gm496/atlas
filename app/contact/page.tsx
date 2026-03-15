export default function ContactPage() {
  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-4">
        <p className="atlas-kicker">Reach out</p>
        <h1 className="atlas-title">Contatti</h1>
        <p className="text-sm text-neutral-700">
          Per richieste editoriali, partnership, accesso ai dataset o collaborazioni di ricerca scrivi a{' '}
          <a className="underline" href="mailto:atlas@incursivefashionheritage.com">atlas@incursivefashionheritage.com</a>.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="atlas-card space-y-3 text-sm text-neutral-700">
          <p><strong>Email editoriale</strong><br />atlas@incursivefashionheritage.com</p>
          <p><strong>Ambiti</strong><br />Curatela, revisione, dataset, ricerca, partnership culturali.</p>
          <p><strong>Tempi di risposta</strong><br />Indicativamente 3-5 giorni lavorativi.</p>
        </section>
        <form className="atlas-card grid gap-3 md:grid-cols-2" action="mailto:atlas@incursivefashionheritage.com" method="post" encType="text/plain">
          <input name="name" required placeholder="Nome" className="rounded-2xl border border-atlas-muted px-4 py-3" />
          <input name="email" type="email" required placeholder="Email" className="rounded-2xl border border-atlas-muted px-4 py-3" />
          <input name="subject" placeholder="Oggetto" className="md:col-span-2 rounded-2xl border border-atlas-muted px-4 py-3" />
          <textarea name="message" required placeholder="Messaggio" rows={6} className="md:col-span-2 rounded-2xl border border-atlas-muted px-4 py-3" />
          <button className="w-fit atlas-link-primary">Invia</button>
        </form>
      </div>
    </section>
  );
}
