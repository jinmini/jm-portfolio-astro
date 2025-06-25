import React from 'react';
import type { CollectionEntry } from 'astro:content';

interface BlogCardProps {
  blog: CollectionEntry<'blog'>;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const { slug, data } = blog;
  const { title, description, date, category, thumbnail } = data;

  return (
    <a href={`/blog/${slug}`} className="group relative flex flex-col rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
      {/* 이미지 영역 */}
      {thumbnail && (
        <div className="relative aspect-video overflow-hidden">
          <img src={thumbnail} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent"></div>
        </div>
      )}

      {/* 컨텐츠 영역 */}
      <div className="p-6 flex flex-col flex-grow">
        {category && <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">{category}</span>}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow mb-4">{description}</p>
        <time dateTime={date.toISOString()} className="text-sm text-gray-500 dark:text-gray-400 mt-auto">
          {new Date(date).toLocaleDateString('ko-KR')}
        </time>
      </div>
    </a>
  );
}; 