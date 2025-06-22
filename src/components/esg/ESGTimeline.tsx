import React, { useState } from 'react';
import './ESGTimeline.css';

interface TimelineItem {
  id: string;
  year: string;
  period: string;
  title: string;
  description: string;
  category: 'E' | 'S' | 'G';
  isHighlight?: boolean;
  impact?: string;
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
    impact: '연간 1,200톤 CO2 감축'
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
    impact: '다양성 지수 40% 개선'
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
    impact: '작성 시간 70% 단축'
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
    <div className="esg-timeline-container">
      <h2 className="esg-timeline-title">
        <span className="title-icon">🌟</span>
        ESG 활동 연혁
      </h2>
      <p className="esg-timeline-subtitle">
        환경(E), 사회(S), 지배구조(G) 각 영역에서의 전문적인 프로젝트와 성과
      </p>
      
      <div className="esg-tabs">
        <button
          className={`esg-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          전체
        </button>
        <button
          className={`esg-tab ${activeTab === 'E' ? 'active' : ''}`}
          onClick={() => setActiveTab('E')}
        >
          <span className="tab-icon">🌱</span>
          Environment
        </button>
        <button
          className={`esg-tab ${activeTab === 'S' ? 'active' : ''}`}
          onClick={() => setActiveTab('S')}
        >
          <span className="tab-icon">👥</span>
          Social
        </button>
        <button
          className={`esg-tab ${activeTab === 'G' ? 'active' : ''}`}
          onClick={() => setActiveTab('G')}
        >
          <span className="tab-icon">🏛️</span>
          Governance
        </button>
      </div>

      <div className="timeline-wrapper">
        <div className="timeline-line"></div>
        {filteredData.map((item, index) => (
          <div key={item.id} className="timeline-item">
            <div className="timeline-year">{item.year}</div>
            <div className="timeline-dot" style={{ backgroundColor: getCategoryColor(item.category) }}></div>
            <div className="timeline-content">
              <div className="timeline-header">
                <h3 className="timeline-title">{item.title}</h3>
                <span className="timeline-category" style={{ color: getCategoryColor(item.category) }}>
                  {getCategoryIcon(item.category)} {item.category}
                </span>
              </div>
              <p className="timeline-description">{item.description}</p>
              {item.impact && (
                <div className="timeline-impact">
                  <span className="impact-icon">📊</span>
                  <span className="impact-text">{item.impact}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ESGTimeline;
