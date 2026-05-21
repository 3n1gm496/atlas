import './globals.css';
import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import Script from 'next/script';
import { Nav } from '@/components/nav';
import { Providers } from '@/components/providers';
import { getI18n } from '@/lib/i18n/server';

const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-atlas-display',
  weight: ['500', '600', '700']
});

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-atlas-body',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'ANTICORES',
  description: 'A cartography of digital fashion aesthetics.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, t } = getI18n();

  return (
    <html lang={locale} className={`${displayFont.variable} ${bodyFont.variable}`}>
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
      <body className="overflow-x-hidden font-[family-name:var(--font-atlas-body)]">
        <Providers locale={locale}>
          <a href="#main-content" className="atlas-skip-link">
            {t('common.skipToContent')}
          </a>
          <Nav />
          <main id="main-content" className="container py-8 sm:py-10">
            {children}
          </main>
          <footer className="mt-14 border-t border-[rgba(112,83,61,0.15)] bg-[rgba(255,251,247,0.45)] py-8">
            <div className="container flex flex-col gap-3 text-xs text-[color:var(--atlas-ink-3)] sm:flex-row sm:items-center sm:justify-between">
              <p>{t('footer.line1')}</p>
              <p>{t('footer.line2')}</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
