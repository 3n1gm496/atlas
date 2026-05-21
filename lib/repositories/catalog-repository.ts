import { prisma } from '@/lib/prisma';

export function countUsers() {
  return prisma.user.count();
}

export function countCollections() {
  return prisma.collection.count();
}

export function countTaxonomyTerms() {
  return prisma.taxonomyTerm.count();
}

export function findCollectionsIndex() {
  return prisma.collection.findMany({
    select: { id: true, slug: true, title: true, intro: true },
    orderBy: { title: 'asc' }
  });
}

export function findCollectionDetail(slug: string) {
  return prisma.collection.findUnique({
    where: { slug },
    include: {
      sections: { orderBy: { orderIndex: 'asc' } },
      entries: {
        include: {
          entry: {
            include: { country: true }
          }
        },
        orderBy: { orderIndex: 'asc' }
      }
    }
  });
}

export function findTaxonomyGroups() {
  return prisma.taxonomyGroup.findMany({
    include: { terms: { orderBy: { labelIt: 'asc' } } },
    orderBy: { labelIt: 'asc' }
  });
}

export function findTaxonomyGroup(slug: string) {
  return prisma.taxonomyGroup.findUnique({
    where: { slug },
    include: { terms: { orderBy: { labelIt: 'asc' } } }
  });
}

export function findSubmissionCountries() {
  return prisma.country.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });
}

export function findSubmissionTaxonomyGroups() {
  return prisma.taxonomyGroup.findMany({
    include: { terms: { select: { id: true, labelIt: true, groupId: true }, orderBy: { labelIt: 'asc' } } },
    orderBy: { slug: 'asc' }
  });
}
