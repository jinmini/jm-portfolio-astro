export type Project = {
  id: number;
  title: string;
  description: string;
  year: string;
  tags: string[];
  thumbnail?: string; // 썸네일은 선택적으로 사용될 수 있음
  video?: {
    url: string; // 영상 파일 URL
    thumbnail?: string; // 영상 썸네일 (비디오 포스터)
    autoplay?: boolean; // 자동재생 여부 (기본값: false)
    loop?: boolean; // 반복재생 여부 (기본값: true)
  };
  images: string[];
  links: {
    github?: string;
    site?: string;
  };
  featured: boolean;
  details: string[];
}; 