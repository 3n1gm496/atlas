import { prisma } from '@/lib/prisma';
import { fallbackCountries, fallbackGroups } from '@/lib/atlas-taxonomy';
import { SubmitTrendForm } from './submit-trend-form';

export const dynamic = 'force-dynamic';

export default async function SubmitNewPage() {
  let countries: { id: string; name: string }[] = fallbackCountries;
  let groups = fallbackGroups;

  try {
    const [dbCountries, dbGroups] = await Promise.all([
      prisma.country.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
      prisma.taxonomyGroup.findMany({
        where: { slug: { in: ['typological', 'thematic', 'practices', 'framing', 'formats', 'tone', 'scripto', 'microforms'] } },
        include: { terms: { select: { id: true, labelIt: true, groupId: true }, orderBy: { labelIt: 'asc' } } },
        orderBy: { slug: 'asc' }
      })
    ]);

    if (dbCountries.length) countries = dbCountries;
    if (dbGroups.length) groups = dbGroups;
  } catch {
    // Use curated fallback taxonomy/countries to keep contribution UI fully functional.
  }

  return (
    <section className="space-y-5">
      <h1 className="atlas-title">Contribuisci: nuovo trend mappato</h1>
      <p className="text-sm text-neutral-700">
        Inserisci un trend culturale/digitale e seleziona i metadati necessari per classificazione cartografica e workflow editoriale.
      </p>
      <SubmitTrendForm countries={countries} groups={groups} />
    </section>
  );
}
