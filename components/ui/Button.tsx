import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md px-6 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#10B981] text-white hover:bg-[#059669] focus:ring-[#10B981]',
    secondary: 'bg-white border-2 border-[#10B981] text-[#10B981] hover:bg-[#10B981]/10 focus:ring-[#10B981]',
    outline: 'bg-transparent border-2 border-[#334155] text-[#111827] hover:bg-[#334155]/10 focus:ring-[#334155]',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}






