import { Card, CardContent } from "@/components/ui";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import type { KpiTotals } from "@/lib/queries";

type Props = { totals: KpiTotals };

export function KpiGrid({ totals }: Props) {
  const items = [
    { label: "Budget dépensé", value: formatCurrency(totals.spend) },
    { label: "Impressions", value: formatNumber(totals.impressions) },
    { label: "Clics", value: formatNumber(totals.clicks) },
    { label: "CTR", value: formatPercent(totals.ctr) },
    { label: "CPM", value: formatCurrency(totals.cpm) },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {items.map((it) => (
        <Card key={it.label}>
          <CardContent>
            <div className="text-xs uppercase tracking-wide text-neutral-500">{it.label}</div>
            <div className="mt-2 text-2xl font-semibold tabular-nums">{it.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
