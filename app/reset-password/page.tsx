export default function ResetPasswordPage() {
  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-4">
        <p className="atlas-kicker">Password reset</p>
        <h1 className="atlas-title">Imposta nuova password</h1>
      </div>
      <form className="atlas-card grid gap-3 max-w-xl">
        <input type="password" placeholder="Nuova password" className="rounded-2xl border border-atlas-muted px-4 py-3" />
        <input type="password" placeholder="Conferma password" className="rounded-2xl border border-atlas-muted px-4 py-3" />
        <button type="button" className="atlas-link-primary">Aggiorna password</button>
      </form>
    </section>
  );
}
