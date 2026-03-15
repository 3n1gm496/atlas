import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/next-auth';
import { prisma } from '@/lib/prisma';
import { findDemoUserByEmail } from '@/lib/demo-content';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id && !session?.user?.email) return null;

  if (session?.user?.id) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { role: true }
      });
      if (dbUser) return dbUser;
    } catch {
      // Fall back to demo session payload when the database is unavailable.
    }
  }

  const demoUser = session.user.email ? findDemoUserByEmail(session.user.email) : null;
  if (!demoUser) return null;

  return {
    id: demoUser.id,
    email: demoUser.email,
    passwordHash: '',
    displayName: demoUser.displayName,
    roleId: demoUser.roleName,
    role: {
      id: `role-${demoUser.roleName}`,
      name: demoUser.roleName,
      description: `Demo role ${demoUser.roleName}`
    },
    createdAt: new Date(0),
    updatedAt: new Date(0)
  };
}
