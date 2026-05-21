export type DemoCollectionDefinition = {
  slug: string;
  title: string;
  intro: string;
  workbookIds: string[];
  sectionTitles: [string, string];
};

export type DemoEntrySummary = {
  workbookId: string;
  slug: string;
  title: string;
  abstract: string;
  countryName: string;
  timePeriodLabel: string | null;
};

export const DEMO_COLLECTION_DEFINITIONS: DemoCollectionDefinition[] = [
  {
    slug: 'diaspora-traces',
    title: 'Diaspora Traces',
    intro: 'A route through entries where identity, circulation, and cultural translation are visible in the workbook data.',
    workbookIds: ['21024', '23024', '36024', '40024', '45024', '46024'],
    sectionTitles: ['Identity and circulation', 'Editorial chain']
  },
  {
    slug: 'craft-process-remix',
    title: 'Craft, Process, and Remix',
    intro: 'A chain centered on making, process visibility, and digitally mediated fashion forms from the workbook.',
    workbookIds: ['22024', '24024', '25024', '28024', '29024', '30024'],
    sectionTitles: ['Process notes', 'Featured entries']
  },
  {
    slug: 'archive-signs',
    title: 'Archive Signs',
    intro: 'A selection focused on archive cues, format shifts, and media mix across the real dataset.',
    workbookIds: ['26024', '31024', '32024', '33024', '34024', '38024'],
    sectionTitles: ['Archive language', 'Media and format']
  }
];

export function buildDemoCollectionSections(
  definition: DemoCollectionDefinition,
  entriesByWorkbookId: Map<string, DemoEntrySummary>
) {
  const entries = definition.workbookIds.map((workbookId) => entriesByWorkbookId.get(workbookId)).filter(Boolean) as DemoEntrySummary[];
  const firstLine = entries.slice(0, 3).map((entry) => `${entry.title} (${entry.workbookId})`).join(' · ');
  const secondLine = entries.slice(3).map((entry) => `${entry.title} (${entry.workbookId})`).join(' · ');

  return [
    {
      title: definition.sectionTitles[0],
      content: firstLine || 'No entries attached.'
    },
    {
      title: definition.sectionTitles[1],
      content: secondLine || 'No entries attached.'
    }
  ];
}
