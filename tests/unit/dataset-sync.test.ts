import { describe, expect, it } from 'vitest';
import syncReport from '../../data/cartel2.sync-report.json';
import { checkDatasetReadiness } from '../../lib/health';
import { getDatasetSyncOverview } from '../../lib/services/workspaces';

describe('cartel2 dataset sync', () => {
  it('exposes the editorial fallback contract in the generated sync report', () => {
    expect(syncReport.rowsTotal).toBe(18);
    expect(syncReport.rowsRenderableWithEditorialFallback).toBe(syncReport.rowsTotal);
    expect(syncReport.rowsWithoutEditorialFallback).toBe(0);
    expect(syncReport.editorialFallbackCoverage).toBe(100);
    expect(syncReport.editorialFallbackMissingRowNumbers).toEqual([]);
  });

  it('reports readiness from the generated sync snapshot', () => {
    const readiness = checkDatasetReadiness();

    expect(readiness.ok).toBe(true);
    expect(readiness.report).toEqual({
      rowsTotal: syncReport.rowsTotal,
      rowsRenderableWithEditorialFallback: syncReport.rowsRenderableWithEditorialFallback,
      editorialFallbackCoverage: syncReport.editorialFallbackCoverage,
      rowsWithCanonicalCollision: 0,
      orphanAssets: 0
    });
  });

  it('loads the same dataset sync overview used by admin surfaces', () => {
    const overview = getDatasetSyncOverview();

    expect(overview.rowsTotal).toBe(syncReport.rowsTotal);
    expect(overview.rowsRenderableWithEditorialFallback).toBe(syncReport.rowsRenderableWithEditorialFallback);
    expect(overview.editorialFallbackCoverage).toBe(syncReport.editorialFallbackCoverage);
    expect(overview.editorialFallbackMissingRowNumbers).toEqual([]);
  });
});
