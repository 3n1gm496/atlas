import { prisma } from '@/lib/prisma';
import { demoAuditLogs } from '@/lib/demo-content';

export const dynamic = 'force-dynamic';

export default async function AdminAuditPage() {
  const logs: Awaited<ReturnType<typeof prisma.auditLog.findMany>> = await prisma.auditLog
    .findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
    .catch(() =>
      demoAuditLogs.map((log) => ({
        id: log.id,
        action: log.action,
        payload: { summary: log.payloadSummary, actorName: log.actorName },
        actorId: log.actorName,
        createdAt: new Date(log.createdAt)
      })) as Awaited<ReturnType<typeof prisma.auditLog.findMany>>
    );

  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Traceability</p>
        <h1 className="atlas-title">Audit log</h1>
      </div>
      {logs.map((l) => (
        <div key={l.id} className="atlas-card text-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <strong>{l.action}</strong>
            <span className="text-neutral-500">{l.createdAt.toISOString()}</span>
          </div>
          {l.payload ? <p className="mt-2 text-neutral-700">{JSON.stringify(l.payload)}</p> : null}
        </div>
      ))}
      {logs.length === 0 ? <div className="atlas-empty">Nessun audit log disponibile.</div> : null}
    </section>
  );
}
