export const dynamic = 'force-dynamic';
import { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

type EntryDetailModel = Prisma.EntryGetPayload<{
  include: {
    country: true;
    assignments: { include: { term: true } };
    mediaAssets: true;
    sourceLinks: true;
    bibliographyItems: true;
  };
}>;

export default async function EntryDetail({ params }: { params: { slug: string } }) {
  let entry: EntryDetailModel | null = null;
  try {
    entry = await prisma.entry.findUnique({
      where: { slug: params.slug },
      include: {
        country: true,
        assignments: { include: { term: true } },
        mediaAssets: true,
        sourceLinks: true,
        bibliographyItems: true
      }
    });
  } catch {
    return (
      <section className="atlas-card">
        <h1 className="text-2xl font-semibold">Errore di connessione</h1>
        <p className="mt-2 text-sm text-neutral-700">Impossibile caricare l&apos;entry in questo momento.</p>
      </section>
    );
  }

  if (!entry) return notFound();

  return (
    <section className="space-y-4">
      <h1 className="atlas-title">{entry.title}</h1>
      <p>{entry.abstract}</p>
      <p className="text-sm text-neutral-700">
        {entry.country.name} · {entry.canonicalLanguage}
      </p>
      <div className="atlas-card">
        <h2 className="font-semibold">Taxonomy</h2>
        <ul className="list-disc pl-6 text-sm">
          {entry.assignments.map((a) => (
            <li key={a.id}>{a.term.labelIt}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
