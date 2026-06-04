import { Sparkline } from "@/components/sparkline";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import type { DailyPoint, KpiTotals } from "@/lib/queries";

type Props = {
  totals: KpiTotals;
  previous?: KpiTotals | null;
  daily?: DailyPoint[];
  /** Mode comparé explicite : compare à `compare.totals` (période B) au lieu de previous. */
  compare?: { totals: KpiTotals; label: string } | null;
};

type Metric = {
  key: "spend" | "impressions" | "clicks" | "ctr" | "cpm";
  label: string;
  format: (n: number) => string;
  derive: (k: KpiTotals) => number;
  /** Pour les KPI dérivés (CTR, CPM), on n'affiche pas de sparkline. */
  noSparkline?: boolean;
};

const METRICS: Metric[] = [
  { key: "spend", label: "Budget", format: (n) => formatCurrency(n), derive: (k) => k.spend },
  { key: "impressions", label: "Impressions", format: formatNumber, derive: (k) => k.impressions },
  { key: "clicks", label: "Clics", format: formatNumber, derive: (k) => k.clicks },
  { key: "ctr", label: "CTR", format: (n) => formatPercent(n), derive: (k) => k.ctr, noSparkline: true },
  { key: "cpm", label: "CPM", format: (n) => formatCurrency(n), derive: (k) => k.cpm, noSparkline: true },
];

function pctChange(curr: number, prev: number | undefined | null): number | null {
  if (prev === undefined || prev === null) return null;
  if (!Number.isFinite(prev) || prev === 0) return null;
  return (curr - prev) / Math.abs(prev);
}

function formatDelta(d: number | null): string {
  if (d === null) return "réf.";
  const pct = d * 100;
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(pct >= 10 || pct <= -10 ? 0 : 1)} %`;
}

export function KpiGrid({ totals, previous, daily, compare }: Props) {
  const comparing = !!compare;
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {METRICS.map((m) => {
        const curr = m.derive(totals);
        // En mode comparé, le delta se calcule vs la période B; sinon vs previous.
        const ref = comparing ? m.derive(compare!.totals) : previous ? m.derive(previous) : null;
        const delta = pctChange(curr, ref);
        const dataPoints =
          !m.noSparkline && daily
            ? daily.map((d) =>
                m.key === "ctr" || m.key === "cpm" ? 0 : Number(d[m.key as keyof DailyPoint] ?? 0)
              )
            : [];

        return (
          <div
            key={m.key}
            className="relative overflow-hidden rounded-xl bg-[var(--navy)] text-white p-5"
            data-card
          >
            {/* 3px green top border */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--green)]" aria-hidden />

            <div className="flex items-start justify-between gap-2">
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/60">{m.label}</div>
              {delta !== null ? (
                <div
                  className={`text-[10px] font-medium tabular-nums tracking-tight px-1.5 py-0.5 rounded-full ${
                    delta >= 0 ? "text-[var(--green)]" : "text-white/50"
                  }`}
                >
                  {formatDelta(delta)}
                </div>
              ) : (
                <div className="text-[10px] uppercase tracking-wider text-white/40">réf.</div>
              )}
            </div>

            <div className="mt-3 font-display text-3xl font-semibold leading-none tabular-nums">
              {m.format(curr)}
            </div>

            {comparing ? (
              <div className="mt-3 text-[11px] text-white/55 tabular-nums">
                <span className="uppercase tracking-wider text-white/40">{compare!.label} : </span>
                {m.format(m.derive(compare!.totals))}
              </div>
            ) : (
              <div className="mt-4 h-8">
                {dataPoints.length > 1 && <Sparkline data={dataPoints} width={220} height={32} />}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
