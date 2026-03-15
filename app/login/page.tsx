export default function LoginPage() {
  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Login</h1>
      <form className="atlas-card grid gap-3 max-w-xl">
        <input type="email" placeholder="Email" className="rounded border border-atlas-muted px-3 py-2" />
        <input type="password" placeholder="Password" className="rounded border border-atlas-muted px-3 py-2" />
        <button type="button" className="rounded-full bg-neutral-900 px-4 py-2 text-white">Accedi</button>
      </form>
      <p className="text-xs text-neutral-600">Demo UI pronta; integrazione Auth.js prevista dal piano production-readiness.</p>
    </section>
  );
}
