export default function ContactPage() {
  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Contatti</h1>
      <p className="text-sm text-neutral-700">Per richieste editoriali e collaborazioni: <a className="underline" href="mailto:atlas@incursivefashionheritage.com">atlas@incursivefashionheritage.com</a></p>
      <form className="atlas-card grid gap-3 md:grid-cols-2" action="mailto:atlas@incursivefashionheritage.com" method="post" encType="text/plain">
        <input name="name" required placeholder="Nome" className="rounded border border-atlas-muted px-3 py-2" />
        <input name="email" type="email" required placeholder="Email" className="rounded border border-atlas-muted px-3 py-2" />
        <textarea name="message" required placeholder="Messaggio" rows={5} className="md:col-span-2 rounded border border-atlas-muted px-3 py-2" />
        <button className="w-fit rounded-full bg-neutral-900 px-4 py-2 text-white">Invia</button>
      </form>
    </section>
  );
}
