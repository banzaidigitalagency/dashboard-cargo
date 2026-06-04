"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { CampaignRow } from "@/lib/queries";

export function CampaignFilter({
  campaigns,
  selected,
}: {
  campaigns: CampaignRow[];
  selected: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState<string[]>(selected);
  const [pending, start] = useTransition();

  const label = useMemo(() => {
    if (local.length === 0) return "Toutes les campagnes";
    if (local.length === 1)
      return (
        campaigns.find((c) => c.campaign_id === local[0])?.campaign_name ?? "1 campagne"
      );
    return `${local.length} campagnes`;
  }, [local, campaigns]);

  function apply(next: string[]) {
    const params = new URLSearchParams(sp.toString());
    params.delete("campaigns");
    if (next.length > 0) params.set("campaigns", next.join(","));
    start(() => router.push(`${pathname}?${params.toString()}`));
  }

  function toggle(id: string) {
    setLocal((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-white px-4 py-1.5 text-xs hover:border-[var(--navy)] transition text-[var(--ink)] max-w-[260px]"
      >
        <span className="truncate">{label}</span>
        <span className="text-[var(--muted-2)]">▾</span>
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-[420px] max-h-[60vh] overflow-auto rounded-xl border border-[var(--hairline)] bg-white shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between border-b border-[var(--hairline)] px-4 py-3 text-[11px] uppercase tracking-wider text-[var(--muted)]">
            <span>{campaigns.length} campagnes</span>
            <div className="flex gap-3">
              <button onClick={() => setLocal([])} className="hover:text-[var(--ink)]">
                Tout effacer
              </button>
              <button
                onClick={() => {
                  apply(local);
                  setOpen(false);
                }}
                className="font-medium text-[var(--navy)]"
                disabled={pending}
              >
                Appliquer
              </button>
            </div>
          </div>
          <ul className="py-1">
            {campaigns.map((c) => (
              <li key={c.campaign_id}>
                <label className="flex items-start gap-2 px-4 py-2 hover:bg-[var(--bg-2)] cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 accent-[var(--navy)]"
                    checked={local.includes(c.campaign_id)}
                    onChange={() => toggle(c.campaign_id)}
                  />
                  <div className="text-sm">
                    <div className="text-[var(--ink)] line-clamp-2">{c.campaign_name}</div>
                    <div className="text-[10px] uppercase tracking-wider mt-0.5">
                      <span
                        className={
                          c.type === "boost"
                            ? "text-[var(--green-600)]"
                            : "text-[var(--ink-2)]"
                        }
                      >
                        {c.type}
                      </span>
                      {c.status && (
                        <span className="text-[var(--muted)]"> · {c.status}</span>
                      )}
                    </div>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
