import { Card } from "@/components/ui";
import type { BudgetStatus, BudgetLine } from "@/lib/queries";
import { formatCurrency, formatDate, formatPercent } from "@/lib/utils";

const PLATFORM_LABEL: Record<string, string> = {
  meta: "Meta",
  tiktok: "TikTok",
  dv360: "DV360",
};

function lineLabel(l: BudgetLine): string {
  const p = PLATFORM_LABEL[l.platform] ?? l.platform;
  if (l.type) return `${p} · ${l.type === "dark" ? "Dark" : "Boost"}`;
  return p;
}

function barColor(l: BudgetLine): string {
  if (!l.hasActuals) return "var(--muted-2)";
  if (l.pct >= 1) return "var(--neg)";
  if (l.type === "boost") return "var(--green-600)";
  return "var(--navy)";
}

export function BudgetWidget({ status, periodLabel }: { status: BudgetStatus; periodLabel?: string }) {
  const { lines, totals, asOf } = status;
  return (
    <Card className="overflow-hidden">
      <div className="px-6 pt-5 pb-3 flex items-end justify-between gap-4 border-b border-[var(--hairline)]">
        <div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
            Budget média {periodLabel ?? "2026"}
          </div>
          <div className="mt-1 font-display text-xl font-semibold text-[var(--ink)]">
            {formatCurrency(totals.spent)}{" "}
            <span className="text-[var(--muted)] font-normal text-base">
              / {formatCurrency(totals.budget)} dépensé
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-[var(--muted)]">Restant</div>
          <div className="font-display text-lg font-semibold text-[var(--green-600)] tabular-nums">
            {formatCurrency(totals.remaining)}
          </div>
        </div>
      </div>

      <div className="divide-y divide-[var(--hairline)]">
        {lines.map((l, i) => (
          <div key={i} className="px-6 py-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-[var(--ink)]">{lineLabel(l)}</span>
                {!l.hasActuals && (
                  <span className="text-[10px] uppercase tracking-wider text-[var(--muted-2)] border border-dashed border-[var(--hairline-strong)] rounded-full px-2 py-0.5">
                    Pas encore synchronisé
                  </span>
                )}
              </div>
              <div className="text-sm tabular-nums text-[var(--muted)]">
                <span className="text-[var(--ink)] font-medium">{formatCurrency(l.spent)}</span>
                {" / "}
                {formatCurrency(l.budget)}
              </div>
            </div>
            <div className="relative h-2 rounded-full bg-[var(--bg-2)] overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, Math.max(0, l.pct * 100))}%`,
                  background: barColor(l),
                }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-[var(--muted)]">
              <span>{formatPercent(l.pct)} consommé</span>
              <span>
                Restant{" "}
                <span className="text-[var(--ink-2)] font-medium tabular-nums">
                  {formatCurrency(l.remaining)}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-3 bg-[var(--bg-2)] text-[11px] text-[var(--muted)] flex items-center justify-between">
        <span>Dépensé arrêté au {formatDate(asOf)}</span>
        <span>Source : plan média validé + dépenses réelles</span>
      </div>
    </Card>
  );
}
