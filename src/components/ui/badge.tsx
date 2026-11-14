import { cn } from '@/lib/utils.js';

export const Badge = ({ variant = 'info', children }: { variant?: 'info' | 'success' | 'danger', children: React.ReactNode }) => {
  const variants = {
    info: 'bg-status-info text-white',
    success: 'bg-status-success text-white',
    danger: 'bg-status-danger text-white',
  };
  return <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase', variants[variant])}>{children}</span>;
};