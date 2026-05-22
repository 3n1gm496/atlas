import type { ReactNode } from 'react';
import { requireCurrentUserRole } from '@/lib/auth/route-guards';

export const dynamic = 'force-dynamic';

const adminRoles = ['research_admin', 'super_admin'] as const;

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireCurrentUserRole(adminRoles);
  return <>{children}</>;
}
