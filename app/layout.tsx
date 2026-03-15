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
      <body>
        <Providers>
          <Nav />
          <main className="container py-10">{children}</main>
          <footer className="mt-14 border-t border-atlas-muted py-8 text-center text-xs text-neutral-600">
            ATLAS · Archivio critico delle scritture digitali della moda mediterranea.
          </footer>
        </Providers>
      </body>
    </html>
  );
}

