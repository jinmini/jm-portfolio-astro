import { useState } from 'react';

interface AccordionItem {
  id: string;
  title: string;
  icon: string;
  items: string[];
}

const accordionData: AccordionItem[] = [
  {
    id: 'expertise',
    title: 'ESG 전문성',
    icon: '📜',
    items: [
      '환경에너지공학과 학사 졸업',
      '온실가스 전문인력 양성과정 수료',
      'ESG 경영지원 보고서 자동화 과정 진행 중'
    ]
  },
  {
    id: 'development',
    title: '개발 역량',
    icon: '💻',
    items: [
      'FastAPI 기반 확장성 높은 API/MSA 설계',
      'React/TS 기반 재사용 가능한 UI 컴포넌트 구축',
      'LLM 기반 AI Agent 솔루션 개발'
    ]
  },
  {
    id: 'teamwork',
    title: '팀워크',
    icon: '🤝',
    items: [
      'Notion기반 팀 워크스페이스 활용 가능',
      'Slack으로 실시간 업무 대응 가능',
      'GitHub 기반 코드 협업'
    ]
  }
];

export default function ImpactAccordion() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  const isAnyItemOpen = openItem !== null;

  return (
    <div className={`grid grid-cols-1 ${isAnyItemOpen ? '' : 'lg:grid-cols-3'} gap-4 sm:gap-6 py-8`}>
      {accordionData.map((item) => {
        const isOpen = openItem === item.id;
        
        const baseStyles = 'bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl border border-white/30 dark:border-gray-700/30 overflow-hidden transition-all duration-300 hover:bg-white/30 dark:hover:bg-gray-800/30';

        let layoutStyles = '';
        if (isAnyItemOpen) {
          if (isOpen) {
            layoutStyles = 'col-span-1 lg:col-span-3';
          } else {
            layoutStyles = 'hidden';
          }
        } else {
          layoutStyles = 'col-span-1';
        }

        return (
          <div
            key={item.id}
            className={`${baseStyles} ${layoutStyles}`}
          >
            {/* 아코디언 헤더 */}
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl sm:text-3xl">{item.icon}</span>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                  {item.title}
                </h3>
              </div>
              <svg
                className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* 아코디언 콘텐츠 */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-1">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-3 sm:p-4">
                  <ul className="space-y-2 sm:space-y-3">
                    {item.items.map((listItem, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-600 dark:bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                          {listItem}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 