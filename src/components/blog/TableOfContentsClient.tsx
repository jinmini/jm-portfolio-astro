import { useEffect, useState } from 'react';

interface TocHeading {
  depth: number;
  slug: string;
  text: string;
}

interface TableOfContentsClientProps {
  headings: TocHeading[];
}

export default function TableOfContentsClient({ headings }: TableOfContentsClientProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    // H2, H3만 필터링
    const tocHeadings = headings.filter(heading => heading.depth === 2 || heading.depth === 3);
    
    if (tocHeadings.length === 0) return;

    // 헤딩 요소들과 관찰자 설정
    const headingElements = tocHeadings
      .map(heading => document.getElementById(heading.slug))
      .filter(Boolean) as HTMLElement[];

    if (headingElements.length === 0) return;

    // Intersection Observer로 현재 보이는 섹션 감지
    const observer = new IntersectionObserver(
      (entries) => {
        // 가장 위에 있으면서 보이는 섹션 찾기
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          // 가장 위에 있는 섹션을 활성화
          const topEntry = visibleEntries.reduce((top, entry) => 
            entry.boundingClientRect.top < top.boundingClientRect.top ? entry : top
          );
          setActiveId(topEntry.target.id);
        }
      },
      {
        // 루트 마진을 조정해서 섹션이 화면 상단 1/3 지점에 올 때 활성화
        rootMargin: '-20% 0% -60% 0%',
        threshold: [0, 0.1, 0.5, 1]
      }
    );

    headingElements.forEach(element => observer.observe(element));

    // 페이지 로드 시 첫 번째 섹션을 활성화
    if (tocHeadings.length > 0) {
      setActiveId(tocHeadings[0].slug);
    }

    return () => {
      headingElements.forEach(element => observer.unobserve(element));
    };
  }, [headings]);

  // ToC 접기/펼치기 토글
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // ToC 링크 클릭 시 부드러운 스크롤
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    
    const element = document.getElementById(slug);
    if (element) {
      // 헤더 높이 고려해서 여유 공간 추가
      const yOffset = -100; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
      
      // URL 업데이트
      history.pushState(null, '', `#${slug}`);
      setActiveId(slug);
    }
  };

  // H2, H3만 필터링
  const tocHeadings = headings.filter(heading => heading.depth === 2 || heading.depth === 3);

  if (tocHeadings.length === 0) return null;

  return (
    <nav 
      className="hidden lg:block fixed top-32 right-8 w-72 max-h-[calc(100vh-200px)] overflow-y-auto z-10"
      aria-label="Table of Contents"
    >
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm">
        <div className="border-l-4 border-blue-600 pl-6 pr-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
              Table of Contents
            </h2>
            <button
              onClick={toggleCollapse}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
              aria-label={isCollapsed ? "목차 펼치기" : "목차 접기"}
            >
              <svg 
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  isCollapsed ? 'rotate-180' : ''
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
              </svg>
            </button>
          </div>
          
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isCollapsed ? 'max-h-0 opacity-0 mt-0' : 'max-h-[800px] opacity-100 mt-0'
          }`}>
            <ul className="space-y-1">
              {tocHeadings.map((heading) => (
                <li 
                  key={heading.slug}
                  className={`
                    relative transition-all duration-200
                    ${heading.depth === 3 ? 'ml-4' : ''}
                  `}
                >
                  <a
                    href={`#${heading.slug}`}
                    onClick={(e) => handleLinkClick(e, heading.slug)}
                    className={`
                      block py-2 px-3 text-sm transition-all duration-200 rounded-md
                      hover:bg-blue-50 hover:text-blue-600 border-l-2 -ml-2 pl-4
                      ${heading.depth === 2 ? 'font-medium' : ''}
                      ${activeId === heading.slug 
                        ? 'bg-blue-50' 
                        : ''
                      }
                    `}
                    style={{
                      color: activeId === heading.slug ? '#2563eb' : '#a3a3a3',
                      borderLeftColor: activeId === heading.slug ? '#2563eb' : 'transparent'
                    }}
                    data-heading-id={heading.slug}
                    data-heading-depth={heading.depth}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
} 