export type WorkbookEditorialFallback = {
  abstract: string;
  description: string;
  note: string;
};

const note = 'Editorial fallback applied for sparse workbook data.';

const workbookEditorialFallbacks: Record<string, WorkbookEditorialFallback> = {
  '28024': {
    abstract: 'Rhythm-led craft and edit-driven presentation.',
    description:
      'A curated concept card for beat-synced making, where the process reads through timing, repetition, and short-form visual rhythm.',
    note
  },
  '29024': {
    abstract: 'Styling routines and self-presentation.',
    description:
      'A GRWM concept card that follows the logic of preparation, outfit choice, and the staged intimacy of being seen getting ready.',
    note
  },
  '30024': {
    abstract: 'Romanticist reinterpretation of folk references.',
    description:
      'A neo-folk card that frames folk references through romantic feeling rather than strict archival reconstruction.',
    note
  },
  '31024': {
    abstract: 'Archive-linked reels and named source networks.',
    description:
      'A history-reel card anchored in cited accounts, turning traces, references, and repost chains into an editorial archive trail.',
    note
  },
  '32024': {
    abstract: 'Tutorials and process videos for crafting.',
    description:
      'An ASMR card centered on making as a visible, audible sequence rather than a finished product.',
    note
  },
  '33024': {
    abstract: 'Printed fashion archives.',
    description:
      'A printed-archive card focused on magazines, posters, and explainers that document fashion through the page rather than the feed.',
    note
  },
  '34024': {
    abstract: 'Videos from shows and backstage fragments.',
    description:
      'A VHS card that treats analog video texture, runway footage, and behind-the-scenes material as an archival aesthetic.',
    note
  },
  '36024': {
    abstract: 'Scenestyled and adjacent SWANA references.',
    description:
      'A SWANA moodboard card built from scene-specific references, adjacent creators, and style clustering rather than a single source point.',
    note
  },
  '38024': {
    abstract: 'Rare aesthetic.',
    description:
      'A sparse concept card for an intentionally hard-to-classify aesthetic that still needs a fuller editorial frame.',
    note
  },
  '40024': {
    abstract: 'SWANA Y2K styling and digital-era references.',
    description:
      'A regional Y2K concept card that blends digital-era styling with SWANA references and online circulation.',
    note
  },
  '45024': {
    abstract: 'Moodboard occasions like scenestyled.',
    description:
      'A what-to-wear card oriented around occasion styling and moodboard prompts rather than a finished narrative.',
    note
  },
  '46024': {
    abstract: 'Main character energy.',
    description:
      'A self-staging concept card centered on presence, performance, and narrative control.',
    note
  }
};

export function getWorkbookEditorialFallback(workbookId: string | null | undefined) {
  if (!workbookId) return null;
  return workbookEditorialFallbacks[workbookId] ?? null;
}

export function hasWorkbookEditorialFallback(workbookId: string | null | undefined) {
  return Boolean(workbookId && workbookEditorialFallbacks[workbookId]);
}

export const workbookEditorialFallbackIds = Object.keys(workbookEditorialFallbacks);
