import React, { useState, useMemo, useCallback } from 'react';
import type { CollectionEntry } from 'astro:content';
import CategoryTabs from './CategoryTabs';
import TimelineCard from './TimelineCard';

type TimelineItem = CollectionEntry<'esg'>['data'] & {
  id: string;
  description: string;
};

interface ESGTimelineProps {
  data: TimelineItem[];
}

const ESGTimeline: React.FC<ESGTimelineProps> = ({ data: timelineData }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'E' | 'S' | 'G'>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = useCallback((id: string) => {
    setExpandedItems(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return newExpanded;
    });
  }, []);

  const filteredData = useMemo(() => {
    if (activeTab === 'all') {
      return timelineData.filter((item: TimelineItem) => item.isHighlight);
    }
    return timelineData.filter((item: TimelineItem) => item.category === activeTab);
  }, [activeTab, timelineData]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'E':
        return '🌱';
      case 'S':
        return '👥';
      case 'G':
        return '🏛️';
      default:
        return '';
    }
  };

  const getCategoryColor = (category: string) => {
    // 모든 카테고리에 통일된 파란색 계열 사용
    return '#0ea5e9';
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 px-4">
      <h2 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100 flex items-center justify-center gap-2">
        <span className="text-3xl">🌟</span>
        ESG 활동 연혁
      </h2>
      <p className="text-center text-slate-600 dark:text-slate-400 mb-12 text-lg">
        환경(E), 사회(S), 지배구조(G) 각 영역에서의 전문적인 프로젝트와 성과
      </p>
      
      <CategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="relative py-8">
        <div className="absolute left-[60px] top-0 bottom-0 w-px bg-sky-500 opacity-30 dark:opacity-20"></div>
        
        {filteredData.map((item, index) => (
          <TimelineCard 
            key={item.id}
            item={item}
            index={index}
            isExpanded={expandedItems.has(item.id)}
            onToggleExpand={() => toggleExpanded(item.id)}
            getCategoryIcon={getCategoryIcon}
          />
        ))}
      </div>
    </div>
  );
};

export default ESGTimeline;
