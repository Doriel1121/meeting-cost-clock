import * as React from 'react';
import { cn } from '@/lib/utils.js';

export const TextDisplay = ({ variant = 'body', children, className }: { variant?: 'heading' | 'body' | 'label', children: React.ReactNode, className?: string }) => {
  const classes = {
    heading: 'text-2xl font-bold tracking-tight text-text-primary',
    body: 'text-sm text-text-secondary',
    label: 'text-xs font-semibold uppercase text-text-primary',
  };
  return <div className={cn(classes[variant], className)}>{children}</div>;
};