import { PrismaClient } from '@prisma/client';

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
      { it: 'Teorizzazione/Costituzione', en: 'Theorisation/Constitution', fr: 'Theorisation/Constitution' },
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
      { it: 'Pratiche di moda', en: 'Fashion Practices', fr: 'Pratiques de mode' },
      { it: 'Culture di moda', en: 'Fashion Cultures', fr: 'Cultures de mode' },
      { it: 'Pratiche e Culture di moda', en: 'Fashion Practices and Cultures', fr: 'Pratiques et Cultures de mode' },
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
      { it: 'Schizzi', en: 'Sketches', fr: 'Sketches' },
      { it: 'Street fashion photography', en: 'Street Fashion Photography', fr: 'Street fashion photography' },
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
// Entry fixtures — realistic multilingual content, all set to published
// ---------------------------------------------------------------------------
const publishedFixtures = [
  {
    slug: 'ricamo-digitale-identita-beduina',
    titleIt: 'Ricamo digitale e identita\' beduina',
    subtitleIt: 'Pratiche artigianali su Instagram',
    abstractIt: 'Analisi critica delle pratiche di ricamo tradizionale beduino rilette attraverso la visualita\' digitale di Instagram.',
    descriptionIt: 'Studio approfondito degli account Instagram che documentano e ricontestualizzano le tecniche di ricamo beduino. Il corpus comprende oltre 200 account attivi tra il 2020 e il 2024, con focus sulla negoziazione tra autenticita\' culturale e spettacolarizzazione digitale.',
    sourceContext: 'Instagram @broderie_bedouine',
    timePeriod: '2020-2024',
    editorialNote: 'Entry selezionata per il percorso curatoriale Diaspora Traces.',
    canonicalLanguage: 'it',
    countryCode: 'PS',
    lat: 31.90, lng: 35.20,
    featured: true,
  },
  {
    slug: 'moda-urbana-casablanca',
    titleIt: 'Moda urbana a Casablanca',
    subtitleIt: 'Streetstyle e ibridazione culturale',
    abstractIt: 'Mappatura degli account Instagram legati allo streetstyle di Casablanca tra tradizione e modernita\' urbana.',
    descriptionIt: 'Casablanca e\' uno dei laboratori piu\' vivaci della moda digitale nordafricana. Questo studio analizza come i creator locali costruiscano un\'estetica urbana ibrida, mescolando codici visivi occidentali e simboli dell\'abbigliamento tradizionale marocchino, con particolare attenzione alle pratiche di auto-rappresentazione femminile.',
    sourceContext: 'Instagram @casablanca_style',
    timePeriod: '2019-2023',
    editorialNote: null,
    canonicalLanguage: 'fr',
    countryCode: 'MA',
    lat: 33.59, lng: -7.62,
    featured: false,
  },
  {
    slug: 'diaspora-libanese-moda-digitale',
    titleIt: 'Diaspora libanese e moda digitale',
    subtitleIt: 'Memoria e adornamento in esilio',
    abstractIt: 'Studio delle pratiche di auto-rappresentazione della diaspora libanese attraverso piattaforme digitali.',
    descriptionIt: 'Attraverso l\'analisi di account TikTok e Instagram gestiti da libanesi in diaspora (principalmente Francia, Canada, Brasile), questa ricerca esplora come il vestiario e l\'adornamento diventino veicoli di memoria collettiva e ricostruzione identitaria a distanza dalla terra d\'origine.',
    sourceContext: 'TikTok @liban_diaspora',
    timePeriod: '2021-2024',
    editorialNote: 'Commentata da tre ricercatori del progetto.',
    canonicalLanguage: 'en',
    countryCode: 'LB',
    lat: 33.89, lng: 35.50,
    featured: true,
  },
  {
    slug: 'tessitura-codici-culturali-siriani',
    titleIt: 'Tessitura e codici culturali siriani',
    subtitleIt: 'Dalla tradizione alla narrazione digitale',
    abstractIt: 'Analisi della tessitura tradizionale siriana e della sua trasposizione narrativa nei social media.',
    descriptionIt: 'La guerra e la diaspora hanno frammentato le comunita\' di tessitori siriani, ma i social media hanno creato nuovi spazi di trasmissione del sapere artigianale. Questo studio documenta come maestri tessitori e designer della seconda generazione utilizzino YouTube e Instagram per preservare e reinventare tecniche tradizionali di Damasco e Aleppo.',
    sourceContext: 'YouTube @syrian_weaving',
    timePeriod: '2018-2022',
    editorialNote: null,
    canonicalLanguage: 'it',
    countryCode: 'SY',
    lat: 33.51, lng: 36.29,
    featured: false,
  },
  {
    slug: 'henna-ritualita-tunisina-tiktok',
    titleIt: 'Henna e ritualita\' tunisina su TikTok',
    subtitleIt: 'Pratiche corporee e memoria familiare',
    abstractIt: 'Le pratiche di henne come forma di narrazione della memoria familiare e dell\'identita\' di genere in Tunisia.',
    descriptionIt: 'TikTok e diventato uno spazio privilegiato per la trasmissione intergenerazionale delle tecniche di henne in Tunisia. Questa ricerca analizza come le giovani tunisine negozino tra la dimensione rituale tradizionale e la logica performativa dei social media, producendo nuovi immaginari di femminilita\' e appartenenza culturale.',
    sourceContext: 'TikTok @henna_tunis',
    timePeriod: '2022-2024',
    editorialNote: null,
    canonicalLanguage: 'fr',
    countryCode: 'TN',
    lat: 36.82, lng: 10.16,
    featured: false,
  },
  {
    slug: 'moda-alessandrina-nostalgia-coloniale',
    titleIt: 'Moda alessandrina e nostalgia coloniale',
    subtitleIt: 'Estetica del remix postcoloniale',
    abstractIt: 'Il ritorno estetico alla Alessandria cosmopolita del Novecento attraverso gli account di moda vintage egiziani.',
    descriptionIt: 'Un corpus crescente di account Instagram e Pinterest propone una riscoperta dell\'estetica cosmopolita di Alessandria d\'Egitto tra anni Venti e Cinquanta. Questa ricerca analizza come tale nostalgia visuale si intrecci con discorsi postcoloniali, nazionalisti e di genere nell\'Egitto contemporaneo.',
    sourceContext: 'Instagram @alex_vintage_fashion',
    timePeriod: '2019-2023',
    editorialNote: 'Entry in corso di revisione editoriale approfondita.',
    canonicalLanguage: 'en',
    countryCode: 'EG',
    lat: 31.20, lng: 29.92,
    featured: false,
  },
  {
    slug: 'tatriz-resistenza-palestinese',
    titleIt: 'Tatriz: adornamento politico palestinese',
    subtitleIt: 'Il ricamo come simbolo di resistenza',
    abstractIt: 'Il ricamo palestinese (tatriz) come forma di resistenza culturale e politica nelle pratiche digitali.',
    descriptionIt: 'Il tatriz, il ricamo tradizionale palestinese, e\' diventato un potente simbolo di resistenza e identita\' nazionale nelle piattaforme digitali. Questa ricerca documenta come designer, artigiane e attiviste utilizzino Instagram e TikTok per riaffermare la continuita\' culturale palestinese attraverso le pratiche tessili.',
    sourceContext: 'Instagram @tatriz_palestine',
    timePeriod: '2020-2024',
    editorialNote: null,
    canonicalLanguage: 'it',
    countryCode: 'PS',
    lat: 31.95, lng: 35.25,
    featured: true,
  },
  {
    slug: 'couture-greco-cipriota-identita-bifocale',
    titleIt: 'Couture greco-cipriota e identita\' bifocale',
    subtitleIt: 'Moda tra Atene e Nicosia',
    abstractIt: 'Analisi degli account di couture greco-cipriota e della negoziazione identitaria tra le due culture.',
    descriptionIt: 'L\'isola di Cipro ospita una scena della moda digitale peculiare, caratterizzata dalla sovrapposizione di influenze greche, turco-cipriote e britanniche. Questa ricerca analizza come i designer locali costruiscano narrative di identita\' bifocale attraverso Instagram e siti di e-commerce.',
    sourceContext: 'Instagram @cypriot_couture',
    timePeriod: '2021-2024',
    editorialNote: null,
    canonicalLanguage: 'en',
    countryCode: 'CY',
    lat: 35.17, lng: 33.36,
    featured: false,
  },
  {
    slug: 'hijab-fashion-post-secolarismo-turco',
    titleIt: 'Hijab fashion e post-secolarismo turco',
    subtitleIt: 'Velo, agency femminile e Instagram',
    abstractIt: 'Le pratiche di hijab fashion turca come spazio di agency femminile e negoziazione del post-secolarismo.',
    descriptionIt: 'La Turchia contemporanea e\' un laboratorio privilegiato per osservare le tensioni tra secolarismo, islamismo politico e moda globale. Questa ricerca analizza come le influencer di hijab fashion su Instagram negozino tra estetica globale, valori religiosi e affermazione di agency femminile in un contesto politico in trasformazione.',
    sourceContext: 'Instagram @hijab_istanbul',
    timePeriod: '2019-2024',
    editorialNote: null,
    canonicalLanguage: 'it',
    countryCode: 'TR',
    lat: 41.01, lng: 28.95,
    featured: false,
  },
  {
    slug: 'karakou-algeri-digitale',
    titleIt: 'La karakou nell\'era digitale ad Algeri',
    subtitleIt: 'Tradizione e modernita\' nelle piattaforme sociali',
    abstractIt: 'La karakou tradizionale algerina rivisitata dai designer emergenti di Algeri sui social media.',
    descriptionIt: 'La karakou, abito tradizionale femminile di Algeri, sta vivendo una rinascita digitale grazie a una nuova generazione di stilisti che la reinterpretano sui social media. Questa ricerca documenta le tensioni creative tra tradizione, modernita\' e mercato globale nella moda digitale algerina contemporanea.',
    sourceContext: 'Instagram @karakou_moderne',
    timePeriod: '2020-2023',
    editorialNote: null,
    canonicalLanguage: 'fr',
    countryCode: 'DZ',
    lat: 36.73, lng: 3.09,
    featured: false,
  },
  {
    slug: 'moda-italiana-mediterraneita',
    titleIt: 'Moda italiana e mediterraneita\'',
    subtitleIt: 'Identita\' visuale del Sud Italia',
    abstractIt: 'Come i designer del Sud Italia costruiscono un immaginario mediterraneo nelle loro narrazioni digitali.',
    descriptionIt: 'I designer emergenti del Mezzogiorno italiano stanno costruendo su Instagram e TikTok un nuovo immaginario estetico che mescola tradizioni artigianali locali (dalla ceramica di Caltagirone ai tessuti di Lentini) con riferimenti alla moda globale, affermando una mediterraneita\' come categoria identitaria e commerciale.',
    sourceContext: 'Instagram @southitaly_fashion',
    timePeriod: '2021-2024',
    editorialNote: 'Entry in evidenza nella homepage del sito.',
    canonicalLanguage: 'it',
    countryCode: 'IT',
    lat: 37.50, lng: 15.09,
    featured: true,
  },
  {
    slug: 'moda-marsigliese-maghreb',
    titleIt: 'Moda di Marsiglia: Maghreb e Mediterranee',
    subtitleIt: 'Ibridazione culturale nel vestiario urbano',
    abstractIt: 'Analisi degli account di moda di Marsiglia e della loro narrazione dell\'ibridazione culturale maghrebina-francese.',
    descriptionIt: 'Marsiglia e\' la citta\' in cui la moda mediterranea e la moda nordafricana si incontrano con maggiore intensita\' in Europa. Questa ricerca analizza come i creator di moda marsigliesi costruiscano estetiche ibride che riflettono la complessita\' della citta\' come spazio di incontro tra culture del Mediterraneo.',
    sourceContext: 'Instagram @marseille_moda',
    timePeriod: '2020-2024',
    editorialNote: null,
    canonicalLanguage: 'fr',
    countryCode: 'FR',
    lat: 43.30, lng: 5.37,
    featured: false,
  },
  {
    slug: 'moda-balearica-turismo-identita',
    titleIt: 'Moda balearica tra turismo e identita\' locale',
    subtitleIt: 'Adornamento e stagionalita\' insulare',
    abstractIt: 'Come l\'industria della moda delle Isole Baleari negozia l\'identita\' locale in un contesto turistico globale.',
    descriptionIt: 'Le Isole Baleari offrono un caso di studio unico sulla tensione tra identita\' locale e pressioni del turismo globale nella moda digitale. Questa ricerca analizza come i brand locali e i creator di Maiorca e Ibiza costruiscano narrazioni di autenticita\' culturale per un pubblico internazionale sui social media.',
    sourceContext: 'Instagram @ibiza_style_local',
    timePeriod: '2019-2023',
    editorialNote: null,
    canonicalLanguage: 'en',
    countryCode: 'ES-IB',
    lat: 39.57, lng: 2.65,
    featured: false,
  },
  {
    slug: 'beirut-post-esplosione-moda',
    titleIt: 'Moda beirutina post-esplosione',
    subtitleIt: 'Resilienza creativa e adornamento',
    abstractIt: 'Come i designer di Beirut hanno risposto all\'esplosione del porto del 2020 attraverso la moda digitale.',
    descriptionIt: 'L\'esplosione del porto di Beirut del 4 agosto 2020 ha segnato una svolta nella produzione culturale libanese. Questa ricerca documenta come i designer di moda beirutini abbiano risposto al trauma collettivo attraverso le piattaforme digitali, trasformando l\'adornamento in atto di resilienza, memoria e ricostruzione identitaria.',
    sourceContext: 'Instagram @beirut_resilience_fashion',
    timePeriod: '2020-2023',
    editorialNote: 'Entry di alta rilevanza documentaria. Raccomandata per percorsi didattici.',
    canonicalLanguage: 'en',
    countryCode: 'LB',
    lat: 33.89, lng: 35.51,
    featured: true,
  },
  {
    slug: 'modest-fashion-imprenditoria-grecia',
    titleIt: 'Modest fashion e imprenditoria femminile in Grecia',
    subtitleIt: 'Nuovi mercati e narrazioni digitali',
    abstractIt: 'La crescita del mercato della modest fashion in Grecia e il ruolo delle imprenditrici digitali.',
    descriptionIt: 'La Grecia ospita una minoranza musulmana storica in Tracia e una crescente comunita\' di immigrati dal Medio Oriente e dal Nord Africa. Questa ricerca analizza come le imprenditrici di modest fashion stiano costruendo su Instagram nicchie di mercato originali, negoziando tra estetica globale, valori religiosi e contesto greco-mediterraneo.',
    sourceContext: 'Instagram @modest_hellas',
    timePeriod: '2021-2024',
    editorialNote: null,
    canonicalLanguage: 'it',
    countryCode: 'GR',
    lat: 41.15, lng: 25.41,
    featured: false,
  },
];

// ---------------------------------------------------------------------------
// Workflow-state entries (for testing the editorial pipeline)
// ---------------------------------------------------------------------------
type WorkflowStatus = 'submitted' | 'under_review' | 'changes_requested' | 'approved' | 'draft';

const workflowFixtures: { status: WorkflowStatus; countryCode: string }[] = [
  { status: 'submitted',         countryCode: 'MA' },
  { status: 'submitted',         countryCode: 'TN' },
  { status: 'submitted',         countryCode: 'IT' },
  { status: 'submitted',         countryCode: 'TR' },
  { status: 'submitted',         countryCode: 'GR' },
  { status: 'under_review',      countryCode: 'LB' },
  { status: 'under_review',      countryCode: 'EG' },
  { status: 'under_review',      countryCode: 'DZ' },
  { status: 'changes_requested', countryCode: 'SY' },
  { status: 'changes_requested', countryCode: 'CY' },
  { status: 'approved',          countryCode: 'FR' },
  { status: 'approved',          countryCode: 'IT' },
  { status: 'draft',             countryCode: 'MA' },
  { status: 'draft',             countryCode: 'PS' },
  { status: 'draft',             countryCode: 'TR' },
];

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
  // Full cleanup in safe dependency order
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
  // Demo users  (passwordHash is a dev-only placeholder)
  // ------------------------------------------------------------------
  const admin = await prisma.user.create({
    data: { email: 'admin@atlas.local', passwordHash: 'dev-only', displayName: 'ATLAS Admin', roleId: superAdminRole.id },
  });
  const editor = await prisma.user.create({
    data: { email: 'editor@atlas.local', passwordHash: 'dev-only', displayName: 'ATLAS Editor', roleId: editorRole.id },
  });
  const contributor = await prisma.user.create({
    data: { email: 'contributor@atlas.local', passwordHash: 'dev-only', displayName: 'ATLAS Contributor', roleId: contributorRole.id },
  });
  const researcher = await prisma.user.create({
    data: { email: 'researcher@atlas.local', passwordHash: 'dev-only', displayName: 'ATLAS Researcher', roleId: researchAdminRole.id },
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

  const allTerms = await prisma.taxonomyTerm.findMany();

  // ------------------------------------------------------------------
  // Published entries (from fixtures — all set to published)
  // ------------------------------------------------------------------
  const publishedEntries = [];
  for (let i = 0; i < publishedFixtures.length; i++) {
    const f = publishedFixtures[i];
    const country = countriesById[f.countryCode];
    // Stagger publication dates over the past 6 months
    const publishedAt = new Date(Date.now() - (i + 1) * 12 * 24 * 60 * 60 * 1000);

    const entry = await prisma.entry.create({
      data: {
        slug: f.slug,
        title: f.titleIt,
        subtitle: f.subtitleIt,
        abstract: f.abstractIt,
        description: f.descriptionIt,
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
        publishedAt,
      },
    });
    publishedEntries.push(entry);

    // 5 taxonomy assignments per entry (unique, cycling through all terms)
    const termIds = new Set<string>();
    for (let offset = 0; termIds.size < 5; offset++) {
      termIds.add(allTerms[(i * 7 + offset * 11) % allTerms.length].id);
    }
    await prisma.entryTaxonomyAssignment.createMany({
      data: Array.from(termIds).map((termId) => ({ entryId: entry.id, termId })),
    });

    // Multiple keywords
    await prisma.keyword.createMany({
      data: [
        { entryId: entry.id, value: 'moda-digitale' },
        { entryId: entry.id, value: 'mediterraneo' },
        { entryId: entry.id, value: 'identita' },
        { entryId: entry.id, value: toSlug(country.name) },
        { entryId: entry.id, value: `atlas-${i + 1}` },
      ],
    });

    // Multiple hashtags
    await prisma.hashtag.createMany({
      data: [
        { entryId: entry.id, value: '#atlas' },
        { entryId: entry.id, value: '#modadigitale' },
        { entryId: entry.id, value: `#${toSlug(country.name)}fashion` },
        { entryId: entry.id, value: '#mediterranean' },
      ],
    });

    await prisma.mediaAsset.create({
      data: { entryId: entry.id, kind: 'image', url: `https://picsum.photos/seed/atlas-pub-${i + 1}/1200/800`, altText: f.titleIt },
    });
    await prisma.sourceLink.create({
      data: { entryId: entry.id, label: 'Fonte primaria', url: f.sourceContext },
    });
    await prisma.bibliographyItem.create({
      data: { entryId: entry.id, citation: `ATLAS Research Group (2024). ${f.titleIt}. ATLAS – Cartografia digitale della moda.` },
    });
  }

  // ------------------------------------------------------------------
  // Workflow-state entries (for testing all editorial screens)
  // ------------------------------------------------------------------
  const workflowEntries = [];
  for (let i = 0; i < workflowFixtures.length; i++) {
    const { status, countryCode } = workflowFixtures[i];
    const country = countriesById[countryCode];
    const idx = i + 16;
    const needsReviewer = ['under_review', 'changes_requested', 'approved'].includes(status);

    const entry = await prisma.entry.create({
      data: {
        slug: `atl-workflow-${idx}`,
        title: `Entry in lavorazione ${idx}: moda digitale in ${country.name}`,
        subtitle: `Stato: ${status.replace(/_/g, ' ')}`,
        abstract: `Scheda critica sulla produzione digitale legata alla moda in ${country.name}. Entry nello stato "${status}" per dimostrare il workflow editoriale.`,
        description: `Analisi delle pratiche di scrittura digitale della moda in ${country.name}. Questa entry e\' attualmente nello stato "${status}" e serve a illustrare le diverse fasi del processo editoriale di ATLAS: dalla bozza alla pubblicazione, con possibilita\' di revisione, richiesta di modifiche e approvazione finale.`,
        status,
        featured: false,
        countryId: country.id,
        contributorId: contributor.id,
        reviewerId: needsReviewer ? editor.id : undefined,
        placeName: country.name,
        lat: country.lat + (((i * 17) % 10) - 5) * 0.1,
        lng: country.lng + (((i * 13) % 10) - 5) * 0.1,
        timePeriodLabel: '2022-2024',
        canonicalLanguage: 'it',
      },
    });
    workflowEntries.push(entry);

    const termIds = new Set<string>();
    for (let offset = 0; termIds.size < 4; offset++) {
      termIds.add(allTerms[(idx * 5 + offset * 9) % allTerms.length].id);
    }
    await prisma.entryTaxonomyAssignment.createMany({
      data: Array.from(termIds).map((termId) => ({ entryId: entry.id, termId })),
    });

    await prisma.keyword.createMany({
      data: [
        { entryId: entry.id, value: `moda-${toSlug(country.name)}` },
        { entryId: entry.id, value: 'atlas-work-in-progress' },
      ],
    });
    await prisma.hashtag.createMany({
      data: [
        { entryId: entry.id, value: '#atlas' },
        { entryId: entry.id, value: `#${status.replace(/_/g, '')}` },
      ],
    });
    await prisma.mediaAsset.create({
      data: { entryId: entry.id, kind: 'image', url: `https://picsum.photos/seed/atlas-wf-${idx}/1200/800`, altText: `Entry in lavorazione ${idx}` },
    });
    await prisma.sourceLink.create({
      data: { entryId: entry.id, label: 'Fonte', url: `https://example.org/source/workflow-${idx}` },
    });
    await prisma.bibliographyItem.create({
      data: { entryId: entry.id, citation: `Autore Demo (2024). Entry di test ${idx}. ATLAS.` },
    });
  }

  // ------------------------------------------------------------------
  // Submission comments on under_review entries
  // ------------------------------------------------------------------
  for (let i = 0; i < workflowFixtures.length; i++) {
    if (workflowFixtures[i].status === 'under_review') {
      await prisma.submissionComment.create({
        data: { entryId: workflowEntries[i].id, authorId: editor.id, content: 'L\'abstract e\' chiaro, ma la descrizione necessita di maggiore contestualizzazione storica.' },
      });
      await prisma.submissionComment.create({
        data: { entryId: workflowEntries[i].id, authorId: contributor.id, content: 'Grazie per il feedback. Provvedo ad ampliare la sezione descrittiva.' },
      });
    }
    if (workflowFixtures[i].status === 'changes_requested') {
      await prisma.submissionComment.create({
        data: { entryId: workflowEntries[i].id, authorId: editor.id, content: 'Si prega di aggiungere fonti primarie e di ampliare la contestualizzazione geografica.' },
      });
    }
  }

  // ------------------------------------------------------------------
  // Entry revisions (first 5 published entries get 2 revisions each)
  // ------------------------------------------------------------------
  for (let i = 0; i < Math.min(5, publishedEntries.length); i++) {
    const entry = publishedEntries[i];
    await prisma.entryRevision.create({
      data: { entryId: entry.id, createdById: contributor.id, snapshot: { title: entry.title, abstract: entry.abstract, version: 1 } },
    });
    await prisma.entryRevision.create({
      data: { entryId: entry.id, createdById: editor.id, snapshot: { title: entry.title, abstract: entry.abstract, version: 2 } },
    });
  }

  // ------------------------------------------------------------------
  // Collections
  // ------------------------------------------------------------------
  const collection1 = await prisma.collection.create({
    data: {
      slug: 'diaspora-traces',
      title: 'Diaspora Traces',
      intro: 'Percorso curatoriale su diaspora e adornamento digitale nel Mediterraneo.',
    },
  });
  const collection2 = await prisma.collection.create({
    data: {
      slug: 'pratiche-artigianali-digitali',
      title: 'Pratiche Artigianali Digitali',
      intro: 'Come le pratiche artigianali tradizionali si trasformano nell\'era dei social media.',
    },
  });

  await prisma.collectionSection.createMany({
    data: [
      { collectionId: collection1.id, title: 'Origini', content: 'Tracce materiali e genealogie del tessuto diasporico mediterraneo.', orderIndex: 1 },
      { collectionId: collection1.id, title: 'Rimediazioni', content: 'Riuso digitale, remix visuale e ibridazioni post-coloniali.', orderIndex: 2 },
    ],
  });
  await prisma.collectionSection.createMany({
    data: [
      { collectionId: collection2.id, title: 'Ricamo e Intreccio', content: 'Pratiche di ricamo e intreccio tradizionale nell\'era digitale.', orderIndex: 1 },
      { collectionId: collection2.id, title: 'Tintura e Grafica tessile', content: 'Innovazioni digitali nelle pratiche di tintura e grafica su tessuto.', orderIndex: 2 },
    ],
  });

  await prisma.collectionEntry.createMany({
    data: publishedEntries.slice(0, 8).map((e, idx) => ({ collectionId: collection1.id, entryId: e.id, orderIndex: idx + 1 })),
  });
  await prisma.collectionEntry.createMany({
    data: publishedEntries.slice(4, 10).map((e, idx) => ({ collectionId: collection2.id, entryId: e.id, orderIndex: idx + 1 })),
  });

  // ------------------------------------------------------------------
  // Favorites
  // ------------------------------------------------------------------
  await prisma.favorite.createMany({
    data: publishedEntries.slice(0, 6).map((e) => ({ userId: contributor.id, entryId: e.id })),
  });
  await prisma.favorite.createMany({
    data: publishedEntries.slice(5, 10).map((e) => ({ userId: researcher.id, entryId: e.id })),
  });

  // ------------------------------------------------------------------
  // Saved searches (contributor)
  // ------------------------------------------------------------------
  await prisma.savedSearch.createMany({
    data: [
      { userId: contributor.id, label: 'Moda marocchina', query: { q: 'marocco', country: 'Marocco' } },
      { userId: contributor.id, label: 'Entry pubblicate in evidenza', query: { status: 'published', featured: 'true' } },
      { userId: contributor.id, label: 'Ricerca diaspora', query: { q: 'diaspora' } },
    ],
  });

  // ------------------------------------------------------------------
  // Notifications
  // ------------------------------------------------------------------
  await prisma.notification.createMany({
    data: [
      { userId: contributor.id, title: 'Entry approvata', body: 'La tua entry "Ricamo digitale e identita\' beduina" e\' stata approvata e pubblicata.' },
      { userId: contributor.id, title: 'Modifiche richieste', body: 'La tua entry "Tessitura e codici culturali siriani" richiede alcune revisioni prima della pubblicazione.' },
      { userId: contributor.id, title: 'Nuovo commento dell\'editor', body: 'L\'editor ha lasciato un commento sulla tua entry in revisione.' },
      { userId: editor.id, title: 'Nuove submission da revisionare', body: '5 nuove entry sono in attesa di revisione nella coda editoriale.' },
      { userId: editor.id, title: 'Seed demo caricato', body: 'Il dataset di test e\' disponibile: 15 entry pubblicate + 15 in vari stati del workflow.' },
      { userId: admin.id, title: 'Seed demo completato', body: 'Database inizializzato: 15 entry pubblicate, 15 in lavorazione, 4 utenti, 2 collezioni curate.' },
    ],
  });

  // ------------------------------------------------------------------
  // Audit logs
  // ------------------------------------------------------------------
  await prisma.auditLog.createMany({
    data: [
      { actorId: admin.id, action: 'seed.run', payload: { publishedEntries: publishedEntries.length, workflowEntries: workflowEntries.length, users: 4, collections: 2 } },
      { actorId: editor.id, action: 'entry.review.start', payload: { entryId: workflowEntries[5]?.id } },
      { actorId: editor.id, action: 'entry.review.comment', payload: { entryId: workflowEntries[5]?.id } },
      { actorId: contributor.id, action: 'entry.submit', payload: { count: workflowFixtures.filter((f) => f.status === 'submitted').length } },
      { actorId: contributor.id, action: 'entry.create', payload: { slug: publishedEntries[0]?.slug } },
    ],
  });

  // ------------------------------------------------------------------
  // Taxonomy suggestions (pending moderation in the admin panel)
  // ------------------------------------------------------------------
  await prisma.taxonomySuggestion.createMany({
    data: [
      { groupSlug: 'practices', label: 'Stampa a blocchi', rationale: 'Tecnica tradizionale di stampa su tessuto diffusa in tutto il Mediterraneo.' },
      { groupSlug: 'framing', label: 'Moda e Sostenibilita\'', rationale: 'Crescente rilevanza del tema sostenibilita\' nelle scritture digitali di moda.' },
      { groupSlug: 'tone', label: 'Militante', rationale: 'Tono presente in molti account che trattano la moda come pratica di resistenza politica.' },
      { groupSlug: 'formats', label: 'Podcast audio', rationale: 'Formato emergente nella produzione digitale su moda e identita\'.' },
    ],
  });

  console.log(`
+---------------------------------------------------------+
|  ATLAS – Seed demo completato con successo!             |
+---------------------------------------------------------+

Dati caricati:
  • 4 utenti demo
  • 13 paesi con regioni
  • ${allTerms.length} termini tassonomici (it/en/fr) in 9 gruppi
  • ${publishedEntries.length} entry PUBBLICATE con coordinate geografiche
  • ${workflowEntries.length} entry in vari stati del workflow editoriale
  • 2 collezioni curate
  • Preferiti, ricerche salvate, notifiche, commenti, revisioni
  • Log di audit e suggerimenti tassonomici

Account demo (passwordHash = 'dev-only', solo sviluppo):
  admin@atlas.local       — super_admin
  editor@atlas.local      — editor
  contributor@atlas.local — contributor
  researcher@atlas.local  — research_admin

Per azzerare e ricaricare:  npm run db:reset
+---------------------------------------------------------+
`);
}

main().finally(() => prisma.$disconnect());
