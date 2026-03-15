export default function ForgotPasswordPage() {
  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Recupero password</h1>
      <form className="atlas-card grid gap-3 max-w-xl">
        <input type="email" placeholder="Email account" className="rounded border border-atlas-muted px-3 py-2" />
        <button type="button" className="rounded-full bg-neutral-900 px-4 py-2 text-white">Invia link reset</button>
      </form>
    </section>
  );
}
