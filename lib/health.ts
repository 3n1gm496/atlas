import { prisma } from '@/lib/prisma';

export async function checkDatabaseConnection(): Promise<{ ok: boolean; reason?: string }> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true };
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, reason: error.message };
    }
    return { ok: false, reason: 'unknown database error' };
  }
}
