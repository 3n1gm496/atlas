export default function RegisterPage() {
  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Registrazione contributore</h1>
      <form className="atlas-card grid gap-3 max-w-xl">
        <input placeholder="Nome visualizzato" className="rounded border border-atlas-muted px-3 py-2" />
        <input type="email" placeholder="Email" className="rounded border border-atlas-muted px-3 py-2" />
        <input type="password" placeholder="Password" className="rounded border border-atlas-muted px-3 py-2" />
        <button type="button" className="rounded-full bg-neutral-900 px-4 py-2 text-white">Crea account</button>
      </form>
    </section>
  );
}
