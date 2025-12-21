import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'amber' | 'emerald';
  className?: string;
}

export function Badge({ children, variant = 'amber', className }: BadgeProps) {
  const variants = {
    amber: 'bg-[#F59E0B]/10 text-[#F59E0B]',
    emerald: 'bg-[#10B981]/10 text-[#10B981]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}






