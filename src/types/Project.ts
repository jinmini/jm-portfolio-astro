export type Project = {
  id: number;
  title: string;
  description: string;
  year: string;
  tags: string[];
  thumbnail?: string; // 썸네일은 선택적으로 사용될 수 있음
  images: string[];
  links: {
    github?: string;
    site?: string;
  };
  featured: boolean;
  details: string[];
}; 