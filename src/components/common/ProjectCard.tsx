import React from 'react';
import type { CollectionEntry } from 'astro:content';

interface ProjectCardProps {
  project: CollectionEntry<'project'>;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { title, description, thumbnail, tags, links } = project.data;

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 card-hover">
      {/* 썸네일 이미지 */}
      <div className="relative h-48 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 image-blur-hover"></div>
        <div className="gradient-overlay"></div>
        
        {/* 호버 시 나타나는 링크들 */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 slide-up">
          {links?.github && (
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/90 text-gray-900 rounded-lg hover:bg-white transition-colors font-semibold"
            >
              GitHub
            </a>
          )}
          {links?.site && (
            <a
              href={links.site}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600/90 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              사이트
            </a>
          )}
        </div>
      </div>
      
      {/* 카드 내용 */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
          {description}
        </p>
        
        {/* 태그들 */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full hover:bg-blue-200 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* 우측 상단 화살표 아이콘 */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
        <svg
          className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 17L17 7M17 7H7M17 7V17"
          />
        </svg>
      </div>
    </div>
  );
}; 