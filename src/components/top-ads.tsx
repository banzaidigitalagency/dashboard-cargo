import { Badge, Card, CardContent, EmptyState } from "@/components/ui";
import type { TopAd } from "@/lib/queries";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

export function TopAdsGrid({ ads, emptyLabel }: { ads: TopAd[]; emptyLabel: string }) {
  if (ads.length === 0) {
    return <EmptyState title={emptyLabel} description="Les données apparaîtront dès qu'elles seront disponibles." />;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {ads.map((ad, idx) => (
        <Card key={ad.ad_id} className="overflow-hidden">
          <div className="relative aspect-video w-full bg-[var(--bg-2)] flex items-center justify-center text-xs text-[var(--muted-2)]">
            <div className="absolute top-2 left-2 font-display text-sm font-semibold text-[var(--green-600)] tabular-nums">
              /0{idx + 1}
            </div>
            {ad.preview_url ? (
              <a
                href={ad.preview_url}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--navy)] hover:text-[var(--green-600)] underline underline-offset-2"
              >
                Voir la créa
              </a>
            ) : (
              <span>Aperçu indisponible</span>
            )}
          </div>
          <CardContent>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="min-w-0">
                <div className="text-sm font-medium line-clamp-2 text-[var(--ink)]">{ad.ad_name}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-[var(--muted)] line-clamp-1">
                  {ad.campaign_name}
                </div>
              </div>
              <Badge variant={ad.type === "boost" ? "boost" : "dark"}>{ad.type}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[var(--hairline)]">
              <Kpi label="Impressions" value={formatNumber(ad.impressions)} />
              <Kpi label="CTR" value={formatPercent(ad.ctr)} />
              <Kpi label="Dépense" value={formatCurrency(ad.spend)} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">{label}</div>
      <div className="text-sm font-medium tabular-nums text-[var(--ink)]">{value}</div>
    </div>
  );
}
