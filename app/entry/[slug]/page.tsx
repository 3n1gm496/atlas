export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function EntryDetail({ params }: { params: { slug: string } }) {
  const entry = await prisma.entry.findUnique({
    where: { slug: params.slug },
    include: { country: true, assignments: { include: { term: true } }, mediaAssets: true, sourceLinks: true, bibliographyItems: true }
  });
  if (!entry) return notFound();

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">{entry.title}</h1>
      <p>{entry.abstract}</p>
      <p className="text-sm text-neutral-700">{entry.country.name} · {entry.canonicalLanguage}</p>
      <div>
        <h2 className="font-semibold">Taxonomy</h2>
        <ul className="list-disc pl-6 text-sm">{entry.assignments.map((a)=><li key={a.id}>{a.term.labelIt}</li>)}</ul>
      </div>
    </section>
  );
}
