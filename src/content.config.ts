import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Site settings — Sveltia CMS writes one YAML file per "singleton" to src/content/site/.
// Using glob(): each file in src/content/site/ becomes one entry, keyed by filename.
// e.g. general.yml → id "general", accessed via getEntry('site', 'general').
const site = defineCollection({
  loader: glob({ pattern: '*.yml', base: 'src/content/site' }),
  schema: z.object({
    site_name: z.string(),
    phone_display: z.string(),
    phone_tel: z.string(),
    email: z.string(),
    address_line_1: z.string(),
    address_line_2: z.string(),
    hours: z.string(),
    linkedin_url: z.string().url(),
    credentials: z.string(),
    fees: z.object({
      session_fee: z.string(),
      medicare_rebate: z.string(),
      out_of_pocket: z.string(),
    }),
  }),
});

// Issues I Help With — collection of small YAML files in src/content/issues/.
const issues = defineCollection({
  loader: glob({ pattern: '*.yml', base: 'src/content/issues' }),
  schema: z.object({
    name: z.string(),
    order: z.number().int().default(0),
  }),
});

export const collections = { site, issues };
