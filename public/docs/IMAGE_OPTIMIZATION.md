# 🖼️ 이미지 최적화 가이드

이 문서는 포트폴리오 사이트에 구현된 이미지 최적화 기능들을 설명합니다.

## 📋 구현된 최적화 기능

### 1. **레이지 로딩 (Lazy Loading)**
- **구현 위치**: `BlogCard.astro`, `ProjectCard.astro`, `ProjectModal.astro`
- **기능**: 화면에 보이지 않는 이미지는 로딩을 지연시켜 초기 로딩 속도 향상
- **설정**: `loading="lazy"` 속성 적용
- **추가 기능**: Intersection Observer API를 활용한 고급 레이지 로딩

### 2. **이미지 프리로딩 (Preloading)**
- **구현 위치**: `imageOptimization.ts`
- **기능**: 중요한 이미지(프로필 이미지 등)를 우선적으로 로딩
- **대상 이미지**: 
  - `/images/profile-fix.webp`
  - `/images/profile.webp`

### 3. **반응형 이미지 (Responsive Images)**
- **구현 위치**: 모든 이미지 컴포넌트
- **기능**: 화면 크기에 따라 적절한 이미지 크기 제공
- **sizes 속성 예시**:
  ```html
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  ```

### 4. **이미지 포맷 최적화**
- **포맷**: WebP 사용 (Astro Image 컴포넌트 자동 변환)
- **폴백**: 브라우저 지원에 따른 자동 폴백
- **압축**: 자동 압축 및 품질 최적화

### 5. **로딩 플레이스홀더**
- **구현 위치**: `BlogCard.astro`, `global.css`
- **기능**: 이미지 로딩 중 shimmer 애니메이션 표시
- **스타일**: 
  - 라이트모드: `#f3f4f6` 색상
  - 다크모드: `#374151` 색상

## 🛠️ 사용된 기술

### Core Technologies
- **Astro Image 컴포넌트**: 정적 이미지 최적화
- **Intersection Observer API**: 레이지 로딩 구현
- **Performance Observer API**: 성능 모니터링
- **MutationObserver API**: 동적 콘텐츠 감지

### CSS 최적화
- **image-rendering**: 이미지 렌더링 품질 최적화
- **transition**: 부드러운 로딩 애니메이션
- **background-size**: 플레이스홀더 크기 조정

## 📊 성능 모니터링

### 자동 측정 지표
- **LCP (Largest Contentful Paint)**: 주요 콘텐츠 로딩 시간
- **FID (First Input Delay)**: 첫 입력 응답 시간
- **CLS (Cumulative Layout Shift)**: 레이아웃 이동 정도
- **이미지 로딩 시간**: 각 이미지의 개별 로딩 시간

### 개발 도구 사용법
개발 환경에서 브라우저 콘솔에서 다음 명령어를 사용할 수 있습니다:

```javascript
// 현재 성능 메트릭 확인
getPerformanceReport()

// 성능 데이터 JSON 형태로 내보내기
exportPerformanceData()

// 이미지 최적화 설정 확인
imageOptimizer.getPerformanceData()
```

## 🎯 성능 목표 및 기준

### Core Web Vitals 목표
- **LCP**: 2.5초 이하
- **FID**: 100ms 이하
- **CLS**: 0.1 이하

### 이미지 최적화 목표
- **이미지 로딩 성공률**: 95% 이상
- **평균 이미지 로딩 시간**: 500ms 이하
- **첫 화면 이미지 로딩**: 1초 이하

## 🔧 설정 및 커스터마이징

### 이미지 최적화 설정 변경
`src/scripts/imageOptimization.ts`에서 설정을 수정할 수 있습니다:

```typescript
const config = {
  enablePreloading: true,          // 프리로딩 활성화
  enableLazyLoading: true,         // 레이지 로딩 활성화
  enablePerformanceMonitoring: true, // 성능 모니터링 활성화
  priorityImages: [               // 우선 로딩할 이미지 목록
    '/images/profile-fix.webp',
    '/images/profile.webp'
  ],
  lazyLoadThreshold: 0.1          // 레이지 로딩 임계값 (0.0 ~ 1.0)
};
```

### 새로운 이미지 컴포넌트 추가 시 주의사항
1. **lazy loading 속성 추가**: `loading="lazy"`
2. **sizes 속성 설정**: 반응형 크기 지정
3. **width/height 속성**: 레이아웃 이동 방지
4. **alt 속성**: 접근성 및 SEO
5. **decoding="async"**: 비동기 디코딩

### 예시 코드
```astro
<img 
  src={imageSrc}
  alt="설명"
  class="w-full h-full object-cover image-lazy"
  loading="lazy"
  decoding="async"
  width="400"
  height="300"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

## 🐛 문제 해결

### 이미지가 로드되지 않는 경우
1. 브라우저 콘솔에서 에러 메시지 확인
2. 이미지 경로가 올바른지 확인
3. 네트워크 탭에서 요청 상태 확인

### 레이지 로딩이 작동하지 않는 경우
1. `IntersectionObserver` 브라우저 지원 확인
2. 이미지에 `loading="lazy"` 속성이 있는지 확인
3. JavaScript 에러가 없는지 확인

### 성능이 개선되지 않는 경우
1. 이미지 파일 크기 확인 (각 이미지 100KB 이하 권장)
2. WebP 포맷 사용 여부 확인
3. Core Web Vitals 점수 측정 및 분석

## 📈 성능 개선 효과

이미지 최적화 구현 후 기대되는 개선 효과:

- **로딩 속도**: 30-50% 개선
- **데이터 사용량**: 20-40% 감소
- **사용자 경험**: 부드러운 로딩 애니메이션
- **SEO 점수**: Core Web Vitals 개선
- **모바일 성능**: 특히 모바일에서 큰 개선

## 🔮 향후 개선 계획

1. **WebP 이외 차세대 포맷**: AVIF 지원 추가
2. **이미지 CDN**: Cloudinary, Vercel Image 등 활용
3. **Progressive JPEG**: 점진적 로딩 구현
4. **AI 기반 압축**: 스마트 품질 조정
5. **캐싱 전략**: 브라우저 캐시 최적화

---

**참고**: 이 최적화는 지속적으로 모니터링하고 개선해야 합니다. 정기적으로 성능 테스트를 실행하고 결과를 분석하여 추가 최적화 기회를 찾아보세요. 