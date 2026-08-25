import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  if (align === "center") {
    return (
      <div className={cn("mx-auto mb-10 max-w-2xl text-center", className)}>
        <p className="flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div>
        <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
