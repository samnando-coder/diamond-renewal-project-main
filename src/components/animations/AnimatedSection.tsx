import { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'scale-up' | 'blur-in';
  delay?: number;
  duration?: number;
}

export const AnimatedSection = ({
  children,
  className,
  animation = 'fade-up',
  delay = 0,
  duration = 800,
}: AnimatedSectionProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const baseStyles = 'transition-all ease-out';

  const animationStyles = {
    'fade-up': {
      initial: 'opacity-0 translate-y-12',
      visible: 'opacity-100 translate-y-0',
    },
    'fade-in': {
      initial: 'opacity-0',
      visible: 'opacity-100',
    },
    'fade-left': {
      initial: 'opacity-0 -translate-x-12',
      visible: 'opacity-100 translate-x-0',
    },
    'fade-right': {
      initial: 'opacity-0 translate-x-12',
      visible: 'opacity-100 translate-x-0',
    },
    'scale-up': {
      initial: 'opacity-0 scale-95',
      visible: 'opacity-100 scale-100',
    },
    'blur-in': {
      initial: 'opacity-0 blur-sm',
      visible: 'opacity-100 blur-0',
    },
  };

  const currentAnimation = animationStyles[animation];

  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        isVisible ? currentAnimation.visible : currentAnimation.initial,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};
