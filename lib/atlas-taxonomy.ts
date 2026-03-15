export type FallbackCountry = { id: string; name: string };
export type FallbackTerm = { id: string; labelIt: string; groupId: string };
export type FallbackGroup = { id: string; slug: string; labelIt: string; terms: FallbackTerm[] };

export const fallbackCountries: FallbackCountry[] = [
  'Îles Baléares',
  'France',
  'Italie',
  'Cyprus',
  'Maroc',
  'Algerie',
  'Tunisie',
  'Egypte',
  'Liban',
  'Palestine',
  'Syrie',
  'Turkey',
  'Grèce'
].map((name) => ({ id: `fallback-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, name }));

const taxonomyGroups: Record<string, string[]> = {
  typological: ['Exposition', 'Narration', 'Promotion', 'Théorisation/Constitution', 'Interaction'],
  thematic: ['Pratiques de mode', 'Cultures de mode', 'Pratiques et Cultures de mode'],
  practices: ['Broderie', 'Tressage', 'Macramé', 'Weaving', 'Couching', 'Perlage', 'Couture', 'Teinture', 'Graphisme sur tissus'],
  framing: [
    'Mode et Adornement Autochtone',
    'Adornement du corps et Esthétique',
    'Mode et Adornement des Subcultures/Subalterns',
    'Mode et Adornement Anti-Fashion Cultures',
    'Fashion pas = à changement',
    'Mode et Adornement Artificielle et Digitale',
    'Mode et Adornement De-Growing',
    'Mode et Adornement en Diaspora et Migration',
    'Mode et Adornement Politique',
    'Mode et Adornement Quotidien ou Streetstyle',
    'Mode et Adornement Religieux',
    'Mode et Adornement Historique'
  ],
  formats: ['Carrousels', 'Images statiques', 'Reels/Videos', 'Stories', 'CupCuts', 'Direct stream', 'Stories Images en Movement'],
  tone: ['Humoristique', 'Descriptif', 'Critique', 'Pédagogique', 'Introspectif'],
  scripto: [
    'Photographies/reprises',
    'Collections de vêtements et accessoires',
    'Photographies d’e-commerce',
    'Pages de livres, magazines et catalogues',
    'Behind-the-scenes / Process de création',
    'Sketches',
    'Street fashion photography',
    'Vie personnelle',
    'Événements personnels',
    'Révisions',
    'Commentaires',
    'Photographies d’archive',
    'Repost / Remix',
    'Memes'
  ],
  microforms: ['Hashtags', 'Trending Keywords', 'Tags', 'Collabs']
};

export const fallbackGroups: FallbackGroup[] = Object.entries(taxonomyGroups).map(([slug, terms]) => ({
  id: slug,
  slug,
  labelIt: slug,
  terms: terms.map((labelIt) => ({
    id: `fallback-${slug}-${labelIt.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    labelIt,
    groupId: slug
  }))
}));
