import { prisma } from '@/lib/prisma';

export async function getDemoContributor() {
  const byEmail = await prisma.user.findUnique({ where: { email: 'contributor@atlas.local' } });
  if (byEmail) return byEmail;
  return prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });
}
