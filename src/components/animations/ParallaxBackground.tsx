import { useEffect, useState } from 'react';

interface ParallaxBackgroundProps {
  intensity?: number;
  className?: string;
}

export const ParallaxBackground = ({
  intensity = 0.5,
  className = '',
}: ParallaxBackgroundProps) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Gradient Orbs */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.15), transparent 60%)',
          left: '-10%',
          top: '10%',
          transform: `translateY(${scrollY * intensity * 0.3}px)`,
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.1), transparent 60%)',
          right: '-5%',
          top: '40%',
          transform: `translateY(${-scrollY * intensity * 0.2}px)`,
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.1), transparent 60%)',
          left: '30%',
          bottom: '10%',
          transform: `translateY(${-scrollY * intensity * 0.15}px)`,
        }}
      />
    </div>
  );
};
