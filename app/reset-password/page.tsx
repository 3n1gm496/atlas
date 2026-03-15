export default function ResetPasswordPage() {
  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Imposta nuova password</h1>
      <form className="atlas-card grid gap-3 max-w-xl">
        <input type="password" placeholder="Nuova password" className="rounded border border-atlas-muted px-3 py-2" />
        <input type="password" placeholder="Conferma password" className="rounded border border-atlas-muted px-3 py-2" />
        <button type="button" className="rounded-full bg-neutral-900 px-4 py-2 text-white">Aggiorna password</button>
      </form>
    </section>
  );
}
