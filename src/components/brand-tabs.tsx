"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "", label: "Vue d'ensemble", num: "00" },
  { key: "meta", label: "Meta Ads", num: "01" },
  { key: "tiktok", label: "TikTok Ads", num: "02" },
  { key: "programmatic", label: "Programmatique", num: "03" },
];

export function BrandTabs({ brand }: { brand: string }) {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 -mb-px border-b border-[var(--hairline)] overflow-x-auto no-print">
      {TABS.map((t) => {
        const href = t.key ? `/${brand}/${t.key}` : `/${brand}`;
        const active = pathname === href;
        return (
          <Link
            key={t.key}
            href={href}
            className={cn(
              "flex items-baseline gap-2 px-4 py-3.5 text-sm border-b-2 transition whitespace-nowrap",
              active
                ? "border-[var(--navy)] text-[var(--ink)] font-medium"
                : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]"
            )}
          >
            <span
              className={cn(
                "text-[10px] tabular-nums tracking-wider",
                active ? "text-[var(--green-600)]" : "text-[var(--muted-2)]"
              )}
            >
              /{t.num}
            </span>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
