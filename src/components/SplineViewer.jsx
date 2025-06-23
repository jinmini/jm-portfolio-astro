import Spline from '@splinetool/react-spline';
import { useState } from 'react';

export default function SplineViewer({ 
  url = "https://prod.spline.design/hblmvsuZDlgmNL41/scene.splinecode",
  className = "",
  onLoad
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = (spline) => {
    setIsLoaded(true);
    setHasError(false);
    console.log('Spline 모델이 성공적으로 로드되었습니다!');
    if (onLoad) {
      onLoad(spline);
    }
  };

  const handleError = (error) => {
    setHasError(true);
    setIsLoaded(false);
    console.error('Spline 모델 로드 실패:', error);
  };

  return (
    <div className={`relative ${className}`} style={{ minHeight: '500px' }}>
      {/* 로딩 인디케이터 */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50/80 to-purple-50/80 z-10 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm font-medium">3D 환경을 불러오는 중...</p>
          </div>
        </div>
      )}

      {/* 에러 상태 */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center text-gray-600">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-lg font-medium mb-2">3D 모델을 불러올 수 없습니다</p>
            <p className="text-sm">네트워크 연결을 확인해주세요</p>
          </div>
        </div>
      )}
      
      {/* Spline 컴포넌트 */}
      <Spline
        scene={url}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '500px'
        }}
      />
    </div>
  );
}