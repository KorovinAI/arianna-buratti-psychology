// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Plain static Astro site, deployed to Netlify.
// Content lives in src/content/site/general.yml and src/content/issues/*.yml;
// pages read from those via Astro's content collections. Edit those files in
// GitHub (or locally) to change content; Netlify rebuilds on push.

export default defineConfig({
  site: 'https://ab-psych.com.au',
  trailingSlash: 'always',
  output: 'static',
  build: {
    format: 'directory', // /about/ instead of /about.html — preserves current URL structure
  },
  integrations: [sitemap()],
});
