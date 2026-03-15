
import React from 'react';
import { cn } from '@/lib/utils';

const FormInput = React.forwardRef(({ 
  label, 
  error, 
  className,
  containerClassName,
  ...props 
}, ref) => {
  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-base text-foreground placeholder:text-muted-foreground transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
