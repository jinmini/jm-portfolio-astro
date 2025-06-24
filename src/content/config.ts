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
    site: z.string().optional()
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

export const collections = { project, blog }; 