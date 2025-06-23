import React, { useState } from 'react';
import styles from './ESGTimeline.module.scss';

interface TimelineItem {
  id: string;
  year: string;
  period: string;
  title: string;
  description: string;
  category: 'E' | 'S' | 'G';
  isHighlight?: boolean;
  impact?: string;
  thumbnail?: string;
  role?: string;
  techStack?: string[];
  achievements?: string[];
}

const timelineData: TimelineItem[] = [
  // Environment (E)
  {
    id: 'e1',
    year: '2025',
    period: '2025 - Present',
    title: '탄소 관리 AI 플랫폼 개발',
    description: 'AI 기반 탄소 배출량 실시간 모니터링 및 최적화 솔루션으로 연간 1,200톤 CO2 감축 달성',
    category: 'E',
    isHighlight: true,
    impact: '연간 1,200톤 CO2 감축',
    thumbnail: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&h=300&fit=crop',
    role: 'AI 솔루션 아키텍트 & 프로젝트 리드',
    techStack: ['Python', 'TensorFlow', 'React', 'AWS', 'PostgreSQL'],
    achievements: [
      'AI 모델 정확도 95% 달성',
      '실시간 대시보드 구축으로 의사결정 시간 80% 단축',
      '연간 탄소 배출량 1,200톤 감축 성과'
    ]
  },
  {
    id: 'e2',
    year: '2024',
    period: '2024',
    title: '재생에너지 전환 컨설팅',
    description: '제조업체 재생에너지 전환 프로젝트로 에너지 비용 30% 절감 및 탄소 중립 로드맵 수립',
    category: 'E',
    impact: '에너지 비용 30% 절감'
  },
  {
    id: 'e3',
    year: '2023',
    period: '2023',
    title: '순환경제 시스템 구축',
    description: '폐기물 재활용률 85% 달성을 위한 스마트 분류 시스템 개발',
    category: 'E',
    impact: '재활용률 85% 달성'
  },
  // Social (S)
  {
    id: 's1',
    year: '2024',
    period: '2024 - 2025',
    title: 'AI 기반 다양성 분석 도구',
    description: '조직 다양성 측정 및 편향성 감지 AI 분석 도구로 포용적 조직문화 구축 지원',
    category: 'S',
    isHighlight: true,
    impact: '다양성 지수 40% 개선',
    thumbnail: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop',
    role: '풀스택 개발자 & 데이터 분석가',
    techStack: ['Python', 'scikit-learn', 'React', 'D3.js', 'MongoDB'],
    achievements: [
      '편향성 감지 알고리즘 개발로 채용 공정성 30% 향상',
      '다양성 지표 시각화 대시보드 구축',
      '10개 기업 도입 및 조직문화 개선 컨설팅'
    ]
  },
  {
    id: 's2',
    year: '2024',
    period: '2024',
    title: '직장 내 안전 모니터링 시스템',
    description: 'IoT와 AI를 활용한 작업장 안전 모니터링으로 산업재해 85% 예방',
    category: 'S',
    impact: '산업재해 85% 감소'
  },
  {
    id: 's3',
    year: '2023',
    period: '2023',
    title: '지역사회 IT 교육 프로그램',
    description: '소외계층 청소년 500명 대상 코딩 교육 및 멘토링 프로그램 운영',
    category: 'S',
    impact: '500명 교육 수료'
  },
  // Governance (G)
  {
    id: 'g1',
    year: '2024',
    period: '2024 - Present',
    title: 'ESG 보고서 자동화 플랫폼',
    description: 'NLP 기술로 ESG 보고서 작성 시간 70% 단축 및 데이터 정확도 95% 향상',
    category: 'G',
    isHighlight: true,
    impact: '작성 시간 70% 단축',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    role: '기술 팀 리드 & NLP 엔지니어',
    techStack: ['Python', 'BERT', 'FastAPI', 'Vue.js', 'Elasticsearch'],
    achievements: [
      'GRI, TCFD, SASB 표준 자동 매핑 시스템 개발',
      '다국어 지원(5개 언어) 및 실시간 번역 기능',
      '20개 대기업 도입 및 연간 500시간 업무 절감'
    ]
  },
  {
    id: 'g2',
    year: '2024',
    period: '2024',
    title: '블록체인 기반 투명성 플랫폼',
    description: '블록체인으로 거버넌스 투명성 100% 보장 및 감사 비용 50% 절감',
    category: 'G',
    impact: '감사 비용 50% 절감'
  },
  {
    id: 'g3',
    year: '2023',
    period: '2023',
    title: 'AI 리스크 관리 시스템',
    description: 'ML 기반 리스크 예측으로 컴플라이언스 위반 사전 방지 및 200억원 손실 방지',
    category: 'G',
    impact: '200억원 손실 방지'
  }
];

const ESGTimeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'E' | 'S' | 'G'>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getFilteredData = () => {
    if (activeTab === 'all') {
      // 전체 탭에서는 각 카테고리의 하이라이트된 항목만 표시
      return timelineData.filter(item => item.isHighlight);
    }
    return timelineData.filter(item => item.category === activeTab);
  };

  const filteredData = getFilteredData();

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
    <div className={styles.esgTimelineContainer}>
      <h2 className={styles.esgTimelineTitle}>
        <span className={styles.titleIcon}>🌟</span>
        ESG 활동 연혁
      </h2>
      <p className={styles.esgTimelineSubtitle}>
        환경(E), 사회(S), 지배구조(G) 각 영역에서의 전문적인 프로젝트와 성과
      </p>
      
      <div className={styles.esgTabs}>
        <button
          className={`${styles.esgTab} ${activeTab === 'all' ? styles.active : ''}`}
          onClick={() => setActiveTab('all')}
        >
          전체
        </button>
        <button
          className={`${styles.esgTab} ${activeTab === 'E' ? styles.active : ''}`}
          onClick={() => setActiveTab('E')}
        >
          <span className={styles.tabIcon}>🌱</span>
          Environment
        </button>
        <button
          className={`${styles.esgTab} ${activeTab === 'S' ? styles.active : ''}`}
          onClick={() => setActiveTab('S')}
        >
          <span className={styles.tabIcon}>👥</span>
          Social
        </button>
        <button
          className={`${styles.esgTab} ${activeTab === 'G' ? styles.active : ''}`}
          onClick={() => setActiveTab('G')}
        >
          <span className={styles.tabIcon}>🏛️</span>
          Governance
        </button>
      </div>

      {activeTab === 'all' ? (
        // 전체 탭의 디자인: 중앙 타임라인 + 좌우 지그재그
        <div className={styles.timelineWrapperCenter}>
          <div className={styles.timelineLineCenter}>
            {filteredData.map((_, index) => (
              <div key={index} className={styles.timelineDotCenter}></div>
            ))}
          </div>
          {filteredData.map((item, index) => {
            const isExpanded = expandedItems.has(item.id);
            const isLeft = index % 2 === 0;
            
            return (
              <div 
                key={item.id} 
                className={`${styles.timelineItemCenter} ${isLeft ? styles.left : styles.right}`}
              >
                <div className={styles.timelineContentCenter}>
                  <div className={styles.contentHeader}>
                    <div className={styles.yearSection}>
                      <span className={styles.year}>{item.year}</span>
                      <span className={styles.period}>{item.period}</span>
                    </div>
                    {item.thumbnail && (
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className={styles.thumbnail}
                      />
                    )}
                  </div>
                  
                  <h3 className={styles.contentTitle}>{item.title}</h3>
                  <p className={styles.contentDescription}>{item.description}</p>
                  
                  <div className={styles.contentFooter}>
                    <span className={styles.categoryBadge}>
                      {getCategoryIcon(item.category)} {item.category}
                    </span>
                    <button 
                      className={styles.accordionButton}
                      onClick={() => toggleExpanded(item.id)}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? '접기' : '상세 보기'}
                      <span className={styles.accordionIcon}>
                        {isExpanded ? '▲' : '▼'}
                      </span>
                    </button>
                  </div>
                  
                  {isExpanded && (
                    <div className={styles.expandedContent}>
                      {item.thumbnail && (
                        <img 
                          src={item.thumbnail} 
                          alt={item.title}
                          className={styles.expandedImage}
                        />
                      )}
                      
                      {item.role && (
                        <div className={styles.detailSection}>
                          <h4 className={styles.detailTitle}>👨‍💻 나의 역할</h4>
                          <p className={styles.detailText}>{item.role}</p>
                        </div>
                      )}
                      
                      {item.techStack && (
                        <div className={styles.detailSection}>
                          <h4 className={styles.detailTitle}>🔧 기술 스택</h4>
                          <div className={styles.techStack}>
                            {item.techStack.map((tech, idx) => (
                              <span key={idx} className={styles.techBadge}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {item.achievements && (
                        <div className={styles.detailSection}>
                          <h4 className={styles.detailTitle}>🏆 주요 성과</h4>
                          <ul className={styles.achievementList}>
                            {item.achievements.map((achievement, idx) => (
                              <li key={idx}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {item.impact && (
                        <div className={styles.impactHighlight}>
                          <span className={styles.impactIcon}>📊</span>
                          <span className={styles.impactText}>{item.impact}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // 카테고리별 탭의 디자인 (기존 유지)
        <div className={styles.timelineWrapper}>
          <div className={styles.timelineLine}></div>
          {filteredData.map((item, index) => (
            <div key={item.id} className={styles.timelineItem}>
              <div className={styles.timelineYear}>{item.year}</div>
              <div className={styles.timelineDot} style={{ backgroundColor: getCategoryColor(item.category) }}></div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineHeader}>
                  <h3 className={styles.timelineTitle}>{item.title}</h3>
                  <span className={styles.timelineCategory} style={{ color: getCategoryColor(item.category) }}>
                    {getCategoryIcon(item.category)} {item.category}
                  </span>
                </div>
                <p className={styles.timelineDescription}>{item.description}</p>
                {item.impact && (
                  <div className={styles.timelineImpact}>
                    <span className={styles.impactIcon}>📊</span>
                    <span className={styles.impactText}>{item.impact}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ESGTimeline;
