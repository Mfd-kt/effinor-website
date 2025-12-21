import React from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  subtitle?: string;
  center?: boolean;
}

export function SectionTitle({
  children,
  className,
  subtitle,
  center = false,
}: SectionTitleProps) {
  return (
    <div className={cn('mb-12', center && 'text-center')}>
      <h2
        className={cn(
          'text-3xl md:text-4xl font-extrabold text-[#111827] mb-4',
          className
        )}
      >
        {children}
      </h2>
      {subtitle && (
        <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}






