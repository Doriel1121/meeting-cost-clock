import * as React from "react";
import { cn } from "@/lib/utils";

interface AlertProps {
  title: string;
  description?: string;
  variant?: "error" | "info" | "success";
  className?: string;
}

export function Alert({ title, description, variant = "info", className }: AlertProps) {
  const styles = {
    error: "border-status-danger bg-status-danger/10 text-status-danger",
    info: "border-border-default bg-surface-secondary text-text-primary",
    success: "border-status-success bg-status-success/10 text-status-success",
  } as const;

  return (
    <div role="alert" className={cn("rounded-md border p-3 text-sm", styles[variant], className)}>
      <p className="font-medium">{title}</p>
      {description ? <p className="mt-1 opacity-90">{description}</p> : null}
    </div>
  );
}
