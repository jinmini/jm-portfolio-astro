// @ts-check
import { defineConfig } from 'astro/config';
import rehypeSlug from 'rehype-slug';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://jm-portfolio-astro.vercel.app',
  
  integrations: [
    react(),
    mdx({
      rehypePlugins: [rehypeSlug],
    }),
    tailwind(),
    icon()
  ],

  markdown: {
    rehypePlugins: [rehypeSlug],
  },

  output: 'static',

  server: {
    port: 4322,
    host: true
  }
});