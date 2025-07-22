import { atom } from 'nanostores';
import type { CollectionEntry } from 'astro:content';

// 모달 열림/닫힘 상태
export const isModalOpen = atom<boolean>(false);

// 현재 선택된 프로젝트
export const currentProject = atom<CollectionEntry<'project'> | null>(null);

// 모달 열기 액션
export function openModal(project: CollectionEntry<'project'>) {
  currentProject.set(project);
  isModalOpen.set(true);
  document.body.style.overflow = 'hidden';
}

// 모달 닫기 액션
export function closeModal() {
  isModalOpen.set(false);
  currentProject.set(null);
  document.body.style.overflow = 'auto';
}

// 프로젝트 slug로 모달 열기 (기존 API 호환성)
export function openModalBySlug(slug: string, projects: CollectionEntry<'project'>[]) {
  const project = projects.find(p => p.slug === slug);
  if (project) {
    openModal(project);
  }
} 