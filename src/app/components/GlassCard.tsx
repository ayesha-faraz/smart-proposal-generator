import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = false }: GlassCardProps) {
  return (
    <div
      className={`
        bg-[rgba(255,255,255,0.65)]
        border border-[rgba(174,195,176,0.35)]
        rounded-[20px]
        backdrop-blur-[20px]
        shadow-[0_4px_24px_rgba(15,42,29,0.06),0_1px_4px_rgba(15,42,29,0.04)]
        transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${hover ? 'hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(15,42,29,0.1)]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
