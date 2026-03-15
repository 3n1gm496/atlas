export const dynamic = 'force-dynamic';
import { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { findDemoEntryBySlug, getStatusLabel } from '@/lib/demo-content';

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
    const demoEntry = findDemoEntryBySlug(params.slug);
    if (!demoEntry) {
      return (
        <section className="atlas-card">
          <h1 className="text-2xl font-semibold">Errore di connessione</h1>
          <p className="mt-2 text-sm text-neutral-700">Impossibile caricare l&apos;entry in questo momento.</p>
        </section>
      );
    }

    return (
      <section className="space-y-4">
        <div className="atlas-card atlas-hero space-y-3">
          <p className="atlas-kicker">Scheda entry</p>
          <h1 className="atlas-title">{demoEntry.title}</h1>
          <p className="text-sm text-neutral-600">
            {demoEntry.countryName} · {demoEntry.canonicalLanguage} · {getStatusLabel(demoEntry.status)}
          </p>
          <p>{demoEntry.abstract}</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="atlas-card space-y-3">
            <h2 className="font-semibold">Descrizione</h2>
            <p className="text-sm text-neutral-700">{demoEntry.description}</p>
            <p className="text-sm text-neutral-600">
              {demoEntry.placeName} · {demoEntry.timePeriodLabel} · {demoEntry.sourceContext}
            </p>
          </article>
          <article className="atlas-card space-y-3">
            <h2 className="font-semibold">Taxonomy</h2>
            <ul className="space-y-2 text-sm">
              {demoEntry.taxonomy.map((term) => (
                <li key={term} className="rounded-2xl bg-neutral-50 px-4 py-3">{term}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    );
  }

  if (!entry) return notFound();

  return (
    <section className="space-y-4">
      <div className="atlas-card atlas-hero space-y-3">
        <p className="atlas-kicker">Scheda entry</p>
        <h1 className="atlas-title">{entry.title}</h1>
        <p>{entry.abstract}</p>
        <p className="text-sm text-neutral-700">
          {entry.country.name} · {entry.canonicalLanguage} · {getStatusLabel(entry.status)}
        </p>
      </div>
      <div className="atlas-card">
        <h2 className="font-semibold">Taxonomy</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {entry.assignments.map((a) => (
            <li key={a.id} className="rounded-2xl bg-neutral-50 px-4 py-3">{a.term.labelIt}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
