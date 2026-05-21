import { prisma } from '@/lib/prisma';

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: { role: true }
  });
}

export function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { role: true }
  });
}
