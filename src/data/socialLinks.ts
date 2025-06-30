/**
 * 소셜 링크 중앙 관리 모듈
 * 모든 소셜 미디어 링크를 한 곳에서 관리하여 일관성과 유지보수성을 확보합니다.
 */

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  external?: boolean;
}

// 기본 소셜 링크 정보
export const SOCIAL_LINKS = {
  github: 'https://github.com/jinmini',
  linkedin: 'https://www.linkedin.com/in/%EC%A7%84%EB%AF%BC-%EA%B9%80-645372372/',
  email: 'mailto:charmjinmean@gmail.com'
} as const;

// Footer용 소셜 링크 배열 (기존 MainGridLayout.astro 호환)
export const socialLinksArray: SocialLink[] = [
  {
    name: 'GitHub',
    url: SOCIAL_LINKS.github,
    icon: 'github',
    external: true
  },
  {
    name: 'LinkedIn', 
    url: SOCIAL_LINKS.linkedin,
    icon: 'linkedin',
    external: true
  },
  {
    name: 'Email',
    url: SOCIAL_LINKS.email,
    icon: 'email',
    external: false
  }
];

// 개별 접근용 (HeroProfileCard 등에서 사용)
export const getSocialLink = (platform: keyof typeof SOCIAL_LINKS) => {
  return SOCIAL_LINKS[platform];
};

// 타입 안전성을 위한 타입 export
export type SocialPlatform = keyof typeof SOCIAL_LINKS;
