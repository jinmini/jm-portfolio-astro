import { defineCollection, z } from 'astro:content';

// 공통 베이스 스키마 (DRY 원칙)
const baseContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()),
  thumbnail: z.string().optional(),
  links: z.object({
    github: z.string().optional(),
    site: z.string().optional(),
    demo: z.string().optional()
  }).optional(),
  featured: z.boolean().default(false),
});

// Project 컬렉션 (프로젝트)
const project = defineCollection({
  type: 'content',
  schema: baseContentSchema,
});

// Story 컬렉션 (블로그) - category enum 추가
const blog = defineCollection({
  type: 'content', 
  schema: baseContentSchema.extend({
    category: z.string().default("미분류"), // 변경 자유로운 문자열 배열열
  }),
});

const esgCollection = defineCollection({
  type: 'content',
  schema: z.object({
    year: z.string(),
    period: z.string(),
    title: z.string(),
    category: z.enum(['E', 'S', 'G']),
    isHighlight: z.boolean().optional(),
    impact: z.string().optional(),
    thumbnail: z.string().optional(),
    role: z.string().optional(),
    techStack: z.array(z.string()).optional(),
    achievements: z.array(z.string()).optional(),
  }),
});

export const collections = { project, blog, esg: esgCollection }; 