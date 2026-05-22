import { AtlasRole } from '@/lib/auth/rbac';
import { defaultLocale, type Locale } from '@/lib/i18n/messages';
import { entryStatuses, reviewPriorities } from '@/lib/validation/entry';

const roleLabels: Record<Locale, Record<string, string>> = {
  en: {
    public_visitor: 'Visitor',
    contributor: 'Contributor',
    editor: 'Editor',
    research_admin: 'Research admin',
    super_admin: 'Super admin',
    guest: 'Guest'
  },
  it: {
    public_visitor: 'Visitatore',
    contributor: 'Contributor',
    editor: 'Editor',
    research_admin: 'Research admin',
    super_admin: 'Super admin',
    guest: 'Ospite'
  },
  fr: {
    public_visitor: 'Visiteur',
    contributor: 'Contributeur',
    editor: 'Editeur',
    research_admin: 'Research admin',
    super_admin: 'Super admin',
    guest: 'Invite'
  }
};

const entryStatusLabels: Record<Locale, Record<(typeof entryStatuses)[number], string>> = {
  en: {
    draft: 'Draft',
    submitted: 'Submitted',
    under_review: 'In review',
    changes_requested: 'Changes requested',
    approved: 'Approved',
    published: 'Published',
    rejected: 'Rejected',
    archived: 'Archived'
  },
  it: {
    draft: 'Bozza',
    submitted: 'Sottomessa',
    under_review: 'In review',
    changes_requested: 'Modifiche richieste',
    approved: 'Approvata',
    published: 'Pubblicata',
    rejected: 'Respinta',
    archived: 'Archiviata'
  },
  fr: {
    draft: 'Brouillon',
    submitted: 'Soumise',
    under_review: 'En revue',
    changes_requested: 'Modifications demandees',
    approved: 'Approuvee',
    published: 'Publiee',
    rejected: 'Rejetee',
    archived: 'Archivee'
  }
};

const reviewPriorityLabels: Record<Locale, Record<(typeof reviewPriorities)[number], string>> = {
  en: {
    low: 'Low',
    medium: 'Medium',
    high: 'High'
  },
  it: {
    low: 'Bassa',
    medium: 'Media',
    high: 'Alta'
  },
  fr: {
    low: 'Faible',
    medium: 'Moyenne',
    high: 'Elevee'
  }
};

const mediaMatchLabels: Record<Locale, Record<string, string>> = {
  en: {
    matched: 'Matched',
    partial: 'Partial',
    missing: 'Missing',
    orphan: 'Orphan'
  },
  it: {
    matched: 'Corrisposto',
    partial: 'Parziale',
    missing: 'Mancante',
    orphan: 'Orfano'
  },
  fr: {
    matched: 'Apparie',
    partial: 'Partiel',
    missing: 'Manquant',
    orphan: 'Orphelin'
  }
};

const mediaMatchedByLabels: Record<Locale, Record<'canonical' | 'legacy' | 'alias', string>> = {
  en: {
    canonical: 'Matched via canonical key',
    legacy: 'Matched via legacy key',
    alias: 'Matched via alias'
  },
  it: {
    canonical: 'Corrisposto tramite chiave canonica',
    legacy: 'Corrisposto tramite chiave legacy',
    alias: 'Corrisposto tramite alias'
  },
  fr: {
    canonical: 'Apparié via la clé canonique',
    legacy: 'Apparié via la clé héritée',
    alias: 'Apparié via un alias'
  }
};

function resolveLocale(locale?: Locale) {
  return locale ?? defaultLocale;
}

export function getRoleLabel(role: AtlasRole | 'guest' | string, locale?: Locale) {
  const resolved = resolveLocale(locale);
  return roleLabels[resolved]?.[role] ?? roleLabels[defaultLocale]?.[role] ?? role;
}

export function getStatusLabel(status: (typeof entryStatuses)[number] | string, locale?: Locale) {
  const resolved = resolveLocale(locale);
  return entryStatusLabels[resolved]?.[status as (typeof entryStatuses)[number]] ?? status;
}

export function getReviewPriorityLabel(priority: (typeof reviewPriorities)[number] | string, locale?: Locale) {
  const resolved = resolveLocale(locale);
  return reviewPriorityLabels[resolved]?.[priority as (typeof reviewPriorities)[number]] ?? priority;
}

export function getMediaMatchLabel(status: string | null | undefined, locale?: Locale) {
  if (!status) return status ?? '';
  const resolved = resolveLocale(locale);
  return mediaMatchLabels[resolved]?.[status] ?? mediaMatchLabels[defaultLocale]?.[status] ?? status;
}

export function getMediaMatchedByLabel(status: string | null | undefined, locale?: Locale) {
  if (!status || status === 'none') return null;
  const resolved = resolveLocale(locale);
  return mediaMatchedByLabels[resolved]?.[status as 'canonical' | 'legacy' | 'alias'] ?? status;
}
