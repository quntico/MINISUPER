
import React from 'react';
import { cn } from '@/lib/utils';

const Badge = ({ 
  children, 
  variant = 'default',
  className 
}) => {
  const variants = {
    default: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary text-secondary-foreground border-border',
    success: 'bg-primary/10 text-primary border-primary/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    danger: 'bg-destructive/10 text-destructive border-destructive/20',
    outline: 'bg-transparent border-border text-foreground'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border transition-colors duration-200',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
