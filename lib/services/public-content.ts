import { Prisma } from '@prisma/client';
import { logWarn } from '@/lib/logger';
import {
  countPublishedEntries,
  findArchiveEntries,
  findEntryDetailBySlug,
  findFeaturedPublishedEntries,
  findMapEntries,
  findSearchEntries
} from '@/lib/repositories/entries-repository';
import {
  countCollections,
  countUsers,
  findCollectionDetail,
  findCollectionsIndex,
  findSubmissionCountries,
  findSubmissionTaxonomyGroups,
  findTaxonomyGroup,
  findTaxonomyGroups
} from '@/lib/repositories/catalog-repository';

export type PublicEntryCard = {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  description: string | null;
  editorialNote: string | null;
  status: string;
  featured: boolean;
  countryName: string;
  placeName: string | null;
  timePeriodLabel: string | null;
  sheetRowNumber: number | null;
  sheetKey: string | null;
  mediaAssetCount: number;
  mediaMatchStatus: string | null;
  lat: number | null;
  lng: number | null;
  taxonomyTerms?: string[];
  taxonomyByGroup?: Record<string, string[]>;
};

export type EntryDetailView = {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  description: string;
  editorialNote: string | null;
  status: string;
  canonicalLanguage: string;
  countryName: string;
  placeName: string | null;
  timePeriodLabel: string | null;
  sourceContext: string | null;
  contributorId: string;
  contributorName: string;
  reviewerName: string | null;
  metadata: Record<string, unknown> | null;
  taxonomyByGroup: Record<string, string[]>;
  mediaAssets: { id: string; kind: string; url: string; altText: string }[];
  sourceLinks: { id: string; label: string; url: string }[];
  bibliographyItems: { id: string; citation: string }[];
  taxonomy: string[];
  comments: { id: string; author: string; content: string; createdAt: string }[];
  timeline: { id: string; title: string; description: string; createdAt: string }[];
  revisionsCount: number;
};

function getSheetMetadata(metadata: Record<string, unknown> | null) {
  if (!metadata) return null;
  const sheet = metadata.sheet1;
  if (!sheet || typeof sheet !== 'object' || Array.isArray(sheet)) return null;
  return sheet as Record<string, unknown>;
}

async function withPublicFallback<T>(operation: string, fallback: T, executor: () => Promise<T>) {
  try {
    return await executor();
  } catch (error) {
    logWarn('public-content-fallback', 'Public content query fell back to a safe response.', {
      operation,
      error: error instanceof Error ? error.message : 'unknown error'
    });
    return fallback;
  }
}

export async function getPublicHomepageData() {
  return withPublicFallback(
    'getPublicHomepageData',
    {
      stats: {
        publishedCount: 0,
        usersCount: 0,
        collectionsCount: 0
      },
      featuredEntries: []
    },
    async () => {
      const [publishedCount, usersCount, collectionsCount, featuredEntries] = await Promise.all([
        countPublishedEntries(),
        countUsers(),
        countCollections(),
        findFeaturedPublishedEntries()
      ]);

      return {
        stats: {
          publishedCount,
          usersCount,
          collectionsCount
        },
        featuredEntries: featuredEntries.map(toPublicEntryCard)
      };
    }
  );
}

export async function getArchiveEntries(filters: { q?: string; country?: string; status?: string; taxonomy?: string; keyword?: string; year?: string }) {
  const where: Prisma.EntryWhereInput = {
    ...(filters.q
      ? {
          OR: [
            { title: { contains: filters.q, mode: 'insensitive' } },
            { abstract: { contains: filters.q, mode: 'insensitive' } },
            { description: { contains: filters.q, mode: 'insensitive' } },
            { keywords: { some: { value: { contains: filters.q, mode: 'insensitive' } } } },
            { assignments: { some: { term: { labelIt: { contains: filters.q, mode: 'insensitive' } } } } }
          ]
        }
      : {}),
    ...(filters.country ? { country: { name: { equals: filters.country, mode: 'insensitive' } } } : {}),
    ...(filters.status ? { status: filters.status as never } : {}),
    ...(filters.keyword ? { keywords: { some: { value: { contains: filters.keyword, mode: 'insensitive' } } } } : {}),
    ...(filters.taxonomy
      ? {
          assignments: {
            some: {
              term: {
                OR: [
                  { labelIt: { contains: filters.taxonomy, mode: 'insensitive' } },
                  { group: { labelIt: { contains: filters.taxonomy, mode: 'insensitive' } } }
                ]
              }
            }
          }
        }
      : {}),
    ...(filters.year ? { timePeriodLabel: { contains: filters.year, mode: 'insensitive' } } : {})
  };

  return withPublicFallback('getArchiveEntries', [] as PublicEntryCard[], async () => {
    const entries = await findArchiveEntries(where);
    return entries.map(toPublicEntryCard);
  });
}

export async function searchPublicEntries(q: string) {
  if (!q.trim()) return [];

  return withPublicFallback('searchPublicEntries', [] as PublicEntryCard[], async () => {
    const entries = await findSearchEntries(q);
    return entries.map(toPublicEntryCard);
  });
}

export async function getMapEntries() {
  return withPublicFallback(
    'getMapEntries',
    [] as Array<PublicEntryCard & { lat: number; lng: number }>,
    async () => {
      const entries = await findMapEntries();

      return entries.map(toPublicEntryCard).map((entry, index) => ({
        ...entry,
        lat: entries[index].lat ?? 0,
        lng: entries[index].lng ?? 0
      }));
    }
  );
}

export async function getCollectionsIndex() {
  return withPublicFallback('getCollectionsIndex', [] as Awaited<ReturnType<typeof findCollectionsIndex>>, () => findCollectionsIndex());
}

export async function getArchiveFilterOptions() {
  return withPublicFallback('getArchiveFilterOptions', { countries: [] as string[] }, async () => {
    const countries = await findSubmissionCountries();
    return {
      countries: countries.map((country) => country.name)
    };
  });
}

export async function getCollectionDetail(slug: string) {
  return withPublicFallback('getCollectionDetail', null, () => findCollectionDetail(slug));
}

export async function getTaxonomyGroups() {
  return withPublicFallback('getTaxonomyGroups', [] as Awaited<ReturnType<typeof findTaxonomyGroups>>, () => findTaxonomyGroups());
}

export async function getTaxonomyGroup(slug: string) {
  return withPublicFallback('getTaxonomyGroup', null, () => findTaxonomyGroup(slug));
}

export async function getSubmissionFormData() {
  return withPublicFallback(
    'getSubmissionFormData',
    { countries: [], groups: [] as Awaited<ReturnType<typeof findSubmissionTaxonomyGroups>> },
    async () => {
      const [countries, groups] = await Promise.all([findSubmissionCountries(), findSubmissionTaxonomyGroups()]);
      return { countries, groups };
    }
  );
}

export async function getEntryDetailView(slug: string): Promise<EntryDetailView | null> {
  return withPublicFallback('getEntryDetailView', null, async () => {
    const entry = await findEntryDetailBySlug(slug);

    if (!entry) return null;

    return {
      id: entry.id,
      slug: entry.slug,
      title: entry.title,
      abstract: entry.abstract || entry.title,
      description: entry.description || entry.abstract || entry.title,
      editorialNote: entry.editorialNote || null,
      status: entry.status,
      canonicalLanguage: entry.canonicalLanguage,
      countryName: entry.country.name,
      placeName: entry.placeName,
      timePeriodLabel: entry.timePeriodLabel,
      sourceContext: entry.sourceContext,
      contributorId: entry.contributorId,
      contributorName: entry.contributor.displayName,
      reviewerName: entry.reviewer?.displayName ?? null,
      metadata:
        entry.metadata && typeof entry.metadata === 'object' && !Array.isArray(entry.metadata)
          ? (entry.metadata as Record<string, unknown>)
          : null,
      taxonomyByGroup: entry.assignments.reduce<Record<string, string[]>>((acc, assignment) => {
        const groupLabel = assignment.term.group.labelIt;
        if (!acc[groupLabel]) acc[groupLabel] = [];
        acc[groupLabel].push(assignment.term.labelIt);
        return acc;
      }, {}),
      mediaAssets: entry.mediaAssets.map((asset) => ({
        id: asset.id,
        kind: asset.kind,
        url: asset.url,
        altText: asset.altText
      })),
      sourceLinks: entry.sourceLinks.map((link) => ({
        id: link.id,
        label: link.label,
        url: link.url
      })),
      bibliographyItems: entry.bibliographyItems.map((item) => ({
        id: item.id,
        citation: item.citation
      })),
      taxonomy: entry.assignments.map((assignment) => assignment.term.labelIt),
      comments: entry.comments.map((comment) => ({
        id: comment.id,
        author: comment.author.displayName,
        content: comment.content,
        createdAt: comment.createdAt.toISOString()
      })),
      timeline: [
        {
          id: `created-${entry.id}`,
          title: 'Scheda creata',
          description: `Aperta da ${entry.contributor.displayName}.`,
          createdAt: entry.createdAt.toISOString()
        },
        ...(entry.reviewStartedAt
          ? [
              {
                id: `review-start-${entry.id}`,
                title: 'Lettura avviata',
                description: entry.reviewer?.displayName
                  ? `Presa in carico da ${entry.reviewer.displayName}.`
                  : 'La scheda e entrata in lettura.',
                createdAt: entry.reviewStartedAt.toISOString()
              }
            ]
          : []),
        ...(entry.publishedAt
          ? [
              {
                id: `published-${entry.id}`,
                title: 'Scheda pubblicata',
                description: 'La scheda e ora visibile nel catalogo pubblico.',
                createdAt: entry.publishedAt.toISOString()
              }
            ]
          : []),
        ...entry.revisions.map((revision) => ({
          id: revision.id,
          title: 'Revisione salvata',
          description: `Snapshot creato da ${revision.createdBy.displayName}.`,
          createdAt: revision.createdAt.toISOString()
        })),
        ...entry.comments.map((comment) => ({
          id: `comment-${comment.id}`,
          title: `Nota di ${comment.author.displayName}`,
          description: comment.content,
          createdAt: comment.createdAt.toISOString()
        }))
      ].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()),
      revisionsCount: entry.revisions.length
    };
  });
}

function toPublicEntryCard(
  entry:
    | Prisma.EntryGetPayload<{
        include: { country: true; mediaAssets: true };
      }>
    | Prisma.EntryGetPayload<{
        include: { country: true; mediaAssets: true; assignments: { include: { term: { include: { group: true } } } } };
      }>
): PublicEntryCard {
  const assignments = 'assignments' in entry ? entry.assignments : undefined;
  const taxonomyByGroup = assignments
    ? assignments.reduce<Record<string, string[]>>((acc, assignment) => {
        const groupLabel = assignment.term.group.labelIt;
        if (!acc[groupLabel]) acc[groupLabel] = [];
        acc[groupLabel].push(assignment.term.labelIt);
        return acc;
      }, {})
    : undefined;
  const sheet = getSheetMetadata('metadata' in entry ? (entry.metadata as Record<string, unknown> | null) : null);
  const mediaMatch = sheet?.media && typeof sheet.media === 'object' && !Array.isArray(sheet.media) ? (sheet.media as Record<string, unknown>) : null;

  return {
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    abstract: entry.abstract || entry.title,
    description: ('description' in entry && typeof entry.description === 'string' ? entry.description : null) || entry.abstract || entry.title,
    editorialNote: ('editorialNote' in entry && typeof entry.editorialNote === 'string' ? entry.editorialNote : null) || null,
    status: entry.status,
    featured: entry.featured,
    countryName: entry.country.name,
    placeName: entry.placeName,
      timePeriodLabel: entry.timePeriodLabel,
      sheetRowNumber: sheet?.rowNumber ? Number(sheet.rowNumber) : null,
      sheetKey: sheet?.canonicalKey ? String(sheet.canonicalKey) : null,
      mediaAssetCount: entry.mediaAssets.length,
      mediaMatchStatus: mediaMatch?.status ? String(mediaMatch.status) : null,
      lat: entry.lat,
      lng: entry.lng,
      taxonomyTerms: taxonomyByGroup ? Object.values(taxonomyByGroup).flat() : undefined,
      taxonomyByGroup
    };
  }
