import { useState, useEffect } from 'react';

const ThemeToggleButton = () => {
  const [theme, setTheme] = useState<string | null>(null);

  // 이 effect는 클라이언트에서 컴포넌트가 마운트된 후 한 번만 실행됩니다.
  // BaseLayout.astro의 인라인 스크립트가 이미 설정한 테마를 읽어와 React 상태와 동기화합니다.
  useEffect(() => {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    setTheme(currentTheme);
  }, []);

  // 이 effect는 theme 상태가 변경될 때마다 실행됩니다.
  useEffect(() => {
    // 테마가 아직 설정되지 않았다면(초기 렌더링 시) 아무것도 하지 않습니다.
    if (theme === null) return;

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // 사용자의 선택을 localStorage에 저장합니다.
    localStorage.setItem('theme', theme);
    // Astro의 View Transitions를 위해 data-theme 속성도 업데이트합니다.
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleClick = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  // 테마가 결정되기 전에 잘못된 아이콘이 잠시 보이는 것을 방지하기 위해
  // 자리표시자를 렌더링하여 레이아웃 깨짐을 방지합니다.
  if (theme === null) {
    return <div className="w-10 h-10" aria-hidden="true" />;
  }

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        // Sun icon for light mode
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggleButton; 