// 성능 모니터링 도구

interface PerformanceMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  imageLoadTimes: Record<string, number>;
  totalImages: number;
  loadedImages: number;
  pageLoadTime: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    lcp: null,
    fid: null,
    cls: null,
    imageLoadTimes: {},
    totalImages: 0,
    loadedImages: 0,
    pageLoadTime: 0
  };

  private startTime: number;

  constructor() {
    this.startTime = performance.now();
    this.setupMonitoring();
  }

  private setupMonitoring(): void {
    // Core Web Vitals 측정
    this.measureLCP();
    this.measureFID();
    this.measureCLS();
    
    // 이미지 로딩 성능 측정
    this.measureImagePerformance();
    
    // 페이지 로드 시간 측정
    this.measurePageLoadTime();
  }

  private measureLCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  private measureFID(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.metrics.fid = (entry as any).processingStart - entry.startTime;
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  private measureCLS(): void {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.metrics.cls = clsValue;
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  private measureImagePerformance(): void {
    // 이미지 로딩 시작 시간 기록
    const recordImageLoad = (img: HTMLImageElement) => {
      const startTime = performance.now();
      const src = img.src;
      
      if (img.complete) {
        this.metrics.imageLoadTimes[src] = 0; // 이미 로드됨
        this.metrics.loadedImages++;
      } else {
        img.addEventListener('load', () => {
          this.metrics.imageLoadTimes[src] = performance.now() - startTime;
          this.metrics.loadedImages++;
        });
        
        img.addEventListener('error', () => {
          this.metrics.imageLoadTimes[src] = -1; // 에러 표시
        });
      }
    };

    // 현재 페이지의 모든 이미지 측정
    const images = document.querySelectorAll('img');
    this.metrics.totalImages = images.length;
    
    images.forEach(recordImageLoad);

    // 동적으로 추가되는 이미지 감지
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            const element = node as Element;
            const newImages = element.tagName === 'IMG' 
              ? [element as HTMLImageElement]
              : Array.from(element.querySelectorAll('img'));
            
            newImages.forEach(img => {
              this.metrics.totalImages++;
              recordImageLoad(img);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private measurePageLoadTime(): void {
    window.addEventListener('load', () => {
      this.metrics.pageLoadTime = performance.now() - this.startTime;
      
      // 모든 메트릭 수집 완료 후 콘솔에 출력
      setTimeout(() => {
        this.logResults();
      }, 2000);
    });
  }

  private logResults(): void {
    console.group('🚀 성능 모니터링 결과');
    
    console.log('📊 Core Web Vitals:');
    console.log(`  • LCP (Largest Contentful Paint): ${this.metrics.lcp?.toFixed(2) || 'N/A'}ms`);
    console.log(`  • FID (First Input Delay): ${this.metrics.fid?.toFixed(2) || 'N/A'}ms`);
    console.log(`  • CLS (Cumulative Layout Shift): ${this.metrics.cls?.toFixed(4) || 'N/A'}`);
    
    console.log('\n🖼️ 이미지 로딩 성능:');
    console.log(`  • 총 이미지 수: ${this.metrics.totalImages}`);
    console.log(`  • 로드된 이미지 수: ${this.metrics.loadedImages}`);
    console.log(`  • 로딩 성공률: ${((this.metrics.loadedImages / this.metrics.totalImages) * 100).toFixed(1)}%`);
    
    const loadTimes = Object.values(this.metrics.imageLoadTimes).filter(time => time > 0);
    if (loadTimes.length > 0) {
      const avgLoadTime = loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length;
      const maxLoadTime = Math.max(...loadTimes);
      console.log(`  • 평균 이미지 로딩 시간: ${avgLoadTime.toFixed(2)}ms`);
      console.log(`  • 최대 이미지 로딩 시간: ${maxLoadTime.toFixed(2)}ms`);
    }
    
    console.log('\n⏱️ 전체 성능:');
    console.log(`  • 페이지 로드 시간: ${this.metrics.pageLoadTime.toFixed(2)}ms`);
    
    // 성능 점수 계산 및 권장사항
    this.calculatePerformanceScore();
    
    console.groupEnd();
  }

  private calculatePerformanceScore(): void {
    let score = 100;
    const recommendations: string[] = [];

    // LCP 평가 (2.5초 이하 권장)
    if (this.metrics.lcp && this.metrics.lcp > 2500) {
      score -= 20;
      recommendations.push('LCP 개선: 주요 이미지 최적화 필요');
    }

    // CLS 평가 (0.1 이하 권장)
    if (this.metrics.cls && this.metrics.cls > 0.1) {
      score -= 15;
      recommendations.push('CLS 개선: 이미지 크기 사전 지정 필요');
    }

    // 이미지 로딩 성공률 평가
    const successRate = (this.metrics.loadedImages / this.metrics.totalImages) * 100;
    if (successRate < 95) {
      score -= 10;
      recommendations.push('이미지 로딩 안정성 개선 필요');
    }

    console.log(`\n🎯 성능 점수: ${Math.max(0, score)}/100`);
    
    if (recommendations.length > 0) {
      console.log('\n💡 개선 권장사항:');
      recommendations.forEach(rec => console.log(`  • ${rec}`));
    } else {
      console.log('\n✅ 모든 성능 지표가 양호합니다!');
    }
  }

  // 실시간 메트릭 반환
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // 특정 이미지의 로딩 시간 확인
  public getImageLoadTime(src: string): number | null {
    return this.metrics.imageLoadTimes[src] || null;
  }

  // 성능 데이터 JSON으로 내보내기
  public exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }
}

// 전역 인스턴스 생성
const performanceMonitor = new PerformanceMonitor();

// 전역 객체에 추가 (디버깅용)
if (typeof window !== 'undefined') {
  (window as any).performanceMonitor = performanceMonitor;
  
  // 콘솔 명령어 추가
  (window as any).getPerformanceReport = () => {
    console.log('현재 성능 메트릭:', performanceMonitor.getMetrics());
  };
  
  (window as any).exportPerformanceData = () => {
    const data = performanceMonitor.exportMetrics();
    console.log('성능 데이터 (JSON):', data);
    
    // 클립보드에 복사 (가능한 경우)
    if (navigator.clipboard) {
      navigator.clipboard.writeText(data);
      console.log('📋 성능 데이터가 클립보드에 복사되었습니다.');
    }
  };
}

export default performanceMonitor;
export { PerformanceMonitor, type PerformanceMetrics }; 