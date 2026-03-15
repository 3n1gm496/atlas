export type DemoRoleName = 'super_admin' | 'editor' | 'contributor' | 'research_admin';

export type DemoUser = {
  id: string;
  email: string;
  displayName: string;
  roleName: DemoRoleName;
  password: string;
};

export type DemoEntry = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  abstract: string;
  description: string;
  countryName: string;
  canonicalLanguage: string;
  status: 'published' | 'under_review' | 'changes_requested' | 'submitted' | 'draft';
  featured: boolean;
  placeName: string;
  timePeriodLabel: string;
  sourceContext: string;
  taxonomy: string[];
  contributorId: string;
  contributorName: string;
};

export type DemoCollection = {
  id: string;
  slug: string;
  title: string;
  intro: string;
  sections: { id: string; title: string; content: string; orderIndex: number }[];
  entrySlugs: string[];
};

export const demoUsers: DemoUser[] = [
  {
    id: 'demo-admin',
    email: 'admin@atlas.local',
    displayName: 'ATLAS Admin',
    roleName: 'super_admin',
    password: 'admin1234'
  },
  {
    id: 'demo-editor',
    email: 'editor@atlas.local',
    displayName: 'ATLAS Editor',
    roleName: 'editor',
    password: 'editor1234'
  },
  {
    id: 'demo-contributor',
    email: 'contributor@atlas.local',
    displayName: 'ATLAS Contributor',
    roleName: 'contributor',
    password: 'contributor1234'
  },
  {
    id: 'demo-researcher',
    email: 'researcher@atlas.local',
    displayName: 'ATLAS Research Lead',
    roleName: 'research_admin',
    password: 'researcher1234'
  }
];

export const demoEntries: DemoEntry[] = [
  {
    id: 'entry-bedouin-threads',
    slug: 'ricamo-digitale-identita-beduina',
    title: "Ricamo digitale e identita' beduina",
    subtitle: 'Pratiche artigianali su Instagram',
    abstract: 'Una mappatura delle grammatiche visuali che trasformano il ricamo beduino in archivio vivo, praticato e condiviso online.',
    description:
      "Studio di account Instagram che rendono visibile il ricamo beduino come memoria tessile, gesto quotidiano e strategia di posizionamento culturale nel panorama digitale mediterraneo.",
    countryName: 'Palestina',
    canonicalLanguage: 'it',
    status: 'published',
    featured: true,
    placeName: 'Gerusalemme Est',
    timePeriodLabel: '2020-2024',
    sourceContext: 'Instagram @broderie_bedouine',
    taxonomy: ['Tipologia: Narrazione', 'Pratiche: Ricamo', 'Inquadramenti: Diaspora e Migrazione'],
    contributorId: 'demo-researcher',
    contributorName: 'ATLAS Research Lead'
  },
  {
    id: 'entry-casablanca',
    slug: 'moda-urbana-casablanca',
    title: 'Moda urbana a Casablanca',
    subtitle: 'Streetstyle e ibridazione culturale',
    abstract: 'Osservatorio sui creator che intrecciano codici streetwear e riferimenti sartoriali marocchini.',
    description:
      'La scena di Casablanca viene letta come laboratorio di autorappresentazione, branding e negoziazione tra tradizione e immaginari urbani globali.',
    countryName: 'Marocco',
    canonicalLanguage: 'fr',
    status: 'published',
    featured: false,
    placeName: 'Casablanca',
    timePeriodLabel: '2019-2023',
    sourceContext: 'Instagram @casablanca_style',
    taxonomy: ['Tematiche: Culture di moda', 'Formati: Reels/Video', 'Toni: Descrittivo'],
    contributorId: 'demo-editor',
    contributorName: 'ATLAS Editor'
  },
  {
    id: 'entry-lebanon-diaspora',
    slug: 'diaspora-libanese-moda-digitale',
    title: 'Diaspora libanese e moda digitale',
    subtitle: 'Memoria e adornamento in esilio',
    abstract: 'Ricerca sulle pratiche di autorappresentazione della diaspora libanese tra TikTok, Instagram e archivi personali.',
    description:
      'L abbigliamento viene interpretato come dispositivo di memoria, cura e ricostruzione identitaria nelle comunita in diaspora.',
    countryName: 'Libano',
    canonicalLanguage: 'en',
    status: 'under_review',
    featured: true,
    placeName: 'Beirut / Parigi',
    timePeriodLabel: '2021-2024',
    sourceContext: 'TikTok @liban_diaspora',
    taxonomy: ['Inquadramenti: Moda in Diaspora e Migrazione', 'Microformi: Hashtag', 'Formati: Stories'],
    contributorId: 'demo-contributor',
    contributorName: 'ATLAS Contributor'
  },
  {
    id: 'entry-athens',
    slug: 'archivi-vestimentari-atene',
    title: 'Archivi vestimentari ad Atene',
    subtitle: 'Memorie di piattaforma e pratiche di riuso',
    abstract: 'Percorso tra account, marketplace e microarchivi che tengono insieme second hand, design e memoria urbana.',
    description:
      'Le pratiche di collezionismo, riuso e vendita diventano qui strumenti per osservare economie culturali e visibilita locale.',
    countryName: 'Grecia',
    canonicalLanguage: 'it',
    status: 'changes_requested',
    featured: false,
    placeName: 'Atene',
    timePeriodLabel: '2018-2024',
    sourceContext: 'Instagram + marketplace locali',
    taxonomy: ['Pratiche: Sartoria', 'Tematiche: Pratiche di moda', 'Toni: Critico'],
    contributorId: 'demo-contributor',
    contributorName: 'ATLAS Contributor'
  },
  {
    id: 'entry-palermo',
    slug: 'memoria-tessile-palermo-digitale',
    title: 'Memoria tessile e Palermo digitale',
    subtitle: 'Narrazioni locali tra reels e storytelling curatoriale',
    abstract: 'Studio sulle forme di racconto che collegano patrimonio artigianale, moda e identita urbana in Sicilia.',
    description:
      'La ricerca osserva come atelier, curatori e comunita locali costruiscano un ecosistema editoriale fatto di video brevi, commenti e archivi condivisi.',
    countryName: 'Italia',
    canonicalLanguage: 'it',
    status: 'submitted',
    featured: false,
    placeName: 'Palermo',
    timePeriodLabel: '2022-2025',
    sourceContext: 'Instagram / TikTok',
    taxonomy: ['Tipologia: Esposizione', 'Formati: Caroselli', 'Sottocategorie: Fotografie d archivio'],
    contributorId: 'demo-contributor',
    contributorName: 'ATLAS Contributor'
  },
  {
    id: 'entry-ankara',
    slug: 'moda-politica-ankara-online',
    title: 'Moda politica e Ankara online',
    subtitle: 'Adornamento, attivismo e piattaforme',
    abstract: 'Esplorazione di pratiche estetiche usate per esprimere appartenenza, dissenso e solidarieta in ambienti digitali.',
    description:
      'Tra hashtag, post editoriali e live stream, il caso mostra come il vestire diventi linguaggio politico e infrastruttura narrativa.',
    countryName: 'Turchia',
    canonicalLanguage: 'tr',
    status: 'published',
    featured: true,
    placeName: 'Ankara',
    timePeriodLabel: '2020-2025',
    sourceContext: 'Instagram / X / streaming',
    taxonomy: ['Inquadramenti: Moda e Adornamento Politico', 'Formati: Diretta streaming', 'Toni: Critico'],
    contributorId: 'demo-editor',
    contributorName: 'ATLAS Editor'
  }
];

export const demoCollections: DemoCollection[] = [
  {
    id: 'collection-diaspora',
    slug: 'diaspora-traces',
    title: 'Diaspora Traces',
    intro: 'Una selezione curatoriale dedicata ai modi in cui l abbigliamento costruisce memoria, appartenenza e movimento tra territori.',
    sections: [
      {
        id: 'diaspora-1',
        title: 'Memoria condivisa',
        content: 'Le piattaforme rendono osservabili forme di continuita culturale che passano per abiti, gesti, ricami e posture.',
        orderIndex: 0
      },
      {
        id: 'diaspora-2',
        title: 'Migrazione e linguaggi visuali',
        content: 'Le entry raccolte mostrano come la cultura visuale di moda incorpori archivi familiari, hashtag e microcomunita.',
        orderIndex: 1
      }
    ],
    entrySlugs: ['ricamo-digitale-identita-beduina', 'diaspora-libanese-moda-digitale']
  },
  {
    id: 'collection-street',
    slug: 'street-atlases',
    title: 'Street Atlases',
    intro: 'Percorso dedicato alle scritture urbane della moda, tra Casablanca, Palermo e Ankara.',
    sections: [
      {
        id: 'street-1',
        title: 'Citta come interfaccia',
        content: 'Le piattaforme sono lette come estensione dei luoghi, dei quartieri e delle reti di creativita locale.',
        orderIndex: 0
      }
    ],
    entrySlugs: ['moda-urbana-casablanca', 'memoria-tessile-palermo-digitale', 'moda-politica-ankara-online']
  }
];

export function authenticateDemoUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return demoUsers.find((user) => user.email === normalizedEmail && user.password === password) ?? null;
}

export function findDemoUserByEmail(email: string) {
  return demoUsers.find((user) => user.email === email.trim().toLowerCase()) ?? null;
}

export function findDemoEntryBySlug(slug: string) {
  return demoEntries.find((entry) => entry.slug === slug) ?? null;
}

export function findDemoCollectionBySlug(slug: string) {
  return demoCollections.find((collection) => collection.slug === slug) ?? null;
}

export function getRoleLabel(roleName: string) {
  return (
    {
      super_admin: 'Super admin',
      editor: 'Editor',
      contributor: 'Contributor',
      research_admin: 'Research admin'
    }[roleName] ?? roleName
  );
}

export function getStatusLabel(status: string) {
  return (
    {
      published: 'Pubblicata',
      under_review: 'In revisione',
      changes_requested: 'Revisioni richieste',
      submitted: 'Sottomessa',
      draft: 'Bozza'
    }[status] ?? status
  );
}
