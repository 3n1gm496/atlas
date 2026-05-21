import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
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

export function checkDatasetReadiness(): { ok: boolean; reason?: string; report?: { rowsTotal: number; rowsRenderableWithEditorialFallback: number; editorialFallbackCoverage: number; rowsWithCanonicalCollision: number; orphanAssets: number } } {
  try {
    const file = readFileSync(resolve(process.cwd(), 'data/cartel2.sync-report.json'), 'utf8');
    const report = JSON.parse(file) as {
      rowsTotal?: number;
      rowsRenderableWithEditorialFallback?: number;
      editorialFallbackCoverage?: number;
      rowsWithCanonicalCollision?: number;
      orphanAssets?: number;
    };

    const rowsTotal = report.rowsTotal ?? 0;
    const rowsRenderableWithEditorialFallback = report.rowsRenderableWithEditorialFallback ?? 0;
    const editorialFallbackCoverage = report.editorialFallbackCoverage ?? 0;
    const rowsWithCanonicalCollision = report.rowsWithCanonicalCollision ?? 0;
    const orphanAssets = report.orphanAssets ?? 0;

    if (rowsTotal === 0) {
      return { ok: false, reason: 'dataset report is empty' };
    }

    if (rowsRenderableWithEditorialFallback !== rowsTotal) {
      return {
        ok: false,
        reason: 'not all workbook rows are renderable with editorial fallback',
        report: { rowsTotal, rowsRenderableWithEditorialFallback, editorialFallbackCoverage, rowsWithCanonicalCollision, orphanAssets }
      };
    }

    if (rowsWithCanonicalCollision > 0) {
      return {
        ok: false,
        reason: 'canonical collisions detected in workbook data',
        report: { rowsTotal, rowsRenderableWithEditorialFallback, editorialFallbackCoverage, rowsWithCanonicalCollision, orphanAssets }
      };
    }

    if (orphanAssets > 0) {
      return {
        ok: false,
        reason: 'orphan media assets detected',
        report: { rowsTotal, rowsRenderableWithEditorialFallback, editorialFallbackCoverage, rowsWithCanonicalCollision, orphanAssets }
      };
    }

    return {
      ok: true,
      report: { rowsTotal, rowsRenderableWithEditorialFallback, editorialFallbackCoverage, rowsWithCanonicalCollision, orphanAssets }
    };
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : 'unknown dataset readiness error'
    };
  }
}
