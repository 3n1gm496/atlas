export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getEnv } from '@/lib/env';

export async function GET() {
  const timestamp = new Date().toISOString();
  const env = getEnv();

  return NextResponse.json({
    status: 'ok',
    environment: env.NODE_ENV,
    appUrl: env.NEXT_PUBLIC_APP_URL,
    checks: {
      process: 'ok'
    },
    timestamp
  });
}
