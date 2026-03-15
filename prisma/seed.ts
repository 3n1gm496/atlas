import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const groups = {
  typological: ['Exposition','Narration','Promotion','Théorisation/Constitution','Interaction'],
  geography: ['Îles Baléares','France','Italie','Cyprus','Maroc','Algerie','Tunisie','Egypte','Liban','Palestine','Syrie','Turkey','Grèce'],
  thematic: ['Pratiques de mode','Cultures de mode','Pratiques et Cultures de mode'],
  practices: ['Broderie','Tressage','Macramé','Weaving','Couching','Perlage','Couture','Teinture','Graphisme sur tissus'],
  framing: ['Mode et Adornement Autochtone','Adornement du corps et Esthétique','Mode et Adornement des Subcultures/Subalterns','Mode et Adornement Anti-Fashion Cultures','Fashion pas = à changement','Mode et Adornement Artificielle et Digitale','Mode et Adornement De-Growing','Mode et Adornement en Diaspora et Migration','Mode et Adornement Politique','Mode et Adornement Quotidien ou Streetstyle','Mode et Adornement Religieux','Mode et Adornement Historique'],
  formats: ['Carrousels','Images statiques','Reels/Videos','Stories','CupCuts','Direct stream','Stories Images en Movement'],
  tone: ['Humoristique','Descriptif','Critique','Pédagogique','Introspectif'],
  scripto: ['Photographies/reprises','Collections de vêtements et accessoires','Photographies d’e-commerce','Pages de livres, magazines et catalogues','Behind-the-scenes / Process de création','Sketches','Street fashion photography','Vie personnelle','Événements personnels','Révisions','Commentaires','Photographies d’archive','Repost / Remix','Memes'],
  microforms: ['Hashtags','Trending Keywords','Tags','Collabs']
};

async function main() {
  await prisma.$transaction([
    prisma.favorite.deleteMany(), prisma.collectionEntry.deleteMany(), prisma.collectionSection.deleteMany(), prisma.collection.deleteMany(),
    prisma.entryTaxonomyAssignment.deleteMany(), prisma.keyword.deleteMany(), prisma.hashtag.deleteMany(), prisma.mediaAsset.deleteMany(),
    prisma.sourceLink.deleteMany(), prisma.bibliographyItem.deleteMany(), prisma.entryRevision.deleteMany(), prisma.submissionComment.deleteMany(),
    prisma.entry.deleteMany(), prisma.taxonomyTerm.deleteMany(), prisma.taxonomyGroup.deleteMany(), prisma.region.deleteMany(), prisma.country.deleteMany(),
    prisma.user.deleteMany(), prisma.role.deleteMany()
  ]);

  const roles = await Promise.all(['public_visitor','contributor','editor','research_admin','super_admin'].map(name=>prisma.role.create({data:{name,description:name}})));
  const superAdminRole = roles.find(r=>r.name==='super_admin')!;
  const contributorRole = roles.find(r=>r.name==='contributor')!;
  const editorRole = roles.find(r=>r.name==='editor')!;

  const admin = await prisma.user.create({data:{email:'admin@atlas.local',passwordHash:'dev-only',displayName:'ATLAS Admin',roleId:superAdminRole.id}});
  const editor = await prisma.user.create({data:{email:'editor@atlas.local',passwordHash:'dev-only',displayName:'ATLAS Editor',roleId:editorRole.id}});
  const contributor = await prisma.user.create({data:{email:'contributor@atlas.local',passwordHash:'dev-only',displayName:'ATLAS Contributor',roleId:contributorRole.id}});

  const countries = await Promise.all([
    ['France','FR'],['Italie','IT'],['Maroc','MA'],['Tunisie','TN'],['Egypte','EG'],['Liban','LB'],['Grèce','GR'],['Turkey','TR'],['Cyprus','CY'],['Palestine','PS'],['Syrie','SY'],['Algerie','DZ'],['Îles Baléares','ES-IB']
  ].map(([name, code])=>prisma.country.create({data:{name,code}})));

  for (const [slug, terms] of Object.entries(groups)) {
    const group = await prisma.taxonomyGroup.create({data:{slug,labelIt:slug,labelEn:slug,labelFr:slug}});
    for (const term of terms) {
      await prisma.taxonomyTerm.create({data:{groupId:group.id,slug:term.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),labelIt:term,labelEn:term,labelFr:term,aliases:[]}});
    }
  }

  const allTerms = await prisma.taxonomyTerm.findMany();

  for (let i=1;i<=40;i++) {
    const country = countries[i % countries.length];
    const entry = await prisma.entry.create({
      data: {
        slug: `atl-entry-${i}`,
        title: `ATLAS Entry ${i}: Scrittura digitale e moda`,
        abstract: `Scheda critica ${i} sulle pratiche digitali della moda mediterranea.`,
        description: `Descrizione estesa dell'entry ${i} con focus su memoria, identità e visualità postcoloniale.`,
        status: i % 3 === 0 ? 'published' : 'submitted',
        featured: i % 7 === 0,
        countryId: country.id,
        contributorId: contributor.id,
        reviewerId: editor.id,
        placeName: country.name,
        canonicalLanguage: i % 3 === 0 ? 'fr' : i % 2 === 0 ? 'en' : 'it'
      }
    });

    await prisma.entryTaxonomyAssignment.createMany({
      data: [0,1,2,3].map(offset=>({entryId: entry.id, termId: allTerms[(i+offset*3) % allTerms.length].id}))
    });

    await prisma.keyword.create({data:{entryId:entry.id,value:`keyword-${i}`}});
    await prisma.hashtag.create({data:{entryId:entry.id,value:`#atlas${i}`}});
    await prisma.mediaAsset.create({data:{entryId:entry.id,kind:'image',url:`https://picsum.photos/seed/atlas${i}/1200/800`,altText:`ATLAS media ${i}`}});
    await prisma.sourceLink.create({data:{entryId:entry.id,label:'Fonte primaria',url:`https://example.org/source/${i}`}});
    await prisma.bibliographyItem.create({data:{entryId:entry.id,citation:`Autore ${i}, Atlante Digitale della Moda, 2024.`}});
  }

  const entries = await prisma.entry.findMany({take:8});
  const collection = await prisma.collection.create({data:{slug:'diaspora-traces',title:'Diaspora Traces',intro:'Percorso curatoriale su diaspora e adornamento digitale.'}});
  await prisma.collectionSection.createMany({data:[
    {collectionId:collection.id,title:'Origini',content:'Tracce materiali e genealogie.',orderIndex:1},
    {collectionId:collection.id,title:'Rimediazioni',content:'Riuso digitale e remix.',orderIndex:2}
  ]});
  await prisma.collectionEntry.createMany({data:entries.map((entry,index)=>({collectionId:collection.id,entryId:entry.id,orderIndex:index+1}))});

  await prisma.notification.create({data:{userId:admin.id,title:'Seed completato',body:'Dataset demo disponibile.'}});
}

main().finally(()=>prisma.$disconnect());
