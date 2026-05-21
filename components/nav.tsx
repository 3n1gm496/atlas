'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useI18n } from '@/components/i18n-provider';

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const { t } = useI18n();
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role;
  const canAdmin = role === 'super_admin' || role === 'research_admin';
  const exploreLinks = [
    { href: '/map', label: t('nav.map') },
    { href: '/archive', label: t('nav.archive') },
    { href: '/collections', label: t('nav.collections') }
  ];
  const projectLinks = [
    { href: '/about', label: t('nav.projectPage') },
    { href: '/taxonomy', label: t('nav.taxonomies') },
    { href: '/contact', label: t('nav.contact') }
  ];

  const workspaceLinks = session
    ? [
        { href: '/submit/new', label: t('common.newCard'), visible: true },
        { href: '/review', label: t('nav.review'), visible: canAdmin },
        { href: '/admin', label: t('nav.admin'), visible: canAdmin },
        { href: '/account', label: t('nav.account'), visible: true }
      ].filter((link) => link.visible)
    : [];

  return (
    <NavContent
      key={pathname}
      t={t}
      session={session}
      exploreLinks={exploreLinks}
      projectLinks={projectLinks}
      workspaceLinks={workspaceLinks}
    />
  );
}

function NavContent({
  t,
  session,
  exploreLinks,
  projectLinks,
  workspaceLinks
}: {
  t: ReturnType<typeof useI18n>['t'];
  session: ReturnType<typeof useSession>['data'];
  exploreLinks: { href: string; label: string }[];
  projectLinks: { href: string; label: string }[];
  workspaceLinks: { href: string; label: string; visible?: boolean }[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const mobileMenuId = 'atlas-mobile-nav';

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(112,83,61,0.14)] bg-[rgba(247,241,234,0.82)] backdrop-blur-2xl">
      <div className="container flex items-center justify-between gap-3 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3 rounded-full px-1 py-1">
          <div className="hidden h-10 w-10 rounded-full border border-[rgba(112,83,61,0.16)] bg-[linear-gradient(135deg,var(--atlas-accent)_0%,#2f6b55_100%)] shadow-[0_10px_24px_rgba(24,17,13,0.12)] sm:block" />
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-atlas-display)] text-xl font-semibold leading-none text-[color:var(--atlas-ink-1)] sm:text-2xl">{t('brand.name')}</p>
            <p className="mt-1 hidden max-w-[24rem] truncate text-[11px] uppercase tracking-[0.18em] text-[color:var(--atlas-ink-3)] lg:block">{t('brand.subtitle')}</p>
          </div>
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-3 xl:flex">
          <nav className="flex items-center gap-1 rounded-full border border-[rgba(112,83,61,0.12)] bg-[rgba(255,252,248,0.6)] px-2 py-1.5">
            {exploreLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`atlas-nav-link ${isActive(pathname, link.href) ? 'atlas-nav-link-active' : ''}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <nav className="flex items-center gap-1 rounded-full border border-transparent px-1 py-1">
            {projectLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`atlas-nav-link ${isActive(pathname, link.href) ? 'atlas-nav-link-active' : ''}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <LanguageSwitcher />

          {session ? (
            <div className="flex items-center gap-2">
              <Link href="/submit/new" className="atlas-link-primary shadow-[0_14px_24px_rgba(24,17,13,0.18)]">
                {t('common.newCard')}
              </Link>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen((value) => !value)}
                  className={`atlas-nav-link rounded-full border border-[rgba(112,83,61,0.14)] bg-[rgba(255,252,248,0.78)] px-4 ${accountOpen ? 'atlas-nav-link-active border-[color:var(--atlas-ink-1)]' : ''}`}
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                >
                  {t('nav.account')}
                </button>
                {accountOpen ? (
                  <div className="absolute right-0 top-[calc(100%+0.6rem)] z-50 min-w-56 rounded-[1.25rem] border border-[rgba(112,83,61,0.14)] bg-[rgba(255,252,248,0.96)] p-2 shadow-[0_16px_40px_rgba(24,17,13,0.12)]">
                    <div className="grid gap-1">
                      {workspaceLinks.map((link) => (
                        <Link key={link.href} href={link.href} prefetch={false} className={`atlas-nav-link ${isActive(pathname, link.href) ? 'atlas-nav-link-active' : ''}`}>
                          {link.label}
                        </Link>
                      ))}
                      <button type="button" onClick={() => signOut({ callbackUrl: '/' })} className="atlas-nav-link text-left">
                        {t('common.signOut')}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <Link href="/login" className="atlas-link-primary">
              {t('common.signIn')}
            </Link>
          )}
        </div>

        <button
          type="button"
          className="rounded-full border border-[rgba(112,83,61,0.16)] bg-[rgba(255,252,248,0.72)] px-4 py-2 text-sm text-[color:var(--atlas-ink-2)] xl:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
          aria-expanded={open}
          aria-controls={mobileMenuId}
        >
          <span aria-hidden="true">{open ? t('common.close') : t('nav.menu')}</span>
        </button>
      </div>

      {open ? (
        <div id={mobileMenuId} className="container space-y-4 border-t border-[rgba(112,83,61,0.14)] bg-[rgba(249,244,238,0.94)] py-4 xl:hidden">
          <section className="atlas-dark-card space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="atlas-kicker">{t('nav.explore')}</p>
              <LanguageSwitcher />
            </div>
            <div className="grid gap-2">
              {exploreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={false}
                    onClick={() => setOpen(false)}
                    className={`atlas-nav-link justify-center ${isActive(pathname, link.href) ? 'atlas-nav-link-active' : 'bg-white/10 text-white'}`}
                  >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="atlas-card space-y-3">
            <p className="atlas-kicker">{t('nav.project')}</p>
            <div className="grid gap-2">
              {projectLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`atlas-nav-link justify-center ${isActive(pathname, link.href) ? 'atlas-nav-link-active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>

          {session ? (
            <section className="atlas-card space-y-3">
              <p className="atlas-kicker">{t('nav.workspace')}</p>
              <div className="grid gap-2">
                {workspaceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={false}
                    onClick={() => setOpen(false)}
                    className={`atlas-nav-link justify-center ${isActive(pathname, link.href) ? 'atlas-nav-link-active' : ''}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href="/submit/new" onClick={() => setOpen(false)} className="atlas-link-primary w-full">
                  {t('common.newCard')}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="atlas-nav-link justify-center"
                >
                  {t('common.signOut')}
                </button>
              </div>
            </section>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className="atlas-link-primary w-full">
              {t('common.signIn')}
            </Link>
          )}
        </div>
      ) : null}
    </header>
  );
}
