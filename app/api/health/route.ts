export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getEnv } from '@/lib/env';

export async function GET() {
  const env = getEnv();
  return NextResponse.json({
    status: 'ok',
    appUrl: env.NEXT_PUBLIC_APP_URL,
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
}
