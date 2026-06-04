import { cn } from "@/lib/utils";
import * as React from "react";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-card
      className={cn("rounded-xl border border-[var(--hairline)] bg-white", className)}
      style={{ boxShadow: "var(--shadow-card)" }}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 pt-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-[11px] uppercase tracking-[0.12em] text-[var(--muted)] font-medium",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 py-5", className)} {...props} />;
}

type BadgeVariant = "default" | "boost" | "dark" | "muted" | "live" | "soon";

export function Badge({
  className,
  children,
  variant = "default",
}: {
  className?: string;
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  const styles: Record<BadgeVariant, string> = {
    default: "bg-[var(--bg-2)] text-[var(--ink-2)] border border-[var(--hairline)]",
    boost:
      "bg-[var(--green-200)] text-[var(--navy)] border border-[color:var(--green-600)]/30",
    dark: "bg-[var(--navy)] text-white",
    muted: "bg-[var(--bg-2)] text-[var(--muted)] border border-[var(--hairline)]",
    live:
      "bg-transparent text-[var(--navy)] border border-[var(--hairline-strong)] before:content-[''] before:inline-block before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--green-600)] before:mr-1.5 before:align-middle",
    soon:
      "bg-transparent text-[var(--muted)] border border-dashed border-[var(--hairline-strong)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--hairline-strong)] bg-white p-10 text-center">
      <p className="text-sm font-medium text-[var(--ink)]">{title}</p>
      {description && (
        <p className="text-sm text-[var(--muted)] mt-1">{description}</p>
      )}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        {eyebrow && (
          <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] mb-1">
            {eyebrow}
          </div>
        )}
        <h2 className="font-display text-2xl font-semibold text-[var(--ink)] leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-[var(--muted)] mt-1.5 max-w-2xl">{subtitle}</p>
        )}
      </div>
      {right}
    </div>
  );
}
