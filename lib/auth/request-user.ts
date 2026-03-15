import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth/next-auth';
import { findDemoUserByEmail } from '@/lib/demo-content';

export async function getRequestUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { role: true }
    });
    if (user) return user;
  } catch {
    // Fall through to demo fallback.
  }

  const demo = findDemoUserByEmail(session.user.email);
  if (!demo) return null;

  return {
    id: demo.id,
    email: demo.email,
    passwordHash: '',
    displayName: demo.displayName,
    roleId: demo.roleName,
    role: {
      id: `role-${demo.roleName}`,
      name: demo.roleName,
      description: `Demo role ${demo.roleName}`
    },
    createdAt: new Date(0),
    updatedAt: new Date(0)
  };
}
