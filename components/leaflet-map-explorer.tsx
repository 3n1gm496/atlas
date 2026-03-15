'use client';

import Link from 'next/link';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { getStatusLabel } from '@/lib/demo-content';

type MapEntry = {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  countryName: string;
  status: string;
  placeName?: string | null;
  timePeriodLabel?: string | null;
  featured?: boolean;
  lat: number;
  lng: number;
};

type ThemeMode = 'status' | 'featured' | 'country';
type MarkerRegistry = Map<string, any>;

const STATUS_COLORS: Record<string, string> = {
  published: '#365944',
  under_review: '#9a6324',
  changes_requested: '#b44a3c',
  submitted: '#7b4d2a',
  draft: '#6b7280'
};

function parseYearRange(label?: string | null) {
  if (!label) return null;
  const years = label.match(/\d{4}/g)?.map(Number) ?? [];
  if (years.length === 0) return null;
  return {
    start: Math.min(...years),
    end: Math.max(...years)
  };
}

function normaliseClassName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getThemeValue(entry: MapEntry, theme: ThemeMode) {
  if (theme === 'featured') return entry.featured ? 'featured' : 'standard';
  if (theme === 'country') return normaliseClassName(entry.countryName);
  return entry.status;
}

function getMarkerColor(entry: MapEntry, theme: ThemeMode, palette: Record<string, string>) {
  if (theme === 'featured') return entry.featured ? '#7b4d2a' : '#b8aa99';
  if (theme === 'country') return palette[getThemeValue(entry, theme)] ?? '#365944';
  return STATUS_COLORS[entry.status] ?? '#365944';
}

function getLegendItems(entries: MapEntry[], theme: ThemeMode, palette: Record<string, string>) {
  if (theme === 'featured') {
    return [
      { label: 'Featured', color: '#7b4d2a' },
      { label: 'Standard', color: '#b8aa99' }
    ];
  }

  if (theme === 'country') {
    return Array.from(new Set(entries.map((entry) => entry.countryName)))
      .sort((a, b) => a.localeCompare(b))
      .map((country) => ({
        label: country,
        color: palette[normaliseClassName(country)] ?? '#365944'
      }));
  }

  return Array.from(new Set(entries.map((entry) => entry.status))).map((status) => ({
    label: getStatusLabel(status),
    color: STATUS_COLORS[status] ?? '#365944'
  }));
}

function buildCountryPalette(entries: MapEntry[]) {
  const colors = ['#365944', '#7b4d2a', '#9a6324', '#5d6d7e', '#8f3b76', '#3b6d8f', '#6b8e23', '#b44a3c'];
  return Array.from(new Set(entries.map((entry) => entry.countryName)))
    .sort((a, b) => a.localeCompare(b))
    .reduce<Record<string, string>>((acc, country, index) => {
      acc[normaliseClassName(country)] = colors[index % colors.length];
      return acc;
    }, {});
}

export function LeafletMapExplorer({ entries }: { entries: MapEntry[] }) {
  const [query, setQuery] = useState('');
  const [activeCountry, setActiveCountry] = useState('all');
  const [activeTheme, setActiveTheme] = useState<ThemeMode>('status');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerLayerRef = useRef<any>(null);
  const markerRegistryRef = useRef<MarkerRegistry>(new Map());

  const validEntries = useMemo(
    () => entries.filter((entry) => Number.isFinite(entry.lat) && Number.isFinite(entry.lng) && !(entry.lat === 0 && entry.lng === 0)),
    [entries]
  );

  const countryPalette = useMemo(() => buildCountryPalette(validEntries), [validEntries]);

  const countries = useMemo(
    () => ['all', ...Array.from(new Set(validEntries.map((entry) => entry.countryName))).sort((a, b) => a.localeCompare(b))],
    [validEntries]
  );

  const years = useMemo(() => {
    const allYears = validEntries.flatMap((entry) => {
      const range = parseYearRange(entry.timePeriodLabel);
      if (!range) return [];
      return Array.from({ length: range.end - range.start + 1 }, (_, index) => range.start + index);
    });
    return Array.from(new Set(allYears)).sort((a, b) => a - b);
  }, [validEntries]);

  const filtered = useMemo(() => {
    return validEntries.filter((entry) => {
      const matchesCountry = activeCountry === 'all' || entry.countryName === activeCountry;
      const haystack = `${entry.title} ${entry.abstract} ${entry.placeName ?? ''} ${entry.countryName}`.toLowerCase();
      const matchesQuery = haystack.includes(deferredQuery.trim().toLowerCase());
      const range = parseYearRange(entry.timePeriodLabel);
      const matchesYear = selectedYear === null || (range ? selectedYear >= range.start && selectedYear <= range.end : false);
      return matchesCountry && matchesQuery && matchesYear;
    });
  }, [activeCountry, deferredQuery, selectedYear, validEntries]);

  const highlightedEntry = useMemo(
    () => filtered.find((entry) => entry.id === selectedId) ?? filtered[0] ?? validEntries[0] ?? null,
    [filtered, selectedId, validEntries]
  );

  const legendItems = useMemo(() => getLegendItems(validEntries, activeTheme, countryPalette), [activeTheme, countryPalette, validEntries]);

  useEffect(() => {
    if (!selectedId && highlightedEntry) {
      setSelectedId(highlightedEntry.id);
    }
  }, [highlightedEntry, selectedId]);

  useEffect(() => {
    let cancelled = false;

    function init() {
      if (!mapElementRef.current || mapRef.current) return;
      const L = (window as Window & { L?: any }).L;
      if (!L) return;
      if (cancelled || !mapElementRef.current) return;

      const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      });
      const light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      });

      const map = L.map(mapElementRef.current, {
        center: [35, 18],
        zoom: 4,
        scrollWheelZoom: true,
        layers: [osm]
      });

      const layerControl = L.control.layers(
        {
          OpenStreetMap: osm,
          'CARTO Light': light
        },
        {},
        { position: 'topright' }
      );
      layerControl.addTo(map);

      const markerLayer = typeof L.markerClusterGroup === 'function' ? L.markerClusterGroup() : L.layerGroup();
      markerLayer.addTo(map);

      mapRef.current = { map, L };
      markerLayerRef.current = markerLayer;
    }

    init();

    return () => {
      cancelled = true;
      if (mapRef.current?.map) {
        mapRef.current.map.remove();
        mapRef.current = null;
        markerLayerRef.current = null;
        markerRegistryRef.current = new Map();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerLayerRef.current) return;
    const { map, L } = mapRef.current;

    markerRegistryRef.current.clear();
    markerLayerRef.current.clearLayers();

    const rows = filtered.length ? filtered : validEntries;
    if (!rows.length) return;

    rows.forEach((entry: MapEntry) => {
      const color = getMarkerColor(entry, activeTheme, countryPalette);
      const marker = L.marker([entry.lat, entry.lng], {
        icon: L.divIcon({
          className: 'atlas-map-div-icon',
          html: `<span class="atlas-map-marker${entry.id === highlightedEntry?.id ? ' atlas-map-marker--active' : ''}" style="--marker-color:${color}"></span>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
      });

      marker.bindPopup(
        `<div class="space-y-1"><strong>${entry.title}</strong><br/>${entry.countryName} · ${entry.placeName ?? 'Nodo territoriale'}<br/>${getStatusLabel(entry.status)}<br/>${entry.timePeriodLabel ?? 'Periodo non definito'}</div>`
      );
      marker.on('click', () => setSelectedId(entry.id));

      markerRegistryRef.current.set(entry.id, marker);
      markerLayerRef.current.addLayer(marker);
    });

    const bounds = L.latLngBounds(rows.map((entry: MapEntry) => [entry.lat, entry.lng]));
    map.fitBounds(bounds, { padding: [32, 32], maxZoom: 6 });
  }, [activeTheme, countryPalette, filtered, highlightedEntry?.id, validEntries]);

  useEffect(() => {
    if (!highlightedEntry || !mapRef.current) return;
    const marker = markerRegistryRef.current.get(highlightedEntry.id);
    if (!marker) return;

    mapRef.current.map.flyTo([highlightedEntry.lat, highlightedEntry.lng], Math.max(mapRef.current.map.getZoom(), 5), {
      duration: 0.5
    });

    if (typeof marker.openPopup === 'function') {
      marker.openPopup();
    }
  }, [highlightedEntry]);

  const visibleCount = filtered.length || validEntries.length;
  const featuredCount = filtered.filter((entry) => entry.featured).length;
  const activeYearLabel = selectedYear === null ? 'Tutti gli anni' : String(selectedYear);

  return (
    <div className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
      <aside className="atlas-card space-y-5">
        <div>
          <p className="atlas-kicker">Geo explorer</p>
          <h2 className="mt-2 text-2xl font-semibold">Mappa Leaflet avanzata</h2>
          <p className="mt-2 text-sm text-neutral-700">
            Cluster, filtri, timeline e viste tematiche per leggere il corpus come geografia editoriale.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="atlas-stat">
            <p className="text-sm text-neutral-600">Marker visibili</p>
            <p className="text-2xl font-semibold">{visibleCount}</p>
          </div>
          <div className="atlas-stat">
            <p className="text-sm text-neutral-600">Entry featured</p>
            <p className="text-2xl font-semibold">{featuredCount}</p>
          </div>
        </div>

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cerca luogo, titolo, paese..."
          className="rounded-2xl border border-atlas-muted px-4 py-3"
        />

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Paesi</p>
          <div className="flex flex-wrap gap-2">
            {countries.map((country) => (
              <button
                key={country}
                type="button"
                onClick={() => setActiveCountry(country)}
                className={`rounded-full px-3 py-2 text-sm transition ${
                  activeCountry === country ? 'bg-neutral-900 text-white' : 'border border-atlas-muted bg-white text-neutral-700'
                }`}
              >
                {country === 'all' ? 'Tutti' : country}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Layer tematici</p>
          <div className="flex flex-wrap gap-2">
            {([
              ['status', 'Stato'],
              ['featured', 'Featured'],
              ['country', 'Paese']
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setActiveTheme(value)}
                className={`rounded-full px-3 py-2 text-sm transition ${
                  activeTheme === value ? 'bg-[var(--atlas-accent)] text-white' : 'border border-atlas-muted bg-white text-neutral-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {years.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Timeline</p>
              <button
                type="button"
                onClick={() => setSelectedYear(null)}
                className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--atlas-accent)]"
              >
                Reset
              </button>
            </div>
            <div className="atlas-stat">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-neutral-600">Finestra attiva</span>
                <strong>{activeYearLabel}</strong>
              </div>
              <input
                type="range"
                min={years[0]}
                max={years[years.length - 1]}
                step={1}
                value={selectedYear ?? years[years.length - 1]}
                onChange={(event) => setSelectedYear(Number(event.target.value))}
                className="mt-4 w-full accent-[var(--atlas-accent)]"
              />
              <div className="mt-2 flex justify-between text-xs text-neutral-500">
                <span>{years[0]}</span>
                <span>{years[years.length - 1]}</span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Legenda</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {legendItems.map((item) => (
              <div key={item.label} className="atlas-stat flex items-center gap-3 p-3 text-sm">
                <span className="atlas-map-legend-dot" style={{ backgroundColor: item.color }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Nodi visibili</p>
            <p className="text-xs text-neutral-500">{visibleCount} risultati</p>
          </div>
          {filtered.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setSelectedId(entry.id)}
              className={`block w-full rounded-2xl border bg-white p-4 text-left transition ${
                highlightedEntry?.id === entry.id ? 'border-[var(--atlas-accent)] shadow-sm' : 'border-atlas-muted'
              }`}
            >
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                {entry.countryName} · {entry.placeName ?? 'Nodo territoriale'}
              </p>
              <h3 className="mt-2 font-semibold">{entry.title}</h3>
              <p className="mt-2 text-sm text-neutral-700">{entry.abstract}</p>
              <p className="mt-3 text-xs text-neutral-500">
                {getStatusLabel(entry.status)} · {entry.timePeriodLabel ?? 'Periodo non definito'}
              </p>
            </button>
          ))}
          {filtered.length === 0 ? <div className="atlas-empty">Nessuna entry corrisponde ai filtri correnti.</div> : null}
        </div>
      </aside>

      <section className="atlas-card space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="atlas-kicker">Mediterranean basemap</p>
            <h2 className="text-2xl font-semibold">Navigazione geografica reale</h2>
            <p className="mt-2 max-w-2xl text-sm text-neutral-700">
              La mappa raggruppa automaticamente i nodi vicini, cambia semantica visiva per stato o paese e ti accompagna su ogni entry.
            </p>
          </div>
          {highlightedEntry ? (
            <div className="atlas-stat max-w-md">
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Focus attivo · {highlightedEntry.countryName} · {highlightedEntry.placeName ?? 'Nodo territoriale'}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{highlightedEntry.title}</h3>
              <p className="mt-2 text-sm text-neutral-700">{highlightedEntry.abstract}</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-xs text-neutral-500">{highlightedEntry.timePeriodLabel ?? 'Periodo non definito'}</span>
                <Link href={`/entry/${highlightedEntry.slug}`} className="atlas-link-secondary">
                  Apri scheda
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        <div ref={mapElementRef} className="h-[560px] w-full overflow-hidden rounded-[2rem] border border-atlas-muted" />
      </section>
    </div>
  );
}
