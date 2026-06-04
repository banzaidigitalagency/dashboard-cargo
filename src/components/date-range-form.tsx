"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";

type Preset =
  | { kind: "days"; label: string; days: number }
  | { kind: "since"; label: string; since: string };

export function DateRangeForm({
  from,
  to,
  variant = "navy",
  /** Si fourni, on ajoute un preset "Depuis le début" qui démarre à cette date ISO. */
  earliestDate,
}: {
  from: string;
  to: string;
  variant?: "navy" | "light";
  earliestDate?: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [localFrom, setFrom] = useState(from);
  const [localTo, setTo] = useState(to);
  const [pending, start] = useTransition();
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    setFrom(from);
    setTo(to);
  }, [from, to]);

  const presets: Preset[] = [
    { kind: "days", label: "7 j", days: 7 },
    { kind: "days", label: "30 j", days: 30 },
    { kind: "days", label: "90 j", days: 90 },
    ...(earliestDate
      ? [{ kind: "since" as const, label: "Depuis le début", since: earliestDate }]
      : []),
  ];

  function apply(nextFrom: string, nextTo: string) {
    const params = new URLSearchParams(sp.toString());
    params.set("from", nextFrom);
    params.set("to", nextTo);
    start(() => router.push(`${pathname}?${params.toString()}`));
  }

  function applyPreset(p: Preset, key: string) {
    const today = new Date();
    const iso = (d: Date) => d.toISOString().slice(0, 10);
    let fromIso: string;
    if (p.kind === "days") {
      const f = new Date(today);
      f.setDate(today.getDate() - (p.days - 1));
      fromIso = iso(f);
    } else {
      fromIso = p.since;
    }
    const toIso = iso(today);
    setFrom(fromIso);
    setTo(toIso);
    setActiveKey(key);
    apply(fromIso, toIso);
  }

  const isNavy = variant === "navy";
  const presetBase = isNavy
    ? "text-white/70 hover:text-white hover:bg-white/10"
    : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--bg-2)]";
  const presetActive = isNavy
    ? "bg-[var(--green)] text-[var(--navy)] hover:bg-[var(--green)] hover:text-[var(--navy)]"
    : "bg-[var(--green-200)] text-[var(--navy)]";
  const wrapBg = isNavy
    ? "bg-white/10 border-white/10"
    : "bg-white border-[var(--hairline)]";
  const inputCls = isNavy
    ? "bg-transparent text-white placeholder-white/40 [color-scheme:dark]"
    : "bg-transparent text-[var(--ink)]";
  const sepCls = isNavy ? "text-white/40" : "text-[var(--muted-2)]";

  return (
    <div className="flex flex-wrap items-center gap-2 no-print">
      <div className={cn("flex items-center gap-1 rounded-full border p-1", wrapBg)}>
        {presets.map((p, i) => {
          const key = `${p.kind}-${p.kind === "days" ? p.days : p.since}-${i}`;
          return (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(p, key)}
              className={cn(
                "px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full transition whitespace-nowrap",
                activeKey === key ? presetActive : presetBase
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>
      <div className={cn("flex items-center gap-2 rounded-full border px-3 py-1", wrapBg)}>
        <input
          type="date"
          value={localFrom}
          onChange={(e) => {
            setFrom(e.target.value);
            setActiveKey(null);
          }}
          className={cn("text-xs outline-none", inputCls)}
        />
        <span className={sepCls}>→</span>
        <input
          type="date"
          value={localTo}
          onChange={(e) => {
            setTo(e.target.value);
            setActiveKey(null);
          }}
          className={cn("text-xs outline-none", inputCls)}
        />
        <button
          type="button"
          onClick={() => apply(localFrom, localTo)}
          className={cn(
            "ml-1 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full transition",
            isNavy
              ? "text-white hover:bg-white/10"
              : "text-[var(--navy)] hover:bg-[var(--bg-2)]"
          )}
          disabled={pending}
        >
          OK
        </button>
      </div>
    </div>
  );
}
