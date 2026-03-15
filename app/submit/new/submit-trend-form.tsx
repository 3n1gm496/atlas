'use client';

import { FormEvent, useState } from 'react';

type Country = { id: string; name: string };
type TaxonomyTerm = { id: string; labelIt: string; groupId: string };
type TaxonomyGroup = { id: string; slug: string; labelIt: string; terms: TaxonomyTerm[] };

type Props = {
  countries: Country[];
  groups: TaxonomyGroup[];
};

type TrendMetadataArrayKey = Exclude<keyof TrendMetadata, 'trendSummary'>;

function slugToMetadataKey(slug: string): TrendMetadataArrayKey {
  const map: Record<string, TrendMetadataArrayKey> = {
    typological: 'typologicalObjective',
    thematic: 'thematicCategories',
    practices: 'preferredPractices',
    framing: 'culturalFramings',
    formats: 'technoCreativeFormats',
    tone: 'tones',
    scripto: 'scriptoIconicSubcategories',
    microforms: 'microforms'
  };
  return map[slug] ?? 'thematicCategories';
}

type TrendMetadata = {
  typologicalObjective: string[];
  thematicCategories: string[];
  preferredPractices: string[];
  culturalFramings: string[];
  technoCreativeFormats: string[];
  tones: string[];
  scriptoIconicSubcategories: string[];
  microforms: string[];
  trendSummary?: string;
};

export function SubmitTrendForm({ countries, groups }: Props) {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);


  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoading(true);
    setStatus('Salvataggio in corso...');

    const selectedTermIds = formData.getAll('taxonomyTermIds').map(String);

    const trendMetadata: TrendMetadata = {
      typologicalObjective: [],
      thematicCategories: [],
      preferredPractices: [],
      culturalFramings: [],
      technoCreativeFormats: [],
      tones: [],
      scriptoIconicSubcategories: [],
      microforms: [],
      trendSummary: String(formData.get('trendSummary') ?? '')
    };

    groups.forEach((group) => {
      const selectedInGroup = group.terms
        .filter((term) => selectedTermIds.includes(term.id))
        .map((term) => term.labelIt);
      const key = slugToMetadataKey(group.slug);
      trendMetadata[key] = selectedInGroup;
    });

    const payload = {
      slug: String(formData.get('slug')),
      title: String(formData.get('title')),
      abstract: String(formData.get('abstract')),
      description: String(formData.get('description')),
      canonicalLanguage: String(formData.get('canonicalLanguage')),
      countryId: String(formData.get('countryId')),
      placeName: String(formData.get('placeName') ?? ''),
      lat: formData.get('lat') ? Number(formData.get('lat')) : undefined,
      lng: formData.get('lng') ? Number(formData.get('lng')) : undefined,
      timePeriodLabel: String(formData.get('timePeriodLabel') ?? ''),
      sourceContext: String(formData.get('sourceContext') ?? ''),
      taxonomyTermIds: selectedTermIds,
      keywords: String(formData.get('keywords') ?? '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
      hashtags: String(formData.get('hashtags') ?? '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
      trendMetadata
    };

    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const body = await response.json();
        setStatus(`Errore: ${body.error ?? 'impossibile salvare'}`);
      } else {
        const body = await response.json();
        setStatus(`Trend salvato in bozza (ID: ${body.id}).`);
        event.currentTarget.reset();
      }
    } catch {
      setStatus('Errore di rete durante il salvataggio.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <section className="atlas-card grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span>Slug</span>
          <input name="slug" required className="w-full rounded border border-atlas-muted px-3 py-2" />
        </label>
        <label className="space-y-1 text-sm">
          <span>Titolo trend</span>
          <input name="title" required className="w-full rounded border border-atlas-muted px-3 py-2" />
        </label>
        <label className="space-y-1 text-sm md:col-span-2">
          <span>Abstract</span>
          <textarea name="abstract" required rows={3} className="w-full rounded border border-atlas-muted px-3 py-2" />
        </label>
        <label className="space-y-1 text-sm md:col-span-2">
          <span>Descrizione critica</span>
          <textarea name="description" required rows={6} className="w-full rounded border border-atlas-muted px-3 py-2" />
        </label>
      </section>

      <section className="atlas-card grid gap-4 md:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span>Lingua</span>
          <select name="canonicalLanguage" className="w-full rounded border border-atlas-muted px-3 py-2">
            <option value="it">Italiano</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span>Paese</span>
          <select name="countryId" required className="w-full rounded border border-atlas-muted px-3 py-2">
            <option value="">Seleziona...</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span>Luogo</span>
          <input name="placeName" className="w-full rounded border border-atlas-muted px-3 py-2" />
        </label>
        <label className="space-y-1 text-sm">
          <span>Latitudine</span>
          <input type="number" step="0.0001" name="lat" className="w-full rounded border border-atlas-muted px-3 py-2" />
        </label>
        <label className="space-y-1 text-sm">
          <span>Longitudine</span>
          <input type="number" step="0.0001" name="lng" className="w-full rounded border border-atlas-muted px-3 py-2" />
        </label>
        <label className="space-y-1 text-sm">
          <span>Periodo</span>
          <input name="timePeriodLabel" className="w-full rounded border border-atlas-muted px-3 py-2" />
        </label>
      </section>

      <section className="atlas-card space-y-4">
        <h2 className="text-lg font-semibold">Metadati trend per la mappa</h2>
        <p className="text-sm text-neutral-600">
          Seleziona i metadati analitici del trend: saranno usati per classificazione, filtri e connessioni cartografiche.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <fieldset key={group.id} className="rounded border border-atlas-muted p-3">
              <legend className="px-1 text-sm font-semibold">{group.labelIt}</legend>
              <div className="mt-2 max-h-40 space-y-2 overflow-auto pr-2 text-sm">
                {group.terms.map((term) => (
                  <label key={term.id} className="flex items-start gap-2">
                    <input type="checkbox" name="taxonomyTermIds" value={term.id} />
                    <span>{term.labelIt}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      <section className="atlas-card grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span>Keywords (separate da virgola)</span>
          <input name="keywords" className="w-full rounded border border-atlas-muted px-3 py-2" placeholder="artigianato digitale, memoria visiva" />
        </label>
        <label className="space-y-1 text-sm">
          <span>Hashtags (separati da virgola)</span>
          <input name="hashtags" className="w-full rounded border border-atlas-muted px-3 py-2" placeholder="#diaspora #digitalfashion" />
        </label>
        <label className="space-y-1 text-sm md:col-span-2">
          <span>Contesto sorgente</span>
          <input name="sourceContext" className="w-full rounded border border-atlas-muted px-3 py-2" />
        </label>
        <label className="space-y-1 text-sm md:col-span-2">
          <span>Sintesi trend</span>
          <textarea name="trendSummary" rows={3} className="w-full rounded border border-atlas-muted px-3 py-2" />
        </label>
      </section>

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? 'Salvataggio...' : 'Salva trend in bozza'}
      </button>
      {status ? <p className="text-sm text-neutral-700">{status}</p> : null}
    </form>
  );
}
