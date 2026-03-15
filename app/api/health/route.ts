export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getEnv } from '@/lib/env';
import { checkDatabaseConnection } from '@/lib/health';

export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    const env = getEnv();
    const db = await checkDatabaseConnection();

    if (!db.ok) {
      return NextResponse.json(
        {
          status: 'degraded',
          environment: env.NODE_ENV,
          appUrl: env.NEXT_PUBLIC_APP_URL,
          checks: {
            env: 'ok',
            database: 'down'
          },
          reason: db.reason,
          timestamp
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      environment: env.NODE_ENV,
      appUrl: env.NEXT_PUBLIC_APP_URL,
      checks: {
        env: 'ok',
        database: 'ok'
      },
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
        reason: error instanceof Error ? error.message : 'unknown health error',
        timestamp
      },
      { status: 503 }
    );
  }
}
