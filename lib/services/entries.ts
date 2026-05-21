import { Prisma } from '@prisma/client';
import { entryFilterSchema, entryCreateSchema, entryPatchSchema } from '@/lib/validation/entry';
import { countEntries, createEntryRecord, findEntriesPage, findEntryById, updateEntryRecord } from '@/lib/repositories/entries-repository';

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
    findEntriesPage(where, skip, parsed.pageSize),
    countEntries(where)
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
  const taxonomyTermIds = dedupeIds(data.taxonomyTermIds);
  const keywords = sanitiseStringList(data.keywords);
  const hashtags = sanitiseStringList(data.hashtags);

  return createEntryRecord({
    slug: data.slug,
    title: data.title,
    abstract: data.abstract,
    description: data.description,
    country: { connect: { id: data.countryId } },
    canonicalLanguage: data.canonicalLanguage,
    placeName: data.placeName,
    lat: data.lat,
    lng: data.lng,
    sourceContext: data.sourceContext,
    timePeriodLabel: data.timePeriodLabel,
    metadata: data.trendMetadata ? { trend: data.trendMetadata } : undefined,
    contributor: { connect: { id: contributorId } },
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
  });
}

export async function patchEntry(id: string, payload: unknown, actorId?: string) {
  const data = entryPatchSchema.parse(payload);
  const current = await findEntryById(id);
  if (!current) return null;

  const updated = await updateEntryRecord(id, toEntryUpdateInput(data, current.metadata ?? null));

  if (actorId) {
    await updateEntryRecord(id, {
      revisions: {
        create: {
          createdBy: { connect: { id: actorId } },
          snapshot: buildRevisionSnapshot(updated)
        }
      }
    });
  }

  return updated;
}

export async function getEntryById(id: string) {
  return findEntryById(id);
}

function sanitiseStringList(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function dedupeIds(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function toEntryUpdateInput(
  data: ReturnType<typeof entryPatchSchema.parse>,
  currentMetadata: Prisma.JsonValue | null
): Prisma.EntryUpdateInput {
  const update: Prisma.EntryUpdateInput = {};

  if ('slug' in data) update.slug = data.slug;
  if ('title' in data) update.title = data.title;
  if ('abstract' in data) update.abstract = data.abstract;
  if ('description' in data) update.description = data.description;
  if ('canonicalLanguage' in data) update.canonicalLanguage = data.canonicalLanguage;
  if ('placeName' in data) update.placeName = data.placeName;
  if ('lat' in data) update.lat = data.lat;
  if ('lng' in data) update.lng = data.lng;
  if ('sourceContext' in data) update.sourceContext = data.sourceContext;
  if ('timePeriodLabel' in data) update.timePeriodLabel = data.timePeriodLabel;
  if ('status' in data) update.status = data.status;
  if ('featured' in data) update.featured = data.featured;
  if ('reviewPriority' in data) update.reviewPriority = data.reviewPriority;
  if ('reviewDueAt' in data) update.reviewDueAt = data.reviewDueAt;
  if ('countryId' in data) update.country = { connect: { id: data.countryId } };

  if ('taxonomyTermIds' in data) {
    const taxonomyTermIds = dedupeIds(data.taxonomyTermIds ?? []);
    update.assignments = {
      deleteMany: {},
      ...(taxonomyTermIds.length
        ? { createMany: { data: taxonomyTermIds.map((termId) => ({ termId })) } }
        : {})
    };
  }

  if ('keywords' in data) {
    const keywords = sanitiseStringList(data.keywords ?? []);
    update.keywords = {
      deleteMany: {},
      ...(keywords.length ? { createMany: { data: keywords.map((value) => ({ value })) } } : {})
    };
  }

  if ('hashtags' in data) {
    const hashtags = sanitiseStringList(data.hashtags ?? []);
    update.hashtags = {
      deleteMany: {},
      ...(hashtags.length ? { createMany: { data: hashtags.map((value) => ({ value })) } } : {})
    };
  }

  if ('trendMetadata' in data) {
    const metadataRoot =
      currentMetadata && typeof currentMetadata === 'object' && !Array.isArray(currentMetadata)
        ? { ...(currentMetadata as Record<string, Prisma.JsonValue>) }
        : {};
    update.metadata = {
      ...metadataRoot,
      trend: data.trendMetadata as Prisma.InputJsonValue
    };
  }

  return update;
}

function buildRevisionSnapshot(
  entry: Awaited<ReturnType<typeof findEntryById>>
): Prisma.InputJsonValue {
  if (!entry) return {};

  return {
    slug: entry.slug,
    title: entry.title,
    abstract: entry.abstract,
    description: entry.description,
    canonicalLanguage: entry.canonicalLanguage,
    countryId: entry.countryId,
    placeName: entry.placeName,
    lat: entry.lat,
    lng: entry.lng,
    sourceContext: entry.sourceContext,
    timePeriodLabel: entry.timePeriodLabel,
    status: entry.status,
    taxonomyTermIds: entry.assignments.map((assignment) => assignment.termId),
    keywords: entry.keywords.map((keyword) => keyword.value),
    hashtags: entry.hashtags.map((hashtag) => hashtag.value),
    trendMetadata:
      entry.metadata && typeof entry.metadata === 'object' && !Array.isArray(entry.metadata)
        ? ((entry.metadata as Record<string, Prisma.JsonValue>).trend ?? null)
        : null,
    updatedAt: entry.updatedAt.toISOString()
  } satisfies Prisma.InputJsonObject;
}
