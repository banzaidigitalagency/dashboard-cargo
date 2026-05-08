import { Badge, Card, CardContent, EmptyState } from "@/components/ui";
import type { TopAd } from "@/lib/queries";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

export function TopAdsGrid({ title, ads, emptyLabel }: { title: string; ads: TopAd[]; emptyLabel: string }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">{title}</h2>
      {ads.length === 0 ? (
        <EmptyState title={emptyLabel} description="Les données apparaîtront dès qu'elles seront disponibles." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map((ad) => (
            <Card key={ad.ad_id} className="overflow-hidden">
              <div className="aspect-video w-full bg-neutral-100 flex items-center justify-center text-xs text-neutral-400">
                {ad.preview_url ? (
                  // Meta preview_url returns HTML iframe-able content, fallback to link
                  <a href={ad.preview_url} target="_blank" rel="noreferrer" className="underline">
                    Voir la créa
                  </a>
                ) : (
                  <span>Aperçu indisponible</span>
                )}
              </div>
              <CardContent>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium line-clamp-2">{ad.ad_name}</div>
                    <div className="mt-1 text-xs text-neutral-500 line-clamp-1">{ad.campaign_name}</div>
                  </div>
                  <Badge variant={ad.type === "boost" ? "boost" : "dark"}>{ad.type}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-neutral-500">Impressions</div>
                    <div className="font-medium tabular-nums">{formatNumber(ad.impressions)}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500">CTR</div>
                    <div className="font-medium tabular-nums">{formatPercent(ad.ctr)}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Dépense</div>
                    <div className="font-medium tabular-nums">{formatCurrency(ad.spend)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
