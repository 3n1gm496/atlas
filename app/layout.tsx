import './globals.css';
import type { Metadata } from 'next';
import { Nav } from '@/components/nav';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'ATLAS - Cartografia dinamica delle scritture digitali della moda',
  description: 'Piattaforma di ricerca e archivio partecipativo per le scritture digitali della moda.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
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
