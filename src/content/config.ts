import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Project 컬렉션 (프로젝트)
const project = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/project' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    thumbnail: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    links: z.object({
      github: z.string().optional(),
      site: z.string().optional()
    }).optional(),
    featured: z.boolean().default(false),
  }),
});

// Story 컬렉션 (블로그)
const story = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/story' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    thumbnail: z.string().optional(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    links: z.object({
      github: z.string().optional(),
      site: z.string().optional()
    }).optional(),
    featured: z.boolean().default(false),
    category: z.string(),
  }),
});

export const collections = { project, story }; 