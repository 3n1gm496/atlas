export const locales = ['en', 'it', 'fr'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';
export const localeCookieName = 'anticores-locale';

type Primitive = string | number;
type MessageTree = {
  [key: string]: string | MessageTree;
};

type Dictionary = Record<Locale, MessageTree>;

function replaceInterpolations(template: string, values?: Record<string, Primitive>) {
  if (!values) return template;
  return Object.entries(values).reduce((result, [key, value]) => result.replaceAll(`{${key}}`, String(value)), template);
}

export function getMessage(messages: MessageTree, key: string, values?: Record<string, Primitive>) {
  const parts = key.split('.');
  let current: string | MessageTree | undefined = messages;

  for (const part of parts) {
    if (!current || typeof current === 'string') break;
    current = current[part];
  }

  if (typeof current !== 'string') return key;
  return replaceInterpolations(current, values);
}

export const messages: Dictionary = {
  en: {
    brand: {
      name: 'ANTICORES',
      subtitle: 'A cartography of digital fashion aesthetics.',
      baseline: "Mapping fashion(s) that didn't make it to your feed."
    },
    common: {
      skipToContent: 'Skip to content',
      open: 'Open',
      close: 'Close',
      reset: 'Reset',
      apply: 'Apply',
      remove: 'Remove',
      available: 'Available',
      account: 'Account',
      signIn: 'Sign in',
      signOut: 'Sign out',
      newCard: 'New Card',
      allCountries: 'All countries',
      allYears: 'All years',
      noFilters: 'No filters',
      untitled: 'Untitled',
      countryUndefined: 'Place being defined',
      periodUndefined: 'Timeframe being defined',
      provenance: 'Provenance',
      editorialFallback: 'Sheet note',
      sheet: 'Sheet',
      row: 'Row',
      canonicalKey: 'Canonical key',
      mediaMatch: 'Media match',
      mediaAssets: '{count} media',
      more: 'More',
      sourceNetwork: 'Source network',
      sourceLinks: 'Source links',
      bibliography: 'Bibliography',
      media: 'Media',
      workbookRowCaption: 'Workbook row',
      matchedViaCanonical: 'Matched via canonical key',
      matchedViaLegacy: 'Matched via legacy key',
      matchedViaAlias: 'Matched via alias',
      matchedBy: 'Matched by {value}',
      matched: 'Matched',
      partial: 'Partial',
      missing: 'Missing',
      orphan: 'Orphan',
      active: 'Active',
      inactive: 'Inactive',
      unavailable: 'Unavailable'
    },
    nav: {
      explore: 'Explore',
      project: 'Project',
      workspace: 'Area',
      menu: 'Menu',
      closeMenu: 'Close menu',
      openMenu: 'Open menu',
      map: 'Map',
      archive: 'Archive',
      collections: 'Collections',
      projectPage: 'Project',
      taxonomies: 'Taxonomies',
      contact: 'Contact us',
      review: 'Review',
      admin: 'Admin',
      account: 'Account'
    },
    footer: {
      line1: 'ANTICORES · A cartography of digital fashion aesthetics.',
      line2: "Mapping fashion(s) that didn't make it to your feed."
    },
    language: {
      label: 'Language',
      en: 'English',
      it: 'Italiano',
      fr: 'Français'
    },
    home: {
      chip: 'Digital fashion, aesthetics, places, and traces',
      title: 'A cartography for digital fashion aesthetics that circulate outside the obvious feed.',
      lead: "Start from a place, follow a constellation of images and practices, then open the card to learn more about a certain aesthetic.",
      statsPublished: 'Published cards',
      statsPeople: 'Contributors',
      statsCollections: 'Collections',
      entryLabel: 'Start here',
      mapTitle: 'Map',
      mapDescription: 'To start from places and see how texts, images, and themes gather in space.',
      archiveTitle: 'Archive',
      archiveDescription: 'To browse cards side by side and compare territories, periods, and keywords.',
      collectionsTitle: 'Collections',
      collectionsDescription: 'To follow already composed paths: a reading trail, not a neutral list.',
      whyKicker: 'Why ANTICORES',
      whyTitle: 'Some aesthetics never become the dominant image. They still leave strong traces.',
      whyBody: 'ANTICORES collects the signals that remain at the edge of the platform spotlight: local scenes, recurring images, practical know-how, and micro-histories of digital fashion.',
      sectionLabel: 'Featured cards',
      sectionTitle: 'A few openings into the catalog',
      openArchive: 'Open the full archive',
      featured: 'Featured',
      defaultPlace: 'Editorial node',
      defaultPeriod: 'Timeframe being defined'
    },
    archive: {
      eyebrow: 'Archive',
      title: 'Browse cards, compare contexts, and search within the archive itself.',
      description: 'Archive and search now live together: start from a keyword, narrow by taxonomy, then compare places, periods, formats, and know-how in one flow.',
      searchPlaceholder: 'Keyword, place, format, know-how…',
      filtersTaxonomy: 'Taxonomy',
      filtersCountry: 'Country',
      filtersYear: 'Year',
      filtersKeywords: 'Keywords',
      apply: 'Apply filters',
      reset: 'Reset',
      resultCount: '{count} results',
      grid: 'Grid',
      list: 'List',
      queryFilter: 'Query: {value}',
      countryFilter: 'Country: {value}',
      yearFilter: 'Year: {value}',
      taxonomyFilter: 'Taxonomy: {value}',
      keywordFilter: 'Keyword: {value}',
      empty: 'No cards match this combination. Widen the field or remove a filter.',
      featured: 'Featured'
    },
    about: {
      eyebrow: 'Why it exists',
      title: 'ANTICORES exists to make digital fashion aesthetics readable beyond the churn of the feed.',
      description:
        'The project gathers cards, images, keywords, and taxonomies so that dispersed visual cultures can be read as connected formations rather than isolated posts.',
      body1:
        'Digital fashion aesthetics often circulate in fragments: a look repeated by small scenes, a practical gesture, a video format, a local vocabulary, a shared mood. ANTICORES keeps those fragments together long enough to make them legible.',
      body2:
        'The platform is not a neutral container. Every card is composed so that a place, a period, a format, a set of materials, and a cluster of themes can be compared with others. The goal is to help readers, contributors, and editors follow relations rather than chase isolated impressions.',
      body3:
        'That is also why taxonomies matter here: not as backend labels, but as a shared language for filtering, comparing, and building paths through aesthetics that rarely receive stable public memory.'
    },
    taxonomy: {
      eyebrow: 'Taxonomies',
      title: 'The vocabulary that makes the archive searchable and comparable.',
      description:
        'Terms are grouped to support map filters, archive search, and card reading. They are part of the public experience, not hidden metadata.',
      readyTerms: '{count} terms ready to explore',
      groupDescription: '{count} terms available for classification, filtering, and editorial reading.',
      backToTaxonomies: 'Back to taxonomies'
    },
    review: {
      page: {
        eyebrow: 'Review',
        title: 'Inbox and selected card view.',
        description: 'Open the inbox, select a card, then decide without extra dashboard noise.',
        breadcrumb: 'Review',
        adminAction: 'Admin',
        empty: 'No cards are waiting in the inbox.'
      },
      inboxKicker: 'Inbox',
      inboxTitle: 'Review the cards that need a decision.',
      inboxDescription: 'Search the queue and open a card to assign, comment, or move it forward.',
      searchLabel: 'Search',
      searchPlaceholder: 'Title, contributor, reviewer…',
      searchAria: 'Search within the review inbox',
      visibleLabel: 'Cards visible',
      empty: 'No cards match this search.',
      selectedKicker: 'Selected card',
      byContributor: 'Proposed by {name}',
      assignedTo: 'Assigned to {name}',
      unassigned: 'Unassigned',
      lastMove: 'Last update',
      notes: 'Notes',
      reviewerLabel: 'Reviewer',
      openCard: 'Open card',
      recentNotes: 'Recent notes',
      notesCount: '{count} notes',
      noNotes: 'No notes yet.',
      nextStep: 'Next step',
      nextStepPlaceholder: 'Write the next step: verify, request changes, approve…',
      saving: 'Saving…',
      saveAssign: 'Save note and assignment',
      emptySelection: 'Select a card from the list to review it and decide the next step.',
      actions: {
        start: 'Start review',
        changes: 'Request changes',
        approve: 'Approve',
        publish: 'Publish',
        reject: 'Reject'
      },
      errors: {
        assign: 'Unable to update the assignment.',
        action: 'Unable to complete this action.',
        network: 'Network error while saving.'
      },
      messages: {
        assign: 'Assignment updated.',
        status: 'Card status updated.'
      }
    },
    account: {
      eyebrow: 'Account',
      title: 'Your cards, your profile, your next move.',
      description: 'Pick up recent work, check the state of your cards, and return to the actions that matter.',
      breadcrumb: 'Account',
      actions: {
        newCard: 'New Card',
        editProfile: 'Edit profile'
      },
      profile: {
        kicker: 'Working profile',
        email: 'Email',
        role: 'Role',
        cardsOpened: 'Cards opened so far',
        missing: 'N/D'
      },
      nextAction: {
        kicker: 'Next action',
        contributor: 'Resume a draft or start a new card.',
        other: 'Check recent cards and return where an intervention is needed.'
      },
      quick: {
        kicker: 'Quick view',
        title: 'Where you are now',
        cardsOpened: 'Cards opened',
        role: 'Current role',
        latestStatus: 'Latest status',
        noActivity: 'No recent activity'
      },
      links: {
        profile: {
          title: 'Profile',
          description: 'Update display name, bio, and core account details.'
        },
        saved: {
          title: 'Saved searches',
          description: 'Keep the paths you want to reopen without starting from zero.'
        },
        notifications: {
          title: 'Notifications',
          description: 'Follow state changes, messages, and requests attached to your cards.'
        }
      },
      recent: {
        kicker: 'Recent activity',
        title: 'Your cards',
        empty: 'No activity has been recorded for this account yet.'
      }
    },
    accountSubmissions: {
      eyebrow: 'Account / Cards',
      title: 'Your card history',
      description: 'A tidy view of the cards you opened, useful for resuming drafts and tracking progress.',
      breadcrumb: 'Account / Cards',
      resume: 'Resume this card',
      empty: 'You have not opened any cards yet.'
    },
    submitDashboard: {
      eyebrow: 'Your cards',
      title: 'Drafts to resume, submissions to follow, fixes to close.',
      description:
        'Everything you opened stays here: what is still being written, what awaits a review, and what came back with requested changes.',
      breadcrumb: 'Contributor',
      actions: {
        new: 'New card',
        history: 'Submission history'
      },
      stats: {
        drafts: 'Open drafts',
        submitted: 'Awaiting review',
        changes: 'Changes requested'
      },
      updated: 'Updated',
      resume: 'Resume this card',
      empty: 'You have not opened any cards yet.'
    },
    accountProfile: {
      eyebrow: 'Account / Profile',
      title: 'How you appear in the project',
      description:
        'Update name, bio, and core details so it is clear how you appear in cards, notes, and workspaces.',
      breadcrumb: 'Account / Profile',
      displayName: 'Display name',
      email: 'Email',
      role: 'Role',
      status: 'Account status',
      active: 'Active',
      missing: 'N/D',
      form: {
        displayName: 'Display name',
        email: 'Email',
        save: 'Save changes',
        saving: 'Saving…',
        saved: 'Profile updated.',
        error: 'Unable to update profile.'
      }
    },
    accountSaved: {
      eyebrow: 'Account / Saved searches',
      title: 'Saved searches you can reopen in seconds.',
      description: 'Keep the queries you use often and relaunch them when you want to return to a theme, place, or trail.',
      breadcrumb: 'Account / Saved searches',
      defaultSummary: 'Saved query ready to relaunch.',
      form: {
        kicker: 'New search',
        title: 'Save a path you want to reopen later.',
        label: 'Label',
        labelPlaceholder: 'For example: Countries under review',
        note: 'Quick note',
        notePlaceholder: 'Why is this search worth reopening?',
        save: 'Save search',
        remove: 'Remove',
        labelRequired: 'Add a label before saving the search.',
        saved: 'Search saved.',
        removed: 'Search removed.',
        saveError: 'Unable to save this search.'
      },
      memory: {
        kicker: 'Working memory',
        title: 'Keep only the searches that genuinely help you return to the archive.',
        count: 'Saved searches'
      }
    },
    accountFavorites: {
      eyebrow: 'Account / Favorites',
      title: 'Cards you want close at hand.',
      description: 'Collect the cards you want to reopen during reading, research, or review.',
      breadcrumb: 'Account / Favorites',
      list: {
        kicker: 'Quick reopen',
        title: 'The cards you keep near while you read or work.',
        count: 'Saved favorites',
        remove: 'Remove from favorites',
        removed: 'Favorite removed.',
        empty: 'No saved favorites.'
      }
    },
    accountNotifications: {
      eyebrow: 'Account / Notifications',
      title: 'Updates that matter to you.',
      description: 'Status changes, notes, and signals arrive here so you can keep the thread.',
      breadcrumb: 'Account / Notifications',
      empty: 'No notifications.',
      list: {
        kicker: 'Recent signals',
        title: 'What deserves attention right now.',
        new: 'New',
        total: 'Total',
        read: 'Read',
        unread: 'New',
        setRead: 'Mark read',
        setUnread: 'Mark unread',
        markRead: 'Notification marked as read.',
        markUnread: 'Notification marked as unread.'
      }
    },
    admin: {
      eyebrow: 'Admin',
      title: 'Edit cards, edit taxonomy, manage the map.',
      description: 'Focus on what needs action today: cards in motion, published records, and direct operational links.',
      breadcrumb: 'Admin',
      actions: {
        review: 'Review'
      },
      alerts: {
        unassigned: '{count} cards without an assigned reviewer',
        urgent: '{count} urgent cards in the queue',
        drafts: '{count} stalled drafts'
      },
      today: {
        kicker: 'Today status',
        title: 'What needs attention now',
        empty: 'No obvious block is emerging right now.',
        check: 'Check',
        open: 'Open'
      },
      stats: {
        cards: 'Cards',
        users: 'Users',
        collections: 'Collections',
        terms: 'Terms'
      },
      pipeline: {
        inProgress: 'In progress',
        published: 'Published records'
      },
      quick: {
        kicker: 'Quick actions',
        users: 'Users',
        taxonomy: 'Taxonomy',
        cards: 'Cards',
        map: 'Map',
        export: 'Export'
      }
    },
    adminEntries: {
      eyebrow: 'Admin / Cards',
      title: 'Cards, taxonomy hooks, and map management',
      description: 'Edit cards directly, keep taxonomy readable, and coordinate map-facing metadata without a separate media area.',
      breadcrumb: 'Admin / Cards',
      hero: {
        kicker: 'Live catalog',
        title: 'Cards, media links, and map context now live in one working surface.',
        body: 'This view keeps title, territory, status, contributor, and editing context together so you can intervene without hopping across admin silos.'
      },
      stats: {
        visible: 'Visible cards',
        drafts: 'Drafts',
        inProgress: 'In progress'
      },
      scope: {
        kicker: 'Edit scope',
        title: 'What belongs here now',
        direct: {
          title: 'Edit cards directly',
          body: 'Titles, abstracts, taxonomy coverage, and editorial readiness should stay visible together.'
        },
        media: {
          title: 'Media belongs inside card editing',
          body: 'Images and video references should be refined in relation to the card they support, not in a detached media silo.'
        }
      },
      table: {
        caption: 'Cards catalog',
        empty: 'No cards available.',
        card: 'Card',
        status: 'Status',
        country: 'Country',
        contributor: 'Contributor',
        updated: 'Updated'
      }
    },
    adminTaxonomies: {
      eyebrow: 'Admin / Taxonomies',
      title: 'Conceptual structure of the catalog',
      description: 'Control groups, terminology, and language coherence behind filters, map, and card reading.',
      breadcrumb: 'Admin / Taxonomies',
      hero: {
        kicker: 'Editorial structure',
        title: 'If taxonomies are not clean, the entire catalog loses readability.',
        body: 'Keep groups and terms aligned so the catalog language stays clear as it grows.'
      },
      stats: {
        groups: 'Groups',
        terms: 'Terms'
      },
      watch: {
        kicker: 'To keep in view',
        title: 'Quality before quantity',
        item1: {
          title: 'Each group must stay readable for people who filter',
          body: 'If terms become too similar or too technical, the public search weakens immediately.'
        },
        item2: {
          title: 'Translations should serve clarity, not filler',
          body: 'Better a few strong, coherent labels than many uncontrolled variants.'
        }
      },
      table: {
        caption: 'Taxonomy groups',
        empty: 'No taxonomies available.',
        group: 'Group',
        slug: 'Slug',
        terms: 'Terms',
        translations: 'Translations'
      }
    },
    adminUsers: {
      eyebrow: 'Admin / Users',
      title: 'People working on the project',
      description: 'Roles, emails, and entry dates for everyone with access to ANTICORES.',
      breadcrumb: 'Admin / Users',
      hero: {
        kicker: 'People',
        title: 'The catalog stays readable only if roles and access stay clear.',
        body: 'This view keeps people, roles, and entry dates together so you see who can contribute and who can keep the project in order.'
      },
      stats: {
        people: 'People',
        editors: 'Editorial roles'
      },
      watch: {
        kicker: 'To watch',
        title: 'What must stay clean',
        item1: {
          title: 'Roles must stay readable at a glance',
          body: 'If readers and publishers blur together, the queue maintenance weakens fast.'
        },
        item2: {
          title: 'The user list is also project memory',
          body: 'Entry dates help reconstruct how the team expanded over time.'
        }
      },
      table: {
        caption: 'Project users',
        empty: 'No users available.',
        name: 'Name',
        email: 'Email',
        role: 'Role',
        created: 'Created'
      }
    },
    adminAnalytics: {
      eyebrow: 'Admin / Trends',
      title: 'Useful numbers, not noise.',
      description: 'See how many cards arrived, how many are online, and where work tends to accumulate.',
      breadcrumb: 'Admin / Trends',
      hero: {
        kicker: 'Overview',
        title: 'Knowing where work builds matters more than collecting KPIs.',
        body: 'This view reads the weight of the catalog, how many cards reach the public, and where geographic coverage thickens or thins.'
      },
      stats: {
        total: 'Total cards',
        published: 'Published',
        activeUsers: 'Active people',
        countries: 'Countries covered'
      },
      quick: {
        kicker: 'Quick read',
        title: 'The numbers that matter today',
        publishRate: 'Published rate',
        busiest: 'Busiest status',
        none: 'None',
        item1: {
          title: 'Publishing is the real bottleneck',
          body: 'Use this ratio to see if review turns into published cards or stalls in the queue.'
        },
        item2: {
          title: 'Coverage shows where we are looking',
          body: 'If the corpus clusters in the same countries, rebalance collection and curation.'
        }
      },
      statuses: {
        kicker: 'Catalog states',
        title: 'Where the card journey stops'
      },
      coverage: {
        kicker: 'Geographic coverage',
        title: 'Where the catalog is most present now',
        empty: 'No countries have been recorded yet.',
        label: 'Cards in the catalog'
      }
    },
    adminExport: {
      eyebrow: 'Admin / Import-Export',
      title: 'Export data only when it truly helps.',
      description: 'Use these outputs for checks, backups, and operational handoffs.',
      breadcrumb: 'Admin / Import-Export',
      hero: {
        kicker: 'Useful outputs',
        title: 'Export only what helps control, transfer, or secure the catalog.',
        body: 'This page avoids format sprawl. Use it when you need QA, a clean handoff, or a reliable snapshot.'
      },
      stats: {
        records: 'Exportable records',
        terms: 'Exportable terms'
      },
      syncCoverage: {
        title: 'Sync coverage',
        rowsWithoutMedia: 'Rows without media',
        orphanAssets: 'Orphan assets',
        canonicalCollisions: 'Canonical collisions',
        matchedAssets: 'Matched assets',
        coreMetadata: 'Core metadata completeness',
        completeRows: 'Rows complete on A/B/E/H',
        incompleteRows: 'Incomplete rows',
        editorialFallback: 'Workbook completeness',
        renderableRows: 'Rows complete on workbook fields',
        missingFallback: 'Incomplete workbook rows',
        coverage: 'Coverage',
        allFallback: 'All workbook rows are complete enough for public rendering.'
      },
      when: {
        kicker: 'When to use them',
        title: 'Not every export is needed every day',
        item1: {
          title: 'JSON for backup and transfer',
          body: 'Use it when you need a structured copy of the catalog or a handoff across tools.'
        },
        item2: {
          title: 'CSV for editorial checks',
          body: 'Use it when you want the catalog as a table to filter or work outside the portal.'
        }
      },
      panel: {
        jsonTag: 'Structured backup',
        jsonTitle: 'Export catalog in JSON',
        jsonBody: 'Download the structured archive for backup, analysis, or transfer.',
        csvTag: 'Tabular check',
        csvTitle: 'Export catalog in CSV',
        csvBody: 'Tabular version for QA, spreadsheets, and editorial checks.',
        taxonomyTag: 'Vocabulary',
        taxonomyTitle: 'Export taxonomies',
        taxonomyBody: 'Download taxonomy groups and terms as structured JSON for review and sync.'
      }
    },
    adminSettings: {
      eyebrow: 'Admin / Settings',
      title: 'Essential instance info.',
      description: 'Check active mode, application URL, and pre-release reminders.',
      breadcrumb: 'Admin / Settings',
      status: {
        unconfigured: 'not configured',
        error: 'env configuration error'
      },
      hero: {
        kicker: 'Current instance',
        title: 'Few details, but the ones that prevent mistakes before release.',
        body: 'This view is not for minute-by-minute debugging. It is for confirming env, URL, and prerequisites before exposing the instance.'
      },
      stats: {
        mode: 'Mode',
        url: 'URL'
      },
      checks: {
        kicker: 'Reminders',
        title: 'What to verify before going live',
        item1: {
          title: 'Real credentials and secrets',
          body: 'This instance needs real credentials, configured database, and valid auth secrets.'
        },
        item2: {
          title: 'Migrations and storage',
          body: 'Before release, verify migrations, controlled seed, media storage, and end-to-end smoke tests.'
        }
      }
    },
    adminAudit: {
      eyebrow: 'Admin / Audit',
      title: 'Action history',
      description: 'Track the steps that changed cards, roles, and admin data so you can reconstruct what happened.',
      breadcrumb: 'Admin / Audit',
      hero: {
        kicker: 'System memory',
        title: 'Every important step should leave a readable trace.',
        body: 'This timeline shows who changed what, when, and with minimal detail. It is a verification tool, not passive storage.'
      },
      stats: {
        events: 'Events shown',
        latest: 'Latest activity',
        none: 'None'
      },
      recent: {
        kicker: 'Read first',
        title: 'Latest movements',
        empty: 'No actions recorded.'
      },
      table: {
        caption: 'Action history',
        empty: 'No actions recorded.',
        action: 'Action',
        actor: 'Actor',
        details: 'Details',
        when: 'When'
      },
      payload: {
        none: 'No additional details.'
      }
    },
    adminMedia: {
      hero: {
        kicker: 'New asset',
        title: 'Link an image or file to an existing card.',
        body: 'Fill in the core fields and use alt text so the media stays readable outside the visual preview.'
      },
      form: {
        validation: 'You need at least one linked card and a valid URL.',
        creating: 'Adding media...',
        error: 'Unable to add this media.',
        created: 'Media added.',
        entry: 'Linked card',
        entryPlaceholder: 'Select a card',
        kind: 'Media type',
        kindPlaceholder: 'image, video, audio…',
        url: 'Asset URL',
        urlPlaceholder: 'https://…',
        alt: 'Alternative text',
        altPlaceholder: 'Describe what is seen or heard',
        submit: 'Add asset'
      },
      checks: {
        kicker: 'Quick check',
        title: 'What to fix first',
        visible: 'Visible assets',
        missingAlt: 'Missing alt text',
        item1: {
          title: 'Start from assets without descriptions',
          body: 'Those are the fastest way to lower readability and accessibility.'
        },
        item2: {
          title: 'Keep media type clean',
          body: 'Use short, consistent labels so the list stays legible as it grows.'
        }
      },
      card: {
        missingAlt: 'Alt text missing',
        entryId: 'Linked card: {id}',
        noDescription: 'No description available.'
      }
    },
    entryActions: {
      kicker: 'Quick actions',
      addFavorite: 'Add to favorites',
      removeFavorite: 'Remove favorite',
      sendToReview: 'Send to review',
      submitting: 'Submitting...',
      submitted: 'Entry sent to review.',
      error: 'Error while submitting.'
    },
    taxonomyExplorer: {
      kicker: 'Esploratore tassonomico',
      title: 'Groups and conceptual families',
      placeholder: 'Search group or term...',
      selected: 'Selected group',
      openPage: 'Open dedicated page',
      empty: 'No group matches this search.'
    },
    collectionsPage: {
      eyebrow: 'Curation',
      title: 'Reading paths that put cards into relation.',
      description:
        'Collections place materials side by side by theme, place, or critical angle. They are not abstract categories: they are composed itineraries.',
      actions: {
        archive: 'Open the archive',
        map: 'Go to the map'
      },
      empty: 'No paths are available yet.',
      cardKicker: 'Path',
      detail: {
        back: 'Back to collections',
        openMap: 'Open filtered map',
        path: 'Path',
        connected: 'Connected cards',
        chainTitle: 'A visible chain between cards',
        cardsCount: '{count} cards'
      }
    },
    mapPage: {
      title: 'Start from territory, then let taxonomies narrow the field.',
      description: 'Each point opens a card preview, each filter clarifies a family of aesthetics, and each selection becomes a path into the archive.',
      collectionTitle: '{title} · map view',
      collectionDescription: 'This map is already filtered to the cards included in the selected collection.',
      empty: 'The map does not have any cards to display yet.'
    },
    mapExplorer: {
      errors: {
        load: 'The cartographic library could not be loaded. Check browser blocking or content security settings.'
      },
      fallback: {
        place: 'Place being defined',
        period: 'Timeframe being defined'
      },
      hero: {
        kicker: 'Map view',
        title: 'Start from a place, then filter the field through taxonomy.',
        body: 'The map opens cards through content type, theme, format, know-how, country, and year. Select a point, read the preview, then jump into the full card.'
      },
      stats: {
        visible: 'Visible cards',
        featured: 'Featured',
        year: 'Year'
      },
      filters: {
        searchPlaceholder: 'Title, place, theme…',
        searchAria: 'Search map cards',
        countryAria: 'Filter by country',
        typeAria: 'Filter by content type',
        themeAria: 'Filter by theme',
        formatAria: 'Filter by format',
        knowHowAria: 'Filter by know-how',
        allYears: 'All years',
        allCountries: 'All countries',
        allTypes: 'All types',
        allThemes: 'All themes',
        allFormats: 'All formats',
        allKnowHow: 'All know-how',
        queryChip: 'Query · remove',
        remove: 'remove',
        none: 'No active filters'
      },
      year: {
        kicker: 'Year',
        body: 'Move through time without leaving the map.',
        reset: 'Reset year'
      },
      preview: {
        kicker: 'Selected card',
        title: 'Preview panel',
        results: '{count} results',
        featured: 'Featured',
        place: 'Place',
        period: 'Period',
        open: 'Open card',
        moreCountry: 'More from this country',
        empty: 'Select a point on the map to read the preview.'
      },
      list: {
        kicker: 'Visible cards',
        title: 'Open a card directly',
        reset: 'Reset',
        empty: 'No cards match the active filters.'
      }
    },
    adminCollections: {
      eyebrow: 'Curatorial stack',
      title: 'Collections management',
      description: 'Monitor curated paths, section density, and coverage of aggregated cards.',
      breadcrumb: 'Admin / Collections',
      table: {
        caption: 'Curated collections',
        empty: 'No collections available.',
        collection: 'Collection',
        summary: 'Summary',
        entries: 'Entries',
        sections: 'Sections'
      }
    },
    terms: {
      eyebrow: 'Editorial framework',
      title: 'Terms of use',
      description: 'Reuse of the corpus and contributions must preserve context, source integrity, and the editorial mandate.',
      items: {
        contributions: {
          title: 'Contributions',
          body: 'Submitted content must respect research goals, source accuracy, copyright, and contextual integrity.'
        },
        moderation: {
          title: 'Moderation',
          body: 'The editorial team may request revisions, reject, or archive materials not aligned with the project mandate.'
        },
        reuse: {
          title: 'Reuse',
          body: 'Use of public data and editorial materials must credit ANTICORES and preserve the context.'
        }
      }
    },
    accessibility: {
      eyebrow: 'Accessibility',
      title: 'Accessibility',
      description: 'ANTICORES treats readability and accessibility as structural, not as afterthoughts.',
      items: {
        baseline: {
          title: 'Active baseline',
          body: 'Responsive interfaces, keyboard navigation, semantic structure, and readable contrast are part of the baseline.'
        },
        inProgress: {
          title: 'Work in progress',
          body: 'We are strengthening WCAG checks for maps, complex forms, focus states, and dense information pages.'
        }
      }
    },
    contact: {
      eyebrow: 'Contact us',
      title: 'Contact us',
      description: 'For editorial questions, collaborations, or data access write to atlas@incursivefashionheritage.com.',
      info: {
        email: 'Editorial email',
        topics: 'Topics',
        topicsBody: 'Curation, review, data, research, and cultural partnerships.',
        response: 'Response time',
        responseBody: 'Usually within 3–5 working days.',
        quick: 'Quick send',
        quickBody: 'The button opens your default email client with a pre-addressed message.'
      },
      form: {
        name: 'Name',
        namePlaceholder: 'Full name…',
        email: 'Email',
        emailPlaceholder: 'name@domain.com…',
        subject: 'Subject',
        subjectPlaceholder: 'What would you like to talk about?',
        message: 'Message',
        messagePlaceholder: 'Write your message here…',
        send: 'Send'
      }
    },
    auth: {
      login: {
        kicker: 'Authentication',
        title: 'Enter ANTICORES.',
        lead: 'This is where contributors, editors, and admins return to the cards they are actually working on.',
        notice: 'Access is personal, and permissions are enforced according to the role assigned to the account.',
        error: 'Invalid credentials. Please try again.',
        form: {
          kicker: 'Sign in',
          title: 'Welcome back',
          email: 'Email',
          emailPlaceholder: 'name@domain.com…',
          password: 'Password',
          passwordPlaceholder: 'Enter your password…',
          submit: 'Sign in',
          loading: 'Signing in…',
          forgot: 'Forgot password?',
          noAccount: 'No account yet?',
          register: 'Register'
        }
      },
      register: {
        kicker: 'Registration',
        title: 'Open your access.',
        lead: 'You start as a contributor. Editorial or admin roles are assigned later if needed.',
        error: 'Registration failed.',
        network: 'Network error. Please try again.',
        form: {
          displayName: 'Display name',
          email: 'Email',
          password: 'Password',
          submit: 'Create account',
          loading: 'Creating…',
          hasAccount: 'Already have an account?',
          signIn: 'Sign in'
        }
      },
      verify: {
        eyebrow: 'Activation',
        title: 'Verify your email',
        description: 'Check your inbox and confirm the link to activate your profile.'
      },
      forgot: {
        eyebrow: 'Account recovery',
        title: 'Password recovery',
        description: 'Enter the email associated with your profile to receive a reset link.',
        emailPlaceholder: 'Account email',
        submit: 'Send reset link'
      },
      reset: {
        eyebrow: 'Password reset',
        title: 'Set a new password',
        description: 'Choose a new password to re-enter your account.',
        newPassword: 'New password',
        confirmPassword: 'Confirm password',
        submit: 'Update password'
      }
    },
    submitNew: {
      eyebrow: 'New card',
      title: 'Focus the material before submitting.',
      description: 'Turn notes, sources, and signals into a readable card. A few steps, done well: title, context, keywords, and a clear summary.',
      breadcrumb: 'Contributor / New card',
      actions: {
        back: 'Back to your cards',
        archive: 'Open the archive'
      }
    },
    submitForm: {
      steps: {
        0: { label: 'Define the card', description: 'Title, slug, short summary, and main text.' },
        1: { label: 'Place and time', description: 'Country, place, language, and period.' },
        2: { label: 'Add media', description: 'Collect visuals that help read the card.' },
        3: { label: 'Choose taxonomy', description: 'Terms that help find and compare the card.' },
        4: { label: 'Review and save', description: 'Check key points and save the draft.' }
      },
      stepLabel: 'Step {step}',
      stepReady: 'Ready',
      stepTodo: 'To do',
      errors: {
        slug: 'Add a readable, stable slug.',
        title: 'Add a clear editorial title.',
        abstract: 'A short abstract is required.',
        description: 'A longer critical description is required.',
        country: 'Select at least one country.',
        period: 'Define a period or time window.',
        taxonomy: 'Select at least one taxonomy term.',
        source: 'Explain where the material emerges from.',
        summary: 'Close with a short summary for review.',
        createDraft: 'Unable to create the draft.',
        updateDraft: 'Unable to update the draft.',
        openDraft: 'Unable to open the draft.'
      },
      status: {
        resumedServer: 'Server draft resumed from {date}.',
        resumedLocal: 'Local draft resumed from {date}.',
        autosaveFailed: 'Autosave failed: {reason}.',
        retry: 'please try again soon',
        savedServer: 'Draft saved to your profile. You can continue now or resume later.',
        missingBeforeSave: 'Fill the missing fields before saving.',
        savingDraft: 'Saving the draft...',
        updatingServer: 'Updating the draft in your profile...',
        openingServer: 'Opening a draft in your profile...',
        openedServer: 'Draft opened in your profile. You can resume it anytime.',
        openedServerContinue: 'Draft opened in your profile. You can continue without losing work.',
        completeRequired: 'Complete the required fields before moving to the next step.',
        error: 'Error: {reason}',
        saveFailed: 'save failed',
        localRemovedServer: 'Local copy removed. The profile draft is still available.',
        localCleared: 'Local draft cleared. You can start from scratch.',
        updatedServerTime: 'Profile draft updated at {time}.',
        updatedLocalTime: 'Local draft auto-updated at {time}.'
      },
      fields: {
        slug: { label: 'Slug', hint: 'Short, clear, easy to find.' },
        title: { label: 'Editorial title', hint: 'Clear and concrete. Avoid abstract formulas.' },
        abstract: { label: 'Abstract', hint: 'Three or four sentences that say what it is and why it matters.' },
        description: {
          label: 'Main text',
          hint: 'Expand the context: practices, images, references, tensions, cultural relevance.'
        },
        language: { label: 'Canonical language' },
        country: { label: 'Country', placeholder: 'Select…' },
        place: { label: 'Place or node', hint: 'City, neighborhood, local scene, or a recognizable node.' },
        period: {
          label: 'Period',
          hint: 'Write it as you would in a public card.',
          placeholder: 'e.g. 2019–2024'
        },
        keywords: {
          label: 'Keywords',
          placeholder: 'digital craft, visual memory',
          hint: 'Separate with commas.'
        },
        source: {
          label: 'Where this material emerges from',
          placeholder: 'Platform, community, project, campaign...'
        },
        summary: {
          label: 'In two or three lines',
          hint: 'Write what someone should understand immediately when opening the card.'
        }
      },
      media: {
        lead: 'Add images or video that help read this aesthetic. Files stay queued while you complete the card.',
        label: 'Upload images and video',
        hint: 'You can select multiple files and refine them later during card editing.',
        queue: 'Media queue',
        empty: 'No files selected.'
      },
      taxonomy: {
        lead: 'Choose only terms that truly help read this card. Better a few strong words than a generic list.'
      },
      summary: {
        kicker: 'Final summary',
        title: 'Title',
        territory: 'Territory',
        period: 'Period',
        taxonomy: 'Selected taxonomies',
        media: 'Queued media',
        unknownCountry: 'Undefined',
        missingTitle: 'Not defined yet',
        unknownPlace: 'Unspecified node',
        unknownPeriod: 'Not defined'
      },
      actions: {
        back: 'Back',
        saveLater: 'Save and continue later',
        openServer: 'Open draft in profile',
        next: 'Continue',
        save: 'Save draft',
        saving: 'Saving...'
      },
      progress: '{completed}/{total} steps completed',
      aside: {
        kicker: 'Draft in progress',
        title: 'Always-visible summary',
        titleLabel: 'Title',
        missingTitle: 'Not written yet',
        slugLabel: 'Slug',
        missingSlug: 'Not defined',
        territoryLabel: 'Territory',
        periodLabel: 'Period',
        missingPeriod: 'Not defined',
        taxonomyLabel: 'Taxonomies',
        taxonomyCount: '{count} terms selected',
        mediaLabel: 'Media',
        mediaCount: '{count} files ready',
        mediaEmpty: 'No files added yet',
        keywordsLabel: 'Keywords',
        keywordsEmpty: 'No keywords yet.',
        draftStatus: 'Draft status',
        serverStatus: 'Draft opened in your profile. Last update: {date}.',
        localStatus: 'Local draft auto-updated: {date}. Open a profile draft to retrieve it elsewhere.',
        localOnly: 'You are writing locally. You can open a profile draft and resume later.',
        clearLocal: 'Clear local draft'
      }
    },
    entry: {
      eyebrow: 'Card',
      breadcrumb: 'Explore / Archive',
      actions: {
        map: 'View on map',
        archive: 'Back to archive'
      },
      meta: {
        author: 'Author',
        country: 'Country',
        timeframe: 'Timeframe',
        timeframeFallback: 'Timeframe being defined',
        place: 'Place',
        placeFallback: 'Place being defined',
        source: 'Source context',
        sourceFallback: 'Source context being defined',
        metadata: 'Metadata',
        taxonomyCount: '{count} taxonomy terms'
      },
      descriptionKicker: 'Description',
      taxonomyKicker: 'Taxonomy metadata',
      taxonomyTitle: 'Signals attached to this card'
    },
    privacy: {
      eyebrow: 'Data care',
      title: 'Privacy',
      description:
        'ANTICORES processes only what is needed for authentication, editorial review, platform security, and publishing the corpus.',
      items: {
        collected: {
          title: 'Data collected',
          body: 'We handle the minimum data needed for contributions, editorial review, authentication, and platform safety.'
        },
        public: {
          title: 'Public data',
          body: 'Public datasets avoid sensitive user data and focus on editorial content and cultural metadata.'
        },
        requests: {
          title: 'Rights & requests',
          body: 'For GDPR requests or clarifications, contact atlas@incursivefashionheritage.com.'
        }
      }
    }
  },
  it: {
    brand: {
      name: 'ANTICORES',
      subtitle: 'Una cartografia delle estetiche digitali della moda.',
      baseline: 'Mappare le mode che non sono arrivate nel tuo feed.'
    },
    common: {
      skipToContent: 'Vai al contenuto',
      open: 'Apri',
      close: 'Chiudi',
      reset: 'Reset',
      apply: 'Applica',
      remove: 'Rimuovi',
      available: 'Disponibile',
      account: 'Account',
      signIn: 'Accedi',
      signOut: 'Esci',
      newCard: 'Nuova Scheda',
      allCountries: 'Tutti i paesi',
      allYears: 'Tutti gli anni',
      noFilters: 'Nessun filtro',
      untitled: 'Senza titolo',
      countryUndefined: 'Luogo in definizione',
      periodUndefined: 'Periodo in definizione',
      provenance: 'Provenienza',
      editorialFallback: 'Nota foglio',
      sheet: 'Foglio',
      row: 'Riga',
      canonicalKey: 'Chiave canonica',
      mediaMatch: 'Corrispondenza media',
      mediaAssets: '{count} media',
      more: 'Altro',
      sourceNetwork: 'Rete di origine',
      sourceLinks: 'Link sorgente',
      bibliography: 'Bibliografia',
      media: 'Media',
      workbookRowCaption: 'Riga del workbook',
      matchedViaCanonical: 'Corrisposto tramite chiave canonica',
      matchedViaLegacy: 'Corrisposto tramite chiave legacy',
      matchedViaAlias: 'Corrisposto tramite alias',
      matchedBy: 'Corrisposto da {value}',
      matched: 'Corrispondente',
      partial: 'Parziale',
      missing: 'Mancante',
      orphan: 'Orfano',
      active: 'Attivo',
      inactive: 'Non attivo',
      unavailable: 'Non disponibile'
    },
    nav: {
      explore: 'Esplora',
      project: 'Progetto',
      workspace: 'Area',
      menu: 'Menu',
      closeMenu: 'Chiudi menu',
      openMenu: 'Apri menu',
      map: 'Mappa',
      archive: 'Archivio',
      collections: 'Collezioni',
      projectPage: 'Progetto',
      taxonomies: 'Tassonomie',
      contact: 'Contattaci',
      review: 'Revisione',
      admin: 'Amministrazione',
      account: 'Account'
    },
    footer: {
      line1: 'ANTICORES · Una cartografia delle estetiche digitali della moda.',
      line2: 'Mappare le mode che non sono arrivate nel tuo feed.'
    },
    language: {
      label: 'Lingua',
      en: 'English',
      it: 'Italiano',
      fr: 'Français'
    },
    home: {
      chip: 'Moda digitale, estetiche, luoghi e tracce',
      title: 'Una cartografia delle estetiche digitali della moda che circolano fuori dal feed piu ovvio.',
      lead: 'Parti da un luogo, segui una costellazione di immagini e pratiche, poi apri la scheda per saperne di più su una determinata estetica.',
      statsPublished: 'Schede pubblicate',
      statsPeople: 'Persone coinvolte',
      statsCollections: 'Collezioni',
      entryLabel: 'Da dove iniziare',
      mapTitle: 'Mappa',
      mapDescription: 'Per partire dai luoghi e vedere come testi, immagini e temi si addensano nello spazio.',
      archiveTitle: 'Archivio',
      archiveDescription: 'Per scorrere le schede una accanto all altra e confrontare territori, tempi e parole chiave.',
      collectionsTitle: 'Collezioni',
      collectionsDescription: 'Per seguire percorsi gia composti: una pista di lettura, non un elenco neutro.',
      whyKicker: 'Perché ANTICORES',
      whyTitle: 'Alcune estetiche non diventano immagine dominante. Restano comunque tracce forti.',
      whyBody: 'ANTICORES raccoglie i segnali che restano ai margini del riflettore delle piattaforme: scene locali, immagini ricorrenti, know-how pratici e microstorie della moda digitale.',
      sectionLabel: 'Schede in evidenza',
      sectionTitle: 'Qualche ingresso nel catalogo',
      openArchive: 'Apri tutto l archivio',
      featured: 'In evidenza',
      defaultPlace: 'Nodo editoriale',
      defaultPeriod: 'Periodo in definizione'
    },
    archive: {
      eyebrow: 'Archivio',
      title: 'Scorri le schede, confronta i contesti e cerca dentro l archivio.',
      description: 'Archivio e ricerca ora stanno insieme: parti da una parola, restringi per tassonomia, poi confronta luoghi, tempi, formati e know-how in un solo flusso.',
      searchPlaceholder: 'Parola chiave, luogo, formato, know-how…',
      filtersTaxonomy: 'Tassonomia',
      filtersCountry: 'Paese',
      filtersYear: 'Anno',
      filtersKeywords: 'Parole chiave',
      apply: 'Applica filtri',
      reset: 'Reset',
      resultCount: '{count} risultati',
      grid: 'Griglia',
      list: 'Lista',
      queryFilter: 'Query: {value}',
      countryFilter: 'Paese: {value}',
      yearFilter: 'Anno: {value}',
      taxonomyFilter: 'Tassonomia: {value}',
      keywordFilter: 'Parola chiave: {value}',
      empty: 'Nessuna scheda corrisponde a questa combinazione. Allarga il campo o rimuovi un filtro.',
      featured: 'In evidenza'
    },
    about: {
      eyebrow: 'Perché esiste',
      title: 'ANTICORES esiste per rendere leggibili le estetiche digitali della moda oltre il ricambio veloce del feed.',
      description:
        'Il progetto raccoglie schede, immagini, parole chiave e tassonomie per leggere culture visive disperse come formazioni connesse e non come post isolati.',
      body1:
        'Le estetiche digitali della moda circolano spesso in frammenti: un look che ritorna in piccole scene, un gesto pratico, un formato video, un lessico locale, una tonalita condivisa. ANTICORES tiene insieme quei frammenti abbastanza a lungo da renderli leggibili.',
      body2:
        'La piattaforma non e un contenitore neutro. Ogni scheda e composta in modo che luogo, periodo, formato, materiali e nuclei tematici possano essere confrontati con altri. L obiettivo e aiutare chi legge, chi contribuisce e chi cura a seguire relazioni, non impressioni isolate.',
      body3:
        'Per questo qui le tassonomie contano: non come etichette di backend, ma come linguaggio condiviso per filtrare, confrontare e costruire percorsi dentro estetiche che raramente ricevono una memoria pubblica stabile.'
    },
    taxonomy: {
      eyebrow: 'Tassonomie',
      title: 'Il vocabolario che rende l archivio filtrabile e confrontabile.',
      description:
        'I termini sono raggruppati per sostenere filtri della mappa, ricerca in archivio e lettura delle schede. Fanno parte dell esperienza pubblica, non sono metadati nascosti.',
      readyTerms: '{count} termini pronti da esplorare',
      groupDescription: '{count} termini disponibili per classificazione, filtri e lettura editoriale.',
      backToTaxonomies: 'Torna alle tassonomie'
    },
    review: {
      page: {
        eyebrow: 'Revisione',
        title: 'Inbox e scheda selezionata.',
        description: 'Apri l inbox, seleziona una scheda, poi decidi senza rumore di dashboard.',
        breadcrumb: 'Revisione',
        adminAction: 'Amministrazione',
        empty: 'Non ci sono schede in coda.'
      },
      inboxKicker: 'Inbox',
      inboxTitle: 'Rivedi le schede che richiedono una decisione.',
      inboxDescription: 'Cerca nella coda e apri una scheda per assegnare, commentare o farla avanzare.',
      searchLabel: 'Cerca',
      searchPlaceholder: 'Titolo, autore, revisore…',
      searchAria: 'Cerca nella coda di revisione',
      visibleLabel: 'Schede visibili',
      empty: 'Nessuna scheda corrisponde a questa ricerca.',
      selectedKicker: 'Scheda selezionata',
      byContributor: 'Proposta da {name}',
      assignedTo: 'Assegnata a {name}',
      unassigned: 'Non assegnata',
      lastMove: 'Ultimo movimento',
      notes: 'Note',
      reviewerLabel: 'Revisore',
      openCard: 'Apri scheda',
      recentNotes: 'Note recenti',
      notesCount: '{count} note',
      noNotes: 'Ancora nessuna nota.',
      nextStep: 'Prossimo passo',
      nextStepPlaceholder: 'Scrivi il prossimo passo: verificare, chiedere modifiche, approvare…',
      saving: 'Salvataggio…',
      saveAssign: 'Salva nota e assegnazione',
      emptySelection: 'Seleziona una scheda dalla lista per leggerla meglio e decidere il prossimo passo.',
      actions: {
        start: 'Avvia revisione',
        changes: 'Richiedi modifiche',
        approve: 'Approva',
        publish: 'Pubblica',
        reject: 'Rifiuta'
      },
      errors: {
        assign: 'Non riesco ad aggiornare la presa in carico.',
        action: 'Non riesco a completare questa azione.',
        network: 'Errore di rete durante il salvataggio.'
      },
      messages: {
        assign: 'Presa in carico aggiornata.',
        status: 'Stato della scheda aggiornato.'
      }
    },
    account: {
      eyebrow: 'Account',
      title: 'Le tue schede, il tuo profilo, il prossimo passo.',
      description: 'Riprendi il lavoro recente, controlla lo stato delle schede e torna alle azioni che contano.',
      breadcrumb: 'Account',
      actions: {
        newCard: 'Nuova Scheda',
        editProfile: 'Modifica profilo'
      },
      profile: {
        kicker: 'Profilo operativo',
        email: 'Email',
        role: 'Ruolo',
        cardsOpened: 'Schede aperte finora',
        missing: 'N/D'
      },
      nextAction: {
        kicker: 'Prossimo passo',
        contributor: 'Riprendi una bozza o avvia una nuova scheda.',
        other: 'Controlla le schede recenti e torna dove serve un intervento.'
      },
      quick: {
        kicker: 'Vista rapida',
        title: 'Dove sei ora',
        cardsOpened: 'Schede aperte',
        role: 'Ruolo attuale',
        latestStatus: 'Stato piu recente',
        noActivity: 'Nessuna attivita recente'
      },
      links: {
        profile: {
          title: 'Profilo',
          description: 'Aggiorna display name, bio e dettagli account.'
        },
        saved: {
          title: 'Ricerche salvate',
          description: 'Riapri i percorsi senza ripartire da zero.'
        },
        notifications: {
          title: 'Notifiche',
          description: 'Segui cambi di stato, messaggi e richieste sulle tue schede.'
        }
      },
      recent: {
        kicker: 'Attivita recente',
        title: 'Le tue schede',
        empty: 'Non ci sono ancora attivita registrate per questo account.'
      }
    },
    accountSubmissions: {
      eyebrow: 'Account / Schede',
      title: 'Storico delle tue schede',
      description: 'Una vista ordinata delle schede che hai aperto, utile per riprendere bozze e seguire i progressi.',
      breadcrumb: 'Account / Schede',
      resume: 'Riprendi la scheda',
      empty: 'Non hai ancora aperto nessuna scheda.'
    },
    submitDashboard: {
      eyebrow: 'Le tue schede',
      title: 'Bozze da riprendere, invii da seguire, correzioni da chiudere.',
      description:
        'Qui ritrovi tutto quello che hai aperto: cio che e ancora in scrittura, cio che aspetta una lettura e cio che e tornato indietro con richieste di modifica.',
      breadcrumb: 'Contributore',
      actions: {
        new: 'Nuova scheda',
        history: 'Storico invii'
      },
      stats: {
        drafts: 'Bozze aperte',
        submitted: 'In attesa di lettura',
        changes: 'Modifiche richieste'
      },
      updated: 'Aggiornata',
      resume: 'Riprendi la scheda',
      empty: 'Non hai ancora aperto nessuna scheda.'
    },
    accountProfile: {
      eyebrow: 'Account / Profilo',
      title: 'Come compari nel progetto',
      description:
        'Aggiorna nome, bio e dettagli di base per rendere chiaro come appari nelle schede, nelle note e negli spazi di lavoro.',
      breadcrumb: 'Account / Profilo',
      displayName: 'Nome visualizzato',
      email: 'Email',
      role: 'Ruolo',
      status: 'Stato account',
      active: 'Attivo',
      missing: 'N/D',
      form: {
        displayName: 'Nome visualizzato',
        email: 'Email',
        save: 'Salva modifiche',
        saving: 'Salvataggio in corso…',
        saved: 'Profilo aggiornato.',
        error: 'Errore aggiornamento profilo.'
      }
    },
    accountSaved: {
      eyebrow: 'Account / Ricerche salvate',
      title: 'Ricerche da ritrovare in un attimo.',
      description: 'Conserva le query che usi spesso e rilanciale quando vuoi tornare su un tema, un luogo o una pista.',
      breadcrumb: 'Account / Ricerche salvate',
      defaultSummary: 'Query salvata pronta da rilanciare.',
      form: {
        kicker: 'Nuova ricerca',
        title: 'Salva un percorso da riaprire piu avanti.',
        label: 'Etichetta',
        labelPlaceholder: 'Per esempio: Paesi in review',
        note: 'Nota rapida',
        notePlaceholder: 'Perche questa ricerca e utile?',
        save: 'Salva ricerca',
        remove: 'Rimuovi',
        labelRequired: 'Aggiungi un etichetta prima di salvare.',
        saved: 'Ricerca salvata.',
        removed: 'Ricerca rimossa.',
        saveError: 'Non riesco a salvare questa ricerca.'
      },
      memory: {
        kicker: 'Memoria di lavoro',
        title: 'Tieni solo le ricerche che ti aiutano a tornare all archivio.',
        count: 'Ricerche salvate'
      }
    },
    accountFavorites: {
      eyebrow: 'Account / Preferiti',
      title: 'Le schede che vuoi tenere a portata di mano.',
      description: 'Raccogli qui le schede che vuoi riaprire durante lettura, ricerca o revisione.',
      breadcrumb: 'Account / Preferiti',
      list: {
        kicker: 'Riapertura rapida',
        title: 'Le schede che tieni vicine mentre leggi o lavori.',
        count: 'Preferiti salvati',
        remove: 'Rimuovi dai preferiti',
        removed: 'Preferito rimosso.',
        empty: 'Nessun preferito salvato.'
      }
    },
    accountNotifications: {
      eyebrow: 'Account / Notifiche',
      title: 'Le novita che ti riguardano.',
      description: 'Qui arrivano cambi di stato, note e segnali utili per non perdere il filo del lavoro.',
      breadcrumb: 'Account / Notifiche',
      empty: 'Nessuna notifica.',
      list: {
        kicker: 'Segnali recenti',
        title: 'Quello che merita attenzione adesso.',
        new: 'Nuove',
        total: 'Totali',
        read: 'Letta',
        unread: 'Nuova',
        setRead: 'Segna letta',
        setUnread: 'Segna non letta',
        markRead: 'Notifica segnata come letta.',
        markUnread: 'Notifica segnata come non letta.'
      }
    },
    admin: {
      eyebrow: 'Amministrazione',
      title: 'Modifica schede, tassonomie, gestione mappa.',
      description: 'Qui restano solo le azioni di oggi: schede in movimento, record pubblicati e link operativi.',
      breadcrumb: 'Amministrazione',
      actions: {
        review: 'Revisione'
      },
      alerts: {
        unassigned: '{count} schede senza revisore assegnato',
        urgent: '{count} schede urgenti in coda',
        drafts: '{count} bozze ferme'
      },
      today: {
        kicker: 'Stato del giorno',
        title: 'Cosa richiede attenzione adesso',
        empty: 'Nessun blocco evidente al momento.',
        check: 'Check',
        open: 'Apri'
      },
      stats: {
        cards: 'Schede',
        users: 'Utenti',
        collections: 'Collezioni',
        terms: 'Termini'
      },
      pipeline: {
        inProgress: 'In lavorazione',
        published: 'Record pubblicati'
      },
      quick: {
        kicker: 'Azioni rapide',
        users: 'Utenti',
        taxonomy: 'Tassonomie',
        cards: 'Schede',
        map: 'Mappa',
        export: 'Export'
      }
    },
    adminEntries: {
      eyebrow: 'Admin / Schede',
      title: 'Schede, tassonomie e gestione mappa',
      description: 'Modifica le schede direttamente, tieni leggibile la tassonomia e coordina i metadati della mappa senza area media separata.',
      breadcrumb: 'Admin / Schede',
      hero: {
        kicker: 'Catalogo vivo',
        title: 'Schede, media e contesto mappa ora vivono in un unico spazio di lavoro.',
        body: 'Questa vista tiene insieme titolo, territorio, stato, contributor e contesto di editing per intervenire senza passare tra silos admin.'
      },
      stats: {
        visible: 'Schede visibili',
        drafts: 'Bozze',
        inProgress: 'In lavorazione'
      },
      scope: {
        kicker: 'Ambito di modifica',
        title: 'Cosa appartiene qui',
        direct: {
          title: 'Modifica le schede direttamente',
          body: 'Titoli, abstract, copertura tassonomie e readiness editoriale devono restare visibili insieme.'
        },
        media: {
          title: 'I media restano dentro la scheda',
          body: 'Immagini e riferimenti video vanno rifiniti in relazione alla scheda che supportano, non in un silo separato.'
        }
      },
      table: {
        caption: 'Catalogo schede',
        empty: 'Nessuna scheda disponibile.',
        card: 'Scheda',
        status: 'Stato',
        country: 'Paese',
        contributor: 'Autore',
        updated: 'Aggiornata'
      }
    },
    adminTaxonomies: {
      eyebrow: 'Admin / Tassonomie',
      title: 'Struttura concettuale del catalogo',
      description: 'Controlla gruppi, terminologia e coerenza linguistica dei termini che reggono filtri, mappa e lettura delle schede.',
      breadcrumb: 'Admin / Tassonomie',
      hero: {
        kicker: 'Struttura editoriale',
        title: 'Se le tassonomie non restano pulite, tutto il catalogo perde leggibilita.',
        body: 'Questa pagina serve a tenere insieme gruppi e termini e verificare che la lingua del catalogo resti chiara anche quando cresce.'
      },
      stats: {
        groups: 'Gruppi',
        terms: 'Termini'
      },
      watch: {
        kicker: 'Da tenere d occhio',
        title: 'Qualita prima della quantita',
        item1: {
          title: 'Ogni gruppo deve restare leggibile da chi filtra',
          body: 'Se i termini diventano troppo simili o troppo tecnici, la ricerca pubblica si indebolisce subito.'
        },
        item2: {
          title: 'Le traduzioni servono alla chiarezza, non al riempimento',
          body: 'Meglio poche etichette forti e coerenti che molte varianti poco controllate.'
        }
      },
      table: {
        caption: 'Gruppi tassonomici',
        empty: 'Nessuna tassonomia disponibile.',
        group: 'Gruppo',
        slug: 'Slug',
        terms: 'Termini',
        translations: 'Traduzioni'
      }
    },
    adminUsers: {
      eyebrow: 'Admin / Utenti',
      title: 'Chi lavora nel progetto',
      description: 'Ruoli, email e data di ingresso delle persone che hanno accesso ad ANTICORES.',
      breadcrumb: 'Admin / Utenti',
      hero: {
        kicker: 'Persone',
        title: 'Il catalogo resta leggibile solo se ruoli e accessi restano chiari.',
        body: 'Questa vista tiene insieme persone, ruoli e data di ingresso per capire chi puo contribuire e chi puo mantenere il progetto.'
      },
      stats: {
        people: 'Persone presenti',
        editors: 'Ruoli editoriali'
      },
      watch: {
        kicker: 'Da controllare',
        title: 'Cosa tenere pulito',
        item1: {
          title: 'I ruoli devono restare leggibili a colpo d occhio',
          body: 'Se chi legge e chi pubblica si confondono, la manutenzione della coda si indebolisce.'
        },
        item2: {
          title: 'L elenco utenti e anche memoria del progetto',
          body: 'La data di ingresso aiuta a ricostruire come si e allargata la squadra.'
        }
      },
      table: {
        caption: 'Utenti del progetto',
        empty: 'Nessun utente disponibile.',
        name: 'Nome',
        email: 'Email',
        role: 'Ruolo',
        created: 'Creato'
      }
    },
    adminAnalytics: {
      eyebrow: 'Admin / Andamento',
      title: 'Numeri utili, non rumore.',
      description: 'Qui vedi quante schede sono entrate, quante sono gia online e dove il lavoro tende ad accumularsi.',
      breadcrumb: 'Admin / Andamento',
      hero: {
        kicker: 'Vista d insieme',
        title: 'Capire dove si accumula il lavoro conta piu che collezionare KPI.',
        body: 'Questa vista legge il peso del catalogo, quante schede arrivano online e dove la copertura geografica si addensa.'
      },
      stats: {
        total: 'Schede totali',
        published: 'Pubblicate',
        activeUsers: 'Persone attive',
        countries: 'Paesi presenti'
      },
      quick: {
        kicker: 'Lettura rapida',
        title: 'I numeri che contano oggi',
        publishRate: 'Quanto arriva online',
        busiest: 'Stato piu affollato',
        none: 'Nessuno',
        item1: {
          title: 'La pubblicazione e il vero imbuto',
          body: 'Usa questo rapporto per capire se la lettura produce schede pubblicabili o si ferma in coda.'
        },
        item2: {
          title: 'La copertura geografica dice dove stiamo guardando',
          body: 'Se il corpus si addensa sempre negli stessi paesi, riequilibra raccolta e curatela.'
        }
      },
      statuses: {
        kicker: 'Stati del catalogo',
        title: 'Dove si ferma il percorso delle schede'
      },
      coverage: {
        kicker: 'Copertura geografica',
        title: 'Dove il catalogo e oggi piu presente',
        empty: 'Non ci sono ancora paesi censiti.',
        label: 'Schede presenti nel catalogo'
      }
    },
    adminExport: {
      eyebrow: 'Admin / Import-Export',
      title: 'Esporta i dati quando servono davvero.',
      description: 'Qui trovi le uscite utili per controlli, copie di sicurezza e scambi di lavoro.',
      breadcrumb: 'Admin / Import-Export',
      hero: {
        kicker: 'Uscite utili',
        title: 'Esporta solo quello che aiuta a controllare, trasferire o mettere al sicuro il catalogo.',
        body: 'Questa pagina non serve ad accumulare formati. Serve a recuperare il materiale giusto per QA, passaggi e copie leggibili.'
      },
      stats: {
        records: 'Record esportabili',
        terms: 'Termini esportabili'
      },
      syncCoverage: {
        title: 'Copertura sync',
        rowsWithoutMedia: 'Righe senza media',
        orphanAssets: 'Asset orfani',
        canonicalCollisions: 'Collisioni canoniche',
        matchedAssets: 'Asset corrisposti',
        coreMetadata: 'Completezza metadata core',
        completeRows: 'Righe complete su A/B/E/H',
        incompleteRows: 'Righe incomplete',
        editorialFallback: 'Completezza workbook',
        renderableRows: 'Righe complete sui campi workbook',
        missingFallback: 'Righe workbook incomplete',
        coverage: 'Copertura',
        allFallback: 'Tutte le righe del workbook sono ora complete per il rendering pubblico.'
      },
      when: {
        kicker: 'Quando usarli',
        title: 'Non tutti gli export servono ogni giorno',
        item1: {
          title: 'JSON per backup e trasferimenti',
          body: 'Usalo quando ti serve una copia strutturata del catalogo o un passaggio tra ambienti e strumenti.'
        },
        item2: {
          title: 'CSV per controlli redazionali',
          body: 'Serve quando vuoi leggere il catalogo come tabella, filtrarlo rapidamente o lavorarlo fuori dal portale.'
        }
      },
      panel: {
        jsonTag: 'Backup strutturato',
        jsonTitle: 'Esporta catalogo in JSON',
        jsonBody: 'Scarica l archivio strutturato per backup, analisi o trasferimento applicativo.',
        csvTag: 'Controllo tabellare',
        csvTitle: 'Esporta catalogo in CSV',
        csvBody: 'Versione tabellare per QA, fogli di lavoro e controllo redazionale.',
        taxonomyTag: 'Vocabolario',
        taxonomyTitle: 'Esporta tassonomie',
        taxonomyBody: 'Scarica gruppi e termini tassonomici in JSON strutturato per revisione e sincronizzazione.'
      }
    },
    adminSettings: {
      eyebrow: 'Admin / Impostazioni',
      title: 'Le informazioni essenziali di questa istanza.',
      description: 'Qui vedi modalita attiva, indirizzo dell applicazione e promemoria utili prima di un rilascio.',
      breadcrumb: 'Admin / Impostazioni',
      status: {
        unconfigured: 'non configurato',
        error: 'errore configurazione env'
      },
      hero: {
        kicker: 'Istanza corrente',
        title: 'Poche informazioni, ma quelle che evitano errori prima di un rilascio.',
        body: 'Qui non si fa debug minuto per minuto. Si controlla che ambiente, URL e prerequisiti siano in ordine.'
      },
      stats: {
        mode: 'Modalita',
        url: 'URL'
      },
      checks: {
        kicker: 'Promemoria',
        title: 'Cosa va verificato prima di andare online',
        item1: {
          title: 'Credenziali e secret reali',
          body: 'Questa istanza richiede credenziali reali, database configurato e secret auth valido per l ambiente.'
        },
        item2: {
          title: 'Migrazioni e storage',
          body: 'Prima del rilascio verifica migrazioni, seed controllato, storage media e smoke test end-to-end.'
        }
      }
    },
    adminAudit: {
      eyebrow: 'Admin / Tracce',
      title: 'Cronologia delle azioni',
      description:
        'Qui restano leggibili i passaggi che hanno cambiato schede, ruoli e dati amministrativi. Serve a ricostruire cosa e successo.',
      breadcrumb: 'Admin / Tracce',
      hero: {
        kicker: 'Memoria del sistema',
        title: 'Ogni passaggio importante deve lasciare una traccia leggibile.',
        body: 'Questa timeline aiuta a capire chi ha cambiato cosa, quando e con quali dettagli minimi.'
      },
      stats: {
        events: 'Eventi mostrati',
        latest: 'Ultima attivita',
        none: 'Nessuna'
      },
      recent: {
        kicker: 'Da leggere per primo',
        title: 'Ultimi movimenti',
        empty: 'Nessuna azione registrata.'
      },
      table: {
        caption: 'Cronologia delle azioni',
        empty: 'Nessuna azione registrata.',
        action: 'Azione',
        actor: 'Attore',
        details: 'Dettagli',
        when: 'Quando'
      },
      payload: {
        none: 'Nessun dettaglio aggiuntivo.'
      }
    },
    adminMedia: {
      hero: {
        kicker: 'Nuovo asset',
        title: 'Collega un immagine o un file a una scheda esistente.',
        body: 'Compila i campi essenziali e usa l alt text per lasciare una descrizione leggibile anche fuori dalla preview visiva.'
      },
      form: {
        validation: 'Serve almeno una scheda associata e un URL valido.',
        creating: 'Sto aggiungendo il media...',
        error: 'Non riesco ad aggiungere questo media.',
        created: 'Media aggiunto.',
        entry: 'Scheda associata',
        entryPlaceholder: 'Seleziona una scheda',
        kind: 'Tipo media',
        kindPlaceholder: 'image, video, audio…',
        url: 'URL asset',
        urlPlaceholder: 'https://…',
        alt: 'Testo alternativo',
        altPlaceholder: 'Descrivi cosa si vede o si ascolta',
        submit: 'Aggiungi asset'
      },
      checks: {
        kicker: 'Controllo rapido',
        title: 'Cosa conviene sistemare per primo',
        visible: 'Asset visibili',
        missingAlt: 'Alt text mancanti',
        item1: {
          title: 'Parti dagli asset senza descrizione',
          body: 'Sono quelli che abbassano subito leggibilita e accessibilita del catalogo.'
        },
        item2: {
          title: 'Tieni pulito il tipo media',
          body: 'Usa etichette corte e coerenti, cosi l elenco resta leggibile anche quando cresce.'
        }
      },
      card: {
        missingAlt: 'Alt text da aggiungere',
        entryId: 'Scheda collegata: {id}',
        noDescription: 'Nessuna descrizione disponibile.'
      }
    },
    entryActions: {
      kicker: 'Azioni rapide',
      addFavorite: 'Aggiungi ai preferiti',
      removeFavorite: 'Rimuovi preferito',
      sendToReview: 'Invia in revisione',
      submitting: 'Invio in corso...',
      submitted: 'Scheda inviata in revisione.',
      error: 'Errore durante l invio.'
    },
    taxonomyExplorer: {
      kicker: 'Esploratore tassonomico',
      title: 'Gruppi e famiglie concettuali',
      placeholder: 'Cerca gruppo o termine...',
      selected: 'Gruppo selezionato',
      openPage: 'Apri pagina dedicata',
      empty: 'Nessun gruppo corrisponde alla ricerca.'
    },
    collectionsPage: {
      eyebrow: 'Curatela',
      title: 'Percorsi di lettura che mettono le schede in relazione.',
      description:
        'Le collezioni accostano materiali che si parlano per tema, luogo o taglio critico. Non sono categorie astratte: sono itinerari gia composti.',
      actions: {
        archive: 'Apri l archivio',
        map: 'Passa alla mappa'
      },
      empty: 'Non ci sono ancora percorsi disponibili.',
      cardKicker: 'Percorso',
      detail: {
        back: 'Torna alle collezioni',
        openMap: 'Apri mappa filtrata',
        path: 'Percorso',
        connected: 'Schede connesse',
        chainTitle: 'Una catena visibile tra le schede',
        cardsCount: '{count} schede'
      }
    },
    mapPage: {
      title: 'Parti dal territorio, poi lascia che siano le tassonomie a restringere il campo.',
      description: 'Ogni punto apre un anteprima, ogni filtro chiarisce una famiglia di estetiche, e ogni selezione diventa un percorso dentro l archivio.',
      collectionTitle: '{title} · vista mappa',
      collectionDescription: 'Questa mappa e gia filtrata sulle schede incluse nella collezione selezionata.',
      empty: 'La mappa non ha ancora schede da mostrare.'
    },
    mapExplorer: {
      errors: {
        load: 'La libreria cartografica non puo essere caricata. Controlla blocchi browser o policy dei contenuti.'
      },
      fallback: {
        place: 'Luogo in definizione',
        period: 'Periodo in definizione'
      },
      hero: {
        kicker: 'Vista mappa',
        title: 'Parti da un luogo, poi filtra il campo attraverso la tassonomia.',
        body: 'La mappa apre le schede per tipo contenuto, tema, formato, know-how, paese e anno. Seleziona un punto, leggi l anteprima, poi apri la scheda completa.'
      },
      stats: {
        visible: 'Schede visibili',
        featured: 'In evidenza',
        year: 'Anno'
      },
      filters: {
        searchPlaceholder: 'Titolo, luogo, tema…',
        searchAria: 'Cerca schede nella mappa',
        countryAria: 'Filtra per paese',
        typeAria: 'Filtra per tipo contenuto',
        themeAria: 'Filtra per tema',
        formatAria: 'Filtra per formato',
        knowHowAria: 'Filtra per know-how',
        allYears: 'Tutti gli anni',
        allCountries: 'Tutti i paesi',
        allTypes: 'Tutti i tipi',
        allThemes: 'Tutti i temi',
        allFormats: 'Tutti i formati',
        allKnowHow: 'Tutti i know-how',
        queryChip: 'Query · rimuovi',
        remove: 'rimuovi',
        none: 'Nessun filtro attivo'
      },
      year: {
        kicker: 'Anno',
        body: 'Muoviti nel tempo senza uscire dalla mappa.',
        reset: 'Reset anno'
      },
      preview: {
        kicker: 'Scheda selezionata',
        title: 'Pannello anteprima',
        results: '{count} risultati',
        featured: 'In evidenza',
        place: 'Luogo',
        period: 'Periodo',
        open: 'Apri scheda',
        moreCountry: 'Altre da questo paese',
        empty: 'Seleziona un punto sulla mappa per leggere l anteprima.'
      },
      list: {
        kicker: 'Schede visibili',
        title: 'Apri una scheda direttamente',
        reset: 'Reset',
        empty: 'Nessuna scheda corrisponde ai filtri attivi.'
      }
    },
    adminCollections: {
      eyebrow: 'Stack curatoriale',
      title: 'Gestione collezioni',
      description: 'Monitora percorsi curatoriali, densita delle sezioni e copertura delle schede aggregate.',
      breadcrumb: 'Amministrazione / Collezioni',
      table: {
        caption: 'Collezioni curate',
        empty: 'Nessuna collezione disponibile.',
        collection: 'Collezione',
        summary: 'Sintesi',
        entries: 'Schede',
        sections: 'Sezioni'
      }
    },
    terms: {
      eyebrow: 'Quadro editoriale',
      title: 'Termini di utilizzo',
      description: 'Il riuso del corpus e dei contributi deve preservare contesto, correttezza delle fonti e mandato editoriale.',
      items: {
        contributions: {
          title: 'Contributi',
          body: 'I contenuti inviati devono rispettare finalita di ricerca, correttezza delle fonti, diritti d autore e accuratezza contestuale.'
        },
        moderation: {
          title: 'Moderazione',
          body: 'La redazione puo richiedere revisioni, rifiutare o archiviare materiali non coerenti con il mandato del progetto.'
        },
        reuse: {
          title: 'Riutilizzo',
          body: 'L uso dei dati pubblici e dei materiali editoriali deve citare ANTICORES e preservarne il contesto.'
        }
      }
    },
    accessibility: {
      eyebrow: 'Accessibilita',
      title: 'Accessibilita',
      description: 'ANTICORES considera leggibilita e accessibilita come parte strutturale, non come correzione a valle.',
      items: {
        baseline: {
          title: 'Baseline attive',
          body: 'Interfacce responsive, navigazione da tastiera, gerarchie semantiche e contrasto leggibile fanno parte della baseline.'
        },
        inProgress: {
          title: 'Lavoro in corso',
          body: 'Stiamo rafforzando i controlli WCAG su mappa, form complessi, stati di focus e pagine dense di informazioni.'
        }
      }
    },
    contact: {
      eyebrow: 'Contattaci',
      title: 'Contattaci',
      description: 'Per domande editoriali, collaborazioni o accesso ai dati scrivi a atlas@incursivefashionheritage.com.',
      info: {
        email: 'Email editoriale',
        topics: 'Temi',
        topicsBody: 'Curatela, review, dati, ricerca e partnership culturali.',
        response: 'Tempi di risposta',
        responseBody: 'Di solito entro 3–5 giorni lavorativi.',
        quick: 'Invio rapido',
        quickBody: 'Il pulsante apre il tuo client email con un messaggio gia indirizzato.'
      },
      form: {
        name: 'Nome',
        namePlaceholder: 'Nome completo…',
        email: 'Email',
        emailPlaceholder: 'nome@dominio.com…',
        subject: 'Oggetto',
        subjectPlaceholder: 'Di cosa vuoi parlare?',
        message: 'Messaggio',
        messagePlaceholder: 'Scrivi qui il tuo messaggio…',
        send: 'Invia'
      }
    },
    auth: {
      login: {
        kicker: 'Autenticazione',
        title: 'Entra in ANTICORES.',
        lead: 'Qui contributor, editor e admin tornano alle schede su cui stanno lavorando.',
        notice: 'L accesso e personale e i permessi seguono il ruolo assegnato.',
        error: 'Credenziali non valide. Riprova.',
        form: {
          kicker: 'Accedi',
          title: 'Bentornato',
          email: 'Email',
          emailPlaceholder: 'nome@dominio.com…',
          password: 'Password',
          passwordPlaceholder: 'Inserisci la password…',
          submit: 'Accedi',
          loading: 'Accesso in corso…',
          forgot: 'Password dimenticata?',
          noAccount: 'Non hai ancora un account?',
          register: 'Registrati'
        }
      },
      register: {
        kicker: 'Registrazione',
        title: 'Apri il tuo accesso.',
        lead: 'Si entra come contributor. I ruoli editoriali o amministrativi vengono assegnati in seguito.',
        error: 'Errore durante la registrazione.',
        network: 'Errore di rete. Riprova.',
        form: {
          displayName: 'Nome visualizzato',
          email: 'Email',
          password: 'Password',
          submit: 'Crea account',
          loading: 'Creazione in corso…',
          hasAccount: 'Hai gia un account?',
          signIn: 'Accedi'
        }
      },
      verify: {
        eyebrow: 'Attivazione',
        title: 'Verifica la tua email',
        description: 'Controlla la tua casella email e conferma il link per attivare il profilo.'
      },
      forgot: {
        eyebrow: 'Recupero account',
        title: 'Recupero password',
        description: 'Inserisci l email associata al profilo per ricevere un link di reset.',
        emailPlaceholder: 'Email account',
        submit: 'Invia link reset'
      },
      reset: {
        eyebrow: 'Reset password',
        title: 'Imposta nuova password',
        description: 'Scegli una nuova password per rientrare nel tuo account.',
        newPassword: 'Nuova password',
        confirmPassword: 'Conferma password',
        submit: 'Aggiorna password'
      }
    },
    submitNew: {
      eyebrow: 'Nuova scheda',
      title: 'Metti a fuoco il materiale prima di consegnarlo.',
      description:
        'Qui trasformi appunti, fonti e intuizioni in una scheda leggibile. Pochi passaggi, fatti bene: titolo, contesto, parole chiave e sintesi.',
      breadcrumb: 'Contributore / Nuova scheda',
      actions: {
        back: 'Torna alle tue schede',
        archive: 'Consulta l archivio'
      }
    },
    submitForm: {
      steps: {
        0: { label: 'Metti a fuoco la scheda', description: 'Titolo, slug, sintesi e testo principale.' },
        1: { label: 'Indica luogo e tempo', description: 'Paese, luogo, lingua e periodo.' },
        2: { label: 'Aggiungi immagini e video', description: 'Raccogli i materiali visivi che aiutano a leggere la scheda.' },
        3: { label: 'Scegli le parole giuste', description: 'Termini che aiutano a trovare e confrontare la scheda.' },
        4: { label: 'Rileggi e salva', description: 'Controlla i punti chiave e salva la bozza.' }
      },
      stepLabel: 'Step {step}',
      stepReady: 'Pronto',
      stepTodo: 'Da fare',
      errors: {
        slug: 'Inserisci uno slug leggibile e stabile.',
        title: 'Inserisci un titolo editoriale chiaro.',
        abstract: 'Serve un abstract sintetico.',
        description: 'Serve una descrizione critica piu ampia.',
        country: 'Seleziona almeno un paese.',
        period: 'Definisci un periodo o una finestra temporale.',
        taxonomy: 'Seleziona almeno un termine tassonomico.',
        source: 'Spiega da dove emerge il trend o il corpus.',
        summary: 'Chiudi con una sintesi utile per la review.',
        createDraft: 'Non riesco a creare la bozza.',
        updateDraft: 'Non riesco ad aggiornare la bozza.',
        openDraft: 'Non riesco ad aprire la bozza.'
      },
      status: {
        resumedServer: 'Bozza server ripresa dal {date}.',
        resumedLocal: 'Bozza locale ripresa dal {date}.',
        autosaveFailed: 'Salvataggio automatico non riuscito: {reason}.',
        retry: 'riprova tra poco',
        savedServer: 'Bozza salvata nel tuo profilo. Puoi continuare adesso o riprenderla piu tardi.',
        missingBeforeSave: 'Compila i campi mancanti prima di salvare.',
        savingDraft: 'Sto salvando la bozza...',
        updatingServer: 'Sto aggiornando la bozza nel tuo profilo...',
        openingServer: 'Sto aprendo una bozza nel tuo profilo...',
        openedServer: 'Bozza aperta nel tuo profilo. Puoi riprenderla in qualsiasi momento.',
        openedServerContinue: 'Bozza aperta nel tuo profilo. Puoi continuare senza perdere il lavoro.',
        completeRequired: 'Completa i campi richiesti prima di passare allo step successivo.',
        error: 'Errore: {reason}',
        saveFailed: 'salvataggio non riuscito',
        localRemovedServer: 'Copia locale rimossa. La bozza nel tuo profilo resta disponibile.',
        localCleared: 'Bozza locale eliminata. Puoi ricominciare da zero.',
        updatedServerTime: 'Bozza nel profilo aggiornata alle {time}.',
        updatedLocalTime: 'Bozza locale aggiornata automaticamente alle {time}.'
      },
      fields: {
        slug: { label: 'Slug', hint: 'Breve, chiaro, facile da ritrovare.' },
        title: { label: 'Titolo editoriale', hint: 'Chiaro e concreto. Evita formule astratte.' },
        abstract: { label: 'Abstract', hint: 'Tre o quattro frasi per dire subito di cosa si tratta e perche conta.' },
        description: {
          label: 'Testo principale',
          hint: 'Allarga il contesto: pratiche, immagini, riferimenti, tensioni, rilevanza culturale.'
        },
        language: { label: 'Lingua canonica' },
        country: { label: 'Paese', placeholder: 'Seleziona...' },
        place: { label: 'Luogo o nodo', hint: 'Citta, quartiere, scena locale o nodo riconoscibile.' },
        period: {
          label: 'Periodo',
          hint: 'Scrivilo come lo leggeresti in una scheda pubblica.',
          placeholder: 'es. 2019-2024'
        },
        keywords: {
          label: 'Parole chiave',
          placeholder: 'artigianato digitale, memoria visiva',
          hint: 'Separate da virgola.'
        },
        source: {
          label: 'Da dove emerge questo materiale',
          placeholder: 'Piattaforma, community, progetto, campagna...'
        },
        summary: {
          label: 'In due o tre righe',
          hint: 'Scrivi quello che una persona deve capire subito aprendo la scheda.'
        }
      },
      media: {
        lead: 'Aggiungi immagini o video utili a leggere questa estetica. I file restano in coda mentre completi la scheda.',
        label: 'Upload immagini e video',
        hint: 'Puoi selezionare piu file e rifinirli in seguito durante l editing della scheda.',
        queue: 'Media in coda',
        empty: 'Nessun file selezionato.'
      },
      taxonomy: {
        lead: 'Scegli solo i termini che aiutano davvero a leggere questa scheda. Meglio poche parole buone che una lista generica.'
      },
      summary: {
        kicker: 'Riepilogo finale',
        title: 'Titolo',
        territory: 'Territorio',
        period: 'Periodo',
        taxonomy: 'Tassonomie selezionate',
        media: 'Media in coda',
        unknownCountry: 'Non definito',
        missingTitle: 'Ancora non definito',
        unknownPlace: 'Nodo non specificato',
        unknownPeriod: 'Non definito'
      },
      actions: {
        back: 'Indietro',
        saveLater: 'Salva e continua dopo',
        openServer: 'Apri bozza nel profilo',
        next: 'Continua',
        save: 'Salva bozza',
        saving: 'Salvataggio...'
      },
      progress: '{completed}/{total} step completati',
      aside: {
        kicker: 'Bozza in costruzione',
        title: 'Sintesi sempre visibile',
        titleLabel: 'Titolo',
        missingTitle: 'Ancora da scrivere',
        slugLabel: 'Slug',
        missingSlug: 'Non definito',
        territoryLabel: 'Territorio',
        periodLabel: 'Periodo',
        missingPeriod: 'Non definito',
        taxonomyLabel: 'Tassonomie',
        taxonomyCount: '{count} termini selezionati',
        mediaLabel: 'Media',
        mediaCount: '{count} file pronti',
        mediaEmpty: 'Nessun file ancora aggiunto',
        keywordsLabel: 'Parole chiave',
        keywordsEmpty: 'Nessuna parola chiave ancora aggiunta.',
        draftStatus: 'Stato bozza',
        serverStatus: 'Bozza aperta nel tuo profilo. Ultimo aggiornamento: {date}.',
        localStatus: 'Bozza locale aggiornata automaticamente: {date}. Apri una bozza nel profilo per ritrovarla anche da un altro accesso.',
        localOnly: 'Per ora stai scrivendo in locale. Quando vuoi, puoi aprire una bozza nel tuo profilo.',
        clearLocal: 'Svuota la bozza locale'
      }
    },
    entry: {
      eyebrow: 'Scheda',
      breadcrumb: 'Esplora / Archivio',
      actions: {
        map: 'Vai alla mappa',
        archive: 'Torna all archivio'
      },
      meta: {
        author: 'Autore',
        country: 'Paese',
        timeframe: 'Periodo',
        timeframeFallback: 'Periodo in definizione',
        place: 'Luogo',
        placeFallback: 'Luogo in definizione',
        source: 'Contesto fonte',
        sourceFallback: 'Contesto in definizione',
        metadata: 'Metadati',
        taxonomyCount: '{count} termini tassonomici'
      },
      descriptionKicker: 'Descrizione',
      taxonomyKicker: 'Metadati tassonomici',
      taxonomyTitle: 'Segnali associati a questa scheda'
    },
    privacy: {
      eyebrow: 'Cura dei dati',
      title: 'Privacy',
      description:
        'ANTICORES tratta solo il necessario per autenticazione, review editoriale, sicurezza della piattaforma e pubblicazione del corpus.',
      items: {
        collected: {
          title: 'Dati raccolti',
          body: 'Trattiamo i dati minimi necessari a contributi, revisione editoriale, autenticazione e sicurezza della piattaforma.'
        },
        public: {
          title: 'Dati pubblici',
          body: 'I dataset pubblici non includono informazioni sensibili degli utenti e privilegiano contenuti editoriali e metadati culturali.'
        },
        requests: {
          title: 'Diritti e richieste',
          body: 'Per richieste GDPR o chiarimenti puoi contattare atlas@incursivefashionheritage.com.'
        }
      }
    }
  },
  fr: {
    brand: {
      name: 'ANTICORES',
      subtitle: 'Une cartographie des esthétiques numériques de la mode.',
      baseline: "Cartographier les modes qui ne sont pas arrivées dans ton fil."
    },
    common: {
      skipToContent: 'Aller au contenu',
      open: 'Ouvrir',
      close: 'Fermer',
      reset: 'Réinitialiser',
      apply: 'Appliquer',
      remove: 'Retirer',
      available: 'Disponible',
      account: 'Compte',
      signIn: 'Se connecter',
      signOut: 'Se déconnecter',
      newCard: 'Nouvelle fiche',
      allCountries: 'Tous les pays',
      allYears: 'Toutes les années',
      noFilters: 'Aucun filtre',
      untitled: 'Sans titre',
      countryUndefined: 'Lieu en cours de définition',
      periodUndefined: 'Période en cours de définition',
      provenance: 'Provenance',
      editorialFallback: 'Note de feuille',
      sheet: 'Feuille',
      row: 'Ligne',
      canonicalKey: 'Clé canonique',
      mediaMatch: 'Correspondance média',
      mediaAssets: '{count} médias',
      more: 'Plus',
      sourceNetwork: 'Réseau source',
      sourceLinks: 'Liens source',
      bibliography: 'Bibliographie',
      media: 'Médias',
      workbookRowCaption: 'Ligne du classeur',
      matchedViaCanonical: 'Apparié via la clé canonique',
      matchedViaLegacy: 'Apparié via la clé héritée',
      matchedViaAlias: 'Apparié via un alias',
      matchedBy: 'Apparié par {value}',
      matched: 'Correspondant',
      partial: 'Partiel',
      missing: 'Manquant',
      orphan: 'Orphelin',
      active: 'Actif',
      inactive: 'Inactif',
      unavailable: 'Indisponible'
    },
    nav: {
      explore: 'Explorer',
      project: 'Projet',
      workspace: 'Espace',
      menu: 'Menu',
      closeMenu: 'Fermer le menu',
      openMenu: 'Ouvrir le menu',
      map: 'Carte',
      archive: 'Archive',
      collections: 'Collections',
      projectPage: 'Projet',
      taxonomies: 'Taxonomies',
      contact: 'Nous contacter',
      review: 'Revue',
      admin: 'Administration',
      account: 'Compte'
    },
    footer: {
      line1: 'ANTICORES · Une cartographie des esthétiques numériques de la mode.',
      line2: "Cartographier les modes qui ne sont pas arrivées dans ton fil."
    },
    language: {
      label: 'Langue',
      en: 'English',
      it: 'Italiano',
      fr: 'Français'
    },
    home: {
      chip: 'Mode numérique, esthétiques, lieux et traces',
      title: 'Une cartographie des esthétiques numériques de la mode qui circulent hors du fil le plus visible.',
      lead: "Pars d’un lieu, suis une constellation d’images et de pratiques, puis ouvre la fiche pour en savoir plus sur une esthétique donnée.",
      statsPublished: 'Fiches publiées',
      statsPeople: 'Personnes impliquées',
      statsCollections: 'Collections',
      entryLabel: 'Par où commencer',
      mapTitle: 'Carte',
      mapDescription: 'Pour partir des lieux et voir comment textes, images et thèmes se densifient dans l espace.',
      archiveTitle: 'Archive',
      archiveDescription: 'Pour parcourir les fiches côte à côte et comparer territoires, périodes et mots-clés.',
      collectionsTitle: 'Collections',
      collectionsDescription: 'Pour suivre des parcours déjà composés: une piste de lecture, pas une liste neutre.',
      whyKicker: 'Pourquoi ANTICORES',
      whyTitle: 'Certaines esthétiques ne deviennent jamais l image dominante. Elles laissent pourtant des traces fortes.',
      whyBody: 'ANTICORES rassemble les signaux qui restent à la marge du projecteur des plateformes: scènes locales, images récurrentes, savoir-faire pratiques et micro-histoires de la mode numérique.',
      sectionLabel: 'Fiches mises en avant',
      sectionTitle: 'Quelques entrées dans le catalogue',
      openArchive: 'Ouvrir toute l archive',
      featured: 'À la une',
      defaultPlace: 'Nœud éditorial',
      defaultPeriod: 'Période en cours de définition'
    },
    archive: {
      eyebrow: 'Archive',
      title: 'Parcourez les fiches, comparez les contextes et cherchez dans l archive elle-même.',
      description: 'Archive et recherche vivent désormais ensemble: partez d un mot, affinez par taxonomie, puis comparez lieux, périodes, formats et savoir-faire dans un seul flux.',
      searchPlaceholder: 'Mot-clé, lieu, format, savoir-faire…',
      filtersTaxonomy: 'Taxonomie',
      filtersCountry: 'Pays',
      filtersYear: 'Année',
      filtersKeywords: 'Mots-clés',
      apply: 'Appliquer les filtres',
      reset: 'Réinitialiser',
      resultCount: '{count} résultats',
      grid: 'Grille',
      list: 'Liste',
      queryFilter: 'Requête : {value}',
      countryFilter: 'Pays : {value}',
      yearFilter: 'Année : {value}',
      taxonomyFilter: 'Taxonomie : {value}',
      keywordFilter: 'Mot-clé : {value}',
      empty: 'Aucune fiche ne correspond à cette combinaison. Élargissez le champ ou retirez un filtre.',
      featured: 'À la une'
    },
    about: {
      eyebrow: 'Pourquoi cela existe',
      title: 'ANTICORES existe pour rendre lisibles les esthétiques numériques de la mode au-delà du rythme du fil.',
      description:
        'Le projet rassemble fiches, images, mots-clés et taxonomies afin de lire des cultures visuelles dispersées comme des formations connectées plutôt que comme des posts isolés.',
      body1:
        'Les esthétiques numériques de la mode circulent souvent par fragments : un look repris par de petites scènes, un geste pratique, un format vidéo, un vocabulaire local, une tonalité partagée. ANTICORES maintient ces fragments ensemble suffisamment longtemps pour les rendre lisibles.',
      body2:
        'La plateforme n est pas un contenant neutre. Chaque fiche est composée de manière à comparer lieu, période, format, matériaux et noyaux thématiques avec d autres. Le but est d aider lectrices, contributeurs et éditrices à suivre des relations plutôt que des impressions isolées.',
      body3:
        'C est aussi pourquoi les taxonomies comptent ici : non pas comme des étiquettes de backend, mais comme un langage partagé pour filtrer, comparer et construire des parcours à travers des esthétiques qui reçoivent rarement une mémoire publique stable.'
    },
    taxonomy: {
      eyebrow: 'Taxonomies',
      title: 'Le vocabulaire qui rend l archive filtrable et comparable.',
      description:
        'Les termes sont regroupés pour soutenir les filtres de la carte, la recherche dans l archive et la lecture des fiches. Ils font partie de l expérience publique, et non de métadonnées cachées.',
      readyTerms: '{count} termes prêts à explorer',
      groupDescription: '{count} termes disponibles pour la classification, le filtrage et la lecture editoriale.',
      backToTaxonomies: 'Retour aux taxonomies'
    },
    review: {
      page: {
        eyebrow: 'Revue',
        title: 'Inbox et fiche sélectionnée.',
        description: 'Ouvrez l inbox, sélectionnez une fiche, puis décidez sans bruit de dashboard.',
        breadcrumb: 'Revue',
        adminAction: 'Administration',
        empty: 'Aucune fiche n attend dans la file.'
      },
      inboxKicker: 'Inbox',
      inboxTitle: 'Revoir les fiches qui demandent une decision.',
      inboxDescription: 'Recherchez dans la file et ouvrez une fiche pour assigner, commenter ou faire avancer.',
      searchLabel: 'Rechercher',
      searchPlaceholder: 'Titre, contributeur, relecteur…',
      searchAria: 'Rechercher dans la file de revue',
      visibleLabel: 'Fiches visibles',
      empty: 'Aucune fiche ne correspond à cette recherche.',
      selectedKicker: 'Fiche sélectionnée',
      byContributor: 'Proposée par {name}',
      assignedTo: 'Assignée à {name}',
      unassigned: 'Non assignée',
      lastMove: 'Dernière mise à jour',
      notes: 'Notes',
      reviewerLabel: 'Relecteur',
      openCard: 'Ouvrir la fiche',
      recentNotes: 'Notes récentes',
      notesCount: '{count} notes',
      noNotes: 'Aucune note pour le moment.',
      nextStep: 'Prochaine étape',
      nextStepPlaceholder: 'Écrivez la prochaine étape : vérifier, demander des changements, approuver…',
      saving: 'Enregistrement…',
      saveAssign: 'Enregistrer note et assignation',
      emptySelection: 'Sélectionnez une fiche dans la liste pour la revoir et décider la prochaine étape.',
      actions: {
        start: 'Commencer la revue',
        changes: 'Demander des modifications',
        approve: 'Approuver',
        publish: 'Publier',
        reject: 'Rejeter'
      },
      errors: {
        assign: 'Impossible de mettre à jour l assignation.',
        action: 'Impossible de terminer cette action.',
        network: 'Erreur réseau pendant la sauvegarde.'
      },
      messages: {
        assign: 'Assignation mise à jour.',
        status: 'Statut de la fiche mis à jour.'
      }
    },
    account: {
      eyebrow: 'Compte',
      title: 'Vos fiches, votre profil, votre prochaine action.',
      description: 'Reprenez le travail recent, verifiez l etat de vos fiches et retournez aux actions importantes.',
      breadcrumb: 'Compte',
      actions: {
        newCard: 'Nouvelle fiche',
        editProfile: 'Modifier le profil'
      },
      profile: {
        kicker: 'Profil de travail',
        email: 'Email',
        role: 'Role',
        cardsOpened: 'Fiches ouvertes',
        missing: 'N/D'
      },
      nextAction: {
        kicker: 'Prochaine action',
        contributor: 'Reprendre une brouillon ou creer une nouvelle fiche.',
        other: 'Verifiez les fiches recentes et revenez la ou une intervention est necessaire.'
      },
      quick: {
        kicker: 'Vue rapide',
        title: 'Ou vous en etes',
        cardsOpened: 'Fiches ouvertes',
        role: 'Role actuel',
        latestStatus: 'Dernier statut',
        noActivity: 'Aucune activite recente'
      },
      links: {
        profile: {
          title: 'Profil',
          description: 'Mettez a jour le nom public, la bio et les details du compte.'
        },
        saved: {
          title: 'Recherches sauvegardees',
          description: 'Gardez les chemins que vous souhaitez rouvrir sans recommencer.'
        },
        notifications: {
          title: 'Notifications',
          description: 'Suivez les changements d etat, messages et demandes lies a vos fiches.'
        }
      },
      recent: {
        kicker: 'Activite recente',
        title: 'Vos fiches',
        empty: 'Aucune activite n est encore enregistree pour ce compte.'
      }
    },
    accountSubmissions: {
      eyebrow: 'Compte / Fiches',
      title: 'Historique de vos fiches',
      description: 'Une vue organisee des fiches ouvertes, utile pour reprendre les brouillons et suivre les progres.',
      breadcrumb: 'Compte / Fiches',
      resume: 'Reprendre la fiche',
      empty: 'Vous n avez encore ouvert aucune fiche.'
    },
    submitDashboard: {
      eyebrow: 'Vos fiches',
      title: 'Brouillons a reprendre, envois a suivre, corrections a fermer.',
      description:
        'Tout ce que vous avez ouvert reste ici: ce qui est encore en cours d ecriture, ce qui attend une revue, et ce qui est revenu avec des changements.',
      breadcrumb: 'Contribution',
      actions: {
        new: 'Nouvelle fiche',
        history: 'Historique des envois'
      },
      stats: {
        drafts: 'Brouillons ouverts',
        submitted: 'En attente de revue',
        changes: 'Modifications demandees'
      },
      updated: 'Mis a jour',
      resume: 'Reprendre la fiche',
      empty: 'Vous n avez encore ouvert aucune fiche.'
    },
    accountProfile: {
      eyebrow: 'Compte / Profil',
      title: 'Comment vous apparaissez dans le projet',
      description:
        'Mettez a jour le nom, la bio et les details de base pour clarifier votre presence dans les fiches et espaces de travail.',
      breadcrumb: 'Compte / Profil',
      displayName: 'Nom affiche',
      email: 'Email',
      role: 'Role',
      status: 'Statut du compte',
      active: 'Actif',
      missing: 'N/D',
      form: {
        displayName: 'Nom affiche',
        email: 'Email',
        save: 'Enregistrer',
        saving: 'Enregistrement…',
        saved: 'Profil mis a jour.',
        error: 'Impossible de mettre a jour le profil.'
      }
    },
    accountSaved: {
      eyebrow: 'Compte / Recherches sauvegardees',
      title: 'Recherches a rouvrir en un instant.',
      description: 'Conservez les requetes que vous utilisez souvent et relancez les quand vous voulez revenir a un theme ou un lieu.',
      breadcrumb: 'Compte / Recherches sauvegardees',
      defaultSummary: 'Requete sauvegardee prete a relancer.',
      form: {
        kicker: 'Nouvelle recherche',
        title: 'Enregistrez un parcours a rouvrir plus tard.',
        label: 'Etiquette',
        labelPlaceholder: 'Par exemple: Pays en revue',
        note: 'Note rapide',
        notePlaceholder: 'Pourquoi cette recherche vaut la peine?',
        save: 'Enregistrer la recherche',
        remove: 'Retirer',
        labelRequired: 'Ajoutez une etiquette avant de sauvegarder.',
        saved: 'Recherche sauvegardee.',
        removed: 'Recherche retiree.',
        saveError: 'Impossible de sauvegarder cette recherche.'
      },
      memory: {
        kicker: 'Memoire de travail',
        title: 'Gardez seulement les recherches qui aident a revenir a l archive.',
        count: 'Recherches sauvegardees'
      }
    },
    accountFavorites: {
      eyebrow: 'Compte / Favoris',
      title: 'Les fiches que vous gardez a portee de main.',
      description: 'Rassemblez les fiches que vous souhaitez rouvrir pendant la lecture, la recherche ou la revue.',
      breadcrumb: 'Compte / Favoris',
      list: {
        kicker: 'Reouverture rapide',
        title: 'Les fiches que vous gardez proches quand vous lisez ou travaillez.',
        count: 'Favoris sauvegardes',
        remove: 'Retirer des favoris',
        removed: 'Favori retire.',
        empty: 'Aucun favori sauvegarde.'
      }
    },
    accountNotifications: {
      eyebrow: 'Compte / Notifications',
      title: 'Les mises a jour qui vous concernent.',
      description: 'Changements d etat, notes et signaux arrivent ici pour garder le fil.',
      breadcrumb: 'Compte / Notifications',
      empty: 'Aucune notification.',
      list: {
        kicker: 'Signaux recents',
        title: 'Ce qui merite attention maintenant.',
        new: 'Nouvelles',
        total: 'Totales',
        read: 'Lue',
        unread: 'Nouvelle',
        setRead: 'Marquer lue',
        setUnread: 'Marquer non lue',
        markRead: 'Notification marquee comme lue.',
        markUnread: 'Notification marquee comme non lue.'
      }
    },
    admin: {
      eyebrow: 'Administration',
      title: 'Modifier les fiches, les taxonomies, gerer la carte.',
      description: 'Restez concentre sur les actions du jour: fiches en cours, records publies et liens operationnels.',
      breadcrumb: 'Administration',
      actions: {
        review: 'Revue'
      },
      alerts: {
        unassigned: '{count} fiches sans relecteur assigne',
        urgent: '{count} fiches urgentes dans la file',
        drafts: '{count} brouillons en attente'
      },
      today: {
        kicker: 'Etat du jour',
        title: 'Ce qui demande attention maintenant',
        empty: 'Aucun bloc evident pour le moment.',
        check: 'Verifier',
        open: 'Ouvrir'
      },
      stats: {
        cards: 'Fiches',
        users: 'Utilisateurs',
        collections: 'Collections',
        terms: 'Termes'
      },
      pipeline: {
        inProgress: 'En cours',
        published: 'Enregistrements publies'
      },
      quick: {
        kicker: 'Actions rapides',
        users: 'Utilisateurs',
        taxonomy: 'Taxonomies',
        cards: 'Fiches',
        map: 'Carte',
        export: 'Export'
      }
    },
    adminEntries: {
      eyebrow: 'Admin / Fiches',
      title: 'Fiches, taxonomies, et gestion de la carte',
      description: 'Modifiez les fiches directement, gardez la taxonomie lisible et coordonnez les metadonnees sans section media separee.',
      breadcrumb: 'Admin / Fiches',
      hero: {
        kicker: 'Catalogue vivant',
        title: 'Fiches, media et contexte carte reunis sur une seule surface.',
        body: 'Cette vue garde titre, territoire, statut, contributeur et contexte d edition ensemble pour intervenir sans passer par des silos.'
      },
      stats: {
        visible: 'Fiches visibles',
        drafts: 'Brouillons',
        inProgress: 'En cours'
      },
      scope: {
        kicker: 'Portee d edition',
        title: 'Ce qui appartient ici',
        direct: {
          title: 'Modifier les fiches directement',
          body: 'Titres, resumes, couverture des taxonomies et preparation editoriale doivent rester visibles ensemble.'
        },
        media: {
          title: 'Les medias restent dans l edition des fiches',
          body: 'Images et videos doivent etre ajustes par rapport a la fiche qu ils soutiennent, pas dans un silo separe.'
        }
      },
      table: {
        caption: 'Catalogue des fiches',
        empty: 'Aucune fiche disponible.',
        card: 'Fiche',
        status: 'Statut',
        country: 'Pays',
        contributor: 'Contributeur',
        updated: 'Mis a jour'
      }
    },
    adminTaxonomies: {
      eyebrow: 'Admin / Taxonomies',
      title: 'Structure conceptuelle du catalogue',
      description: 'Controlez groupes, terminologie et coherence linguistique qui soutiennent filtres, carte et lecture.',
      breadcrumb: 'Admin / Taxonomies',
      hero: {
        kicker: 'Structure editoriale',
        title: 'Si les taxonomies ne restent pas propres, tout le catalogue perd en lisibilite.',
        body: 'Gardez groupes et termes alignes pour que la langue du catalogue reste claire en grandissant.'
      },
      stats: {
        groups: 'Groupes',
        terms: 'Termes'
      },
      watch: {
        kicker: 'A surveiller',
        title: 'Qualite avant quantite',
        item1: {
          title: 'Chaque groupe doit rester lisible pour ceux qui filtrent',
          body: 'Si les termes deviennent trop similaires ou trop techniques, la recherche publique s affaiblit.'
        },
        item2: {
          title: 'Les traductions doivent servir la clarte, pas le remplissage',
          body: 'Mieux vaut peu d etiquettes fortes et coherentes que beaucoup de variantes non controlees.'
        }
      },
      table: {
        caption: 'Groupes taxonomiques',
        empty: 'Aucune taxonomie disponible.',
        group: 'Groupe',
        slug: 'Slug',
        terms: 'Termes',
        translations: 'Traductions'
      }
    },
    adminUsers: {
      eyebrow: 'Admin / Utilisateurs',
      title: 'Personnes qui travaillent sur le projet',
      description: 'Roles, emails et dates d entree pour chaque personne ayant acces a ANTICORES.',
      breadcrumb: 'Admin / Utilisateurs',
      hero: {
        kicker: 'Personnes',
        title: 'Le catalogue reste lisible seulement si roles et acces restent clairs.',
        body: 'Cette vue garde personnes, roles et dates d entree ensemble pour voir qui peut contribuer.'
      },
      stats: {
        people: 'Personnes',
        editors: 'Roles editoriaux'
      },
      watch: {
        kicker: 'A surveiller',
        title: 'Ce qui doit rester propre',
        item1: {
          title: 'Les roles doivent rester lisibles en un coup d oeil',
          body: 'Si lecteurs et publieurs se confondent, la maintenance de la file faiblit.'
        },
        item2: {
          title: 'La liste des utilisateurs est aussi la memoire du projet',
          body: 'La date d entree aide a reconstruire l expansion de l equipe.'
        }
      },
      table: {
        caption: 'Utilisateurs du projet',
        empty: 'Aucun utilisateur disponible.',
        name: 'Nom',
        email: 'Email',
        role: 'Role',
        created: 'Cree'
      }
    },
    adminAnalytics: {
      eyebrow: 'Admin / Tendances',
      title: 'Des chiffres utiles, pas du bruit.',
      description: 'Voyez combien de fiches arrivent, combien sont en ligne, et ou le travail s accumule.',
      breadcrumb: 'Admin / Tendances',
      hero: {
        kicker: 'Vue d ensemble',
        title: 'Savoir ou le travail s empile compte plus que collectionner des KPI.',
        body: 'Cette vue lit le poids du catalogue, combien de fiches passent en public et ou la couverture se densifie.'
      },
      stats: {
        total: 'Fiches totales',
        published: 'Publiees',
        activeUsers: 'Personnes actives',
        countries: 'Pays couverts'
      },
      quick: {
        kicker: 'Lecture rapide',
        title: 'Les chiffres qui comptent aujourd hui',
        publishRate: 'Taux de publication',
        busiest: 'Statut le plus charge',
        none: 'Aucun',
        item1: {
          title: 'La publication est le vrai goulot',
          body: 'Utilisez ce ratio pour voir si la revue produit des fiches publiees ou stagne.'
        },
        item2: {
          title: 'La couverture montre ou nous regardons',
          body: 'Si le corpus se concentre toujours dans les memes pays, reequilibrez collecte et curation.'
        }
      },
      statuses: {
        kicker: 'Etats du catalogue',
        title: 'Ou le parcours des fiches s arrete'
      },
      coverage: {
        kicker: 'Couverture geographique',
        title: 'Ou le catalogue est le plus present',
        empty: 'Aucun pays recense.',
        label: 'Fiches dans le catalogue'
      }
    },
    adminExport: {
      eyebrow: 'Admin / Import-Export',
      title: 'Exporter les donnees quand elles servent vraiment.',
      description: 'Utilisez ces sorties pour controles, sauvegardes et transferts.',
      breadcrumb: 'Admin / Import-Export',
      hero: {
        kicker: 'Sorties utiles',
        title: 'Exporter seulement ce qui aide a controler, transferer ou securiser le catalogue.',
        body: 'Cette page evite l accumulation de formats. Utilisez-la pour QA, transferts ou snapshots.'
      },
      stats: {
        records: 'Enregistrements exportables',
        terms: 'Termes exportables'
      },
      syncCoverage: {
        title: 'Couverture de synchronisation',
        rowsWithoutMedia: 'Lignes sans media',
        orphanAssets: 'Assets orphelins',
        canonicalCollisions: 'Collisions canoniques',
        matchedAssets: 'Assets apparies',
        coreMetadata: 'Completeness des metadonnees de base',
        completeRows: 'Lignes completes sur A/B/E/H',
        incompleteRows: 'Lignes incompletes',
        editorialFallback: 'Completeness du workbook',
        renderableRows: 'Lignes completes sur les champs workbook',
        missingFallback: 'Lignes workbook incompletes',
        coverage: 'Couverture',
        allFallback: 'Toutes les lignes du workbook sont maintenant completes pour le rendu public.'
      },
      when: {
        kicker: 'Quand les utiliser',
        title: 'Tous les exports ne sont pas necessaires chaque jour',
        item1: {
          title: 'JSON pour sauvegarde et transfert',
          body: 'A utiliser quand il faut une copie structuree du catalogue ou un passage entre outils.'
        },
        item2: {
          title: 'CSV pour controles editoriaux',
          body: 'Utile pour lire le catalogue en tableau, filtrer vite ou travailler hors du portail.'
        }
      },
      panel: {
        jsonTag: 'Sauvegarde structuree',
        jsonTitle: 'Exporter le catalogue en JSON',
        jsonBody: 'Telechargez l archive structuree pour sauvegarde, analyse ou transfert.',
        csvTag: 'Controle tabulaire',
        csvTitle: 'Exporter le catalogue en CSV',
        csvBody: 'Version tabulaire pour QA, feuilles de travail et controles editoriaux.',
        taxonomyTag: 'Vocabulaire',
        taxonomyTitle: 'Exporter les taxonomies',
        taxonomyBody: 'Telechargez groupes et termes en JSON structure pour revue et synchronisation.'
      }
    },
    adminSettings: {
      eyebrow: 'Admin / Parametres',
      title: 'Informations essentielles de l instance.',
      description: 'Consultez le mode actif, l URL et les rappels avant la mise en ligne.',
      breadcrumb: 'Admin / Parametres',
      status: {
        unconfigured: 'non configure',
        error: 'erreur de configuration env'
      },
      hero: {
        kicker: 'Instance actuelle',
        title: 'Peu d informations, mais celles qui evitent des erreurs avant le lancement.',
        body: 'Ici on ne debogue pas minute par minute. On verifie environnement, URL et prerequis.'
      },
      stats: {
        mode: 'Mode',
        url: 'URL'
      },
      checks: {
        kicker: 'Rappels',
        title: 'Ce qu il faut verifier avant la mise en ligne',
        item1: {
          title: 'Identifiants et secrets reels',
          body: 'Cette instance requiert des identifiants reels, une base configuree et des secrets valides.'
        },
        item2: {
          title: 'Migrations et stockage',
          body: 'Avant la mise en ligne, verifiez migrations, seed controle, stockage media et tests smoke.'
        }
      }
    },
    adminAudit: {
      eyebrow: 'Admin / Audit',
      title: 'Historique des actions',
      description:
        'Les etapes qui ont modifie fiches, roles et donnees admin restent visibles pour reconstruire ce qui s est passe.',
      breadcrumb: 'Admin / Audit',
      hero: {
        kicker: 'Memoire du systeme',
        title: 'Chaque etape importante doit laisser une trace lisible.',
        body: 'Cette timeline aide a comprendre qui a change quoi, quand, et avec les details minimum.'
      },
      stats: {
        events: 'Evenements affiches',
        latest: 'Derniere activite',
        none: 'Aucune'
      },
      recent: {
        kicker: 'A lire en premier',
        title: 'Derniers mouvements',
        empty: 'Aucune action enregistree.'
      },
      table: {
        caption: 'Historique des actions',
        empty: 'Aucune action enregistree.',
        action: 'Action',
        actor: 'Acteur',
        details: 'Details',
        when: 'Quand'
      },
      payload: {
        none: 'Aucun detail supplementaire.'
      }
    },
    adminMedia: {
      hero: {
        kicker: 'Nouvel asset',
        title: 'Lier une image ou un fichier a une fiche existante.',
        body: 'Remplissez les champs essentiels et utilisez un alt text pour garder le media lisible hors preview.'
      },
      form: {
        validation: 'Il faut au moins une fiche liee et une URL valide.',
        creating: 'Ajout du media...',
        error: 'Impossible d ajouter ce media.',
        created: 'Media ajoute.',
        entry: 'Fiche liee',
        entryPlaceholder: 'Selectionner une fiche',
        kind: 'Type de media',
        kindPlaceholder: 'image, video, audio…',
        url: 'URL du media',
        urlPlaceholder: 'https://…',
        alt: 'Texte alternatif',
        altPlaceholder: 'Decrire ce qui est vu ou entendu',
        submit: 'Ajouter un asset'
      },
      checks: {
        kicker: 'Controle rapide',
        title: 'Ce qu il faut corriger en premier',
        visible: 'Assets visibles',
        missingAlt: 'Alt text manquants',
        item1: {
          title: 'Commencer par les assets sans description',
          body: 'Ce sont ceux qui degradent le plus vite lisibilite et accessibilite.'
        },
        item2: {
          title: 'Gardez le type media propre',
          body: 'Utilisez des etiquettes courtes et coherentes pour garder la liste lisible.'
        }
      },
      card: {
        missingAlt: 'Alt text a ajouter',
        entryId: 'Fiche liee: {id}',
        noDescription: 'Aucune description disponible.'
      }
    },
    entryActions: {
      kicker: 'Actions rapides',
      addFavorite: 'Ajouter aux favoris',
      removeFavorite: 'Retirer le favori',
      sendToReview: 'Envoyer en revue',
      submitting: 'Envoi...',
      submitted: 'Fiche envoyee en revue.',
      error: 'Erreur pendant l envoi.'
    },
    taxonomyExplorer: {
      kicker: 'Explorateur taxonomique',
      title: 'Groupes et familles conceptuelles',
      placeholder: 'Rechercher un groupe ou un terme...',
      selected: 'Groupe selectionne',
      openPage: 'Ouvrir la page dediee',
      empty: 'Aucun groupe ne correspond a cette recherche.'
    },
    collectionsPage: {
      eyebrow: 'Curation',
      title: 'Parcours de lecture qui mettent les fiches en relation.',
      description:
        'Les collections rapprochent des materiaux qui dialoguent par theme, lieu ou angle critique. Ce sont des itineraires deja composes.',
      actions: {
        archive: 'Ouvrir l archive',
        map: 'Aller a la carte'
      },
      empty: 'Aucun parcours disponible pour le moment.',
      cardKicker: 'Parcours',
      detail: {
        back: 'Retour aux collections',
        openMap: 'Ouvrir la carte filtree',
        path: 'Parcours',
        connected: 'Fiches connectees',
        chainTitle: 'Une chaine visible entre les fiches',
        cardsCount: '{count} fiches'
      }
    },
    mapPage: {
      title: 'Partir du territoire, puis laisser les taxonomies resserrer le champ.',
      description: 'Chaque point ouvre un apercu de fiche, chaque filtre clarifie une famille esthetique, et chaque selection devient un chemin dans l archive.',
      collectionTitle: '{title} · vue carte',
      collectionDescription: 'Cette carte est deja filtree sur les fiches incluses dans la collection selectionnee.',
      empty: 'La carte n a pas encore de fiches a afficher.'
    },
    mapExplorer: {
      errors: {
        load: 'La librairie cartographique ne peut pas etre chargee. Verifiez le navigateur ou les politiques de contenu.'
      },
      fallback: {
        place: 'Lieu en cours',
        period: 'Periode en cours'
      },
      hero: {
        kicker: 'Vue carte',
        title: 'Partir d un lieu, puis filtrer le champ par taxonomie.',
        body: 'La carte ouvre les fiches par type de contenu, theme, format, know-how, pays et annee. Selectionnez un point, lisez l apercu puis ouvrez la fiche.'
      },
      stats: {
        visible: 'Fiches visibles',
        featured: 'A la une',
        year: 'Annee'
      },
      filters: {
        searchPlaceholder: 'Titre, lieu, theme…',
        searchAria: 'Rechercher dans la carte',
        countryAria: 'Filtrer par pays',
        typeAria: 'Filtrer par type de contenu',
        themeAria: 'Filtrer par theme',
        formatAria: 'Filtrer par format',
        knowHowAria: 'Filtrer par know-how',
        allYears: 'Toutes les annees',
        allCountries: 'Tous les pays',
        allTypes: 'Tous les types',
        allThemes: 'Tous les themes',
        allFormats: 'Tous les formats',
        allKnowHow: 'Tous les know-how',
        queryChip: 'Requete · retirer',
        remove: 'retirer',
        none: 'Aucun filtre actif'
      },
      year: {
        kicker: 'Annee',
        body: 'Parcourez le temps sans quitter la carte.',
        reset: 'Reinitialiser l annee'
      },
      preview: {
        kicker: 'Fiche selectionnee',
        title: 'Panneau d apercu',
        results: '{count} resultats',
        featured: 'A la une',
        place: 'Lieu',
        period: 'Periode',
        open: 'Ouvrir la fiche',
        moreCountry: 'Plus de ce pays',
        empty: 'Selectionnez un point sur la carte pour lire l apercu.'
      },
      list: {
        kicker: 'Fiches visibles',
        title: 'Ouvrir une fiche directement',
        reset: 'Reinitialiser',
        empty: 'Aucune fiche ne correspond aux filtres actifs.'
      }
    },
    adminCollections: {
      eyebrow: 'Pile curatoriale',
      title: 'Gestion des collections',
      description: 'Surveillez les parcours curatoriaux, la densite des sections et la couverture des fiches.',
      breadcrumb: 'Administration / Collections',
      table: {
        caption: 'Collections curees',
        empty: 'Aucune collection disponible.',
        collection: 'Collection',
        summary: 'Synthese',
        entries: 'Fiches',
        sections: 'Sections'
      }
    },
    terms: {
      eyebrow: 'Cadre editorial',
      title: 'Conditions d utilisation',
      description: 'La reutilisation du corpus et des contributions doit preserver contexte, sources et mandat editorial.',
      items: {
        contributions: {
          title: 'Contributions',
          body: 'Les contenus soumis doivent respecter objectifs de recherche, exactitude des sources, droits d auteur et contexte.'
        },
        moderation: {
          title: 'Moderation',
          body: 'L equipe editoriale peut demander des revisions, rejeter ou archiver des materiaux non conformes au mandat.'
        },
        reuse: {
          title: 'Reutilisation',
          body: 'L usage des donnees publiques et des materiaux editoriaux doit citer ANTICORES et preserver le contexte.'
        }
      }
    },
    accessibility: {
      eyebrow: 'Accessibilite',
      title: 'Accessibilite',
      description: 'ANTICORES traite lisibilite et accessibilite comme structurelles, pas comme ajout final.',
      items: {
        baseline: {
          title: 'Baseline active',
          body: 'Interfaces responsives, navigation clavier, structure semantique et contraste lisible font partie de la base.'
        },
        inProgress: {
          title: 'Travail en cours',
          body: 'Nous renforcons les controles WCAG pour la carte, les formulaires complexes, les etats de focus et les pages denses.'
        }
      }
    },
    contact: {
      eyebrow: 'Nous contacter',
      title: 'Nous contacter',
      description: 'Pour questions editoriales, collaborations ou acces aux donnees, ecrivez a atlas@incursivefashionheritage.com.',
      info: {
        email: 'Email editorial',
        topics: 'Themes',
        topicsBody: 'Curation, review, donnees, recherche et partenariats culturels.',
        response: 'Delai de reponse',
        responseBody: 'Habituellement sous 3–5 jours ouvrables.',
        quick: 'Envoi rapide',
        quickBody: 'Le bouton ouvre votre client email avec un message deja adresse.'
      },
      form: {
        name: 'Nom',
        namePlaceholder: 'Nom complet…',
        email: 'Email',
        emailPlaceholder: 'nom@domaine.com…',
        subject: 'Sujet',
        subjectPlaceholder: 'De quoi voulez-vous parler ?',
        message: 'Message',
        messagePlaceholder: 'Ecrivez votre message ici…',
        send: 'Envoyer'
      }
    },
    auth: {
      login: {
        kicker: 'Authentification',
        title: 'Entrez dans ANTICORES.',
        lead: 'Ici, contributeurs, editeurs et admins reviennent aux fiches en cours.',
        notice: 'L acces est personnel et les permissions suivent le role attribue.',
        error: 'Identifiants invalides. Reessayez.',
        form: {
          kicker: 'Se connecter',
          title: 'Bon retour',
          email: 'Email',
          emailPlaceholder: 'nom@domaine.com…',
          password: 'Mot de passe',
          passwordPlaceholder: 'Entrez votre mot de passe…',
          submit: 'Se connecter',
          loading: 'Connexion…',
          forgot: 'Mot de passe oublie ?',
          noAccount: 'Pas encore de compte ?',
          register: 'S inscrire'
        }
      },
      register: {
        kicker: 'Inscription',
        title: 'Ouvrez votre acces.',
        lead: 'Vous entrez comme contributeur. Les roles editoriaux ou admin sont assignes plus tard.',
        error: 'Erreur lors de l inscription.',
        network: 'Erreur reseau. Reessayez.',
        form: {
          displayName: 'Nom affiche',
          email: 'Email',
          password: 'Mot de passe',
          submit: 'Creer le compte',
          loading: 'Creation…',
          hasAccount: 'Deja un compte ?',
          signIn: 'Se connecter'
        }
      },
      verify: {
        eyebrow: 'Activation',
        title: 'Vérifiez votre e-mail',
        description: "Consultez votre boîte mail et confirmez le lien pour activer votre profil."
      },
      forgot: {
        eyebrow: 'Recuperation de compte',
        title: 'Recuperation du mot de passe',
        description: 'Entrez l email associe au profil pour recevoir un lien de reinitialisation.',
        emailPlaceholder: 'Email du compte',
        submit: 'Envoyer le lien'
      },
      reset: {
        eyebrow: 'Reinitialisation',
        title: 'Definir un nouveau mot de passe',
        description: 'Choisissez un nouveau mot de passe pour revenir dans votre compte.',
        newPassword: 'Nouveau mot de passe',
        confirmPassword: 'Confirmer le mot de passe',
        submit: 'Mettre a jour'
      }
    },
    submitNew: {
      eyebrow: 'Nouvelle fiche',
      title: 'Clarifiez le contenu avant de soumettre.',
      description:
        'Transformez notes, sources et signaux en fiche lisible. Quelques etapes, bien faites: titre, contexte, mots-cles et synthese.',
      breadcrumb: 'Contributeur / Nouvelle fiche',
      actions: {
        back: 'Retour a vos fiches',
        archive: 'Ouvrir l archive'
      }
    },
    submitForm: {
      steps: {
        0: { label: 'Definir la fiche', description: 'Titre, slug, resume et texte principal.' },
        1: { label: 'Lieu et temps', description: 'Pays, lieu, langue et periode.' },
        2: { label: 'Ajouter des medias', description: 'Rassembler les visuels qui aident a lire la fiche.' },
        3: { label: 'Choisir la taxonomie', description: 'Termes qui aident a trouver et comparer la fiche.' },
        4: { label: 'Relire et sauvegarder', description: 'Verifier les points cles et sauvegarder le brouillon.' }
      },
      stepLabel: 'Etape {step}',
      stepReady: 'Pret',
      stepTodo: 'A faire',
      errors: {
        slug: 'Ajoutez un slug lisible et stable.',
        title: 'Ajoutez un titre editorial clair.',
        abstract: 'Un resume court est requis.',
        description: 'Une description critique plus longue est requise.',
        country: 'Selectionnez au moins un pays.',
        period: 'Definissez une periode.',
        taxonomy: 'Selectionnez au moins un terme taxonomique.',
        source: 'Expliquez d ou vient le materiel.',
        summary: 'Terminez avec une synthese utile pour la review.',
        createDraft: 'Impossible de creer le brouillon.',
        updateDraft: 'Impossible de mettre a jour le brouillon.',
        openDraft: 'Impossible d ouvrir le brouillon.'
      },
      status: {
        resumedServer: 'Brouillon serveur repris le {date}.',
        resumedLocal: 'Brouillon local repris le {date}.',
        autosaveFailed: 'Autosauvegarde echouee: {reason}.',
        retry: 'reessayez bientot',
        savedServer: 'Brouillon sauvegarde dans votre profil. Vous pouvez continuer ou reprendre plus tard.',
        missingBeforeSave: 'Completer les champs manquants avant de sauvegarder.',
        savingDraft: 'Sauvegarde du brouillon...',
        updatingServer: 'Mise a jour du brouillon dans votre profil...',
        openingServer: 'Ouverture d un brouillon dans votre profil...',
        openedServer: 'Brouillon ouvert dans votre profil. Vous pouvez le reprendre quand vous voulez.',
        openedServerContinue: 'Brouillon ouvert dans votre profil. Vous pouvez continuer sans perdre le travail.',
        completeRequired: 'Completez les champs requis avant de passer a l etape suivante.',
        error: 'Erreur: {reason}',
        saveFailed: 'sauvegarde echouee',
        localRemovedServer: 'Copie locale retiree. Le brouillon de profil reste disponible.',
        localCleared: 'Brouillon local efface. Vous pouvez recommencer.',
        updatedServerTime: 'Brouillon du profil mis a jour a {time}.',
        updatedLocalTime: 'Brouillon local mis a jour a {time}.'
      },
      fields: {
        slug: { label: 'Slug', hint: 'Court, clair, facile a retrouver.' },
        title: { label: 'Titre editorial', hint: 'Clair et concret. Evitez les formules abstraites.' },
        abstract: { label: 'Resume', hint: 'Trois ou quatre phrases pour dire de quoi il s agit et pourquoi cela compte.' },
        description: {
          label: 'Texte principal',
          hint: 'Elargissez le contexte: pratiques, images, references, tensions, relevance culturelle.'
        },
        language: { label: 'Langue canonique' },
        country: { label: 'Pays', placeholder: 'Selectionner...' },
        place: { label: 'Lieu ou noeud', hint: 'Ville, quartier, scene locale ou noeud reconnaissable.' },
        period: {
          label: 'Periode',
          hint: 'Ecrivez-le comme vous le liriez dans une fiche publique.',
          placeholder: 'ex. 2019-2024'
        },
        keywords: {
          label: 'Mots-cles',
          placeholder: 'artisanat numerique, memoire visuelle',
          hint: 'Separez par des virgules.'
        },
        source: {
          label: 'D ou vient ce materiel',
          placeholder: 'Plateforme, communaute, projet, campagne...'
        },
        summary: {
          label: 'En deux ou trois lignes',
          hint: 'Ecrivez ce qu une personne doit comprendre en ouvrant la fiche.'
        }
      },
      media: {
        lead: 'Ajoutez des images ou videos utiles pour lire cette esthetique. Les fichiers restent en file pendant la saisie.',
        label: 'Importer images et videos',
        hint: 'Vous pouvez selectionner plusieurs fichiers et les affiner plus tard.',
        queue: 'File de medias',
        empty: 'Aucun fichier selectionne.'
      },
      taxonomy: {
        lead: 'Choisissez seulement les termes utiles pour lire la fiche. Mieux vaut peu de mots forts.'
      },
      summary: {
        kicker: 'Resume final',
        title: 'Titre',
        territory: 'Territoire',
        period: 'Periode',
        taxonomy: 'Taxonomies selectionnees',
        media: 'Medias en file',
        unknownCountry: 'Non defini',
        missingTitle: 'Pas encore defini',
        unknownPlace: 'Noeud non specifie',
        unknownPeriod: 'Non defini'
      },
      actions: {
        back: 'Retour',
        saveLater: 'Sauvegarder et continuer plus tard',
        openServer: 'Ouvrir le brouillon dans le profil',
        next: 'Continuer',
        save: 'Sauvegarder le brouillon',
        saving: 'Sauvegarde...'
      },
      progress: '{completed}/{total} etapes terminees',
      aside: {
        kicker: 'Brouillon en cours',
        title: 'Synthese toujours visible',
        titleLabel: 'Titre',
        missingTitle: 'Pas encore ecrit',
        slugLabel: 'Slug',
        missingSlug: 'Non defini',
        territoryLabel: 'Territoire',
        periodLabel: 'Periode',
        missingPeriod: 'Non defini',
        taxonomyLabel: 'Taxonomies',
        taxonomyCount: '{count} termes selectionnes',
        mediaLabel: 'Media',
        mediaCount: '{count} fichiers prets',
        mediaEmpty: 'Aucun fichier ajoute',
        keywordsLabel: 'Mots-cles',
        keywordsEmpty: 'Aucun mot-cle ajoute.',
        draftStatus: 'Statut du brouillon',
        serverStatus: 'Brouillon ouvert dans votre profil. Derniere mise a jour: {date}.',
        localStatus: 'Brouillon local mis a jour: {date}. Ouvrez un brouillon de profil pour le retrouver ailleurs.',
        localOnly: 'Vous ecrivez en local. Vous pouvez ouvrir un brouillon de profil plus tard.',
        clearLocal: 'Effacer le brouillon local'
      }
    },
    entry: {
      eyebrow: 'Fiche',
      breadcrumb: 'Explorer / Archive',
      actions: {
        map: 'Voir sur la carte',
        archive: 'Retour a l archive'
      },
      meta: {
        author: 'Auteur',
        country: 'Pays',
        timeframe: 'Periode',
        timeframeFallback: 'Periode en cours',
        place: 'Lieu',
        placeFallback: 'Lieu en cours',
        source: 'Contexte source',
        sourceFallback: 'Contexte en cours',
        metadata: 'Metadonnees',
        taxonomyCount: '{count} termes taxonomiques'
      },
      descriptionKicker: 'Description',
      taxonomyKicker: 'Metadonnees taxonomiques',
      taxonomyTitle: 'Signaux associes a cette fiche'
    },
    privacy: {
      eyebrow: 'Protection des donnees',
      title: 'Confidentialite',
      description:
        'ANTICORES traite uniquement ce qui est necessaire pour l authentification, la revue editoriale, la securite et la publication du corpus.',
      items: {
        collected: {
          title: 'Donnees collectees',
          body: 'Nous traitons le minimum de donnees necessaires aux contributions, a la revue editoriale, a l authentification et a la securite.'
        },
        public: {
          title: 'Donnees publiques',
          body: 'Les jeux de donnees publics evitent les informations sensibles et privilegient contenus editoriaux et metadonnees culturelles.'
        },
        requests: {
          title: 'Droits et demandes',
          body: 'Pour les demandes GDPR ou clarifications, contactez atlas@incursivefashionheritage.com.'
        }
      }
    }
  }
};
