"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";

const PRESETS = [
  { label: "7 jours", days: 7 },
  { label: "30 jours", days: 30 },
  { label: "90 jours", days: 90 },
];

export function DateRangeForm({ from, to }: { from: string; to: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [localFrom, setFrom] = useState(from);
  const [localTo, setTo] = useState(to);
  const [pending, start] = useTransition();

  function apply(nextFrom: string, nextTo: string) {
    const params = new URLSearchParams(sp.toString());
    params.set("from", nextFrom);
    params.set("to", nextTo);
    start(() => router.push(`${pathname}?${params.toString()}`));
  }

  function applyPreset(days: number) {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - (days - 1));
    const iso = (d: Date) => d.toISOString().slice(0, 10);
    setFrom(iso(from));
    setTo(iso(to));
    apply(iso(from), iso(to));
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 rounded-md border border-neutral-200 bg-white p-1">
        {PRESETS.map((p) => (
          <button
            key={p.days}
            type="button"
            onClick={() => applyPreset(p.days)}
            className="px-3 py-1 text-xs text-neutral-600 hover:bg-neutral-100 rounded"
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-1.5">
        <input
          type="date"
          value={localFrom}
          onChange={(e) => setFrom(e.target.value)}
          className="text-sm bg-transparent outline-none"
        />
        <span className="text-neutral-400">→</span>
        <input
          type="date"
          value={localTo}
          onChange={(e) => setTo(e.target.value)}
          className="text-sm bg-transparent outline-none"
        />
        <button
          type="button"
          onClick={() => apply(localFrom, localTo)}
          className="ml-1 text-xs font-medium text-neutral-900 hover:underline"
          disabled={pending}
        >
          Appliquer
        </button>
      </div>
    </div>
  );
}
