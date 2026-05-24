// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://ab-psych.com.au',
  trailingSlash: 'always',
  output: 'static', // pages prerendered by default; Keystatic admin opts out via injectRoute prerender:false
  adapter: netlify(),
  build: {
    format: 'directory', // /about/ instead of /about.html — preserves current URL structure
  },
  integrations: [
    react(),
    keystatic(),
    sitemap(),
  ],
});
