import React, { useState, useEffect } from 'react';

interface TypingTextProps {
  roles: string[];
  className?: string;
}

export const TypingText: React.FC<TypingTextProps> = ({ 
  roles = [
    "AI를 활용한 워크플로우 자동화를 설계합니다",
    "Carbon Management Expert", 
    "ESG Consultant",
    "지속가능한 미래를 설계합니다",
    "기술과 환경을 연결합니다"
  ],
  className = "font-semibold text-blue-600"
}) => {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const handleTyping = () => {
      const currentText = roles[currentRole];
      
      if (!isDeleting) {
        setDisplayText(currentText.substring(0, displayText.length + 1));
        
        if (displayText === currentText) {
          setTimeout(() => setIsDeleting(true), 2000);
          setTypingSpeed(50);
        }
      } else {
        setDisplayText(currentText.substring(0, displayText.length - 1));
        
        if (displayText === '') {
          setIsDeleting(false);
          setCurrentRole((prev) => (prev + 1) % roles.length);
          setTypingSpeed(100);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentRole, displayText, isDeleting, typingSpeed, roles]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}; 