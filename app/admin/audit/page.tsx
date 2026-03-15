import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminAuditPage() {
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }).catch(() => []);

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">Audit log</h1>
      {logs.map((l) => <div key={l.id} className="atlas-card text-sm">{l.action} · {l.createdAt.toISOString()}</div>)}
      {logs.length === 0 ? <div className="atlas-card text-sm text-neutral-600">Nessun audit log disponibile.</div> : null}
    </section>
  );
}
