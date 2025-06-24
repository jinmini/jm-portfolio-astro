import React from 'react';
import type { CollectionEntry } from 'astro:content';

interface BlogCardProps {
  blog: CollectionEntry<'blog'>;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const { title, description, thumbnail, date } = blog.data;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
      <a href={`/blog/${blog.id}`} className="block flex h-full flex-col">
        {/* 썸네일 이미지 */}
        <div className="relative h-48 flex-shrink-0 overflow-hidden bg-gradient-to-br from-green-400 to-blue-500">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-6xl text-white">
              📖
            </div>
          )}
        </div>

        {/* 카드 내용 */}
        <div className="flex flex-grow flex-col p-6">
          <div className="flex-grow">
            <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600 h-14 line-clamp-2">
              {title}
            </h3>
            <p className="mb-4 text-gray-600 line-clamp-2">{description}</p>
          </div>
          <span className="text-sm text-gray-500">
            {date.toLocaleDateString('ko-KR')}
          </span>
        </div>
      </a>
    </article>
  );
}; 