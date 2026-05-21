import { prisma } from '@/lib/prisma';

export function findFavoritesByUser(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    include: { entry: true },
    take: 50
  });
}

export function findNotificationsByUser(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { id: 'desc' },
    take: 50
  });
}

export function findSavedSearchesByUser(userId: string) {
  return prisma.savedSearch.findMany({
    where: { userId },
    take: 50
  });
}

export function findFavoriteForEntry(userId: string, entryId: string) {
  return prisma.favorite.findFirst({
    where: { userId, entryId }
  });
}
