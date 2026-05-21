import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth/request-user';
import { AtlasApiError, apiSuccess, handleApiError } from '@/lib/http/api';
import { CARTEL2_COLUMNS, normalizeSheetValue } from '@/lib/dataset/cartel2-sync';

export const dynamic = 'force-dynamic';

type ExportEntry = Prisma.EntryGetPayload<{
  include: {
    country: true;
    contributor: true;
    assignments: { include: { term: true } };
    keywords: true;
    hashtags: true;
    mediaAssets: true;
    sourceLinks: true;
    bibliographyItems: true;
  };
}>;

function toCsv(rows: Record<string, string | number | boolean | null>[]) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (value: string | number | boolean | null) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  return [headers.join(','), ...rows.map((row) => headers.map((header) => escape(row[header] ?? '')).join(','))].join('\n');
}

function getSheetMetadata(metadata: unknown) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null;
  const sheet = (metadata as Record<string, unknown>).sheet1;
  if (!sheet || typeof sheet !== 'object' || Array.isArray(sheet)) return null;
  return sheet as Record<string, unknown>;
}

function buildExportRow(entry: ExportEntry) {
  const sheet = getSheetMetadata(entry.metadata);
  const row = sheet
    ? Object.fromEntries(CARTEL2_COLUMNS.map((column) => [column, normalizeSheetValue(String(sheet[column] ?? ''))]))
    : {};
  const rowNumber = sheet?.rowNumber ? Number(sheet.rowNumber) : null;
  const media = sheet?.media && typeof sheet.media === 'object' && !Array.isArray(sheet.media) ? (sheet.media as Record<string, unknown>) : null;

  return {
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    abstract: entry.abstract,
    description: entry.description,
    status: entry.status,
    featured: entry.featured,
    country: entry.country.name,
    contributor: entry.contributor.displayName,
    canonicalLanguage: entry.canonicalLanguage,
    sheetName: sheet?.sheetName ? String(sheet.sheetName) : 'sheet1',
    sheetRowNumber: rowNumber,
    sheetKey: sheet?.canonicalKey ? String(sheet.canonicalKey) : '',
    sheetCanonicalKeySource: sheet?.canonicalKeySource ? String(sheet.canonicalKeySource) : '',
    mediaMatchStatus: media?.status ? String(media.status) : '',
    mediaMatchedBy: media?.matchedBy ? String(media.matchedBy) : '',
    mediaAssetCount: entry.mediaAssets.length,
    mediaUrls: entry.mediaAssets.map((asset) => asset.url).join(' | '),
    sourceLinks: entry.sourceLinks.map((link) => `${link.label} ${link.url}`).join(' | '),
    bibliography: entry.bibliographyItems.map((item) => item.citation).join(' | '),
    taxonomyTerms: entry.assignments.map((assignment) => assignment.term.labelIt).join(' | '),
    keywords: entry.keywords.map((keyword) => keyword.value).join(' | '),
    hashtags: entry.hashtags.map((hashtag) => hashtag.value).join(' | '),
    updatedAt: entry.updatedAt.toISOString(),
    ...row
  };
}

export async function GET(req: NextRequest) {
  try {
    const user = await getRequestUser();
    if (!user || !['research_admin', 'super_admin'].includes(user.role.name)) {
      throw new AtlasApiError(403, 'forbidden', 'Administrative export permissions required');
    }

    const format = req.nextUrl.searchParams.get('format') ?? 'json';
    const entries = await prisma.entry.findMany({
      include: {
        country: true,
        contributor: true,
        assignments: { include: { term: true } },
        keywords: true,
        hashtags: true,
        mediaAssets: true,
        sourceLinks: true,
        bibliographyItems: true
      },
      orderBy: { updatedAt: 'desc' },
      take: 250
    });

    const rows = entries.map(buildExportRow);

    if (format === 'csv') {
      return new NextResponse(toCsv(rows), {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="atlas-entries.csv"'
        }
      });
    }

    return apiSuccess({ items: rows, total: rows.length });
  } catch (error) {
    return handleApiError(error);
  }
}
