import * as React from 'react';
import { cn } from '@/lib/utils.js';

interface InputNumberProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
}

export const InputNumber = ({ label, error, className, ...props }: InputNumberProps) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-text-secondary">{label}</label>
    <input
      type="number"
      className={cn('h-10 w-full rounded-md border border-border-default bg-surface-primary px-3 text-text-primary focus:border-focus-ring focus:outline-none focus:ring-2 focus:ring-focus-ring', error && 'border-status-danger', className)}
      {...props}
    />
    {error && <span className="text-xs text-status-danger">{error}</span>}
  </div>
);