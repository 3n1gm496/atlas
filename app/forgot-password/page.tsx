export default function ForgotPasswordPage() {
  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-4">
        <p className="atlas-kicker">Account recovery</p>
        <h1 className="atlas-title">Recupero password</h1>
        <p className="text-sm text-neutral-700">Inserisci l email associata al profilo per ricevere un link di reset.</p>
      </div>
      <form className="atlas-card grid gap-3 max-w-xl">
        <input type="email" placeholder="Email account" className="rounded-2xl border border-atlas-muted px-4 py-3" />
        <button type="button" className="atlas-link-primary">Invia link reset</button>
      </form>
    </section>
  );
}
