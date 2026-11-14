import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Select({ label, options, value, onChange, className }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-text-secondary">{label}</label>
      <select
        className={cn(
          "h-10 w-full rounded-md border border-border-default bg-surface-primary px-3 text-text-primary focus:border-focus-ring focus:outline-none focus:ring-2 focus:ring-focus-ring",
          className,
        )}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select…</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
