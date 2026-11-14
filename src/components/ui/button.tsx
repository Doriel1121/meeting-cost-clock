import * as React from 'react';
import { cn } from '@/lib/utils.js';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'primary', loading, disabled, children, ...props }, ref) => {
  const variants = {
    primary: 'bg-accent-primary text-white hover:bg-opacity-90',
    secondary: 'bg-surface-secondary text-text-primary hover:bg-surface-primary border border-border-default',
    danger: 'bg-status-danger text-white hover:bg-opacity-90',
  };
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn('inline-flex items-center justify-center rounded-md px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-focus-ring disabled:opacity-60', variants[variant], className)}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
});
Button.displayName = 'Button';