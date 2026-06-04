import { Card } from "@/components/ui";
import type { TypeBreakdown } from "@/lib/queries";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

const COLS = [
  { key: "spend", label: "Budget", fmt: (n: number) => formatCurrency(n) },
  { key: "impressions", label: "Impressions", fmt: formatNumber },
  { key: "clicks", label: "Clics", fmt: formatNumber },
  { key: "ctr", label: "CTR", fmt: (n: number) => formatPercent(n) },
  { key: "cpm", label: "CPM", fmt: (n: number) => formatCurrency(n) },
] as const;

export function TypeBreakdownTable({ data }: { data: TypeBreakdown }) {
  const rows = [
    { key: "dark", label: "Dark", dotClass: "bg-[var(--navy)]", totals: data.dark },
    { key: "boost", label: "Boost", dotClass: "bg-[var(--green-600)]", totals: data.boost },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
              <th className="text-left font-medium px-6 py-3">Type</th>
              {COLS.map((c) => (
                <th key={c.key} className="text-right font-medium px-6 py-3">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-t border-[var(--hairline)]">
                <td className="px-6 py-3.5">
                  <span className="inline-flex items-center gap-2 font-medium text-[var(--ink)]">
                    <span className={`w-2 h-2 rounded-full ${r.dotClass}`} />
                    {r.label}
                  </span>
                </td>
                {COLS.map((c) => (
                  <td
                    key={c.key}
                    className="text-right tabular-nums px-6 py-3.5 text-[var(--ink-2)]"
                  >
                    {c.fmt(r.totals[c.key])}
                  </td>
                ))}
              </tr>
            ))}
            {/* Total */}
            <tr className="border-t-2 border-[var(--hairline-strong)] bg-[var(--bg-2)]">
              <td className="px-6 py-3.5 font-semibold text-[var(--ink)]">Total</td>
              {COLS.map((c) => (
                <td
                  key={c.key}
                  className="text-right tabular-nums px-6 py-3.5 font-semibold text-[var(--ink)]"
                >
                  {c.fmt(data.total[c.key])}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
