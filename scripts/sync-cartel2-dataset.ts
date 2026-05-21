import { execFileSync } from 'node:child_process';
import { readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  buildCartel2SyncReport,
  inferMediaKind,
  inferMediaKeyFromFileName,
  normalizeSheetValue,
  normalizeSheetKey,
  type Cartel2MediaAsset,
  type Cartel2SnapshotRow,
  type Cartel2SheetRow,
  CARTEL2_COLUMNS,
  CARTEL2_SHEET_NAME
} from '@/lib/dataset/cartel2-sync';

const repoRoot = resolve(process.cwd());
const workbookPath = resolve(repoRoot, 'data/Cartel2.xlsx');
const mediaDir = resolve(repoRoot, 'public/dataset/media');
const datasetPath = resolve(repoRoot, 'data/cartel2.dataset.json');
const reportPath = resolve(repoRoot, 'data/cartel2.sync-report.json');

function decodeXml(value: string) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&#10;/g, '\n')
    .replace(/&#13;/g, '\r');
}

function extractSharedStrings(xml: string) {
  return [...xml.matchAll(/<si\b[\s\S]*?<\/si>/g)].map((match) => {
    const text = [...match[0].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((group) => decodeXml(group[1])).join('');
    return text;
  });
}

function parseCellValue(cellXml: string, sharedStrings: string[]) {
  const typeMatch = cellXml.match(/\bt="([^"]+)"/);
  const type = typeMatch?.[1] ?? 'n';
  const valueMatch = cellXml.match(/<v>([\s\S]*?)<\/v>/);

  if (type === 's') {
    const index = Number(valueMatch?.[1] ?? '0');
    return sharedStrings[index] ?? '';
  }

  if (type === 'inlineStr') {
    const text = [...cellXml.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((group) => decodeXml(group[1])).join('');
    return text;
  }

  if (!valueMatch) return '';
  return decodeXml(valueMatch[1]);
}

function parseSheetRows(xml: string, sharedStrings: string[]) {
  const rows: Cartel2SnapshotRow[] = [];

  for (const rowMatch of xml.matchAll(/<row\b[^>]*r="(\d+)"[\s\S]*?<\/row>/g)) {
    const rowNumber = Number(rowMatch[1]);
    if (rowNumber < 5) continue;

    const sheetRow = {} as Cartel2SheetRow;
    for (const column of CARTEL2_COLUMNS) {
      sheetRow[column] = '';
    }

    for (const cellMatch of rowMatch[0].matchAll(/<c\b[^>]*r="([A-Z]+)(\d+)"[^>]*>([\s\S]*?)<\/c>|<c\b[^>]*r="([A-Z]+)(\d+)"[^>]*/g)) {
      const column = (cellMatch[1] ?? cellMatch[4]) as keyof Cartel2SheetRow | undefined;
      if (!column || !CARTEL2_COLUMNS.includes(column as (typeof CARTEL2_COLUMNS)[number])) continue;
      const cellXml = cellMatch[0];
      const value = parseCellValue(cellXml, sharedStrings);
      sheetRow[column as keyof Cartel2SheetRow] = normalizeSheetValue(value);
    }

    if (!Object.values(sheetRow).some(Boolean)) continue;

    rows.push({
      ...sheetRow,
      rowNumber,
      sheetName: CARTEL2_SHEET_NAME,
      canonicalKey: '',
      canonicalKeySource: 'H',
      legacyKey: '',
      source: {
        workbookFile: 'data/Cartel2.xlsx',
        driveArchive: 'public/dataset/media',
        sheetUrl: 'sheet1',
        driveUrl: 'public/dataset/media',
        origin: 'google'
      },
      media: {
        canonicalKey: '',
        legacyKey: '',
        matchedBy: 'none',
        status: 'missing',
        assetCount: 0,
        assets: [],
        unmatchedAssetNames: []
      },
      mediaUrls: []
    });
  }

  return rows;
}

function listArchiveAssets() {
  return readdirSync(mediaDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => !name.toLowerCase().includes('zone.identifier'))
    .sort((left, right) => left.localeCompare(right))
    .map((name) => {
      const sourceName = name;
      const fileName = name;
      const normalizedKey = inferMediaKeyFromFileName(name);
      const kind = inferMediaKind(name);
      return {
        sourceName,
        fileName,
        kind,
        url: `/dataset/media/${fileName}`,
        altText: '',
        normalizedKey
      } satisfies Cartel2MediaAsset;
    });
}

function applyMediaMatches(rows: Cartel2SnapshotRow[], assets: Cartel2MediaAsset[]) {
  const usedAssets = new Set<string>();

  for (const row of rows) {
    const canonicalSource = row.H ? row.H : row.A;
    const legacySource = row.A;
    const canonicalLookupKey = inferMediaKeyFromFileName(canonicalSource);
    const legacyLookupKey = inferMediaKeyFromFileName(legacySource);
    const canonicalAssetCandidates = assets.filter((asset) => asset.normalizedKey === canonicalLookupKey);
    const legacyAssetCandidates =
      canonicalLookupKey === legacyLookupKey
        ? canonicalAssetCandidates
        : assets.filter((asset) => asset.normalizedKey === legacyLookupKey);
    const matchedAssets = canonicalAssetCandidates.length > 0 ? canonicalAssetCandidates : legacyAssetCandidates;
    const matchedBy = canonicalAssetCandidates.length > 0 ? 'canonical' : legacyAssetCandidates.length > 0 ? 'legacy' : 'none';

    matchedAssets.forEach((asset) => usedAssets.add(asset.fileName));

    row.canonicalKey = normalizeSheetKey(canonicalSource);
    row.canonicalKeySource = row.H ? 'H' : 'A';
    row.legacyKey = normalizeSheetKey(legacySource);
    row.media = {
      canonicalKey: row.canonicalKey,
      legacyKey: row.legacyKey,
      matchedBy,
      status: matchedAssets.length > 0 ? 'matched' : 'missing',
      assetCount: matchedAssets.length,
      assets: matchedAssets.map((asset, index) => ({
        ...asset,
        altText: `${row.B || row.A} · ${row.A} · asset ${index + 1}`
      })),
      unmatchedAssetNames: []
    };
    row.mediaUrls = row.media.assets.map((asset) => asset.url);
  }

  const orphanAssets = assets.filter((asset) => !usedAssets.has(asset.fileName));
  for (const row of rows) {
    row.media.unmatchedAssetNames = orphanAssets.map((asset) => asset.fileName);
  }

  return { rows, orphanAssets };
}

function main() {
  const sharedStringsXml = extractPart('xl/sharedStrings.xml');
  const sheetXml = extractPart('xl/worksheets/sheet1.xml');
  const sharedStrings = extractSharedStrings(sharedStringsXml);
  const rows = parseSheetRows(sheetXml, sharedStrings);
  const assets = listArchiveAssets();
  const { rows: matchedRows } = applyMediaMatches(rows, assets);
  const report = buildCartel2SyncReport(matchedRows, assets);

  writeFileSync(datasetPath, `${JSON.stringify(matchedRows, null, 2)}\n`);
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(`Wrote ${matchedRows.length} rows to ${datasetPath}`);
  console.log(`Wrote sync report to ${reportPath}`);
}

function extractPart(part: string) {
  const output = execFileSync('unzip', ['-p', workbookPath, part], { encoding: 'utf8' });
  return output;
}

main();
