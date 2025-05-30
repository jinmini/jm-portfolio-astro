import React, { useState, useEffect } from 'react';
import { IconMenu2 } from '@tabler/icons-react';
import { MobileMenu } from './MobileMenu';

export const MobileMenuButton: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  // 메뉴가 열릴 때 스크롤 방지
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // ESC 키로 메뉴 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleMenuClose();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <>
      <button
        onClick={handleMenuToggle}
        className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
        aria-label="메뉴 열기"
        aria-expanded={isMenuOpen}
      >
        <IconMenu2 size={24} />
      </button>
      
      <MobileMenu isOpen={isMenuOpen} onClose={handleMenuClose} />
    </>
  );
}; 