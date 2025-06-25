// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    mdx(),
    tailwind()
  ],

  output: 'static',

  server: {
    port: 4322,
    host: true
  }
});