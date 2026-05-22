export const CARTEL2_SHEET_NAME = 'sheet1' as const;

export const CARTEL2_COLUMNS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S'
] as const;

export type Cartel2Column = (typeof CARTEL2_COLUMNS)[number];
export const CARTEL2_CORE_COLUMNS = ['A', 'B', 'E', 'H'] as const;

export type Cartel2SheetRow = Record<Cartel2Column, string>;

export type Cartel2SheetField = {
  column: Cartel2Column;
  label: string;
  description: string;
};

export type Cartel2MediaAsset = {
  sourceName: string;
  fileName: string;
  kind: 'image' | 'video' | 'audio' | 'file';
  url: string;
  altText: string;
  normalizedKey: string;
};

export type Cartel2MediaMatch = {
  canonicalKey: string;
  legacyKey: string;
  matchedBy: 'canonical' | 'legacy' | 'alias' | 'none';
  status: 'matched' | 'partial' | 'missing' | 'orphan';
  assetCount: number;
  assets: Cartel2MediaAsset[];
  unmatchedAssetNames: string[];
};

export type Cartel2SnapshotRow = Cartel2SheetRow & {
  rowNumber: number;
  sheetName: typeof CARTEL2_SHEET_NAME;
  canonicalKey: string;
  canonicalKeySource: 'H' | 'A';
  legacyKey: string;
  source: {
    workbookFile: string;
    driveArchive: string;
    sheetUrl: string;
    driveUrl: string;
    origin: 'google';
  };
  media: Cartel2MediaMatch;
  mediaUrls: string[];
};

export type Cartel2SyncReport = {
  rowsTotal: number;
  rowsWithMedia: number;
  rowsWithoutMedia: number;
  rowsWithCoreMetadata: number;
  rowsWithoutCoreMetadata: number;
  coreMetadataCoverage: number;
  coreMetadataColumns: readonly Cartel2Column[];
  coreMetadataMissingRowNumbers: number[];
  rowsRenderableWithEditorialFallback: number;
  rowsWithoutEditorialFallback: number;
  editorialFallbackCoverage: number;
  editorialFallbackMissingRowNumbers: number[];
  rowsWithCanonicalCollision: number;
  canonicalCollisionGroups: { key: string; rowNumbers: number[] }[];
  assetsTotal: number;
  matchedAssets: number;
  orphanAssets: number;
  orphanAssetNames: string[];
};

export const CARTEL2_SHEET_FIELDS: Cartel2SheetField[] = [
  { column: 'A', label: 'Workbook ID', description: 'Row identifier used across the imported dataset.' },
  { column: 'B', label: 'Title', description: 'Short label for the card and public surfaces.' },
  { column: 'C', label: 'Editorial frame', description: 'Primary editorial framing or blend of framings.' },
  { column: 'D', label: 'Chronology', description: 'Time window recorded in the sheet.' },
  { column: 'E', label: 'Country / geography', description: 'Country or country cluster.' },
  { column: 'F', label: 'Image temporality', description: 'Temporal framing for the image layer.' },
  { column: 'G', label: 'Macro category', description: 'Top-level content family.' },
  { column: 'H', label: 'Sheet key / thematic block', description: 'Canonical sheet key used to track row provenance.' },
  { column: 'I', label: 'Long note', description: 'Extended descriptive note from the sheet.' },
  { column: 'J', label: 'Interpretive note', description: 'Long-form interpretation or research note.' },
  { column: 'K', label: 'Ideological position', description: 'Editorial stance or ideological framing.' },
  { column: 'L', label: 'Narrative type', description: 'Narrative type or discursive mode.' },
  { column: 'M', label: 'Semiotics / references', description: 'Semiotic references and recurring symbols.' },
  { column: 'N', label: 'Graphic style', description: 'Graphic or editing style.' },
  { column: 'O', label: 'Format', description: 'Publication format or support.' },
  { column: 'P', label: 'Tone', description: 'Editorial tone tags.' },
  { column: 'Q', label: 'Audio', description: 'Audio or soundtrack references.' },
  { column: 'R', label: 'Engagement', description: 'Engagement target or interaction goal.' },
  { column: 'S', label: 'Source network', description: 'Source accounts or network references.' }
];

const SHEET_FIELD_BY_COLUMN = new Map<Cartel2Column, Cartel2SheetField>(
  CARTEL2_SHEET_FIELDS.map((field) => [field.column, field])
);

export function normalizeSheetKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeSheetValue(value: string | undefined | null) {
  return (value ?? '').replace(/\r\n/g, '\n').trim();
}

export function splitSheetValues(value: string | undefined | null) {
  return [...new Set(normalizeSheetValue(value)
    .split(/[;\n]/g)
    .map((part) => part.replace(/\s+/g, ' ').trim())
    .filter(Boolean))];
}

export function toSheetColumns(record: Record<string, string>) {
  const next = {} as Cartel2SheetRow;
  for (const column of CARTEL2_COLUMNS) {
    next[column] = normalizeSheetValue(record[column]);
  }
  return next;
}

export function getSheetFieldEntries(row: Cartel2SheetRow) {
  return CARTEL2_FIELDS_ORDER.map((column) => {
    const field = SHEET_FIELD_BY_COLUMN.get(column)!;
    return {
      column,
      label: field.label,
      description: field.description,
      value: row[column]
    };
  });
}

export const CARTEL2_FIELDS_ORDER = [...CARTEL2_COLUMNS];

function toMatchKey(value: string) {
  return normalizeSheetKey(value).replace(/-/g, '');
}

export function inferMediaKeyFromFileName(fileName: string) {
  const stem = fileName.replace(/\.[^.]+$/, '');
  const stripped = stem.replace(/^copy of\s+/i, '').trim();
  const root = stripped.split(/[_-]/)[0] ?? stripped;
  return toMatchKey(root);
}

export function inferMediaKind(fileName: string): Cartel2MediaAsset['kind'] {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'mp4' || ext === 'mov' || ext === 'webm' || ext === 'm4v') return 'video';
  if (ext === 'mp3' || ext === 'wav' || ext === 'm4a' || ext === 'aac' || ext === 'flac' || ext === 'ogg') return 'audio';
  if (ext === 'svg' || ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'webp' || ext === 'bmp') return 'image';
  return 'file';
}

export function getCanonicalSheetKey(row: Cartel2SheetRow) {
  const h = normalizeSheetValue(row.H);
  return h ? normalizeSheetKey(h) : normalizeSheetKey(row.A);
}

export function getLegacySheetKey(row: Cartel2SheetRow) {
  return normalizeSheetKey(row.A);
}

export function buildCartel2MediaMatch(
  row: Cartel2SheetRow,
  mediaAssets: Cartel2MediaAsset[],
  orphanAssets: Cartel2MediaAsset[]
): Cartel2MediaMatch {
  const canonicalKey = getCanonicalSheetKey(row);
  const legacyKey = getLegacySheetKey(row);
  const canonicalAssets = mediaAssets.filter((asset) => asset.normalizedKey === canonicalKey);
  const legacyAssets = canonicalKey === legacyKey ? canonicalAssets : mediaAssets.filter((asset) => asset.normalizedKey === legacyKey);
  const aliasAssets = canonicalAssets.length > 0 ? canonicalAssets : legacyAssets;
  const matchedAssets = aliasAssets.length > 0 ? aliasAssets : [];

  let matchedBy: Cartel2MediaMatch['matchedBy'] = 'none';
  if (canonicalAssets.length > 0) {
    matchedBy = 'canonical';
  } else if (legacyAssets.length > 0) {
    matchedBy = 'legacy';
  }

  const status: Cartel2MediaMatch['status'] =
    matchedAssets.length === 0 ? 'missing' : matchedAssets.length === mediaAssets.length ? 'matched' : 'partial';

  return {
    canonicalKey,
    legacyKey,
    matchedBy,
    status,
    assetCount: matchedAssets.length,
    assets: matchedAssets,
    unmatchedAssetNames: orphanAssets.map((asset) => asset.fileName)
  };
}

export function buildCartel2SyncReport(rows: Cartel2SnapshotRow[], allAssets: Cartel2MediaAsset[]): Cartel2SyncReport {
  const canonicalGroups = new Map<string, number[]>();
  for (const row of rows) {
    const list = canonicalGroups.get(row.canonicalKey) ?? [];
    list.push(row.rowNumber);
    canonicalGroups.set(row.canonicalKey, list);
  }

  const collisionGroups = [...canonicalGroups.entries()]
    .filter(([, rowNumbers]) => rowNumbers.length > 1)
    .map(([key, rowNumbers]) => ({ key, rowNumbers }));

  const rowsWithMedia = rows.filter((row) => row.media.assetCount > 0).length;
  const rowsWithCoreMetadata = rows.filter((row) => CARTEL2_CORE_COLUMNS.every((column) => Boolean(row[column].trim()))).length;
  const coreMetadataMissingRowNumbers = rows
    .filter((row) => !CARTEL2_CORE_COLUMNS.every((column) => Boolean(row[column].trim())))
    .map((row) => row.rowNumber);
  const rowsRenderableWithEditorialFallback = rowsWithCoreMetadata;
  const editorialFallbackMissingRowNumbers = rows
    .filter((row) => !CARTEL2_CORE_COLUMNS.every((column) => Boolean(row[column].trim())))
    .map((row) => row.rowNumber);
  const matchedAssets = rows.reduce((count, row) => count + row.media.assetCount, 0);
  const orphanAssetNames = allAssets.filter((asset) => !rows.some((row) => row.media.assets.some((matched) => matched.fileName === asset.fileName))).map((asset) => asset.fileName);

  return {
    rowsTotal: rows.length,
    rowsWithMedia,
    rowsWithoutMedia: rows.length - rowsWithMedia,
    rowsWithCoreMetadata,
    rowsWithoutCoreMetadata: rows.length - rowsWithCoreMetadata,
    coreMetadataCoverage: rows.length ? Math.round((rowsWithCoreMetadata / rows.length) * 100) : 0,
    coreMetadataColumns: CARTEL2_CORE_COLUMNS,
    coreMetadataMissingRowNumbers,
    rowsRenderableWithEditorialFallback,
    rowsWithoutEditorialFallback: rows.length - rowsRenderableWithEditorialFallback,
    editorialFallbackCoverage: rows.length ? Math.round((rowsRenderableWithEditorialFallback / rows.length) * 100) : 0,
    editorialFallbackMissingRowNumbers,
    rowsWithCanonicalCollision: collisionGroups.length,
    canonicalCollisionGroups: collisionGroups,
    assetsTotal: allAssets.length,
    matchedAssets,
    orphanAssets: orphanAssetNames.length,
    orphanAssetNames
  };
}

export function buildSheetRowSummary(row: Cartel2SheetRow) {
  return {
    title: row.B,
    canonicalKey: getCanonicalSheetKey(row),
    legacyKey: getLegacySheetKey(row),
    sourceNetwork: splitSheetValues(row.S),
    countryValues: splitSheetValues(row.E),
    mediaText: row.H
  };
}
