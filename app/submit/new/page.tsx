import { prisma } from '@/lib/prisma';
import { SubmitTrendForm } from './submit-trend-form';

export const dynamic = 'force-dynamic';

const fallbackGroups = [
  { slug: 'typological', labelIt: 'Obiettivi tipologici' },
  { slug: 'thematic', labelIt: 'Categorie tematiche' },
  { slug: 'practices', labelIt: 'Pratiche/Culture editorializzate' },
  { slug: 'framing', labelIt: 'Cornici culturali' },
  { slug: 'formats', labelIt: 'Formati tecno-creativi' },
  { slug: 'tone', labelIt: 'Tono' },
  { slug: 'scripto', labelIt: 'Sotto-categorie scripto-iconiche' },
  { slug: 'microforms', labelIt: 'Microforme' }
].map((group) => ({ ...group, id: group.slug, terms: [] as { id: string; labelIt: string; groupId: string }[] }));

export default async function SubmitNewPage() {
  let countries: { id: string; name: string }[] = [];
  let groups = fallbackGroups;
  let warning = '';

  try {
    const [dbCountries, dbGroups] = await Promise.all([
      prisma.country.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
      prisma.taxonomyGroup.findMany({
        where: { slug: { in: ['typological', 'thematic', 'practices', 'framing', 'formats', 'tone', 'scripto', 'microforms'] } },
        include: { terms: { select: { id: true, labelIt: true, groupId: true }, orderBy: { labelIt: 'asc' } } },
        orderBy: { slug: 'asc' }
      })
    ]);
    countries = dbCountries;
    groups = dbGroups;
  } catch {
    warning = 'Database non raggiungibile: il form è visibile ma i metadati dipendenti dal DB non sono caricati.';
  }

  return (
    <section className="space-y-5">
      <h1 className="atlas-title">Contribuisci: nuovo trend mappato</h1>
      <p className="text-sm text-neutral-700">
        Inserisci un trend culturale/digitale e seleziona i metadati necessari per classificazione cartografica e workflow editoriale.
      </p>
      {warning ? <p className="rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">{warning}</p> : null}
      <SubmitTrendForm countries={countries} groups={groups} />
    </section>
  );
}
