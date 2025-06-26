import React, { useState, useMemo, useCallback } from 'react';
import type { CollectionEntry } from 'astro:content';
import CategoryTabs from './CategoryTabs';
import TimelineCard from './TimelineCard';
import KPICard from './KPICard';

type EsgItemProp = {
  id: string;
  slug: string;
  body: string;
  data: CollectionEntry<'esg'>['data'];
};

interface ESGTimelineProps {
  items: EsgItemProp[];
}

type TimelineItem = CollectionEntry<'esg'>['data'] & {
  id: string;
  slug: string;
  description: string;
};

type KpiItem = {
  title: string;
  category: 'E' | 'S' | 'G';
  impact?: string;
  period: string;
  role?: string;
  emphasis: 'extra-high' | 'high' | 'normal';
  thumbnail?: string;
  slug: string;
};

const ESGTimeline: React.FC<ESGTimelineProps> = ({ items: allItems }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'E' | 'S' | 'G'>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const getCategoryIcon = (category: string) => {
    if (category === 'E') return '🌱';
    if (category === 'S') return '👥';
    if (category === 'G') return '🏛️';
    return '';
  };
  
  const toggleExpanded = useCallback((id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const filteredTimelineItems: TimelineItem[] = useMemo(() => {
    if (activeTab === 'all') return [];
    return allItems
      .filter(item => item.data.category === activeTab)
      .sort((a, b) => parseInt(b.data.year) - parseInt(a.data.year))
      .map(item => ({
        ...item.data,
        id: item.id,
        slug: item.slug,
        description: item.body,
      }));
  }, [activeTab, allItems]);

  const kpiItems: KpiItem[] = useMemo(() => {
    const specialEmphasisSlugs = ['e1', 'e3', 'g1', 's3'];
    
    // 일관된 순서를 위한 정렬
    const sortedEntries = allItems.sort((a, b) => {
      if (a.data.year !== b.data.year) {
        return parseInt(b.data.year) - parseInt(a.data.year);
      }
      return a.slug.localeCompare(b.slug);
    });

    let highEmphasisCounter = 0;
    return sortedEntries.map(entry => {
      let emphasis: 'extra-high' | 'high' | 'normal' = 'normal';
      if (specialEmphasisSlugs.includes(entry.slug)) {
        // 4개의 강조 카드에 두 가지 다른 큰 크기를 번갈아 적용
        emphasis = highEmphasisCounter < 2 ? 'extra-high' : 'high';
        highEmphasisCounter++;
      }

      return {
        title: entry.data.title,
        category: entry.data.category,
        impact: entry.data.impact,
        period: entry.data.period,
        role: entry.data.role,
        emphasis: emphasis,
        thumbnail: entry.data.thumbnail,
        slug: entry.slug,
      };
    });
  }, [allItems]);

  return (
    <section className="w-full mx-auto">
      {/* 타이틀 섹션 */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-center gap-3">
          <span className="text-4xl">🌟</span>
          ESG 활동 연혁
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          환경(E), 사회(S), 지배구조(G) 각 영역에서의 전문적인 프로젝트와 성과
        </p>
      </div>
      
      <CategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'all' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-4 gap-4 md:gap-6 auto-rows-[240px] [grid-auto-flow:dense]">
          {kpiItems.slice(0, 12).map(item => (
            <KPICard key={item.slug} item={item} />
          ))}
        </div>
      ) : (
        <div className="w-full flex justify-center">
          <div className="relative">
            <div className="absolute left-[66px] top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
            {filteredTimelineItems.map((item, index) => (
              <TimelineCard
                key={item.id}
                item={item}
                isExpanded={expandedItems.has(item.id)}
                onToggleExpand={() => toggleExpanded(item.id)}
                index={index}
                getCategoryIcon={getCategoryIcon}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ESGTimeline;
