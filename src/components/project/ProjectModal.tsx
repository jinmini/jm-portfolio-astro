import { useState, useEffect, useMemo, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import type { CollectionEntry } from 'astro:content';
import { isModalOpen, currentProject, closeModal, openModalBySlug } from '../../stores/modalStore';

// 전역 함수 타입 선언
declare global {
  interface Window {
    openProjectModal: (slug: string) => void;
    closeProjectModal: () => void;
  }
}

interface ProjectModalProps {
  projects: CollectionEntry<'project'>[];
}

// 반응형 처리를 위한 커스텀 hook
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export default function ProjectModal({ projects }: ProjectModalProps) {
  const isOpen = useStore(isModalOpen);
  const project = useStore(currentProject);
  const { width: windowWidth } = useWindowSize();
  
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'media' | 'info'>('media');
  
  const isMobile = windowWidth < 1024;

  // 전역 함수 등록 (기존 API 호환성)
  useEffect(() => {
    (window as any).openProjectModal = (slug: string) => {
      openModalBySlug(slug, projects);
    };
    (window as any).closeProjectModal = closeModal;
    
    return () => {
      // React가 자동으로 정리
    };
  }, [projects]);

  // ESC 키, 클릭 외부 영역 처리
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        handlePreviousMedia();
      } else if (e.key === 'ArrowRight') {
        handleNextMedia();
      } else if (isMobile) {
        if (e.key === '1') setActiveTab('media');
        if (e.key === '2') setActiveTab('info');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentMediaIndex]);

  // 데스크톱/모바일 전환 시 탭 리셋
  useEffect(() => {
    if (!isMobile) {
      // 데스크톱에서는 항상 media 탭으로 리셋
      setActiveTab('media');
    }
  }, [isMobile]);

  // 모달이 열릴 때마다 초기 상태 리셋
  useEffect(() => {
    if (isOpen) {
      setCurrentMediaIndex(0);
      setActiveTab('media');
    }
  }, [isOpen, project]);

  // 미디어 아이템 계산
  const mediaItems = useMemo(() => {
    if (!project) return [];
    
    const items: Array<{ type: 'video' | 'image'; content: any }> = [];
    
    // 영상이 있으면 첫 번째로 추가
    if (project.data.video?.url) {
      items.push({ type: 'video', content: project.data.video });
    }
    
    // 이미지들 추가 (thumbnail 포함)
    if (project.data.thumbnail) {
      items.push({ type: 'image', content: project.data.thumbnail });
    }
    
    return items;
  }, [project]);

  // 미디어 네비게이션 핸들러
  const handlePreviousMedia = useCallback(() => {
    if (mediaItems.length <= 1) return;
    setCurrentMediaIndex(prev => prev > 0 ? prev - 1 : mediaItems.length - 1);
  }, [mediaItems.length]);

  const handleNextMedia = useCallback(() => {
    if (mediaItems.length <= 1) return;
    setCurrentMediaIndex(prev => prev < mediaItems.length - 1 ? prev + 1 : 0);
  }, [mediaItems.length]);

  const handleGoToMedia = useCallback((index: number) => {
    setCurrentMediaIndex(index);
  }, []);

  // 모달 외부 클릭 처리
  const handleModalClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }, []);

  // 탭 전환 (모바일에서만)
  const handleTabChange = useCallback((tabName: 'media' | 'info') => {
    if (!isMobile) return;
    setActiveTab(tabName);
  }, [isMobile]);

  // 터치 스와이프 처리
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  }, [isMobile]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isMobile || !touchStart) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = touchStart.x - endX;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        setActiveTab('info');
      } else {
        setActiveTab('media');
      }
    }
    setTouchStart(null);
  }, [isMobile, touchStart]);

  // 현재 미디어 렌더링
  const renderCurrentMedia = () => {
    if (mediaItems.length === 0) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
          <div className="text-center">
            <div className="text-8xl mb-4">🚀</div>
            <div className="text-2xl font-bold">{project?.data.title}</div>
            <div className="text-lg opacity-75">미디어 없음</div>
          </div>
        </div>
      );
    }

    const currentItem = mediaItems[currentMediaIndex];
    
    if (currentItem.type === 'video') {
      return (
        <video 
          className="w-full h-full object-cover" 
          controls 
          poster={currentItem.content.thumbnail || project?.data.thumbnail || ''}
          preload="metadata"
        >
          <source src={currentItem.content.url} type="video/mp4" />
          당신의 브라우저는 비디오 태그를 지원하지 않습니다.
        </video>
      );
    } else {
      return (
        <img 
          src={currentItem.content} 
          alt={project?.data.title} 
          className="w-full h-full object-cover"
        />
      );
    }
  };

  // 썸네일 갤러리 렌더링
  const renderThumbnails = () => {
    if (mediaItems.length <= 1) return null;

    return (
      <div className="flex justify-center space-x-2 lg:space-x-3">
        {mediaItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleGoToMedia(index)}
            className={`relative w-16 h-12 rounded-lg overflow-hidden transition-all border-2 ${
              index === currentMediaIndex 
                ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            {item.type === 'video' ? (
              <>
                <img 
                  src={item.content.thumbnail || project?.data.thumbnail} 
                  alt="Video thumbnail" 
                  className="w-full h-full object-cover" 
                  loading="lazy"
                  decoding="async"
                  width="120"
                  height="80"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </>
            ) : (
              <img 
                src={item.content} 
                alt="Thumbnail" 
                className="w-full h-full object-cover" 
                loading="lazy"
                decoding="async"
                width="120"
                height="80"
              />
            )}
          </button>
        ))}
      </div>
    );
  };

  // 프로젝트 정보 렌더링
  const renderProjectInfo = () => {
    if (!project) return null;

    const { data } = project;

    return (
      <div>
        {/* 프로젝트 기본 정보 */}
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{data.title}</h3>
          {data.featured && (
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
                ⭐ Featured Project
              </span>
            </div>
          )}
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{data.description}</p>
        </div>

        {/* Technologies 섹션 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Technologies
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.tags.map(tag => (
              <span key={tag} className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded-full font-medium shadow-sm hover:shadow-md transition-shadow">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Features 섹션 */}
        {data.features && data.features.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
              핵심 기능
            </h4>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              {data.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Impact 섹션 */}
        {data.impact && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              프로젝트 임팩트
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.impact.users && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                    </svg>
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-300">사용자</span>
                  </div>
                  <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{data.impact.users}</div>
                </div>
              )}
              {data.impact.companies && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                    <span className="text-sm font-medium text-green-800 dark:text-green-300">기업 도입</span>
                  </div>
                  <div className="text-lg font-bold text-green-900 dark:text-green-100">{data.impact.companies}</div>
                </div>  
              )}
              {data.impact.improvement && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                    <span className="text-sm font-medium text-purple-800 dark:text-purple-300">성과 개선</span>
                  </div>
                  <div className="text-lg font-bold text-purple-900 dark:text-purple-100">{data.impact.improvement}</div>
                </div>
              )}
              {data.impact.cost_saving && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                    </svg>
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-300">비용 절감</span>
                  </div>
                  <div className="text-lg font-bold text-orange-900 dark:text-orange-100">{data.impact.cost_saving}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 프로젝트 메타 정보 */}
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">프로젝트 날짜</div>
          <div className="text-gray-900 dark:text-white font-medium">{new Date(data.date).toLocaleDateString('ko-KR')}</div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          {data.links?.site && (
            <a 
              href={data.links.site} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              Visit Project
            </a>
          )}
          {data.links?.github && (
            <a 
              href={data.links.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          )}
          {data.links?.demo && (
            <a 
              href={data.links.demo} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Live Demo
            </a>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen || !project) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleModalClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-7xl w-full max-h-[90vh] lg:h-[85vh] overflow-hidden shadow-2xl">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            {project.data.title}
          </h2>
          <button 
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            aria-label="모달 닫기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* 모바일 탭 헤더 (lg에서 숨김) */}
        <div className="lg:hidden bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="flex">
            <button 
              onClick={() => handleTabChange('media')}
              className={`flex-1 px-4 py-3 text-sm font-medium text-center transition-colors border-b-2 ${
                activeTab === 'media' 
                  ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800'
                  : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
              role="tab"
              aria-selected={activeTab === 'media'}
            >
              <svg className="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              미디어
            </button>
            <button 
              onClick={() => handleTabChange('info')}
              className={`flex-1 px-4 py-3 text-sm font-medium text-center transition-colors border-b-2 ${
                activeTab === 'info' 
                  ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800'
                  : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
              role="tab"
              aria-selected={activeTab === 'info'}
            >
              <svg className="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              정보
            </button>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)] lg:h-[calc(85vh-88px)]">
          
          {/* 미디어 영역 */}
          <div className={`lg:w-1/2 bg-gray-50 dark:bg-gray-900 flex flex-col ${
            !isMobile ? 'flex' : (activeTab === 'media' ? 'flex' : 'hidden')
          }`}>
            {/* 메인 미디어 */}
            <div className="flex-1 p-4 lg:p-6">
              <div className="relative h-full bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-4xl lg:text-6xl">
                  {renderCurrentMedia()}
                </div>
                
                {/* 미디어 네비게이션 버튼 */}
                {mediaItems.length > 1 && (
                  <>
                    <button 
                      onClick={handlePreviousMedia}
                      className="absolute left-2 lg:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 lg:p-3 rounded-full hover:bg-opacity-75 transition-opacity backdrop-blur-sm"
                      aria-label="이전 미디어"
                    >
                      <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                      </svg>
                    </button>
                    
                    <button 
                      onClick={handleNextMedia}
                      className="absolute right-2 lg:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 lg:p-3 rounded-full hover:bg-opacity-75 transition-opacity backdrop-blur-sm"
                      aria-label="다음 미디어"
                    >
                      <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* 썸네일 갤러리 */}
            <div className="px-4 lg:px-6 pb-4 lg:pb-6">
              {renderThumbnails()}
            </div>
          </div>

          {/* 정보 영역 */}
          <div className={`lg:w-1/2 bg-white dark:bg-gray-800 flex flex-col ${
            !isMobile ? 'flex' : (activeTab === 'info' ? 'flex' : 'hidden')
          }`}>
            <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
              {renderProjectInfo()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 