"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "", label: "Vue d'ensemble" },
  { key: "meta", label: "Meta Ads" },
  { key: "tiktok", label: "TikTok Ads" },
  { key: "programmatic", label: "Programmatique" },
];

export function BrandTabs({ brand }: { brand: string }) {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 -mb-px">
      {TABS.map((t) => {
        const href = t.key ? `/${brand}/${t.key}` : `/${brand}`;
        const active = pathname === href;
        return (
          <Link
            key={t.key}
            href={href}
            className={cn(
              "px-4 py-3 text-sm border-b-2 transition",
              active ? "border-neutral-900 text-neutral-900 font-medium" : "border-transparent text-neutral-500 hover:text-neutral-900"
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
