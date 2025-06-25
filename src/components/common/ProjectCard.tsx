import React from 'react';
import type { CollectionEntry } from 'astro:content';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

// Heroicons에 GitHub 아이콘이 없으므로 직접 정의합니다.
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
		<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
	</svg>
);

interface ProjectCardProps {
  project: CollectionEntry<'project'>;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { title, description, thumbnail, tags, links } = project.data;

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {links?.github && (
          <a href={links.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-sm hover:bg-white dark:hover:bg-black transition-colors" aria-label="GitHub">
            <GithubIcon className="w-5 h-5 text-gray-800 dark:text-white" />
          </a>
        )}
        {links?.site && (
          <a href={links.site} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-sm hover:bg-white dark:hover:bg-black transition-colors" aria-label="사이트">
            <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-800 dark:text-white" />
          </a>
        )}
      </div>

      <div className="relative aspect-video overflow-hidden rounded-t-2xl">
        {thumbnail && <img src={thumbnail} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent"></div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow mb-4">{description}</p>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 dark:text-blue-200 dark:bg-blue-900/50 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}; 