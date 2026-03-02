import { useEffect, useState } from 'react';

interface FloatingElement {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface FloatingElementsProps {
  variant?: 'diamonds' | 'circles' | 'stars' | 'mixed';
  count?: number;
  className?: string;
}

export const FloatingElements = ({
  variant = 'diamonds',
  count = 15,
  className = '',
}: FloatingElementsProps) => {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const newElements: FloatingElement[] = [];
    for (let i = 0; i < count; i++) {
      newElements.push({
        id: i,
        size: Math.random() * 60 + 20,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.15 + 0.05,
      });
    }
    setElements(newElements);
  }, [count]);

  const renderShape = (element: FloatingElement, index: number) => {
    const baseStyle = {
      left: `${element.x}%`,
      top: `${element.y}%`,
      animationDuration: `${element.duration}s`,
      animationDelay: `${element.delay}s`,
      opacity: element.opacity,
    };

    const shapeType = variant === 'mixed' 
      ? ['diamonds', 'circles', 'stars'][index % 3] 
      : variant;

    switch (shapeType) {
      case 'diamonds':
        return (
          <div
            key={element.id}
            className="floating-element absolute rotate-45"
            style={{
              ...baseStyle,
              width: element.size,
              height: element.size,
              background: 'linear-gradient(135deg, hsl(var(--accent) / 0.3), transparent)',
              border: '1px solid hsl(var(--accent) / 0.2)',
            }}
          />
        );
      case 'circles':
        return (
          <div
            key={element.id}
            className="floating-element absolute rounded-full"
            style={{
              ...baseStyle,
              width: element.size,
              height: element.size,
              background: 'radial-gradient(circle, hsl(var(--accent) / 0.2), transparent)',
            }}
          />
        );
      case 'stars':
        return (
          <div
            key={element.id}
            className="floating-element-sparkle absolute"
            style={{
              ...baseStyle,
              width: element.size / 3,
              height: element.size / 3,
              background: 'hsl(var(--accent))',
              borderRadius: '50%',
              boxShadow: `0 0 ${element.size}px ${element.size / 2}px hsl(var(--accent) / 0.3)`,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {elements.map((element, index) => renderShape(element, index))}
    </div>
  );
};
