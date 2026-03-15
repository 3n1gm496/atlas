import './globals.css';
import type { Metadata } from 'next';
import { Nav } from '@/components/nav';

export const metadata: Metadata = {
  title: 'ATLAS - Cartografia dinamica delle scritture digitali della moda',
  description: 'Piattaforma di ricerca e archivio partecipativo per le scritture digitali della moda.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <Nav />
        <main className="container py-8">{children}</main>
      </body>
    </html>
  );
}
