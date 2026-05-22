import { redirect } from 'next/navigation';
import type { AtlasRole } from '@/lib/auth/rbac';
import { getCurrentUser } from '@/lib/auth/session';

type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

export async function requireCurrentUserRole(allowedRoles: readonly AtlasRole[], redirectTo = '/account'): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user || !allowedRoles.includes(user.role.name as AtlasRole)) {
    redirect(redirectTo);
  }

  return user as CurrentUser;
}
