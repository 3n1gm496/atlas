'use client';

import Link from 'next/link';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '@/components/i18n-provider';

type MapEntry = {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  countryName: string;
  placeName?: string | null;
  timePeriodLabel?: string | null;
  featured?: boolean;
  sheetRowNumber?: number | null;
  sheetKey?: string | null;
  mediaAssetCount?: number;
  taxonomyTerms?: string[];
  taxonomyByGroup?: Record<string, string[]>;
  lat: number;
  lng: number;
};

type LeafletPopup = {
  bindPopup: (content: string) => LeafletPopup;
  on: (event: 'click', handler: () => void) => LeafletPopup;
  openPopup?: () => void;
};

type LeafletLayerGroup = {
  addTo: (map: LeafletMap) => void;
  clearLayers: () => void;
  addLayer: (marker: LeafletPopup) => void;
};

type LeafletMap = {
  remove: () => void;
  getZoom: () => number;
  fitBounds: (bounds: unknown, options: { padding: [number, number]; maxZoom: number }) => void;
  flyTo: (coords: [number, number], zoom: number, options: { duration: number }) => void;
};

type LeafletApi = {
  tileLayer: (url: string, options: Record<string, unknown>) => unknown;
  map: (element: HTMLDivElement, options: Record<string, unknown>) => LeafletMap;
  layerGroup: () => LeafletLayerGroup;
  markerClusterGroup?: () => LeafletLayerGroup;
  marker: (coords: [number, number], options: Record<string, unknown>) => LeafletPopup;
  divIcon: (options: Record<string, unknown>) => unknown;
  latLngBounds: (coords: [number, number][]) => unknown;
};

type MarkerRegistry = Map<string, LeafletPopup>;

function parseYearRange(label?: string | null) {
  if (!label) return null;
  const years = label.match(/\d{4}/g)?.map(Number) ?? [];
  if (years.length === 0) return null;
  return {
    start: Math.min(...years),
    end: Math.max(...years)
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function getGroupValues(entry: MapEntry, matcher: string[]) {
  return Object.entries(entry.taxonomyByGroup ?? {})
    .filter(([group]) => matcher.some((term) => group.toLowerCase().includes(term)))
    .flatMap(([, values]) => values);
}

function getCollection(entries: MapEntry[], matcher: string[]) {
  return uniqueSorted(entries.flatMap((entry) => getGroupValues(entry, matcher)));
}

export function LeafletMapExplorer({ entries }: { entries: MapEntry[] }) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [activeCountry, setActiveCountry] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [activeTheme, setActiveTheme] = useState('all');
  const [activeFormat, setActiveFormat] = useState('all');
  const [activeKnowHow, setActiveKnowHow] = useState('all');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapBootError, setMapBootError] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<{ map: LeafletMap; L: LeafletApi } | null>(null);
  const markerLayerRef = useRef<LeafletLayerGroup | null>(null);
  const markerRegistryRef = useRef<MarkerRegistry>(new Map());

  const validEntries = useMemo(
    () => entries.filter((entry) => Number.isFinite(entry.lat) && Number.isFinite(entry.lng) && !(entry.lat === 0 && entry.lng === 0)),
    [entries]
  );

  const countries = useMemo(() => ['all', ...uniqueSorted(validEntries.map((entry) => entry.countryName))], [validEntries]);
  const types = useMemo(() => ['all', ...getCollection(validEntries, ['tipologia', 'type'])], [validEntries]);
  const themes = useMemo(() => ['all', ...getCollection(validEntries, ['tematic', 'theme'])], [validEntries]);
  const formats = useMemo(() => ['all', ...getCollection(validEntries, ['format'])], [validEntries]);
  const knowHowValues = useMemo(() => ['all', ...getCollection(validEntries, ['pratic', 'know'])], [validEntries]);

  const years = useMemo(() => {
    const allYears = validEntries.flatMap((entry) => {
      const range = parseYearRange(entry.timePeriodLabel);
      if (!range) return [];
      return Array.from({ length: range.end - range.start + 1 }, (_, index) => range.start + index);
    });
    return uniqueSorted(allYears.map(String)).map(Number);
  }, [validEntries]);

  const filtered = useMemo(() => {
    return validEntries.filter((entry) => {
      const haystack = `${entry.title} ${entry.abstract} ${entry.placeName ?? ''} ${entry.countryName} ${(entry.taxonomyTerms ?? []).join(' ')}`.toLowerCase();
      const matchesQuery = haystack.includes(deferredQuery.trim().toLowerCase());
      const matchesCountry = activeCountry === 'all' || entry.countryName === activeCountry;
      const matchesType = activeType === 'all' || getGroupValues(entry, ['tipologia', 'type']).includes(activeType);
      const matchesTheme = activeTheme === 'all' || getGroupValues(entry, ['tematic', 'theme']).includes(activeTheme);
      const matchesFormat = activeFormat === 'all' || getGroupValues(entry, ['format']).includes(activeFormat);
      const matchesKnowHow = activeKnowHow === 'all' || getGroupValues(entry, ['pratic', 'know']).includes(activeKnowHow);
      const range = parseYearRange(entry.timePeriodLabel);
      const matchesYear = selectedYear === null || (range ? selectedYear >= range.start && selectedYear <= range.end : false);
      return matchesQuery && matchesCountry && matchesType && matchesTheme && matchesFormat && matchesKnowHow && matchesYear;
    });
  }, [activeCountry, activeFormat, activeKnowHow, activeTheme, activeType, deferredQuery, selectedYear, validEntries]);

  const highlightedEntry = useMemo(
    () => filtered.find((entry) => entry.id === selectedId) ?? filtered[0] ?? null,
    [filtered, selectedId]
  );

  const hasActiveFilters =
    query || activeCountry !== 'all' || activeType !== 'all' || activeTheme !== 'all' || activeFormat !== 'all' || activeKnowHow !== 'all' || selectedYear !== null;

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    let retryTimer: number | null = null;

    function init() {
      if (!mapElementRef.current || mapRef.current) return;
      const L = (window as unknown as { L?: LeafletApi }).L;
      if (!L) {
        attempts += 1;
        if (attempts >= 12) {
          setMapBootError(t('mapExplorer.errors.load'));
          return;
        }
        retryTimer = window.setTimeout(init, 250);
        return;
      }
      if (cancelled || !mapElementRef.current) return;
      setMapBootError(null);

      const light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      });

      const map = L.map(mapElementRef.current, {
        center: [35, 18],
        zoom: 4,
        scrollWheelZoom: true,
        layers: [light]
      });

      const markerLayer = typeof L.markerClusterGroup === 'function' ? L.markerClusterGroup() : L.layerGroup();
      markerLayer.addTo(map);

      mapRef.current = { map, L };
      markerLayerRef.current = markerLayer;
    }

    init();

    return () => {
      cancelled = true;
      if (retryTimer) window.clearTimeout(retryTimer);
      if (mapRef.current?.map) {
        mapRef.current.map.remove();
        mapRef.current = null;
        markerLayerRef.current = null;
        markerRegistryRef.current = new Map();
      }
    };
  }, [t]);

  useEffect(() => {
    const mapState = mapRef.current;
    const markerLayer = markerLayerRef.current;
    if (!mapState || !markerLayer) return;
    const { map, L } = mapState;

    markerRegistryRef.current.clear();
    markerLayer.clearLayers();

    if (!filtered.length) return;

    filtered.forEach((entry) => {
      const color = entry.featured ? '#7d4725' : '#2d6c55';
      const marker = L.marker([entry.lat, entry.lng], {
        icon: L.divIcon({
          className: 'atlas-map-div-icon',
          html: `<span class="atlas-map-marker${entry.id === highlightedEntry?.id ? ' atlas-map-marker--active' : ''}" style="--marker-color:${color}"></span>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
      });

      marker.bindPopup(
        `<div class="space-y-1"><strong>${escapeHtml(entry.title)}</strong><br/>${escapeHtml(entry.countryName)} · ${escapeHtml(
          entry.placeName ?? t('mapExplorer.fallback.place')
        )}<br/>${escapeHtml(entry.timePeriodLabel ?? t('mapExplorer.fallback.period'))}</div>`
      );
      marker.on('click', () => setSelectedId(entry.id));
      markerRegistryRef.current.set(entry.id, marker);
      markerLayer.addLayer(marker);
    });

    const bounds = L.latLngBounds(filtered.map((entry) => [entry.lat, entry.lng]));
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 6 });
  }, [filtered, highlightedEntry?.id, t]);

  useEffect(() => {
    if (!highlightedEntry || !mapRef.current) return;
    const marker = markerRegistryRef.current.get(highlightedEntry.id);
    if (!marker) return;

    mapRef.current.map.flyTo([highlightedEntry.lat, highlightedEntry.lng], Math.max(mapRef.current.map.getZoom(), 5), {
      duration: 0.45
    });

    if (typeof marker.openPopup === 'function') {
      marker.openPopup();
    }
  }, [highlightedEntry]);

  const visibleCount = filtered.length;
  const featuredCount = filtered.filter((entry) => entry.featured).length;
  const activeYearLabel = selectedYear === null ? t('mapExplorer.filters.allYears') : String(selectedYear);

  return (
    <div className="space-y-5">
      <section className="atlas-dark-card min-w-0 space-y-5">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 space-y-3">
            <p className="atlas-kicker">{t('mapExplorer.hero.kicker')}</p>
            <h2 className="atlas-section-title break-words text-5xl">{t('mapExplorer.hero.title')}</h2>
            <p className="atlas-body max-w-3xl break-words">
              {t('mapExplorer.hero.body')}
            </p>
          </div>
          <div className="grid min-w-0 gap-3 sm:grid-cols-3 lg:w-[28rem]">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4">
              <p className="atlas-meta">{t('mapExplorer.stats.visible')}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{visibleCount}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4">
              <p className="atlas-meta">{t('mapExplorer.stats.featured')}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{featuredCount}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4">
              <p className="atlas-meta">{t('mapExplorer.stats.year')}</p>
              <p className="mt-2 text-lg font-semibold text-white">{activeYearLabel}</p>
            </div>
          </div>
        </div>

        <div className="atlas-filter-bar grid min-w-0 gap-3 lg:grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr_0.8fr_0.8fr]">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('mapExplorer.filters.searchPlaceholder')} className="atlas-input" aria-label={t('mapExplorer.filters.searchAria')} />
          <select value={activeCountry} onChange={(event) => setActiveCountry(event.target.value)} className="atlas-select" aria-label={t('mapExplorer.filters.countryAria')}>
            {countries.map((value) => (
              <option key={value} value={value}>
                {value === 'all' ? t('mapExplorer.filters.allCountries') : value}
              </option>
            ))}
          </select>
          <select value={activeType} onChange={(event) => setActiveType(event.target.value)} className="atlas-select" aria-label={t('mapExplorer.filters.typeAria')}>
            {types.map((value) => (
              <option key={value} value={value}>
                {value === 'all' ? t('mapExplorer.filters.allTypes') : value}
              </option>
            ))}
          </select>
          <select value={activeTheme} onChange={(event) => setActiveTheme(event.target.value)} className="atlas-select" aria-label={t('mapExplorer.filters.themeAria')}>
            {themes.map((value) => (
              <option key={value} value={value}>
                {value === 'all' ? t('mapExplorer.filters.allThemes') : value}
              </option>
            ))}
          </select>
          <select value={activeFormat} onChange={(event) => setActiveFormat(event.target.value)} className="atlas-select" aria-label={t('mapExplorer.filters.formatAria')}>
            {formats.map((value) => (
              <option key={value} value={value}>
                {value === 'all' ? t('mapExplorer.filters.allFormats') : value}
              </option>
            ))}
          </select>
          <select value={activeKnowHow} onChange={(event) => setActiveKnowHow(event.target.value)} className="atlas-select" aria-label={t('mapExplorer.filters.knowHowAria')}>
            {knowHowValues.map((value) => (
              <option key={value} value={value}>
                {value === 'all' ? t('mapExplorer.filters.allKnowHow') : value}
              </option>
            ))}
          </select>
        </div>

        <div className="atlas-action-strip">
          {hasActiveFilters ? (
            <>
              {query ? <button type="button" onClick={() => setQuery('')} className="atlas-chip atlas-chip-active">{t('mapExplorer.filters.queryChip')}</button> : null}
              {activeCountry !== 'all' ? <button type="button" onClick={() => setActiveCountry('all')} className="atlas-chip atlas-chip-active">{activeCountry} · {t('mapExplorer.filters.remove')}</button> : null}
              {activeType !== 'all' ? <button type="button" onClick={() => setActiveType('all')} className="atlas-chip atlas-chip-active">{activeType} · {t('mapExplorer.filters.remove')}</button> : null}
              {activeTheme !== 'all' ? <button type="button" onClick={() => setActiveTheme('all')} className="atlas-chip atlas-chip-active">{activeTheme} · {t('mapExplorer.filters.remove')}</button> : null}
              {activeFormat !== 'all' ? <button type="button" onClick={() => setActiveFormat('all')} className="atlas-chip atlas-chip-active">{activeFormat} · {t('mapExplorer.filters.remove')}</button> : null}
              {activeKnowHow !== 'all' ? <button type="button" onClick={() => setActiveKnowHow('all')} className="atlas-chip atlas-chip-active">{activeKnowHow} · {t('mapExplorer.filters.remove')}</button> : null}
              {selectedYear !== null ? <button type="button" onClick={() => setSelectedYear(null)} className="atlas-chip atlas-chip-active">{selectedYear} · {t('mapExplorer.filters.remove')}</button> : null}
            </>
          ) : (
            <span className="atlas-chip">{t('mapExplorer.filters.none')}</span>
          )}
        </div>

        {years.length > 0 ? (
          <div className="rounded-[1.7rem] border border-white/10 bg-white/8 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="atlas-kicker">{t('mapExplorer.year.kicker')}</p>
                <p className="text-sm text-white/78">{t('mapExplorer.year.body')}</p>
              </div>
              <button type="button" onClick={() => setSelectedYear(null)} className="atlas-link-secondary">
                {t('mapExplorer.year.reset')}
              </button>
            </div>
            <div className="mt-4">
              <input
                type="range"
                min={years[0]}
                max={years[years.length - 1]}
                step={1}
                value={selectedYear ?? years[years.length - 1]}
                onChange={(event) => setSelectedYear(Number(event.target.value))}
                className="w-full accent-[color:var(--atlas-accent)]"
              />
              <div className="mt-2 flex justify-between text-xs text-white/60">
                <span>{years[0]}</span>
                <span>{years[years.length - 1]}</span>
              </div>
            </div>
          </div>
        ) : null}

        {mapBootError ? (
          <div className="rounded-[1.5rem] border border-[rgba(154,99,36,0.35)] bg-[rgba(234,216,200,0.62)] px-4 py-3 text-sm text-[color:var(--atlas-warning)]">
            {mapBootError}
          </div>
        ) : null}

        <div ref={mapElementRef} className="h-[58vh] min-h-[28rem] max-w-full overflow-hidden rounded-[2.1rem] border border-white/10 shadow-[0_22px_60px_rgba(0,0,0,0.25)] md:h-[68vh] xl:h-[72vh]" />
      </section>

      <div className="grid gap-5 xl:grid-cols-[0.58fr_0.42fr]">
        <div className="atlas-dark-card min-w-0 space-y-4">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="atlas-kicker">{t('mapExplorer.preview.kicker')}</p>
              <h2 className="atlas-section-title break-words text-4xl">{t('mapExplorer.preview.title')}</h2>
            </div>
            <span className="atlas-chip">{t('mapExplorer.preview.results', { count: visibleCount })}</span>
          </div>
          {highlightedEntry ? (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex min-w-0 flex-wrap gap-2">
                  <span className="atlas-badge-status">{highlightedEntry.countryName}</span>
                  {highlightedEntry.featured ? <span className="atlas-chip atlas-chip-active">{t('mapExplorer.preview.featured')}</span> : null}
                  {highlightedEntry.sheetKey ? <span className="atlas-chip">{highlightedEntry.sheetKey}</span> : null}
                  {highlightedEntry.sheetRowNumber ? <span className="atlas-chip">riga {highlightedEntry.sheetRowNumber}</span> : null}
                  <span className="atlas-chip">{highlightedEntry.mediaAssetCount ?? 0} media</span>
                  {(highlightedEntry.taxonomyTerms ?? []).slice(0, 4).map((term) => (
                    <span key={`${highlightedEntry.id}-${term}`} className="atlas-chip">
                      {term}
                    </span>
                  ))}
                </div>
                <h3 className="break-words font-[family-name:var(--font-atlas-display)] text-5xl font-semibold leading-[0.95] text-white">{highlightedEntry.title}</h3>
                <p className="break-words text-sm leading-7 text-white/80">{highlightedEntry.abstract}</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/8 p-4">
                    <p className="atlas-meta">{t('mapExplorer.preview.place')}</p>
                    <p className="mt-2 text-sm text-white">{highlightedEntry.placeName ?? t('mapExplorer.fallback.place')}</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/8 p-4">
                    <p className="atlas-meta">{t('mapExplorer.preview.period')}</p>
                    <p className="mt-2 text-sm text-white">{highlightedEntry.timePeriodLabel ?? t('mapExplorer.fallback.period')}</p>
                  </div>
                </div>
              </div>
              <div className="atlas-action-strip">
                <Link href={`/entry/${highlightedEntry.slug}`} className="atlas-link-primary">
                  {t('mapExplorer.preview.open')}
                </Link>
                <button type="button" onClick={() => setActiveCountry(highlightedEntry.countryName)} className="atlas-link-secondary">
                  {t('mapExplorer.preview.moreCountry')}
                </button>
              </div>
            </div>
          ) : (
            <div className="atlas-empty">{t('mapExplorer.preview.empty')}</div>
          )}
        </div>

        <div className="atlas-card min-w-0 space-y-3">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="atlas-kicker">{t('mapExplorer.list.kicker')}</p>
              <h2 className="text-xl font-semibold text-[color:var(--atlas-ink-1)]">{t('mapExplorer.list.title')}</h2>
            </div>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setActiveCountry('all');
                  setActiveType('all');
                  setActiveTheme('all');
                  setActiveFormat('all');
                  setActiveKnowHow('all');
                  setSelectedYear(null);
                }}
                className="atlas-link-secondary"
              >
                {t('mapExplorer.list.reset')}
              </button>
            ) : null}
          </div>
          <div className="atlas-subtle-scrollbar max-h-[680px] space-y-3 overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <div className="atlas-empty">{t('mapExplorer.list.empty')}</div>
            ) : (
              filtered.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/entry/${entry.slug}`}
                  onMouseEnter={() => setSelectedId(entry.id)}
                  className={`block rounded-[1.6rem] border px-4 py-4 text-left ${
                    highlightedEntry?.id === entry.id ? 'border-[color:var(--atlas-accent)] bg-[rgba(255,251,247,0.9)] shadow-sm' : 'border-[rgba(112,83,61,0.14)] bg-white'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="atlas-badge-status">{entry.countryName}</span>
                    {entry.sheetKey ? <span className="atlas-chip">{entry.sheetKey}</span> : null}
                    {entry.sheetRowNumber ? <span className="atlas-chip">riga {entry.sheetRowNumber}</span> : null}
                    <span className="atlas-chip">{entry.mediaAssetCount ?? 0} media</span>
                    {(entry.taxonomyTerms ?? []).slice(0, 3).map((term) => (
                      <span key={`${entry.id}-${term}`} className="atlas-chip">
                        {term}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-lg font-semibold leading-tight text-[color:var(--atlas-ink-1)]">{entry.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--atlas-ink-2)]">{entry.abstract}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
