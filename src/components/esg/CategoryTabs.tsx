import React from 'react';

type Tab = 'all' | 'E' | 'S' | 'G';

interface CategoryTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TABS: { id: Tab; label: string; icon?: string }[] = [
  { id: 'all', label: 'KPI' },
  { id: 'E', label: 'Environment', icon: '🌱' },
  { id: 'S', label: 'Social', icon: '👥' },
  { id: 'G', label: 'Governance', icon: '🏛️' },
];

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex justify-center gap-2 mb-12 flex-wrap">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`px-6 py-3 border-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 flex items-center gap-2 ${
            activeTab === tab.id
              ? 'bg-slate-800 dark:bg-blue-600 text-white border-slate-800 dark:border-blue-600'
              : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-600'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon && <span className="text-lg">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
