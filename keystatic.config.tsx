import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  // In production, switch storage.kind to 'github' and add repo info.
  // For local dev and initial content authoring, 'local' writes to disk.
  storage: {
    kind: 'local',
  },

  ui: {
    brand: { name: 'Arianna Buratti Psychology' },
  },

  singletons: {
    // -- Global site settings --
    siteSettings: singleton({
      label: 'Site Settings',
      path: 'src/content/site-settings',
      schema: {
        siteName: fields.text({ label: 'Site name', defaultValue: 'Arianna Buratti — Psychologist' }),
        siteUrl: fields.url({ label: 'Site URL', defaultValue: 'https://ab-psych.com.au' }),
        phone: fields.text({ label: 'Phone (display)', defaultValue: '0490 786 047' }),
        phoneLink: fields.text({ label: 'Phone (tel: link)', defaultValue: '0490786047', description: 'No spaces or hyphens' }),
        email: fields.text({ label: 'Email', defaultValue: 'info@ab-psych.com.au' }),
        addressLine1: fields.text({ label: 'Address (line 1)', defaultValue: '165–167 Drummond Street' }),
        addressLine2: fields.text({ label: 'Address (line 2)', defaultValue: 'Carlton VIC 3053' }),
        hours: fields.text({ label: 'Opening hours (display)', defaultValue: 'Monday – Saturday, 9:00am – 8:00pm' }),
        linkedinUrl: fields.url({ label: 'LinkedIn URL', defaultValue: 'https://www.linkedin.com/in/ariannaburatti/' }),
        credentials: fields.text({ label: 'Credentials line (footer)', defaultValue: 'AHPRA Registered • MAPS' }),
      },
    }),

    // -- Fees (single source of truth, used on /fees/ and /telehealth/ and schema.org) --
    fees: singleton({
      label: 'Fees',
      path: 'src/content/fees',
      schema: {
        sessionFee: fields.text({ label: 'Session fee (display, e.g. "$220")', defaultValue: '$220' }),
        medicareRebate: fields.text({ label: 'Medicare rebate (display, e.g. "$98.97")', defaultValue: '$98.97' }),
        outOfPocket: fields.text({ label: 'Out-of-pocket (display, e.g. "$121.03")', defaultValue: '$121.03' }),
        cancellationNoticeHours: fields.number({ label: 'Cancellation notice required (hours)', defaultValue: 24 }),
      },
    }),

    // -- Home page hero --
    homeHero: singleton({
      label: 'Home — Hero',
      path: 'src/content/home-hero',
      schema: {
        title: fields.text({ label: 'Hero title', defaultValue: 'Psychologist in Carlton, Melbourne' }),
        subtitle: fields.text({ label: 'Hero subtitle', multiline: true, defaultValue: "Compassionate, evidence-based care for individuals and families. Providing a safe space to navigate life's challenges and build lasting wellbeing." }),
        primaryCtaLabel: fields.text({ label: 'Primary button label', defaultValue: 'Get in Touch' }),
        primaryCtaHref: fields.text({ label: 'Primary button URL', defaultValue: '/contact/' }),
        secondaryCtaLabel: fields.text({ label: 'Secondary button label', defaultValue: 'About My Approach' }),
        secondaryCtaHref: fields.text({ label: 'Secondary button URL', defaultValue: '/about/' }),
      },
    }),

    // -- About page bio --
    aboutBio: singleton({
      label: 'About — Bio',
      path: 'src/content/about-bio',
      schema: {
        name: fields.text({ label: 'Name', defaultValue: 'Arianna Buratti' }),
        credentialsLine: fields.text({ label: 'Credentials line', defaultValue: 'Registered Psychologist • MAPS • AHPRA' }),
        bio: fields.document({
          label: 'Bio (rich text)',
          formatting: { inlineMarks: { bold: true, italic: true }, blockTypes: { blockquote: true }, listTypes: { unordered: true } },
          links: true,
        }),
      },
    }),
  },

  collections: {
    // -- Services (6 items, one per service detail page + cards on home/services) --
    services: collection({
      label: 'Services',
      slugField: 'slug',
      path: 'src/content/services/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        slug: fields.slug({ name: { label: 'Slug' } }),
        order: fields.integer({ label: 'Sort order', defaultValue: 1 }),
        shortDescription: fields.text({ label: 'Short description (for cards)', multiline: true, validation: { isRequired: true } }),
        cardImage: fields.image({ label: 'Card image', directory: 'public/images', publicPath: '/images/' }),
        heroSubtitle: fields.text({ label: 'Hero subtitle' }),
        heroImage: fields.image({ label: 'Hero image', directory: 'public/images', publicPath: '/images/' }),
        body: fields.document({
          label: 'Body content',
          formatting: { inlineMarks: { bold: true, italic: true }, listTypes: { unordered: true, ordered: true }, headingLevels: [2, 3] },
          links: true,
        }),
      },
    }),

    // -- Therapeutic approaches (8 items) --
    approaches: collection({
      label: 'Approaches',
      slugField: 'slug',
      path: 'src/content/approaches/*',
      schema: {
        title: fields.text({ label: 'Approach name', validation: { isRequired: true } }),
        slug: fields.slug({ name: { label: 'Slug' } }),
        order: fields.integer({ label: 'Sort order', defaultValue: 1 }),
        description: fields.text({ label: 'Description', multiline: true, validation: { isRequired: true } }),
        bestFor: fields.text({ label: 'Best for (comma-separated)', multiline: true }),
      },
    }),

    // -- Issues I Help With (19 single-text items) --
    issues: collection({
      label: 'Issues I Help With',
      slugField: 'name',
      path: 'src/content/issues/*',
      schema: {
        name: fields.slug({ name: { label: 'Issue name' } }),
      },
    }),
  },
});
