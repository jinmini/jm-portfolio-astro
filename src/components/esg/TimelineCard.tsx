import React from 'react';
import type { CollectionEntry } from 'astro:content';

type TimelineItem = CollectionEntry<'esg'>['data'] & {
  id: string;
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

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl p-8 shadow-sm transition-all duration-300 w-full hover:shadow-lg hover:-translate-y-1 hover:border-sky-500">
        <div className="flex justify-between items-start mb-4 gap-4">
          <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">{item.period}</div>
          <div className="text-sm font-semibold flex items-center gap-1 text-sky-600 dark:text-blue-400">
            {getCategoryIcon(item.category)} {item.category}
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight flex-1 mb-4">
          {item.title}
        </h3>

        <p
          className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: item.description }}
        ></p>

        {item.impact && (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-50 dark:bg-slate-900 border border-sky-200 dark:border-slate-700 rounded-3xl text-sm text-sky-900 dark:text-blue-400 font-semibold mt-2">
            <span className="text-base">📊</span>
            {item.impact}
          </div>
        )}

        {item.isHighlight && (
          <div className="mt-4">
            <button
              onClick={onToggleExpand}
              className="text-sky-600 dark:text-blue-400 hover:text-sky-800 dark:hover:text-blue-300 text-sm font-medium transition-colors"
            >
              {isExpanded ? '간략히 보기 ▲' : '자세히 보기 ▼'}
            </button>

            {isExpanded && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                {item.role && (
                  <div className="mb-3">
                    <strong className="text-slate-900 dark:text-slate-100">역할:</strong>
                    <span className="text-slate-600 dark:text-slate-300 ml-2">{item.role}</span>
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineCard;
