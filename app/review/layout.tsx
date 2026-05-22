import type { ReactNode } from 'react';
import { requireCurrentUserRole } from '@/lib/auth/route-guards';

export const dynamic = 'force-dynamic';

const reviewRoles = ['research_admin', 'super_admin'] as const;

export default async function ReviewLayout({ children }: { children: ReactNode }) {
  await requireCurrentUserRole(reviewRoles);
  return <>{children}</>;
}
