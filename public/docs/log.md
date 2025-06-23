## 250623

## To do list
1. 개인 포트폴리오 Projcet, Story 하나씩 완성해보기! 


### 09:30 ~ 10:30
- `src\content\config.ts`에서 데이터 구조를 파악함
-   개선할 점
    - (1) loader 속성은 이제 사용되지 않음. Astro 2.5 버전에서 사용 중단됨. 구조를 Astro가 자동으로 인식함. -> legacy
    - `import { glob } from 'astro/loaders';` 라인 삭제!

    But !!  glob loader는 Astro 5.0의 최신 Content Layer API이다. 더 유연한 콘텐츠 로딩을 제공한다!
    
    - (2) category의 타입 안정성 부족
    - story 컬렉션의 `category: z.string()`은 위험. 카테고리별 필터링 시 버그를 유발하고 일관성을 해침.
    문자열에 의존하는 타입은 확장성을 저해하는 주범.

    - 해결 방안
        `category: z.enum(['frontend', 'backend', 'fullstack', 'mobile', 'ai'])`
        `category: z.union([z.literal('Frontend'), z.literal('Backend'), z.literal('Mobile')])`
    

    - (3) thumbnail의 잠재력 미활용
    - `thumbnail : z.string()`은 단순히 이미지 경로만 저장. 이미지가 깨지거나, 최적화되지 않은 큰 이미지를 그대로 사용하게 될 위험!
    Astro의 강력한 **에셋 관리(Assets Handling)** 기능을 사용하고 있지 않음. 빌드 시 이미지 최적화와 타입 안전성을 모두 놓침!

    - 해결 방안
        `thumbnail: image().optional()`
        더 고급 해결 방안!
```
thumbnail: z.object({
src: image(),
alt: z.string(),
caption: z.string().optional()
})
```

    - (4) 중복 schema
    - project와 story schema는 title, description, date 등 많은 필드를 공유. 공통 필드를 수정해야 할 때 두 곳을 모두 고쳐야 함! -> 공통 베이스 스키마를 만들자!
    'Dry(Don't Repeat Yourself)' 원칙을 적용하여 코드를 더 효율적으로 만들 수 있음.


### 10:40 ~ 11:40
- 프로젝트가 더 복잡해져서, 특정 project 게시물과 연관된 story 게시물들을 연결하고 싶다면 두 컬렉션 간의 관계(Relation)를 어떻게 설정할 수 있을까?

- Astro 3.0부터 도입된 reference() 헬퍼는 타입-세이프한 방식으로 다른 컬렉션의 항목을 직접 참조할 수 있게 해주는 가장 현대적이고 안전한 방법. 

setp 1 : 스키마 수정(src/content/config.ts)
`story` 컬렉션의 스키마에 `relateProject` 라는 새로운 필드를 추가

`relatedStory : reference('story').opional()`

step 2 : 콘텐츠(마크다운)에서 관계 연결
- story 게시물 마크다운 파일의 프론트매터에서 관련 project의 slug를 지정

step 3 : 페이지에서 관계 데이터 사용하기
- story 상세 페이지에서 연결된 project 정보를 가져와 표시할 수 있음. 

하나의 project는 여러 story와 연관되어 있음. 1:1 또는 1:N 관계가 명확!

### 11:50 ~ 12:50
- step 1 : 사이트 전체 구조 및 라우팅 확정(The Blueprint)
사용자가 어떻게 사이트를 탐색할 것인가?를 결정
목적 : 구직을 위함! 나의 정체성 나타내기! 및 성과가 있는 내용을 메인에 표시! 
- 레이아웃 일관성! 일관된 너비 시스템! 


- step 2 : 실제 콘텐츠 채우기(The Content-First Approach)
디자인은 콘텐츠를 담는 그릇! 내용부터 채우자! 
project와 story 컬렉션에 들어갈 실제 내 콘텐츠 최소 3~5개를 작성하자! 
이 과정에서 기존에 정의한 컬렉션 스키마가 충분한지, 혹은 부족한 필드가 있는지 자연스럽게 검증!
(ex : "아, 프로젝트에 사용된 기술 스택을 보여줄 `techstack`이 필요하구나!")

- step 3 : 핵심 컴포넌트 재사용성 강화 및 디테일 다음기 (The Design System)
개별 페이지를 꾸미는 것이 아니라 재사용 가능한 부품(컴포넌트)을 만드는데 집중!

- Card Component : Project와 Story 목록에 사용될 카드 UI를 확정!
- Tag/Badge Component : 태그를 보여주는 UI를 컴포넌트로 만든다.
- 타이포그래피 시스템 : `<h1>, <h2>, <p>` 등 텍스트 스타일을 `prose` 클래스 등을 이용해 일관되게 정의
- 반응형 디자인 : 1단계에서 정의한 레이아웃과 3단계에서 만든 컴포넌트들이 모바일, 태블릿, 데스크탑에서 모두 잘 보이도록!

- Step 4 : 최종 폴리싱 및 최적화
- 애니메이션/트랜지션 : 부드러운 페이지 전환, 호버 효과 등 사용자 경험을 향상
- 접근성 검사 : 키보드만으로 사이트 탐색이 가능한지, 스크린 리더가 콘텐츠를 잘 읽어주는지 등
- 성능 최적화 : Lighthouse 점수를 측정하고, 이미지 최적화 등을 다시 한번 점검
- SEO 최적화 : 메타 태그, OpenGraph 태그 등이 모든 페이지에 잘 적용되었는지 확인!

# 현재 페이지 구조 조사

## 📊 페이지 레이아웃 일관성 분석 (Playwright MCP 조사)

### 🌐 전체 사이트 구조 개요
**조사 일시**: 2025.06.23 12:10~12:20  
**조사 도구**: Playwright MCP  
**조사 범위**: 4개 핵심 페이지

---

### 📋 페이지별 상세 분석

#### 1. **메인 페이지** (`http://localhost:4322`)
**페이지 제목**: "김진민 - 지속가능한 미래를 코드로 만드는 개발자"

**✅ 레이아웃 구조**:
- **Header**: Fixed navigation (Portfolio 로고 + 소개/프로젝트/스토리 메뉴)
- **Hero Section**: 3D 환경 로딩 + 메인 소개 (안녕하세요! 👋)
- **Features Section**: 3컬럼 그리드 (ESG & 탄소중립 / Full-stack 개발 / 자동화 & 최적화)
- **Projects Section**: 주요 프로젝트 1개 Featured + "모든 프로젝트 보기" CTA
- **Stories Section**: 빈 상태 ("스토리를 준비 중입니다")
- **Contact Section**: 이메일 보내기 CTA
- **Footer**: Copyright 정보

**🎯 특징**: 랜딩 페이지 최적화, 명확한 CTA 배치

---

#### 2. **About 페이지** (`http://localhost:4322/about`)
**페이지 제목**: "소개 - 포트폴리오"

**✅ 레이아웃 구조**:
- **Header**: 동일한 Fixed navigation
- **About Me**: 개인정보 리스트 (이름, 닉네임, 이메일, 관심사, 소개)
- **Work Experience**: 테이블 형태 (period, position, company, projects, tech)
- **주요 성과**: 불릿 포인트 리스트
- **ESG 활동 연혁**: 인터랙티브 타임라인 (필터 버튼 + 카드 리스트)
- **Communities**: 멀티 섹션 (커뮤니티 활동, 멘토링 & 교육, 수상 경력)
- **Footer**: 동일한 Copyright

**🎯 특징**: 콘텐츠 중심, 체계적 정보 구조

---

#### 3. **프로젝트 리스트** (`http://localhost:4322/project/page/1`)
**페이지 제목**: "프로젝트 (1/1) - 포트폴리오"

**✅ 레이아웃 구조**:
- **Header**: 동일한 Fixed navigation
- **Page Title**: "프로젝트" H1
- **Project Article**: 단일 프로젝트 카드
  - **왼쪽**: 이미지 + Featured 배지 + 호버 오버레이 (GitHub/사이트/상세보기 버튼)
  - **오른쪽**: 제목, 설명, 태그들, 날짜 + 링크들
- **Footer**: 동일한 Copyright

**🎯 특징**: 지그재그 레이아웃, 호버 인터랙션

---

#### 4. **프로젝트 상세** (`http://localhost:4322/project/sample-project.mdx`)
**페이지 제목**: "Astro 5.0 포트폴리오 사이트 - 포트폴리오"

**✅ 레이아웃 구조**:
- **Header**: 동일한 Fixed navigation
- **Back Button**: "프로젝트 목록으로 돌아가기"
- **Hero Section**: 2컬럼 (이미지 + 프로젝트 정보)
- **Article Content**: 마크다운 렌더링 
  - 구조화된 헤딩 (주요 특징, 기술 스택, 구현 기능, 성능 최적화, 프로젝트 성과)
  - 불릿 포인트 리스트
  - 정리 문단
- **Footer**: 동일한 Copyright

**🎯 특징**: 2컬럼 헤더 + 마크다운 콘텐츠

---

### 🔍 **레이아웃 일관성 분석 결과**

#### ✅ **일관성이 잘 유지되는 요소**:
1. **Header Navigation**: 모든 페이지 동일한 구조 (Fixed + 3개 메뉴)
2. **Footer**: 동일한 Copyright 정보
3. **페이지 제목**: H1 태그 사용 일관성
4. **Responsive Container**: px-6 lg:max-w-[1024px] 패턴 유지

#### ⚠️ **개선이 필요한 부분**:
1. **페이지 간 섹션 여백**: Section 컴포넌트 사용이 일부만 적용됨
2. **콘텐츠 너비**: About 페이지 테이블과 다른 페이지 간 최대 너비 차이
3. **버튼 스타일**: CTA 버튼 디자인 통일성 부족
4. **카드 컴포넌트**: 프로젝트 카드와 메인 페이지 프로젝트 섹션 스타일 차이

---

### 📋 **개선 권장사항**

#### 1. **공통 레이아웃 시스템 강화**
- Section + Responsive 컴포넌트를 모든 페이지에 일관되게 적용
- 여백(margin, padding) 체계 표준화

#### 2. **컴포넌트 재사용성 향상**
- ProjectCard 컴포넌트 통합
- Button 컴포넌트 스타일 가이드 정립
- Typography 시스템 일관성 강화

#### 3. **콘텐츠 구조 최적화**
- 각 페이지의 정보 계층 구조 재검토
- CTA 배치 전략 일관성 확보

**다음 단계**: 공통 컴포넌트 시스템 구축 및 레이아웃 일관성 강화 작업 진행