import React from 'react';
import type { CollectionEntry } from 'astro:content';

type TimelineItem = CollectionEntry<'esg'>['data'] & {
  id: string;
  slug: string;
  description: string;
};

interface TimelineCardProps {
  item: TimelineItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
  index: number;
  getCategoryIcon: (category: string) => string;
}

const TimelineCard: React.FC<TimelineCardProps> = ({
  item,
  isExpanded,
  onToggleExpand,
  index,
  getCategoryIcon,
}) => {
  return (
    <div
      id={`esg-item-${item.slug}`}
      className="relative pl-[120px] mb-16 flex items-start opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${(index + 1) * 0.1}s` }}
    >
      <div className="absolute left-0 top-0 w-20 text-2xl font-bold text-sky-500 dark:text-blue-400 text-right pr-5">
        {item.year}
      </div>

      <div
        className="absolute w-2.5 h-2.5 rounded-full bg-sky-500 z-10 shadow-[0_0_0_3px_white] dark:shadow-[0_0_0_3px_#0f172a]"
        style={{ left: '56px', top: '8px' }}
      ></div>

      <div 
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-sky-500 flex flex-col"
        style={{
          minHeight: '279px',
          height: isExpanded ? 'auto' : '279px'
        }}
      >
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-3 gap-4">
            <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">{item.period}</div>
            <div className="text-sm font-semibold flex items-center gap-1 text-sky-600 dark:text-blue-400">
              {getCategoryIcon(item.category)} {item.category}
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight mb-3 line-clamp-2">
            {item.title}
          </h3>

          <p
            className={`text-slate-600 dark:text-slate-400 leading-relaxed mb-3 text-sm ${!isExpanded ? 'line-clamp-3' : ''} overflow-hidden`}
            dangerouslySetInnerHTML={{ __html: item.description }}
          ></p>

          {item.impact && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-50 dark:bg-slate-900 border border-sky-200 dark:border-slate-700 rounded-3xl text-xs text-sky-900 dark:text-blue-400 font-semibold mb-3 self-start">
              <span className="text-sm">📊</span>
              <span className={!isExpanded ? 'line-clamp-1' : ''}>{item.impact}</span>
            </div>
          )}

          {item.isHighlight && (
            <div className="mt-auto">
              <button
                onClick={onToggleExpand}
                className="text-sky-600 dark:text-blue-400 hover:text-sky-800 dark:hover:text-blue-300 text-sm font-medium transition-colors"
              >
                {isExpanded ? '간략히 보기 ▲' : '자세히 보기 ▼'}
              </button>
            </div>
          )}
        </div>

        {isExpanded && item.isHighlight && (
          <div className="px-6 pb-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              {item.role && (
                <div className="mb-3">
                  <strong className="text-slate-900 dark:text-slate-100">역할:</strong>
                  <span className="text-slate-600 dark:text-slate-300 ml-2 text-sm">{item.role}</span>
                </div>
              )}

              {item.techStack && (
                <div className="mb-3">
                  <strong className="text-slate-900 dark:text-slate-100">기술 스택:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.techStack.map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.achievements && (
                <div>
                  <strong className="text-slate-900 dark:text-slate-100">주요 성과:</strong>
                  <ul className="list-disc pl-5 mt-2 text-slate-600 dark:text-slate-300 text-sm">
                    {item.achievements.map((achievement: string, i: number) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineCard;
