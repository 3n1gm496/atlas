import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth/request-user';

function toCsv(rows: Record<string, string | number | null>[]) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (value: string | number | null) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  return [headers.join(','), ...rows.map((row) => headers.map((header) => escape(row[header] ?? '')).join(','))].join('\n');
}

export async function GET(req: NextRequest) {
  const user = await getRequestUser();
  if (!user || !['research_admin', 'super_admin'].includes(user.role.name)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const format = req.nextUrl.searchParams.get('format') ?? 'json';
  const entries = await prisma.entry.findMany({
    include: { country: true, contributor: true },
    orderBy: { updatedAt: 'desc' },
    take: 250
  });

  const rows = entries.map((entry) => ({
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    status: entry.status,
    country: entry.country.name,
    contributor: entry.contributor.displayName,
    featured: entry.featured ? 1 : 0,
    updatedAt: entry.updatedAt.toISOString()
  }));

  if (format === 'csv') {
    return new NextResponse(toCsv(rows), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="atlas-entries.csv"'
      }
    });
  }

  return NextResponse.json({ items: rows, total: rows.length });
}
