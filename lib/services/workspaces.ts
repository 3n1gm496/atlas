import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { prisma } from '@/lib/prisma';
import { findFavoritesByUser, findNotificationsByUser, findSavedSearchesByUser } from '@/lib/repositories/account-repository';

export type ReviewQueueItem = {
  id: string;
  slug: string;
  title: string;
  status: string;
  contributorName: string;
  reviewerId: string | null;
  reviewerName: string | null;
  updatedAt: string;
  reviewPriority: string;
  reviewDueAt: string | null;
  commentCount: number;
  recentNotes: { id: string; author: string; content: string; createdAt: string }[];
};

export type ReviewAssignee = {
  id: string;
  displayName: string;
  roleName: string;
};

export type AdminOverview = {
  entries: number;
  users: number;
  collections: number;
  taxonomyTerms: number;
  underReview: number;
  published: number;
  highPriorityReview: number;
  unassignedReview: number;
  mediaWithoutAlt: number;
  draftEntries: number;
};

export type DatasetSyncOverview = {
  rowsTotal: number;
  rowsWithMedia: number;
  rowsWithoutMedia: number;
  rowsWithCoreMetadata: number;
  rowsWithoutCoreMetadata: number;
  coreMetadataCoverage: number;
  coreMetadataColumns: string[];
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

export type ContributorDraft = {
  id: string;
  status: string;
  updatedAt: string;
  form: {
    slug: string;
    title: string;
    abstract: string;
    description: string;
    canonicalLanguage: string;
    countryId: string;
    placeName: string;
    lat: string;
    lng: string;
    timePeriodLabel: string;
    sourceContext: string;
    keywords: string;
    hashtags: string;
    trendSummary: string;
    taxonomyTermIds: string[];
  };
};

export async function getAccountOverview(userId: string) {
  const [submissions, recentEntries] = await Promise.all([
    prisma.entry.count({ where: { contributorId: userId } }),
    prisma.entry.findMany({
      where: { contributorId: userId },
      orderBy: { updatedAt: 'desc' },
      take: 3
    })
  ]);

  return {
    submissions,
    recentEntries
  };
}

export async function getContributorDrafts(userId: string) {
  return prisma.entry.findMany({
    where: { contributorId: userId },
    orderBy: { updatedAt: 'desc' },
    take: 30
  });
}

export async function getContributorResumeDraft(userId: string, draftId?: string): Promise<ContributorDraft | null> {
  const entry = await prisma.entry.findFirst({
    where: {
      contributorId: userId,
      ...(draftId ? { id: draftId } : { status: { in: ['draft', 'changes_requested'] } })
    },
    include: {
      assignments: true,
      keywords: true,
      hashtags: true
    },
    orderBy: { updatedAt: 'desc' }
  });

  if (!entry) return null;

  const metadata =
    entry.metadata && typeof entry.metadata === 'object' && !Array.isArray(entry.metadata)
      ? (entry.metadata as Record<string, unknown>)
      : {};
  const trend =
    metadata.trend && typeof metadata.trend === 'object' && !Array.isArray(metadata.trend)
      ? (metadata.trend as Record<string, unknown>)
      : {};

  return {
    id: entry.id,
    status: entry.status,
    updatedAt: entry.updatedAt.toISOString(),
    form: {
      slug: entry.slug,
      title: entry.title,
      abstract: entry.abstract,
      description: entry.description,
      canonicalLanguage: entry.canonicalLanguage,
      countryId: entry.countryId,
      placeName: entry.placeName ?? '',
      lat: entry.lat != null ? String(entry.lat) : '',
      lng: entry.lng != null ? String(entry.lng) : '',
      timePeriodLabel: entry.timePeriodLabel ?? '',
      sourceContext: entry.sourceContext ?? '',
      keywords: entry.keywords.map((keyword) => keyword.value).join(', '),
      hashtags: entry.hashtags.map((hashtag) => hashtag.value).join(', '),
      trendSummary: typeof trend.trendSummary === 'string' ? trend.trendSummary : '',
      taxonomyTermIds: entry.assignments.map((assignment) => assignment.termId)
    }
  };
}

export function getFavoriteEntries(userId: string) {
  return findFavoritesByUser(userId);
}

export function getNotificationFeed(userId: string) {
  return findNotificationsByUser(userId);
}

export function getSavedSearchList(userId: string) {
  return findSavedSearchesByUser(userId);
}

export async function getReviewQueue(): Promise<ReviewQueueItem[]> {
  const entries = await prisma.entry.findMany({
    where: { status: { in: ['submitted', 'under_review', 'changes_requested', 'approved'] } },
    include: {
      contributor: true,
      reviewer: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: 'desc' },
        take: 2
      }
    },
    orderBy: [{ reviewPriority: 'desc' }, { updatedAt: 'desc' }],
    take: 40
  });

  return entries
    .map((entry) => {
      return {
        id: entry.id,
        slug: entry.slug,
        title: entry.title,
        status: entry.status,
        contributorName: entry.contributor.displayName,
        reviewerId: entry.reviewerId,
        reviewerName: entry.reviewer?.displayName ?? null,
        updatedAt: entry.updatedAt.toISOString(),
        reviewPriority: entry.reviewPriority,
        reviewDueAt: entry.reviewDueAt?.toISOString() ?? null,
        commentCount: entry.comments.length,
        recentNotes: entry.comments.map((comment) => ({
          id: comment.id,
          author: comment.author.displayName,
          content: comment.content,
          createdAt: comment.createdAt.toISOString()
        }))
      };
    })
    .sort((left, right) => {
      const priorityRank = { high: 0, medium: 1, low: 2 } as const;
      const byPriority =
        (priorityRank[left.reviewPriority as keyof typeof priorityRank] ?? 1) -
        (priorityRank[right.reviewPriority as keyof typeof priorityRank] ?? 1);
      if (byPriority !== 0) return byPriority;
      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    });
}

export async function getEditorialAssignees(): Promise<ReviewAssignee[]> {
  const users = await prisma.user.findMany({
    where: {
      role: {
        name: { in: ['editor', 'research_admin', 'super_admin'] }
      }
    },
    include: { role: true },
    orderBy: { displayName: 'asc' }
  });

  return users.map((user) => ({
    id: user.id,
    displayName: user.displayName,
    roleName: user.role.name
  }));
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const [entries, users, collections, taxonomyTerms, underReview, published, highPriorityReview, unassignedReview, mediaWithoutAlt, draftEntries] = await Promise.all([
    prisma.entry.count(),
    prisma.user.count(),
    prisma.collection.count(),
    prisma.taxonomyTerm.count(),
    prisma.entry.count({ where: { status: { in: ['submitted', 'under_review', 'changes_requested', 'approved'] } } }),
    prisma.entry.count({ where: { status: 'published' } }),
    prisma.entry.count({ where: { reviewPriority: 'high', status: { in: ['submitted', 'under_review', 'changes_requested', 'approved'] } } }),
    prisma.entry.count({ where: { reviewerId: null, status: { in: ['submitted', 'under_review', 'changes_requested', 'approved'] } } }),
    prisma.mediaAsset.count({ where: { altText: '' } }),
    prisma.entry.count({ where: { status: 'draft' } })
  ]);

  return {
    entries,
    users,
    collections,
    taxonomyTerms,
    underReview,
    published,
    highPriorityReview,
    unassignedReview,
    mediaWithoutAlt,
    draftEntries
  };
}

export function getDatasetSyncOverview(): DatasetSyncOverview {
  try {
    const file = readFileSync(resolve(process.cwd(), 'data/cartel2.sync-report.json'), 'utf8');
    const parsed = JSON.parse(file) as Partial<DatasetSyncOverview>;
    return {
      rowsTotal: parsed.rowsTotal ?? 0,
      rowsWithMedia: parsed.rowsWithMedia ?? 0,
      rowsWithoutMedia: parsed.rowsWithoutMedia ?? 0,
      rowsWithCoreMetadata: parsed.rowsWithCoreMetadata ?? 0,
      rowsWithoutCoreMetadata: parsed.rowsWithoutCoreMetadata ?? 0,
      coreMetadataCoverage: parsed.coreMetadataCoverage ?? 0,
      coreMetadataColumns: parsed.coreMetadataColumns ?? ['A', 'B', 'E', 'H'],
      coreMetadataMissingRowNumbers: parsed.coreMetadataMissingRowNumbers ?? [],
      rowsRenderableWithEditorialFallback: parsed.rowsRenderableWithEditorialFallback ?? 0,
      rowsWithoutEditorialFallback: parsed.rowsWithoutEditorialFallback ?? 0,
      editorialFallbackCoverage: parsed.editorialFallbackCoverage ?? 0,
      editorialFallbackMissingRowNumbers: parsed.editorialFallbackMissingRowNumbers ?? [],
      rowsWithCanonicalCollision: parsed.rowsWithCanonicalCollision ?? 0,
      canonicalCollisionGroups: parsed.canonicalCollisionGroups ?? [],
      assetsTotal: parsed.assetsTotal ?? 0,
      matchedAssets: parsed.matchedAssets ?? 0,
      orphanAssets: parsed.orphanAssets ?? 0,
      orphanAssetNames: parsed.orphanAssetNames ?? []
    };
  } catch {
    return {
      rowsTotal: 0,
      rowsWithMedia: 0,
      rowsWithoutMedia: 0,
      rowsWithCoreMetadata: 0,
      rowsWithoutCoreMetadata: 0,
      coreMetadataCoverage: 0,
      coreMetadataColumns: ['A', 'B', 'E', 'H'],
      coreMetadataMissingRowNumbers: [],
      rowsRenderableWithEditorialFallback: 0,
      rowsWithoutEditorialFallback: 0,
      editorialFallbackCoverage: 0,
      editorialFallbackMissingRowNumbers: [],
      rowsWithCanonicalCollision: 0,
      canonicalCollisionGroups: [],
      assetsTotal: 0,
      matchedAssets: 0,
      orphanAssets: 0,
      orphanAssetNames: []
    };
  }
}

export async function getAdminEntries() {
  return prisma.entry.findMany({
    include: { country: true, contributor: true },
    orderBy: { updatedAt: 'desc' },
    take: 50
  });
}

export async function getMediaLibrary() {
  const [media, entries] = await Promise.all([
    prisma.mediaAsset.findMany({ orderBy: { id: 'desc' }, take: 50 }),
    prisma.entry.findMany({ select: { id: true, slug: true, title: true }, orderBy: { updatedAt: 'desc' }, take: 50 })
  ]);

  return { media, entries };
}

export async function getTeamDirectory() {
  return prisma.user.findMany({
    include: { role: true },
    orderBy: { displayName: 'asc' },
    take: 50
  });
}

export async function getAdminCollections() {
  return prisma.collection.findMany({
    include: { entries: true, sections: true },
    orderBy: { title: 'asc' }
  });
}

export async function getAdminTaxonomies() {
  return prisma.taxonomyGroup.findMany({
    include: { terms: true },
    orderBy: { slug: 'asc' }
  });
}

export async function getAuditFeed() {
  return prisma.auditLog.findMany({
    include: { actor: true },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
}

export async function getAdminAnalytics() {
  const [byStatus, byCountry, countries, userCount] = await Promise.all([
    prisma.entry.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.entry.groupBy({ by: ['countryId'], _count: { _all: true } }),
    prisma.country.findMany({ select: { id: true, name: true } }),
    prisma.user.count()
  ]);

  const countriesById = new Map(countries.map((country) => [country.id, country.name]));

  return {
    byStatus,
    byCountry: byCountry.map((row) => ({
      ...row,
      countryName: countriesById.get(row.countryId) ?? row.countryId
    })),
    userCount,
    totalEntries: byStatus.reduce((sum, row) => sum + row._count._all, 0),
    published: byStatus.find((row) => row.status === 'published')?._count._all ?? 0
  };
}
