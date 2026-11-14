import * as React from 'react';
import { cn } from '@/lib/utils.js';

export const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={cn('rounded-md border border-border-default bg-surface-primary p-6 shadow-elevation-1', className)}>
    {children}
  </div>
);