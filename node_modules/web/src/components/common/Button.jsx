
import React from 'react';
import { cn } from '@/lib/utils';

const Button = React.forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'default',
  className,
  disabled,
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md',
    outline: 'border-2 border-border bg-transparent hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline'
  };
  
  const sizes = {
    sm: 'h-9 px-3 text-sm rounded-lg',
    default: 'h-11 px-6 text-base rounded-xl',
    lg: 'h-14 px-8 text-lg rounded-xl',
    xl: 'h-16 px-10 text-xl rounded-2xl font-semibold'
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
