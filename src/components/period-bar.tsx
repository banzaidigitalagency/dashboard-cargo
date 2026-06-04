"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";

type PresetDef =
  | { kind: "days"; label: string; days: number }
  | { kind: "since"; label: string; since: string };

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Barre de période : sélecteur principal (période A) + toggle "Comparer"
 * qui révèle un second sélecteur (période B). Pilote l'URL :
 * from, to (période A) · cfrom, cto, cmp=1 (période B).
 */
export function PeriodBar({
  from,
  to,
  cfrom,
  cto,
  comparing,
  earliestDate,
}: {
  from: string;
  to: string;
  cfrom?: string;
  cto?: string;
  comparing?: boolean;
  earliestDate?: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();

  const [aFrom, setAFrom] = useState(from);
  const [aTo, setATo] = useState(to);
  const [bFrom, setBFrom] = useState(cfrom ?? "");
  const [bTo, setBTo] = useState(cto ?? "");
  const [cmp, setCmp] = useState(!!comparing);

  useEffect(() => {
    setAFrom(from);
    setATo(to);
  }, [from, to]);

  const presets: PresetDef[] = [
    { kind: "days", label: "7 j", days: 7 },
    { kind: "days", label: "30 j", days: 30 },
    { kind: "days", label: "90 j", days: 90 },
    ...(earliestDate ? [{ kind: "since" as const, label: "Depuis le début", since: earliestDate }] : []),
  ];

  function push(next: Record<string, string | null>) {
    const params = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v === null) params.delete(k);
      else params.set(k, v);
    }
    start(() => router.push(`${pathname}?${params.toString()}`));
  }

  function applyPresetA(p: PresetDef) {
    let f: string;
    if (p.kind === "days") {
      const d = new Date();
      d.setDate(d.getDate() - (p.days - 1));
      f = d.toISOString().slice(0, 10);
    } else {
      f = p.since;
    }
    const t = isoToday();
    setAFrom(f);
    setATo(t);
    push({ from: f, to: t });
  }

  function applyA() {
    push({ from: aFrom, to: aTo });
  }

  function toggleCompare() {
    if (cmp) {
      setCmp(false);
      push({ cmp: null, cfrom: null, cto: null });
    } else {
      setCmp(true);
      // Préremplit la période B avec la période équivalente juste avant A
      const dayMs = 86_400_000;
      const fa = new Date(aFrom);
      const ta = new Date(aTo);
      const span = Math.max(1, Math.round((ta.getTime() - fa.getTime()) / dayMs) + 1);
      const bTo2 = new Date(fa.getTime() - dayMs);
      const bFrom2 = new Date(bTo2.getTime() - (span - 1) * dayMs);
      const bf = bFrom2.toISOString().slice(0, 10);
      const bt = bTo2.toISOString().slice(0, 10);
      setBFrom(bf);
      setBTo(bt);
      push({ cmp: "1", cfrom: bf, cto: bt });
    }
  }

  function applyB() {
    if (bFrom && bTo) push({ cmp: "1", cfrom: bFrom, cto: bTo });
  }

  return (
    <div className="space-y-3">
      {/* Ligne période A */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] w-16">
          Période
        </span>
        <div className="flex items-center gap-1 rounded-full border border-[var(--hairline)] bg-white p-1">
          {presets.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applyPresetA(p)}
              className="px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--bg-2)] transition whitespace-nowrap"
            >
              {p.label}
            </button>
          ))}
        </div>
        <DateInputs
          from={aFrom}
          to={aTo}
          onFrom={setAFrom}
          onTo={setATo}
          onApply={applyA}
          pending={pending}
        />
        <button
          type="button"
          onClick={toggleCompare}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition",
            cmp
              ? "bg-[var(--navy)] text-white border-[var(--navy)]"
              : "border-[var(--hairline)] text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--navy)]"
          )}
        >
          {cmp ? "✓ Comparer" : "Comparer"}
        </button>
      </div>

      {/* Ligne période B (si comparaison active) */}
      {cmp && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--green-600)] w-16">
            Vs
          </span>
          <DateInputs
            from={bFrom}
            to={bTo}
            onFrom={setBFrom}
            onTo={setBTo}
            onApply={applyB}
            pending={pending}
          />
        </div>
      )}
    </div>
  );
}

function DateInputs({
  from,
  to,
  onFrom,
  onTo,
  onApply,
  pending,
}: {
  from: string;
  to: string;
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
  onApply: () => void;
  pending: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-white px-3 py-1">
      <input
        type="date"
        value={from}
        onChange={(e) => onFrom(e.target.value)}
        className="text-xs outline-none bg-transparent text-[var(--ink)]"
      />
      <span className="text-[var(--muted-2)]">→</span>
      <input
        type="date"
        value={to}
        onChange={(e) => onTo(e.target.value)}
        className="text-xs outline-none bg-transparent text-[var(--ink)]"
      />
      <button
        type="button"
        onClick={onApply}
        disabled={pending}
        className="ml-1 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full text-[var(--navy)] hover:bg-[var(--bg-2)] transition"
      >
        OK
      </button>
    </div>
  );
}
