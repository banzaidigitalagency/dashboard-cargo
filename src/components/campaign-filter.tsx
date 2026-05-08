"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { CampaignRow } from "@/lib/queries";

export function CampaignFilter({ campaigns, selected }: { campaigns: CampaignRow[]; selected: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState<string[]>(selected);
  const [pending, start] = useTransition();

  const label = useMemo(() => {
    if (local.length === 0) return "Toutes les campagnes";
    if (local.length === 1) return campaigns.find((c) => c.campaign_id === local[0])?.campaign_name ?? "1 campagne";
    return `${local.length} campagnes`;
  }, [local, campaigns]);

  function apply(next: string[]) {
    const params = new URLSearchParams(sp.toString());
    params.delete("campaigns");
    if (next.length > 0) params.set("campaigns", next.join(","));
    start(() => router.push(`${pathname}?${params.toString()}`));
  }

  function toggle(id: string) {
    setLocal((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm hover:bg-neutral-50"
      >
        {label}
        <span className="text-neutral-400">▾</span>
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-[420px] max-h-[60vh] overflow-auto rounded-md border border-neutral-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-neutral-200 px-3 py-2 text-xs text-neutral-500">
            <span>{campaigns.length} campagnes</span>
            <div className="flex gap-3">
              <button onClick={() => setLocal([])} className="hover:text-neutral-900">Tout effacer</button>
              <button onClick={() => { apply(local); setOpen(false); }} className="font-medium text-neutral-900" disabled={pending}>Appliquer</button>
            </div>
          </div>
          <ul className="py-1">
            {campaigns.map((c) => (
              <li key={c.campaign_id}>
                <label className="flex items-start gap-2 px-3 py-2 hover:bg-neutral-50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={local.includes(c.campaign_id)}
                    onChange={() => toggle(c.campaign_id)}
                  />
                  <div className="text-sm">
                    <div className="text-neutral-900 line-clamp-2">{c.campaign_name}</div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      <span className={c.type === "boost" ? "text-amber-700" : "text-indigo-700"}>{c.type}</span>
                      {c.status && <span> · {c.status}</span>}
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
