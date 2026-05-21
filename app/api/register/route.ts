import { NextRequest } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { AtlasApiError, apiSuccess, handleApiError } from '@/lib/http/api';
import { checkRateLimit, getRateLimitKey } from '@/lib/auth/rate-limit';

export const dynamic = 'force-dynamic';

const registerSchema = z.object({
  displayName: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(req: NextRequest) {
  try {
    const limit = checkRateLimit(getRateLimitKey(req, 'register'), 5, 60_000);
    if (!limit.ok) {
      throw new AtlasApiError(429, 'rate_limited', 'Too many registration attempts', { retryAfterMs: limit.retryAfterMs });
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      throw new AtlasApiError(400, 'validation_error', parsed.error.issues[0].message, parsed.error.issues);
    }

    const { displayName, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AtlasApiError(409, 'email_conflict', 'Email già registrata');
    }

    const contributorRole = await prisma.role.findFirst({ where: { name: 'contributor' } });
    if (!contributorRole) {
      throw new AtlasApiError(500, 'role_missing', 'Ruolo contributor non trovato');
    }

    const passwordHash = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        displayName,
        passwordHash,
        roleId: contributorRole.id
      }
    });

    return apiSuccess({ id: user.id, email: user.email }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
