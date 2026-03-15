import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { entryFilterSchema, entryCreateSchema, entryPatchSchema } from '@/lib/validation/entry';

type EntryFilters = Prisma.EntryWhereInput;

function toWhere(input: Record<string, string | undefined>): EntryFilters {
  const parsed = entryFilterSchema.parse(input);
  const where: EntryFilters = {};

  if (parsed.q) {
    where.OR = [
      { title: { contains: parsed.q, mode: 'insensitive' } },
      { abstract: { contains: parsed.q, mode: 'insensitive' } },
      { description: { contains: parsed.q, mode: 'insensitive' } },
      { placeName: { contains: parsed.q, mode: 'insensitive' } }
    ];
  }
  if (parsed.country) where.country = { name: { equals: parsed.country, mode: 'insensitive' } };
  if (parsed.status) where.status = parsed.status;
  if (parsed.featured) where.featured = parsed.featured === 'true';

  return where;
}

export async function listEntries(input: Record<string, string | undefined>) {
  const parsed = entryFilterSchema.parse(input);
  const where = toWhere(input);
  const skip = (parsed.page - 1) * parsed.pageSize;

  const [items, total] = await Promise.all([
    prisma.entry.findMany({
      where,
      include: { country: true },
      orderBy: [{ featured: 'desc' }, { updatedAt: 'desc' }],
      skip,
      take: parsed.pageSize
    }),
    prisma.entry.count({ where })
  ]);

  return {
    items,
    pagination: {
      page: parsed.page,
      pageSize: parsed.pageSize,
      total,
      totalPages: Math.ceil(total / parsed.pageSize)
    }
  };
}

export async function createEntry(payload: unknown, contributorId: string) {
  const data = entryCreateSchema.parse(payload);
  const taxonomyTermIds = [...new Set(data.taxonomyTermIds)];
  const keywords = [...new Set(data.keywords.map((k) => k.trim()).filter(Boolean))];
  const hashtags = [...new Set(data.hashtags.map((h) => h.trim()).filter(Boolean))];

  return prisma.entry.create({
    data: {
      slug: data.slug,
      title: data.title,
      abstract: data.abstract,
      description: data.description,
      countryId: data.countryId,
      canonicalLanguage: data.canonicalLanguage,
      placeName: data.placeName,
      lat: data.lat,
      lng: data.lng,
      sourceContext: data.sourceContext,
      timePeriodLabel: data.timePeriodLabel,
      metadata: data.trendMetadata ? { trend: data.trendMetadata } : undefined,
      contributorId,
      status: 'draft',
      assignments: taxonomyTermIds.length
        ? { createMany: { data: taxonomyTermIds.map((termId) => ({ termId })) } }
        : undefined,
      keywords: keywords.length
        ? { createMany: { data: keywords.map((value) => ({ value })) } }
        : undefined,
      hashtags: hashtags.length
        ? { createMany: { data: hashtags.map((value) => ({ value })) } }
        : undefined
    }
  });
}

export async function patchEntry(id: string, payload: unknown) {
  const data = entryPatchSchema.parse(payload);
  return prisma.entry.update({ where: { id }, data });
}

export async function getEntryById(id: string) {
  return prisma.entry.findUnique({
    where: { id },
    include: {
      country: true,
      assignments: { include: { term: { include: { group: true } } } },
      keywords: true,
      hashtags: true,
      mediaAssets: true,
      sourceLinks: true,
      bibliographyItems: true
    }
  });
}
