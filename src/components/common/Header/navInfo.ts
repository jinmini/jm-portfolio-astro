type NavInfo = {
  name: string;
  path: string;
  animation: string;
};

const navInfo: NavInfo[] = [
  {
    name: '소개',
    path: '/about',
    animation: 'animate-[slideInStagger_0.6s_ease-out_forwards]',
  },
  {
    name: '프로젝트',
    path: '/project',
    animation: 'animate-[slideInStagger_0.6s_ease-out_0.1s_forwards]',
  },
  {
    name: '블로그',
    path: '/blog/all/page/1',
    animation: 'animate-[slideInStagger_0.6s_ease-out_0.2s_forwards]',
  },
];

export default navInfo;

export const NAV_INFO = {
  NAV_LINKS: [
    {
      name: 'About',
      path: '/about',
    },
    {
      name: 'Project',
      path: '/project',
    },
    {
      name: 'Blog',
      path: '/blog/all/page/1',
    },
  ],
}; 