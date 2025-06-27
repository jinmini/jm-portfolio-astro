import type { Project } from '../types/Project';

// 전역 상태 변수
let currentProject: Project | null = null;
let currentSlideIndex = 0;
let projectsData: Project[] = [];

// DOM 요소 참조 (한 번만 조회하여 성능 최적화)
const modalElement = document.getElementById('projectModal') as HTMLElement;
const modalTitle = document.getElementById('modalTitle') as HTMLElement;
const currentSlide = document.getElementById('currentSlide') as HTMLElement;
const indicatorsContainer = document.getElementById('slideIndicators') as HTMLElement;
const modalContent = document.getElementById('modalContent') as HTMLElement;
const prevBtn = document.getElementById('prevBtn') as HTMLButtonElement;
const nextBtn = document.getElementById('nextBtn') as HTMLButtonElement;


// 모달 컨텐츠 업데이트
function updateModalContent() {
  if (!currentProject) return;

  modalContent.innerHTML = `
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-3">프로젝트 개요</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">${currentProject.description}</p>
        
        <div class="mb-4">
          <span class="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">기술 스택</span>
          <div class="flex flex-wrap gap-2">
            ${currentProject.tags.map(tag => 
              `<span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-sm rounded-full font-medium">${tag}</span>`
            ).join('')}
          </div>
        </div>
      </div>
      
      <div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-3">주요 기능</h3>
        <ul class="space-y-2 text-gray-600 dark:text-gray-300">
          ${currentProject.details.map(detail => 
            `<li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              ${detail}
            </li>`
          ).join('')}
        </ul>
      </div>
    </div>
  `;
}

// 슬라이더 이동
function goToSlide(index: number) {
  currentSlideIndex = index;
  updateSlider();
}

// 슬라이더 업데이트
function updateSlider() {
  if (!currentProject) return;

  // 현재 슬라이드 이미지 또는 더미 컨텐츠 표시
  const imageSrc = currentProject.images[currentSlideIndex];
  currentSlide.innerHTML = imageSrc 
    ? `<img src="${imageSrc}" alt="${currentProject.title} 이미지 ${currentSlideIndex + 1}" class="w-full h-full object-cover">`
    : `
      <div class="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white">
        <div class="text-center">
          <div class="text-8xl mb-4">🎨</div>
          <div class="text-2xl font-bold">${currentProject.title}</div>
          <div class="text-lg opacity-75">이미지 없음</div>
        </div>
      </div>
    `;

  // 인디케이터 업데이트
  indicatorsContainer.innerHTML = '';
  currentProject.images.forEach((_, index) => {
    const indicator = document.createElement('button');
    indicator.className = `w-3 h-3 rounded-full transition-colors ${
      index === currentSlideIndex ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
    }`;
    indicator.onclick = () => goToSlide(index);
    indicatorsContainer.appendChild(indicator);
  });

  // 네비게이션 버튼 표시/숨김
  const hasMultipleImages = currentProject.images.length > 1;
  prevBtn.style.display = hasMultipleImages ? 'block' : 'none';
  nextBtn.style.display = hasMultipleImages ? 'block' : 'none';
}


// 이전/다음 슬라이드
function previousSlide() {
  if (!currentProject) return;
  currentSlideIndex = currentSlideIndex > 0 ? currentSlideIndex - 1 : currentProject.images.length - 1;
  updateSlider();
}

function nextSlide() {
  if (!currentProject) return;
  currentSlideIndex = currentSlideIndex < currentProject.images.length - 1 ? currentSlideIndex + 1 : 0;
  updateSlider();
}

// 모달 열기
function openProjectModal(projectId: number) {
  const project = projectsData.find(p => p.id === projectId);
  if (!project) return;
  
  currentProject = project;
  currentSlideIndex = 0;
  
  modalTitle.textContent = currentProject.title;
  updateSlider();
  updateModalContent();
  
  modalElement.classList.remove('hidden');
  modalElement.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

// 모달 닫기
function closeProjectModal() {
  modalElement.classList.add('hidden');
  modalElement.classList.remove('flex');
  document.body.style.overflow = 'auto';
  currentProject = null;
}

/**
 * 프로젝트 모달 기능을 초기화합니다.
 * Astro 페이지에서 한 번만 호출되어야 합니다.
 * @param data - 표시할 프로젝트 데이터 배열
 */
export function initProjectModal(data: Project[]) {
  if (!modalElement) return; // 모달이 없는 페이지에서는 실행하지 않음

  projectsData = data;

  // Astro 컴포넌트의 onclick에서 호출할 수 있도록 함수들을 window 객체에 할당
  (window as any).openProjectModal = openProjectModal;
  (window as any).closeProjectModal = closeProjectModal;
  (window as any).previousSlide = previousSlide;
  (window as any).nextSlide = nextSlide;
  (window as any).goToSlide = goToSlide;

  // 이벤트 리스너 설정
  modalElement.addEventListener('click', (e) => {
    if (e.target === modalElement) {
      closeProjectModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
    }
  });
} 