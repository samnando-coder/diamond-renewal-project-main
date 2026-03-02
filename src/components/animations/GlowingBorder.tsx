import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlowingBorderProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  borderRadius?: string;
}

export const GlowingBorder = ({
  children,
  className,
  glowColor = 'hsl(var(--accent))',
  borderRadius = '0.25rem',
}: GlowingBorderProps) => {
  return (
    <div
      className={cn('relative group', className)}
      style={{ borderRadius }}
    >
      {/* Animated gradient border */}
      <div
        className="absolute -inset-[1px] rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${glowColor}, transparent, ${glowColor})`,
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 3s ease infinite',
        }}
      />
      
      {/* Glow effect */}
      <div
        className="absolute -inset-[2px] rounded-[inherit] opacity-0 group-hover:opacity-50 blur-sm transition-opacity duration-500"
        style={{
          background: glowColor,
        }}
      />

      {/* Content */}
      <div className="relative bg-card rounded-[inherit] h-full">
        {children}
      </div>
    </div>
  );
};
