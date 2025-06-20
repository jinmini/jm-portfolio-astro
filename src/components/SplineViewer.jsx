import { useEffect, useRef, useState } from 'react';

export default function SplineViewer({ 
  url = "https://prod.spline.design/hblmvsuZDlgmNL41/scene.splinecode",
  className = "",
  background = "transparent"
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Spline Viewer 스크립트 로드
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.10.12/build/spline-viewer.js';
    
    script.onload = () => {
      // 스크립트가 로드된 후 spline-viewer 엘리먼트 생성
      if (containerRef.current) {
        const splineViewer = document.createElement('spline-viewer');
        splineViewer.setAttribute('url', url);
        splineViewer.style.width = '100%';
        splineViewer.style.height = '100%';
        splineViewer.style.background = background;
        
        // 로드 이벤트 리스너
        splineViewer.addEventListener('load', () => {
          setIsLoaded(true);
        });
        
        // 컨테이너에 추가
        containerRef.current.appendChild(splineViewer);
      }
    };

    // 이미 스크립트가 로드되어 있는지 확인
    const existingScript = document.querySelector('script[src="https://unpkg.com/@splinetool/viewer@1.10.12/build/spline-viewer.js"]');
    if (!existingScript) {
      document.head.appendChild(script);
    } else {
      script.onload();
    }

    // 클린업
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [url, background]);

  return (
    <div className={`relative ${className}`} style={{ minHeight: '500px' }}>
      {/* 로딩 인디케이터 */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">3D 환경을 불러오는 중...</p>
          </div>
        </div>
      )}
      
      {/* Spline 뷰어 컨테이너 */}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}