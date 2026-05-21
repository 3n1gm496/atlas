import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/next-auth';
import { findUserById } from '@/lib/repositories/auth-repository';

export async function getRequestUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return findUserById(session.user.id);
}
