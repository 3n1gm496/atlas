import { NextRequest } from 'next/server';

export const rolePriority = {
  public_visitor: 0,
  contributor: 1,
  editor: 2,
  research_admin: 3,
  super_admin: 4
} as const;

export type AtlasRole = keyof typeof rolePriority;

export function getRoleFromRequest(req: NextRequest): AtlasRole {
  const role = req.headers.get('x-atlas-role') as AtlasRole | null;
  if (!role || !(role in rolePriority)) return 'public_visitor';
  return role;
}

export function hasRequiredRole(current: AtlasRole, required: AtlasRole): boolean {
  return rolePriority[current] >= rolePriority[required];
}
