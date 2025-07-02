// 이미지 최적화 및 성능 관리 스크립트

interface ImageOptimizationConfig {
  enablePreloading: boolean;
  enableLazyLoading: boolean;
  enablePerformanceMonitoring: boolean;
  priorityImages: string[];
  lazyLoadThreshold: number;
}

class ImageOptimizer {
  private config: ImageOptimizationConfig;
  private observer: IntersectionObserver | null = null;
  private loadingImages = new Set<string>();
  private loadedImages = new Set<string>();
  private performanceData: Record<string, number> = {};

  constructor(config: Partial<ImageOptimizationConfig> = {}) {
    this.config = {
      enablePreloading: true,
      enableLazyLoading: true,
      enablePerformanceMonitoring: true,
      priorityImages: ['/images/profile-fix.webp', '/images/profile.webp'],
      lazyLoadThreshold: 0.1,
      ...config
    };

    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined') return;

    // DOM이 로드되면 초기화
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  private setup(): void {
    if (this.config.enablePreloading) {
      this.preloadPriorityImages();
    }

    if (this.config.enableLazyLoading) {
      this.setupLazyLoading();
    }

    if (this.config.enablePerformanceMonitoring) {
      this.setupPerformanceMonitoring();
    }

    this.optimizeExistingImages();
  }

  // 우선순위 이미지 프리로딩
  private preloadPriorityImages(): void {
    this.config.priorityImages.forEach(src => {
      if (!this.loadedImages.has(src) && !this.loadingImages.has(src)) {
        this.preloadImage(src);
      }
    });
  }

  private preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadedImages.has(src)) {
        resolve();
        return;
      }

      if (this.loadingImages.has(src)) {
        return;
      }

      this.loadingImages.add(src);
      const startTime = performance.now();

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;

      link.onload = () => {
        this.loadingImages.delete(src);
        this.loadedImages.add(src);
        
        if (this.config.enablePerformanceMonitoring) {
          this.performanceData[src] = performance.now() - startTime;
          console.log(`✅ 이미지 프리로딩 완료: ${src} (${this.performanceData[src].toFixed(2)}ms)`);
        }
        
        resolve();
      };

      link.onerror = () => {
        this.loadingImages.delete(src);
        console.error(`❌ 이미지 프리로딩 실패: ${src}`);
        reject(new Error(`Failed to preload image: ${src}`));
      };

      document.head.appendChild(link);
    });
  }

  // 레이지 로딩 설정
  private setupLazyLoading(): void {
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver를 지원하지 않는 브라우저입니다. 레이지 로딩이 비활성화됩니다.');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadLazyImage(img);
            this.observer?.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: this.config.lazyLoadThreshold
      }
    );

    // 기존 레이지 이미지들을 관찰 대상에 추가
    this.observeLazyImages();
  }

  private observeLazyImages(): void {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      if (this.observer) {
        this.observer.observe(img);
      }
    });
  }

  private loadLazyImage(img: HTMLImageElement): void {
    const src = img.src || img.dataset.src;
    if (!src) return;

    const startTime = performance.now();

    // 블러 효과 제거를 위한 클래스 추가
    img.classList.add('image-blur-load');

    const tempImg = new Image();
    tempImg.onload = () => {
      // 이미지 로딩 완료 시 블러 효과 제거
      img.classList.remove('image-blur-load');
      img.classList.add('loaded');
      
      // placeholder 애니메이션 제거
      if (img.classList.contains('image-lazy') || img.classList.contains('image-lazy-global')) {
        img.classList.add('loaded');
      }

      if (this.config.enablePerformanceMonitoring) {
        const loadTime = performance.now() - startTime;
        console.log(`🖼️ 레이지 이미지 로딩 완료: ${src} (${loadTime.toFixed(2)}ms)`);
      }
    };

    tempImg.onerror = () => {
      console.error(`❌ 레이지 이미지 로딩 실패: ${src}`);
      img.classList.remove('image-blur-load');
    };

    tempImg.src = src;
  }

  // 기존 이미지 최적화
  private optimizeExistingImages(): void {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // 이미 로드된 이미지들 처리
      if (img.complete && img.naturalHeight !== 0) {
        img.classList.add('loaded');
        if (img.classList.contains('image-lazy') || img.classList.contains('image-lazy-global')) {
          img.classList.add('loaded');
        }
      } else {
        // 로딩 중인 이미지들 모니터링
        img.addEventListener('load', () => {
          img.classList.add('loaded');
          if (img.classList.contains('image-lazy') || img.classList.contains('image-lazy-global')) {
            img.classList.add('loaded');
          }
        });
      }

      // 이미지 에러 처리
      img.addEventListener('error', () => {
        console.error(`❌ 이미지 로딩 에러: ${img.src}`);
        img.style.background = '#f3f4f6';
        img.style.display = 'flex';
        img.style.alignItems = 'center';
        img.style.justifyContent = 'center';
        img.innerHTML = '🖼️';
      });
    });
  }

  // 성능 모니터링 설정
  private setupPerformanceMonitoring(): void {
    // Core Web Vitals 모니터링
    this.measureLCP();
    this.measureCLS();
    
    // 이미지 관련 성능 메트릭
    this.measureImageMetrics();
  }

  private measureLCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log(`📊 Largest Contentful Paint: ${lastEntry.startTime.toFixed(2)}ms`);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
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
        console.log(`📊 Cumulative Layout Shift: ${clsValue.toFixed(4)}`);
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  private measureImageMetrics(): void {
    // 전체 이미지 로딩 시간 측정
    window.addEventListener('load', () => {
      const navigationStart = performance.timing.navigationStart;
      const loadComplete = performance.timing.loadEventEnd;
      const totalLoadTime = loadComplete - navigationStart;
      
      console.log(`📊 전체 페이지 로딩 시간: ${totalLoadTime}ms`);
      
      // 이미지별 성능 데이터 출력
      if (Object.keys(this.performanceData).length > 0) {
        console.log('📊 이미지 로딩 성능:', this.performanceData);
      }
    });
  }

  // 동적으로 추가된 이미지 처리
  public observeNewImages(): void {
    if (this.observer) {
      const newLazyImages = document.querySelectorAll('img[loading="lazy"]:not(.observed)');
      newLazyImages.forEach(img => {
        img.classList.add('observed');
        this.observer!.observe(img);
      });
    }
  }

  // 정리 함수
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  // 설정 업데이트
  public updateConfig(newConfig: Partial<ImageOptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.setup();
  }

  // 성능 데이터 가져오기
  public getPerformanceData(): Record<string, number> {
    return { ...this.performanceData };
  }
}

// 전역 인스턴스 생성 및 내보내기
const imageOptimizer = new ImageOptimizer();

// 전역 객체에 추가 (디버깅용)
if (typeof window !== 'undefined') {
  (window as any).imageOptimizer = imageOptimizer;
}

export default imageOptimizer;
export { ImageOptimizer, type ImageOptimizationConfig }; 