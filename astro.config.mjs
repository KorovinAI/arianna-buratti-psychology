// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// NOTE: Keystatic + @astrojs/netlify temporarily disabled — they cause a known
// prerender-skip bug with Astro 5.18 that bundles all routes into the SSR
// function instead of emitting static HTML. The Keystatic config, schema, and
// dependencies are preserved in package.json + keystatic.config.tsx for the
// follow-up session that will fix the build issue and re-enable the admin UI.
//
// To re-enable Keystatic: add back `react()`, `keystatic()`, `netlify()` to
// integrations + adapter, and restore output: 'server' with prerender exports.

export default defineConfig({
  site: 'https://ab-psych.com.au',
  trailingSlash: 'always',
  output: 'static',
  build: {
    format: 'directory', // /about/ instead of /about.html — preserves current URL structure
  },
  integrations: [sitemap()],
});
