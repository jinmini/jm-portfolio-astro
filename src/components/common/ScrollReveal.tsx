import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  delay?: number;
  duration?: number;
  distance?: string;
  threshold?: number;
  once?: boolean;
  className?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 600,
  distance = '30px',
  threshold = 0.1,
  once = true,
  className = '',
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
            if (once) {
              setHasAnimated(true);
            }
          }, delay);
        } else if (!once && !hasAnimated) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [delay, threshold, once, hasAnimated]);

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return `translateY(${distance})`;
      case 'down':
        return `translateY(-${distance})`;
      case 'left':
        return `translateX(${distance})`;
      case 'right':
        return `translateX(-${distance})`;
      case 'fade':
        return 'translateY(0)';
      default:
        return `translateY(${distance})`;
    }
  };

  const animationStyles = {
    transform: isVisible ? 'translate(0, 0)' : getInitialTransform(),
    opacity: isVisible ? 1 : 0,
    transition: `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
  };

  return (
    <div
      ref={elementRef}
      className={className}
      style={animationStyles}
    >
      {children}
    </div>
  );
};

export default ScrollReveal; 