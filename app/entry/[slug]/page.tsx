export const dynamic = 'force-dynamic';
import { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { findDemoEntryBySlug, getStatusLabel } from '@/lib/demo-content';
import { getCurrentUser } from '@/lib/auth/session';
import { EntryActions } from '@/components/entry-actions';

type EntryDetailModel = Prisma.EntryGetPayload<{
  include: {
    country: true;
    contributor: { include: { role: true } };
    reviewer: { include: { role: true } };
    assignments: { include: { term: { include: { group: true } } } };
    mediaAssets: true;
    sourceLinks: true;
    bibliographyItems: true;
    comments: { include: { author: true } };
    revisions: { include: { createdBy: true } };
  };
}>;

export default async function EntryDetail({ params }: { params: { slug: string } }) {
  const currentUser = await getCurrentUser();
  let entry: EntryDetailModel | null = null;
  try {
    entry = await prisma.entry.findUnique({
      where: { slug: params.slug },
      include: {
        country: true,
        contributor: { include: { role: true } },
        reviewer: { include: { role: true } },
        assignments: { include: { term: { include: { group: true } } } },
        mediaAssets: true,
        sourceLinks: true,
        bibliographyItems: true,
        comments: { include: { author: true }, orderBy: { createdAt: 'desc' } },
        revisions: { include: { createdBy: true }, orderBy: { createdAt: 'desc' } }
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
        <EntryActions
          entryId={demoEntry.id}
          initialFavorite={false}
          canSubmit={currentUser?.id === demoEntry.contributorId && ['draft', 'changes_requested'].includes(demoEntry.status)}
          canFavorite={Boolean(currentUser)}
        />
      </section>
    );
  }

  if (!entry) return notFound();

  const initialFavorite = currentUser
    ? await prisma.favorite
        .findFirst({ where: { userId: currentUser.id, entryId: entry.id } })
        .then(Boolean)
        .catch(() => false)
    : false;

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
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="atlas-card space-y-3">
          <h2 className="font-semibold">Workflow</h2>
          <p className="text-sm text-neutral-700">Contributor: {entry.contributor.displayName}</p>
          <p className="text-sm text-neutral-700">Reviewer: {entry.reviewer?.displayName ?? 'Non assegnato'}</p>
          <p className="text-sm text-neutral-700">Revisioni: {entry.revisions.length}</p>
        </article>
        <article className="atlas-card space-y-3">
          <h2 className="font-semibold">Commenti editoriali</h2>
          {entry.comments.length ? (
            <div className="space-y-3">
              {entry.comments.map((comment) => (
                <div key={comment.id} className="rounded-2xl bg-neutral-50 px-4 py-3 text-sm">
                  <p className="font-semibold">{comment.author.displayName}</p>
                  <p className="mt-2 text-neutral-700">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-600">Nessun commento editoriale ancora presente.</p>
          )}
        </article>
      </div>
      <EntryActions
        entryId={entry.id}
        initialFavorite={initialFavorite}
        canSubmit={Boolean(currentUser && currentUser.id === entry.contributorId && ['draft', 'changes_requested'].includes(entry.status))}
        canFavorite={Boolean(currentUser)}
      />
    </section>
  );
}
