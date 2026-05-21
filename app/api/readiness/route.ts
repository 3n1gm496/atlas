export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getRuntimeReadiness } from '@/lib/env';
import { checkDatasetReadiness, checkDatabaseConnection } from '@/lib/health';

export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    const runtime = getRuntimeReadiness();
    const db = await checkDatabaseConnection();
    const dataset = checkDatasetReadiness();

    if (!runtime.ok || !db.ok || !dataset.ok) {
      return NextResponse.json(
        {
          status: 'degraded',
          environment: runtime.env.NODE_ENV,
          appMode: runtime.env.APP_MODE ?? null,
          appUrl: runtime.env.NEXT_PUBLIC_APP_URL,
          checks: {
            env: runtime.ok ? 'ok' : 'down',
            database: db.ok ? 'ok' : 'down',
            dataset: dataset.ok ? 'ok' : 'down'
          },
          issues: [
            ...runtime.issues,
            ...(db.ok ? [] : [db.reason ?? 'database unavailable']),
            ...(dataset.ok ? [] : [dataset.reason ?? 'dataset unavailable'])
          ],
          dataset: dataset.report ?? null,
          timestamp
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      environment: runtime.env.NODE_ENV,
      appMode: runtime.env.APP_MODE ?? null,
      appUrl: runtime.env.NEXT_PUBLIC_APP_URL,
      checks: {
        env: 'ok',
        database: 'ok',
        dataset: 'ok'
      },
      dataset: dataset.report ?? null,
      timestamp
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'degraded',
        checks: {
          env: 'down',
          database: 'unknown'
        },
        issues: [error instanceof Error ? error.message : 'unknown readiness error'],
        timestamp
      },
      { status: 503 }
    );
  }
}
