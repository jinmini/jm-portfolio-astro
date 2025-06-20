
import { useEffect, useRef, useState } from 'react';

export default function SplineViewer({ 
  url = "https://prod.spline.design/hblmvsuZDlgmNL41/scene.splinecode",
  className = "",
  background = "transparent"
}) {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Spline Viewer 스크립트 동적 로드
    const loadSplineScript = () => {
      if (window.customElements && window.customElements.get('spline-viewer')) {
        setIsScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.10.12/build/spline-viewer.js';
      script.onload = () => setIsScriptLoaded(true);
      document.head.appendChild(script);
    };

    loadSplineScript();
  }, []);

  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current) return;

    // spline-viewer 엘리먼트 생성
    const splineViewer = document.createElement('spline-viewer');
    splineViewer.setAttribute('url', url);
    splineViewer.style.width = '100%';
    splineViewer.style.height = '100%';
    splineViewer.style.background = background;
    
    // 로드 완료 이벤트 리스너
    splineViewer.addEventListener('load', () => {
      setIsLoaded(true);
    });

    // 컨테이너에 추가
    containerRef.current.appendChild(splineViewer);

    // 클린업
    return () => {
      if (containerRef.current && splineViewer) {
        containerRef.current.removeChild(splineViewer);
      }
    };
  }, [isScriptLoaded, url, background]);

  return (
    <div className={`relative ${className}`}>
      {/* 로딩 인디케이터 */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">3D 환경을 불러오는 중...</p>
          </div>
        </div>
      )}
      
      {/* Spline Viewer 컨테이너 */}
      <div 
        ref={containerRef} 
        className={`w-full h-full transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}