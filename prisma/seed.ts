import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import cartel2Rows from '../data/cartel2.dataset.json';
import { type Cartel2SnapshotRow } from '@/lib/dataset/cartel2-sync';
import {
  DEMO_COLLECTION_DEFINITIONS,
  buildDemoCollectionSections,
  type DemoEntrySummary
} from '@/lib/content/demo-collections';
import { getWorkbookEditorialFallback } from '@/lib/content/workbook-editorial-fallbacks';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Taxonomy groups with proper multilingual labels (it / en / fr)
// ---------------------------------------------------------------------------
const groups: {
  slug: string;
  labelIt: string;
  labelEn: string;
  labelFr: string;
  terms: { it: string; en: string; fr: string }[];
}[] = [
  {
    slug: 'typological',
    labelIt: 'Tipologia',
    labelEn: 'Typology',
    labelFr: 'Typologie',
    terms: [
      { it: 'Esposizione', en: 'Exposition', fr: 'Exposition' },
      { it: 'Narrazione', en: 'Narration', fr: 'Narration' },
      { it: 'Promozione', en: 'Promotion', fr: 'Promotion' },
      { it: 'Contestazione', en: 'Contestation', fr: 'Contestation' },
      { it: 'Educazione', en: 'Education', fr: 'Education' },
      { it: 'Teorizzazione/Costituzione', en: 'Theorisation/Constitution', fr: 'Theorisation/Constitution' },
      { it: 'Romanticismo', en: 'Romanticism', fr: 'Romantisme' },
      { it: 'Interazione', en: 'Interaction', fr: 'Interaction' },
    ],
  },
  {
    slug: 'geography',
    labelIt: 'Geografia',
    labelEn: 'Geography',
    labelFr: 'Geographie',
    terms: [
      { it: 'Isole Baleari', en: 'Balearic Islands', fr: 'Iles Baleares' },
      { it: 'Francia', en: 'France', fr: 'France' },
      { it: 'Italia', en: 'Italy', fr: 'Italie' },
      { it: 'Cipro', en: 'Cyprus', fr: 'Chypre' },
      { it: 'Marocco', en: 'Morocco', fr: 'Maroc' },
      { it: 'Algeria', en: 'Algeria', fr: 'Algerie' },
      { it: 'Tunisia', en: 'Tunisia', fr: 'Tunisie' },
      { it: 'Egitto', en: 'Egypt', fr: 'Egypte' },
      { it: 'Libano', en: 'Lebanon', fr: 'Liban' },
      { it: 'Palestina', en: 'Palestine', fr: 'Palestine' },
      { it: 'Siria', en: 'Syria', fr: 'Syrie' },
      { it: 'Turchia', en: 'Turkey', fr: 'Turquie' },
      { it: 'Grecia', en: 'Greece', fr: 'Grece' },
    ],
  },
  {
    slug: 'thematic',
    labelIt: 'Tematiche',
    labelEn: 'Themes',
    labelFr: 'Thematiques',
    terms: [
      { it: 'Moda e identita culturale autoctona', en: 'Fashion and Autochtone Cultural Identity', fr: 'Mode et identite culturelle autochtone' },
      { it: 'Moda e cultura popolare', en: 'Fashion and Popular Culture', fr: 'Mode et culture populaire' },
      { it: 'Moda e svolta digitale', en: 'Fashion and the Digital turn', fr: 'Mode et tournant numerique' },
      { it: 'Moda e de-fashion', en: 'Fashion and De-fashion', fr: 'Mode et de-fashion' },
      { it: 'Moda sostenibile', en: 'Sustainable Fashion', fr: 'Mode durable' },
      { it: 'Moda e adornamento del corpo', en: 'Fashion and Adornment of the body', fr: 'Mode et adornement du corps' },
      { it: 'Moda e femminismo', en: 'Fashion and Feminism', fr: 'Mode et feminisme' },
      { it: 'Moda, diaspora e migrazione', en: 'Fashion, Diaspora and Migration', fr: 'Mode, diaspora et migration' },
    ],
  },
  {
    slug: 'practices',
    labelIt: 'Pratiche',
    labelEn: 'Practices',
    labelFr: 'Pratiques',
    terms: [
      { it: 'Ricamo', en: 'Embroidery', fr: 'Broderie' },
      { it: 'Intreccio', en: 'Braiding', fr: 'Tressage' },
      { it: 'Macrame', en: 'Macrame', fr: 'Macrame' },
      { it: 'Tessitura', en: 'Weaving', fr: 'Weaving' },
      { it: 'Couching', en: 'Couching', fr: 'Couching' },
      { it: 'Perlage', en: 'Beading', fr: 'Perlage' },
      { it: 'Sartoria', en: 'Tailoring', fr: 'Couture' },
      { it: 'Tintura', en: 'Dyeing', fr: 'Teinture' },
      { it: 'Grafica su tessuti', en: 'Textile Graphics', fr: 'Graphisme sur tissus' },
    ],
  },
  {
    slug: 'framing',
    labelIt: 'Inquadramenti',
    labelEn: 'Framings',
    labelFr: 'Cadrages',
    terms: [
      { it: 'Moda e Adornamento Indigeno', en: 'Indigenous Fashion and Adornment', fr: 'Mode et Adornement Autochtone' },
      { it: 'Adornamento del corpo ed Estetica', en: 'Body Adornment and Aesthetics', fr: 'Adornement du corps et Esthetique' },
      { it: 'Moda e Adornamento delle Subculture', en: 'Fashion and Subcultural Adornment', fr: 'Mode et Adornement des Subcultures' },
      { it: 'Moda e Adornamento Anti-Fashion', en: 'Anti-Fashion Cultures', fr: 'Mode et Adornement Anti-Fashion' },
      { it: 'Moda Artificiale e Digitale', en: 'Artificial and Digital Fashion', fr: 'Mode et Adornement Artificielle et Digitale' },
      { it: 'Moda De-Growing', en: 'De-Growing Fashion', fr: 'Mode et Adornement De-Growing' },
      { it: 'Moda in Diaspora e Migrazione', en: 'Diasporic Fashion and Migration', fr: 'Mode et Adornement en Diaspora et Migration' },
      { it: 'Moda e Adornamento Politico', en: 'Political Fashion and Adornment', fr: 'Mode et Adornement Politique' },
      { it: 'Streetstyle e Quotidiano', en: 'Everyday Fashion and Streetstyle', fr: 'Mode et Adornement Quotidien ou Streetstyle' },
      { it: 'Moda e Adornamento Religioso', en: 'Religious Fashion and Adornment', fr: 'Mode et Adornement Religieux' },
      { it: 'Moda e Adornamento Storico', en: 'Historical Fashion and Adornment', fr: 'Mode et Adornement Historique' },
    ],
  },
  {
    slug: 'formats',
    labelIt: 'Formati tecno-creativi',
    labelEn: 'Techno-creative Formats',
    labelFr: 'Formats techno-creatifs',
    terms: [
      { it: 'Caroselli', en: 'Carousels', fr: 'Carrousels' },
      { it: 'Immagini statiche', en: 'Static Images', fr: 'Images statiques' },
      { it: 'Reels/Video', en: 'Reels/Videos', fr: 'Reels/Videos' },
      { it: 'Stories', en: 'Stories', fr: 'Stories' },
      { it: 'CupCuts', en: 'CupCuts', fr: 'CupCuts' },
      { it: 'Diretta streaming', en: 'Live Stream', fr: 'Direct stream' },
      { it: 'Stories Immagini in Movimento', en: 'Stories Moving Images', fr: 'Stories Images en Movement' },
    ],
  },
  {
    slug: 'tone',
    labelIt: 'Toni',
    labelEn: 'Tones',
    labelFr: 'Tons',
    terms: [
      { it: 'Umoristico', en: 'Humorous', fr: 'Humoristique' },
      { it: 'Descrittivo', en: 'Descriptive', fr: 'Descriptif' },
      { it: 'Critico', en: 'Critical', fr: 'Critique' },
      { it: 'Pedagogico', en: 'Pedagogical', fr: 'Pedagogique' },
      { it: 'Introspettivo', en: 'Introspective', fr: 'Introspectif' },
      { it: 'Narrativo', en: 'Narrative', fr: 'Narratif' },
      { it: 'Espositivo', en: 'Expository', fr: 'Expositif' },
      { it: 'Entertaining', en: 'Entertaining', fr: 'Entertaining' },
    ],
  },
  {
    slug: 'scripto',
    labelIt: 'Sottocategorie scripto-iconiche',
    labelEn: 'Scripto-iconic Subcategories',
    labelFr: 'Sous-categories scripto-iconiques',
    terms: [
      { it: 'Fotografie/riprese', en: 'Photos/Shoots', fr: 'Photographies/reprises' },
      { it: 'Collezioni di abiti e accessori', en: 'Clothing and Accessories Collections', fr: 'Collections de vetements et accessoires' },
      { it: 'Fotografie di e-commerce', en: 'E-commerce Photography', fr: 'Photographies e-commerce' },
      { it: 'Pagine di libri, riviste e cataloghi', en: 'Book, Magazine and Catalogue Pages', fr: 'Pages de livres, magazines et catalogues' },
      { it: 'Behind-the-scenes / Processo di creazione', en: 'Behind-the-scenes / Creation Process', fr: 'Behind-the-scenes / Process de creation' },
      { it: '3D e 2D', en: '3D and 2D', fr: '3D et 2D' },
      { it: 'Fotografie e registrazioni di processo', en: 'Process photographs and recordings', fr: 'Photographies et enregistrements de processus' },
      { it: 'Schizzi', en: 'Sketches', fr: 'Sketches' },
      { it: 'Street fashion photography', en: 'Street Fashion Photography', fr: 'Street fashion photography' },
      { it: 'Eventi personali', en: 'Personal events', fr: 'Evenements personnels' },
      { it: 'Slice of life', en: 'Slice of life', fr: 'Slice of life' },
      { it: 'Vita personale', en: 'Personal Life', fr: 'Vie personnelle' },
      { it: 'Revisioni', en: 'Reviews', fr: 'Revisions' },
      { it: 'Commenti', en: 'Comments', fr: 'Commentaires' },
      { it: 'Fotografie d\'archivio', en: 'Archival Photographs', fr: 'Photographies d\'archive' },
      { it: 'Repost / Remix', en: 'Repost / Remix', fr: 'Repost / Remix' },
      { it: 'Memes', en: 'Memes', fr: 'Memes' },
    ],
  },
  {
    slug: 'microforms',
    labelIt: 'Microformi',
    labelEn: 'Microforms',
    labelFr: 'Microformes',
    terms: [
      { it: 'Hashtag', en: 'Hashtags', fr: 'Hashtags' },
      { it: 'Trending Keywords', en: 'Trending Keywords', fr: 'Trending Keywords' },
      { it: 'Tag', en: 'Tags', fr: 'Tags' },
      { it: 'Collab', en: 'Collabs', fr: 'Collabs' },
    ],
  },
  {
    slug: 'chronology',
    labelIt: 'Cronologia',
    labelEn: 'Chronology',
    labelFr: 'Chronologie',
    terms: [
      { it: '2020 - 2025', en: '2020 - 2025', fr: '2020 - 2025' },
      { it: '2015 - 2025', en: '2015 - 2025', fr: '2015 - 2025' },
    ],
  },
  {
    slug: 'image-temporality',
    labelIt: 'Temporalita dell immagine',
    labelEn: 'Image Temporality',
    labelFr: 'Temporalite de limage',
    terms: [
      { it: 'XVIII, XIX, XX, XXI', en: 'XVIII, XIX, XX, XXI', fr: 'XVIII, XIX, XX, XXI' },
      { it: 'XXI, XX, XIX, XVIII', en: 'XXI, XX, XIX, XVIII', fr: 'XXI, XX, XIX, XVIII' },
      { it: 'XX', en: 'XX', fr: 'XX' },
      { it: 'Hybride', en: 'Hybrid', fr: 'Hybride' },
    ],
  },
  {
    slug: 'ideology',
    labelIt: 'Posizioni ideologiche',
    labelEn: 'Ideological Positions',
    labelFr: 'Positions ideologiques',
    terms: [
      { it: 'Autoctono', en: 'Autochtone', fr: 'Autochtone' },
      { it: 'Maximalista', en: 'Maximalist', fr: 'Maximaliste' },
      { it: 'Digitalizzazione e gamification', en: 'Digitalisation & Gamification', fr: 'Digitalisation et gamification' },
      { it: 'Diaspora e migrazione', en: 'Diaspora & Migration', fr: 'Diaspora et migration' },
      { it: 'Decrescita / De-fashion', en: 'De-Growth / De-Fashion', fr: 'Decroissance / De-Fashion' },
    ],
  },
  {
    slug: 'narrative',
    labelIt: 'Tipi di racconto',
    labelEn: 'Narrative Types',
    labelFr: 'Types de recit',
    terms: [
      { it: 'Micro-racconto intertestuale', en: 'Micro-récit intertextuel', fr: 'Micro-recit intertextuel' },
      { it: 'Racconto archetipico', en: 'Récit archetypique', fr: 'Recit archetypique' },
      { it: 'Cyber-folklore', en: 'Cyber-folklore', fr: 'Cyber-folklore' },
      { it: 'Documentario', en: 'Documentaire', fr: 'Documentaire' },
      { it: 'Storico', en: 'Historic', fr: 'Historique' },
    ],
  },
  {
    slug: 'semiotics',
    labelIt: 'Semiotica iconica',
    labelEn: 'Iconic Semiotics',
    labelFr: 'Semiotique iconique',
    terms: [
      { it: 'Documenti d archivio', en: "Documents d'archive", fr: "Documents d'archive" },
      { it: 'Meme', en: 'Memes', fr: 'Memes' },
      { it: 'Repost / Remix', en: 'Repost / Remix', fr: 'Repost / Remix' },
      { it: 'Collezioni di abiti e accessori', en: 'Collections de vetements et accessoires', fr: 'Collections de vetements et accessoires' },
      { it: 'Eventi personali', en: 'Evenements personnels', fr: 'Evenements personnels' },
      { it: 'Slice of life', en: 'Slice of life', fr: 'Slice of life' },
      { it: '3D e 2D', en: '3D et 2D', fr: '3D et 2D' },
      { it: 'Behind-the-scenes', en: 'Behind-the-scenes', fr: 'Behind-the-scenes' },
      { it: 'Foto e registrazioni di processo', en: 'Process photography and recordings', fr: 'Process photography and recordings' },
      { it: 'Schizzi', en: 'Sketches', fr: 'Sketches' },
      { it: 'Street fashion photography', en: 'Street fashion photography', fr: 'Street fashion photography' },
      { it: 'Pagine di libri, riviste e cataloghi', en: 'Pages de livres, magazines et catalogues', fr: 'Pages de livres, magazines et catalogues' },
    ],
  },
  {
    slug: 'graphic-style',
    labelIt: 'Stili grafici',
    labelEn: 'Graphic Styles',
    labelFr: 'Styles graphiques',
    terms: [
      { it: 'Memes', en: 'Memes', fr: 'Memes' },
      { it: 'Montaggi', en: 'Montages', fr: 'Montages' },
      { it: 'Cup Cuts', en: 'Cup Cuts', fr: 'Cup Cuts' },
      { it: 'Beat-sync', en: 'Beat-sync', fr: 'Beat-sync' },
      { it: 'Creazioni vettoriali', en: 'Vector creations', fr: 'Creations vectorielles' },
      { it: 'Voice over', en: 'Voice over', fr: 'Voice over' },
    ],
  },
  {
    slug: 'audio',
    labelIt: 'Tracce audio',
    labelEn: 'Audio Tracks',
    labelFr: 'Pistes audio',
    terms: [
      { it: '-', en: '-', fr: '-' },
      { it: 'Voiceover audio originale', en: 'Original audio voiceover', fr: 'Voiceover audio original' },
      { it: 'Colonne sonore pop', en: 'Pop music soundtracks', fr: 'Bandes sonores pop' },
      { it: 'Audio trend: Back To Black · Amy Winehouse', en: 'trending audios : Back To Black · Amy Winehouse', fr: 'audios tendance : Back To Black · Amy Winehouse' },
    ],
  },
  {
    slug: 'engagement',
    labelIt: 'Obiettivi di engagement',
    labelEn: 'Engagement Goals',
    labelFr: 'Objectifs dengagement',
    terms: [
      { it: 'Repost / Remix', en: 'Repost/remix', fr: 'Repost/remix' },
    ],
  },
  {
    slug: 'source-network',
    labelIt: 'Reti di account',
    labelEn: 'Account Networks',
    labelFr: 'Reseaux de comptes',
    terms: [
      { it: '@soussiangirl', en: '@soussiangirl', fr: '@soussiangirl' },
      { it: '@womenfromhistory', en: '@womenfromhistory', fr: '@womenfromhistory' },
      { it: '@zinalouhaichy', en: '@zinalouhaichy', fr: '@zinalouhaichy' },
      { it: '@karim_bzn', en: '@karim_bzn', fr: '@karim_bzn' },
      { it: '@gridra', en: '@gridra', fr: '@gridra' },
      { it: '@tasneemtatreez', en: '@tasneemtatreez', fr: '@tasneemtatreez' },
      { it: '@tirazain_center', en: '@tirazain_center', fr: '@tirazain_center' },
      { it: 'ilkan.ko', en: 'ilkan.ko', fr: 'ilkan.ko' },
      { it: 'shirvanna', en: 'shirvanna', fr: 'shirvanna' },
      { it: 'folkmona', en: 'folkmona', fr: 'folkmona' },
      { it: 'the.titrit', en: 'the.titrit', fr: 'the.titrit' },
      { it: 'tazriuk', en: 'tazriuk', fr: 'tazriuk' },
      { it: 'fashion heritage network cyprus', en: 'fashion heritage network cyprus', fr: 'fashion heritage network cyprus' },
      { it: 'inaash', en: 'inaash', fr: 'inaash' },
      { it: 'sunbula', en: 'sunbula', fr: 'sunbula' },
      { it: 'mayasanaa', en: 'mayasanaa', fr: 'mayasanaa' },
      { it: 'bedouin silver', en: 'bedouin silver', fr: 'bedouin silver' },
      { it: 'fatima', en: 'fatima', fr: 'fatima' },
      { it: 'thezayinitiative', en: 'thezayinitiative', fr: 'thezayinitiative' },
      { it: 'Tiraiz', en: 'Tiraiz', fr: 'Tiraiz' },
      { it: 'sahar etc', en: 'sahar etc', fr: 'sahar etc' },
      { it: 'Scenestyled and others like soussian girl as well', en: 'Scenestyled and others like soussian girl as well', fr: 'Scenestyled and others like soussian girl as well' },
      { it: 'Moodboard occasions like scenstyled', en: 'Moodboard occasions like scenstyled', fr: 'Moodboard occasions like scenstyled' },
      { it: 'mayasanaa, bedouin silver, fatima, thezayinitiative, Tiraiz', en: 'mayasanaa, bedouin silver, fatima, thezayinitiative, Tiraiz', fr: 'mayasanaa, bedouin silver, fatima, thezayinitiative, Tiraiz' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Country data with representative geographic coordinates
// ---------------------------------------------------------------------------
const countryData = [
  { name: 'Francia',       code: 'FR',    lat: 46.23, lng:  2.21, regions: ['Ile-de-France', 'Provence-Alpes-Cote d\'Azur', 'Occitanie'] },
  { name: 'Italia',        code: 'IT',    lat: 41.90, lng: 12.49, regions: ['Lazio', 'Sicilia', 'Campania', 'Lombardia'] },
  { name: 'Marocco',       code: 'MA',    lat: 31.79, lng: -7.09, regions: ['Grand Casablanca-Settat', 'Marrakech-Safi', 'Fes-Meknes'] },
  { name: 'Tunisia',       code: 'TN',    lat: 33.89, lng:  9.54, regions: ['Tunis', 'Sfax', 'Sousse'] },
  { name: 'Egitto',        code: 'EG',    lat: 26.82, lng: 30.80, regions: ['Il Cairo', 'Alessandria', 'Giza'] },
  { name: 'Libano',        code: 'LB',    lat: 33.85, lng: 35.86, regions: ['Beirut', 'Monte Libano', 'Bekaa'] },
  { name: 'Grecia',        code: 'GR',    lat: 39.07, lng: 21.82, regions: ['Attica', 'Macedonia Centrale', 'Creta'] },
  { name: 'Turchia',       code: 'TR',    lat: 38.96, lng: 35.24, regions: ['Istanbul', 'Ankara', 'Izmir'] },
  { name: 'Cipro',         code: 'CY',    lat: 35.13, lng: 33.43, regions: ['Nicosia', 'Limassol', 'Larnaca'] },
  { name: 'Palestina',     code: 'PS',    lat: 31.95, lng: 35.23, regions: ['Gerusalemme Est', 'Gaza', 'Cisgiordania'] },
  { name: 'Siria',         code: 'SY',    lat: 34.80, lng: 38.99, regions: ['Damasco', 'Aleppo', 'Homs'] },
  { name: 'Algeria',       code: 'DZ',    lat: 28.03, lng:  1.66, regions: ['Algeri', 'Orano', 'Costantina'] },
  { name: 'Isole Baleari', code: 'ES-IB', lat: 39.71, lng:  2.99, regions: ['Maiorca', 'Ibiza', 'Minorca'] },
];

// ---------------------------------------------------------------------------
type PublishedFixture = {
  workbookId: string;
  slug: string;
  title: string;
  subtitle: string;
  abstract: string;
  description: string;
  editorialNote: string | null;
  canonicalLanguage: 'it' | 'en' | 'fr';
  countryCode: string;
  lat: number;
  lng: number;
  featured: boolean;
  sourceContext: string;
  timePeriod: string;
  metadata: Record<string, unknown>;
  mediaAssets: Cartel2SnapshotRow['media']['assets'];
};

const featuredWorkbookIds = new Set(['21024', '22024', '23024', '25024']);
const normalizedCountryNames = new Set(countryData.map((country) => country.name));

function normalizeKey(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function splitValues(value: string | undefined) {
  return [...new Set((value ?? '')
    .split(/[;,\n]/)
    .map((part) => part.trim())
    .filter(Boolean))];
}

function normalizeCountryName(name: string) {
  const aliasMap: Record<string, string> = {
    Marocco: 'Morocco',
    Morocco: 'Morocco',
    Algeria: 'Algeria',
    'Algeria ': 'Algeria',
    Palestine: 'Palestine',
    Lebanon: 'Lebanon',
    Cyprus: 'Cyprus',
    Cyrpus: 'Cyprus',
    Tunisia: 'Tunisia',
    Egypt: 'Egypt',
    Egitto: 'Egypt',
    Italy: 'Italy',
    Italia: 'Italy',
    France: 'France',
    Francia: 'France',
    Greece: 'Greece',
    Grecia: 'Greece',
    Turkey: 'Turkey',
    Turchia: 'Turkey',
    Syria: 'Syria',
    Palestina: 'Palestine',
    'Isole Baleari': 'Isole Baleari'
  };

  return aliasMap[name.trim()] ?? name.trim();
}

function resolvePrimaryCountry(row: Cartel2SnapshotRow) {
  const candidates = splitValues(row.E).map(normalizeCountryName);
  return candidates.find((candidate) => normalizedCountryNames.has(candidate)) ?? 'Algeria';
}

function canonicalLanguageForRow(row: Cartel2SnapshotRow): 'it' | 'en' | 'fr' {
  if (row.A === '21024' || row.A === '22024') return 'fr';
  return 'en';
}

function buildAbstract(row: Cartel2SnapshotRow) {
  return [row.C, row.H, row.K].filter(Boolean).join(' · ');
}

function buildDescription(row: Cartel2SnapshotRow) {
  return [row.I, row.J].filter(Boolean).join('\n\n');
}

function buildPublishedFixtures() {
  return (cartel2Rows as Cartel2SnapshotRow[]).map((row) => {
    const rowId = row.A.trim();
    const primaryCountry = resolvePrimaryCountry(row);
    const country = countryData.find((item) => item.name === primaryCountry) ?? countryData[0];
    const mediaAssets = row.media.assets;
    const editorialFallback = getWorkbookEditorialFallback(rowId);
    const abstract = buildAbstract(row) || editorialFallback?.abstract || row.B;
    const description = buildDescription(row) || editorialFallback?.description || `Editorially curated concept card for ${row.B}.`;

    return {
      workbookId: rowId,
      slug: `${toSlug(row.B)}-${rowId}`,
      title: row.B,
      subtitle: row.C,
      abstract,
      description,
      editorialNote: [row.L, row.K].filter(Boolean).join(' · ') || editorialFallback?.note || null,
      canonicalLanguage: canonicalLanguageForRow(row),
      countryCode: country.code,
      lat: country.lat,
      lng: country.lng,
      featured: featuredWorkbookIds.has(rowId),
      sourceContext: row.S || row.M || row.H,
      timePeriod: row.D || '2020 - 2025',
      metadata: {
        workbookId: rowId,
        workbookRow: row,
        sheet1: row,
        mediaSync: row.media,
        primaryCountry,
        countries: splitValues(row.E).map(normalizeCountryName),
        chronology: row.D || null,
        imageTemporal: row.F || null,
        discourseType: row.G || null,
        editorialCategory: row.H || null,
        ideologicalPosture: row.K || null,
        narrativeType: row.L || null,
        iconicSemiotics: row.M || null,
        graphicStyle: row.N || null,
        diffusionSupport: row.O || null,
        tone: row.P || null,
        audio: row.Q || null,
        microforms: null,
        engagement: row.R || null,
        sourceNetwork: splitValues(row.S),
        accounts: splitValues(row.S),
        media: mediaAssets.map((asset) => asset.url),
        editorialFallback: editorialFallback
          ? {
              workbookId: rowId,
              note: editorialFallback.note,
              abstract: editorialFallback.abstract,
              description: editorialFallback.description
            }
          : null
      },
      mediaAssets
    } satisfies PublishedFixture;
  });
}

function toSlug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const seedMode = process.env.ATLAS_SEED_MODE === 'bootstrap' ? 'bootstrap' : 'reset';
  const [existingUsers, existingEntries] = await Promise.all([
    prisma.user.count().catch(() => 0),
    prisma.entry.count().catch(() => 0),
  ]);

  if (seedMode === 'bootstrap' && (existingUsers > 0 || existingEntries > 0)) {
    console.log('ATLAS bootstrap seed skipped: database already contains data.');
    return;
  }

  if (seedMode === 'reset') {
    // Full cleanup in safe dependency order for explicit reseeds.
    await prisma.$transaction([
      prisma.auditLog.deleteMany(),
      prisma.taxonomySuggestion.deleteMany(),
      prisma.savedSearch.deleteMany(),
      prisma.notification.deleteMany(),
      prisma.favorite.deleteMany(),
      prisma.collectionEntry.deleteMany(),
      prisma.collectionSection.deleteMany(),
      prisma.collection.deleteMany(),
      prisma.entryTaxonomyAssignment.deleteMany(),
      prisma.keyword.deleteMany(),
      prisma.hashtag.deleteMany(),
      prisma.mediaAsset.deleteMany(),
      prisma.sourceLink.deleteMany(),
      prisma.bibliographyItem.deleteMany(),
      prisma.entryRevision.deleteMany(),
      prisma.submissionComment.deleteMany(),
      prisma.entry.deleteMany(),
      prisma.taxonomyTerm.deleteMany(),
      prisma.taxonomyGroup.deleteMany(),
      prisma.region.deleteMany(),
      prisma.country.deleteMany(),
      prisma.user.deleteMany(),
      prisma.role.deleteMany(),
    ]);
  }

  // ------------------------------------------------------------------
  // Roles
  // ------------------------------------------------------------------
  const roles = await Promise.all(
    ['public_visitor', 'contributor', 'editor', 'research_admin', 'super_admin'].map((name) =>
      prisma.role.create({ data: { name, description: name } })
    )
  );
  const superAdminRole = roles.find((r) => r.name === 'super_admin')!;
  const contributorRole = roles.find((r) => r.name === 'contributor')!;
  const editorRole = roles.find((r) => r.name === 'editor')!;
  const researchAdminRole = roles.find((r) => r.name === 'research_admin')!;

  // ------------------------------------------------------------------
  // Demo users  (passwords hashed with bcrypt)
  // ------------------------------------------------------------------
  await prisma.user.create({
    data: { email: 'admin@atlas.local', passwordHash: hashSync('admin1234', 12), displayName: 'ATLAS Admin', roleId: superAdminRole.id },
  });
  const editor = await prisma.user.create({
    data: { email: 'editor@atlas.local', passwordHash: hashSync('editor1234', 12), displayName: 'ATLAS Editor', roleId: editorRole.id },
  });
  const contributor = await prisma.user.create({
    data: { email: 'contributor@atlas.local', passwordHash: hashSync('contributor1234', 12), displayName: 'ATLAS Contributor', roleId: contributorRole.id },
  });
  await prisma.user.create({
    data: { email: 'researcher@atlas.local', passwordHash: hashSync('researcher1234', 12), displayName: 'ATLAS Researcher', roleId: researchAdminRole.id },
  });

  // ------------------------------------------------------------------
  // Countries + regions
  // ------------------------------------------------------------------
  const countriesById: Record<string, { id: string; name: string; lat: number; lng: number }> = {};
  for (const c of countryData) {
    const country = await prisma.country.create({ data: { name: c.name, code: c.code } });
    countriesById[c.code] = { id: country.id, name: c.name, lat: c.lat, lng: c.lng };
    if (c.regions.length) {
      await prisma.region.createMany({ data: c.regions.map((name) => ({ name, countryId: country.id })) });
    }
  }

  // ------------------------------------------------------------------
  // Taxonomy groups and terms (it / en / fr)
  // ------------------------------------------------------------------
  for (const group of groups) {
    const g = await prisma.taxonomyGroup.create({
      data: { slug: group.slug, labelIt: group.labelIt, labelEn: group.labelEn, labelFr: group.labelFr },
    });
    for (const term of group.terms) {
      await prisma.taxonomyTerm.create({
        data: {
          groupId: g.id,
          slug: toSlug(term.en),
          labelIt: term.it,
          labelEn: term.en,
          labelFr: term.fr,
          aliases: [],
        },
      });
    }
  }

  const allTerms = await prisma.taxonomyTerm.findMany({ include: { group: true } });
  const termIdByAlias = new Map<string, string>();
  const registerAlias = (termId: string, alias: string) => {
    const key = normalizeKey(alias);
    if (key) termIdByAlias.set(key, termId);
  };

  const manualAliasesBySlug: Record<string, string[]> = {
    'original-audio-voiceover': ['Voiceover audio original', 'Voiceover audio originale'],
    'process-photographs-and-recordings': ['Process photographies and recordings', 'Process photography and recordings'],
    'personal-events': ['Evenements personnelles', 'Evenements personnels'],
    'vector-creations': ['Créations vectoriellles', 'Creations vectoriellles', 'Creations vectorielles'],
    'repost-remix': ['Remix/Repost', 'Repost/remix', 'Remix / Repost']
  };

  for (const term of allTerms) {
    registerAlias(term.id, term.labelIt);
    registerAlias(term.id, term.labelEn);
    registerAlias(term.id, term.labelFr);
    registerAlias(term.id, term.slug);

    const manualAliases = manualAliasesBySlug[term.slug];
    if (manualAliases) {
      for (const alias of manualAliases) registerAlias(term.id, alias);
    }
  }

  const collectTaxonomyIds = (row: Cartel2SnapshotRow) => {
    const termIds = new Set<string>();
    const fragments = [row.C, row.E, row.F, row.G, row.H, row.K, row.L, row.M, row.N, row.O, row.P, row.Q, row.R, row.S]
      .filter(Boolean)
      .flatMap((value) => splitValues(value))
      .map((value) => value.trim())
      .filter(Boolean);

    for (const fragment of fragments) {
      const normalizedFragment = normalizeKey(fragment);
      if (!normalizedFragment) continue;

      for (const [alias, termId] of termIdByAlias) {
        if (normalizedFragment === alias || normalizedFragment.includes(alias)) {
          termIds.add(termId);
        }
      }
    }

    for (const countryName of splitValues(row.E).map(normalizeCountryName)) {
      const countryKey = normalizeKey(countryName);
      for (const [alias, termId] of termIdByAlias) {
        if (countryKey === alias) {
          termIds.add(termId);
        }
      }
    }

    return Array.from(termIds);
  };

  const publishedFixtures = buildPublishedFixtures();

  // ------------------------------------------------------------------
  // Published entries (from the workbook dataset)
  // ------------------------------------------------------------------
  const publishedEntries = [];
  const publishedEntriesByWorkbookId = new Map<string, DemoEntrySummary>();
  const publishedEntryIdByWorkbookId = new Map<string, string>();
  for (let i = 0; i < publishedFixtures.length; i++) {
    const f = publishedFixtures[i];
    const country = countriesById[f.countryCode];
    const publishedAt = new Date(Date.now() - (i + 1) * 12 * 24 * 60 * 60 * 1000);

    const entry = await prisma.entry.create({
      data: {
        slug: f.slug,
        title: f.title,
        subtitle: f.subtitle,
        abstract: f.abstract,
        description: f.description,
        editorialNote: f.editorialNote ?? undefined,
        status: 'published',
        featured: f.featured,
        countryId: country.id,
        contributorId: contributor.id,
        reviewerId: editor.id,
        placeName: country.name,
        lat: f.lat,
        lng: f.lng,
        timePeriodLabel: f.timePeriod,
        sourceContext: f.sourceContext,
        canonicalLanguage: f.canonicalLanguage,
        metadata: f.metadata,
        publishedAt,
      },
    });
    publishedEntries.push(entry);
    publishedEntryIdByWorkbookId.set(f.workbookId, entry.id);
    publishedEntriesByWorkbookId.set(f.workbookId, {
      workbookId: f.workbookId,
      slug: entry.slug,
      title: entry.title,
      abstract: entry.abstract,
      countryName: country.name,
      timePeriodLabel: entry.timePeriodLabel ?? null
    });

    const termIds = collectTaxonomyIds(cartel2Rows[i] as Cartel2SnapshotRow);
    if (termIds.length) {
      await prisma.entryTaxonomyAssignment.createMany({
        data: termIds.map((termId) => ({ entryId: entry.id, termId })),
      });
    }

    const keywordSeeds = [f.title, country.name, f.workbookId, f.subtitle]
      .filter(Boolean)
      .map((value) => toSlug(value))
      .filter(Boolean)
      .slice(0, 5);
    await prisma.keyword.createMany({
      data: [
        ...keywordSeeds.map((value) => ({ entryId: entry.id, value })),
        { entryId: entry.id, value: 'atlas-cartel2' }
      ],
    });

    const rowHasHandles = splitValues(cartel2Rows[i].S).slice(0, 4);
    await prisma.hashtag.createMany({
      data: [
        { entryId: entry.id, value: '#atlas' },
        { entryId: entry.id, value: `#${f.workbookId}` },
        ...rowHasHandles.map((handle) => ({ entryId: entry.id, value: `#${toSlug(handle)}` }))
      ],
    });

    for (const asset of f.mediaAssets) {
      await prisma.mediaAsset.create({
        data: { entryId: entry.id, kind: asset.kind, url: asset.url, altText: asset.altText },
      });
    }

    await prisma.sourceLink.create({
      data: { entryId: entry.id, label: 'Foglio Cartel2', url: `https://atlas.local/data/Cartel2.xlsx#${f.workbookId}` },
    });
    await prisma.bibliographyItem.create({
      data: { entryId: entry.id, citation: `Cartel2.xlsx (${f.workbookId}). ${f.title}. ATLAS dataset.` },
    });
  }

  // ------------------------------------------------------------------
  // Collections curated from the published workbook entries
  // ------------------------------------------------------------------
  for (const definition of DEMO_COLLECTION_DEFINITIONS) {
    const collection = await prisma.collection.create({
      data: {
        slug: definition.slug,
        title: definition.title,
        intro: definition.intro
      }
    });

    const sections = buildDemoCollectionSections(definition, publishedEntriesByWorkbookId);
    await prisma.collectionSection.createMany({
      data: sections.map((section, index) => ({
        collectionId: collection.id,
        title: section.title,
        content: section.content,
        orderIndex: index
      }))
    });

    const collectionEntries = definition.workbookIds.flatMap((workbookId, index) => {
      const entryId = publishedEntryIdByWorkbookId.get(workbookId);
      if (!entryId) return [];
      return [
        {
          collectionId: collection.id,
          entryId,
          orderIndex: index
        }
      ];
    });

    if (collectionEntries.length > 0) {
      await prisma.collectionEntry.createMany({ data: collectionEntries });
    }
  }

  console.log(`
+---------------------------------------------------------+
|  ATLAS – Seed completato con contenuto workbook         |
+---------------------------------------------------------+

Dati caricati:
  • 4 utenti base
  • 13 paesi con regioni
  • ${allTerms.length} termini tassonomici (it/en/fr) in 9 gruppi
  • ${publishedEntries.length} entry dal workbook Cartel2

Account base (password indicata tra parentesi):
  admin@atlas.local       — super_admin  (admin1234)
  editor@atlas.local      — editor       (editor1234)
  contributor@atlas.local — contributor  (contributor1234)
  researcher@atlas.local  — research_admin (researcher1234)

Per azzerare e ricaricare:  npm run db:reset
+---------------------------------------------------------+
`);
}

main().finally(() => prisma.$disconnect());
