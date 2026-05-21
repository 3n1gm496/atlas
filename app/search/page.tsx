import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

type SearchParams = { q?: string; country?: string; status?: string; view?: string };

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const next = new URLSearchParams();
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (value) next.set(key, value);
  });
  redirect(`/archive${next.toString() ? `?${next.toString()}` : ''}`);
}
