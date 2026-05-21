import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/next-auth';
import { findUserById } from '@/lib/repositories/auth-repository';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return findUserById(session.user.id);
}
