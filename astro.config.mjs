// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://ab-psych.com.au',
  trailingSlash: 'always',
  build: {
    format: 'directory', // /about/ instead of /about.html — preserves current URL structure
  },
  integrations: [sitemap()],
});
