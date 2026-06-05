import { Badge, Card, EmptyState } from "@/components/ui";
import type { TopAd } from "@/lib/queries";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

export function TopAdsGrid({ ads, emptyLabel }: { ads: TopAd[]; emptyLabel: string }) {
  if (ads.length === 0) {
    return <EmptyState title={emptyLabel} description="Les données apparaîtront dès qu'elles seront disponibles." />;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {ads.map((ad, idx) => (
        <Card key={ad.ad_id} className="p-4">
          <div className="flex gap-3">
            {/* Vignette portrait compacte */}
            <div className="relative shrink-0 w-[68px] aspect-[4/5] rounded-lg overflow-hidden bg-[var(--bg-2)] flex items-center justify-center">
              {ad.preview_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ad.preview_url}
                  alt={ad.ad_name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="text-[9px] text-center text-[var(--muted-2)] px-1">Aperçu indispo.</span>
              )}
              <span className="absolute top-1 left-1 font-display text-[10px] font-semibold text-white tabular-nums drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                /0{idx + 1}
              </span>
            </div>

            {/* Titre + campagne + type */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="text-sm font-medium leading-snug line-clamp-2 text-[var(--ink)]">
                  {ad.ad_name}
                </div>
                <Badge variant={ad.type === "boost" ? "boost" : "dark"}>{ad.type}</Badge>
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-[var(--muted)] line-clamp-1">
                {ad.campaign_name}
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-2 pt-3 mt-3 border-t border-[var(--hairline)]">
            <Kpi label="Impr." value={formatNumber(ad.impressions)} />
            <Kpi label="CTR" value={formatPercent(ad.ctr)} />
            <Kpi label="CPM" value={formatCurrency(ad.cpm)} />
            <Kpi label="Dépense" value={formatCurrency(ad.spend)} />
          </div>
        </Card>
      ))}
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-wider text-[var(--muted)]">{label}</div>
      <div className="text-[13px] font-medium tabular-nums text-[var(--ink)] leading-tight">{value}</div>
    </div>
  );
}
