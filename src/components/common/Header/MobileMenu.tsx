import React from 'react';
import { twMerge } from 'tailwind-merge';
import { IconX } from '@tabler/icons-react';
import navInfo from './navInfo';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* 메뉴 패널 */}
      <div className="absolute inset-0 flex">
        <nav className="flex flex-col justify-center px-8">
          <ul className="space-y-8">
            {navInfo.map(({ path, name, animation }, index) => (
              <li 
                key={path} 
                className={twMerge('opacity-0 -translate-x-8', animation)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <a 
                  href={path}
                  className="block text-4xl font-bold text-white hover:text-blue-400 transition-colors duration-300"
                  onClick={onClose}
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-white hover:text-blue-400 transition-colors"
          aria-label="메뉴 닫기"
        >
          <IconX size={28} />
        </button>
      </div>
    </div>
  );
}; 