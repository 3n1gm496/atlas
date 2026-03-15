import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Nav } from '@/components/nav';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'ATLAS - Cartografia dinamica delle scritture digitali della moda',
  description: 'Piattaforma di ricerca e archivio partecipativo per le scritture digitali della moda.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"
        />
        <Script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""
          strategy="beforeInteractive"
        />
        <Script
          src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="overflow-x-hidden">
        <Providers>
          <Nav />
          <main className="container py-8 sm:py-10">{children}</main>
          <footer className="mt-14 border-t border-atlas-muted bg-white/50 py-8">
            <div className="container flex flex-col gap-3 text-xs text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
              <p>ATLAS · Archivio critico delle scritture digitali della moda mediterranea.</p>
              <p>Ricerca, curatela, workflow editoriale e contributi distribuiti.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
