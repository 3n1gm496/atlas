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
  return prisma.entry.create({
    data: {
      ...data,
      contributorId,
      status: 'draft'
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
