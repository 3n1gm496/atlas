import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

const entryDetailInclude = {
  country: true,
  contributor: { include: { role: true } },
  reviewer: { include: { role: true } },
  assignments: { include: { term: { include: { group: true } } } },
  keywords: true,
  hashtags: true,
  mediaAssets: true,
  sourceLinks: true,
  bibliographyItems: true,
  comments: { include: { author: true }, orderBy: { createdAt: 'desc' } },
  revisions: { include: { createdBy: true }, orderBy: { createdAt: 'desc' } }
} satisfies Prisma.EntryInclude;

export function countPublishedEntries() {
  return prisma.entry.count({ where: { status: 'published' } });
}

export function findFeaturedPublishedEntries() {
  return prisma.entry.findMany({
    where: { status: 'published' },
    include: { country: true, mediaAssets: true },
    orderBy: [{ featured: 'desc' }, { updatedAt: 'desc' }],
    take: 4
  });
}

export function findArchiveEntries(where: Prisma.EntryWhereInput) {
  return prisma.entry.findMany({
    where,
    orderBy: [{ featured: 'desc' }, { updatedAt: 'desc' }],
    include: {
      country: true,
      assignments: { include: { term: { include: { group: true } } } },
      keywords: true,
      mediaAssets: true
    },
    take: 30
  });
}

export function findSearchEntries(q: string) {
  return prisma.entry.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { abstract: { contains: q, mode: 'insensitive' } }
      ]
    },
    include: { country: true, mediaAssets: true },
    take: 30,
    orderBy: [{ featured: 'desc' }, { updatedAt: 'desc' }]
  });
}

export function findMapEntries() {
  return prisma.entry.findMany({
    where: { status: 'published', lat: { not: null }, lng: { not: null } },
    include: {
      country: true,
      assignments: { include: { term: { include: { group: true } } } },
      keywords: true,
      mediaAssets: true
    },
    take: 100,
    orderBy: [{ featured: 'desc' }, { updatedAt: 'desc' }]
  });
}

export function findEntryDetailBySlug(slug: string) {
  return prisma.entry.findUnique({
    where: { slug },
    include: entryDetailInclude
  });
}

export function findEntriesPage(where: Prisma.EntryWhereInput, skip: number, take: number) {
  return prisma.entry.findMany({
    where,
    include: { country: true },
    orderBy: [{ featured: 'desc' }, { updatedAt: 'desc' }],
    skip,
    take
  });
}

export function countEntries(where: Prisma.EntryWhereInput) {
  return prisma.entry.count({ where });
}

export function createEntryRecord(data: Prisma.EntryCreateInput) {
  return prisma.entry.create({ data });
}

export function updateEntryRecord(id: string, data: Prisma.EntryUpdateInput) {
  return prisma.entry.update({ where: { id }, data, include: entryDetailInclude });
}

export function findEntryStatusContext(id: string) {
  return prisma.entry.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      status: true,
      contributorId: true,
      reviewerId: true,
      publishedAt: true
    }
  });
}

export function findEntryById(id: string) {
  return prisma.entry.findUnique({
    where: { id },
    include: entryDetailInclude
  });
}
