import { getBrand } from "@/lib/constants";
import { getDailySeries, getKpiTotals, getTopAds, listCargoCampaigns } from "@/lib/queries";
import { KpiGrid } from "@/components/kpi-grid";
import { DailyChart } from "@/components/daily-chart";
import { TopAdsGrid } from "@/components/top-ads";
import { CampaignFilter } from "@/components/campaign-filter";
import { DateRangeForm } from "@/components/date-range-form";
import { parseRange } from "@/lib/date-range";
import { Card, CardContent } from "@/components/ui";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ brand: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function MetaPage({ params, searchParams }: Props) {
  const { brand } = await params;
  const sp = await searchParams;
  const info = getBrand(brand)!;
  const { from, to } = parseRange(sp);
  const selectedIds = typeof sp.campaigns === "string" && sp.campaigns.length ? sp.campaigns.split(",") : [];

  const campaigns = await listCargoCampaigns(brand).catch(() => []);
  const filter = selectedIds.length > 0 ? { campaignIds: selectedIds } : {};

  const [totals, daily, topDark, topBoost] = await Promise.all([
    getKpiTotals({ brandCode: brand, from, to, ...filter }).catch(() => ({ spend: 0, impressions: 0, clicks: 0, reach: 0, ctr: 0, cpm: 0 })),
    getDailySeries({ brandCode: brand, from, to, ...filter }).catch(() => []),
    getTopAds({ brandCode: brand, from, to, type: "dark", limit: 6 }).catch(() => []),
    getTopAds({ brandCode: brand, from, to, type: "boost", limit: 6 }).catch(() => []),
  ]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500">Meta Ads</div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">{info.name}</h1>
          <p className="text-sm text-neutral-500 mt-1">Performance des campagnes dark et boost.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CampaignFilter campaigns={campaigns} selected={selectedIds} />
          <DateRangeForm from={from} to={to} />
        </div>
      </header>

      <KpiGrid totals={totals} />

      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold">Impressions quotidiennes</div>
            <div className="text-xs text-neutral-500">{from} → {to}</div>
          </div>
          {daily.length === 0 ? (
            <div className="h-72 flex items-center justify-center text-sm text-neutral-400">
              Pas de données sur la période sélectionnée.
            </div>
          ) : (
            <DailyChart data={daily} metric="impressions" />
          )}
        </CardContent>
      </Card>

      <TopAdsGrid title="Top pubs (dark)" ads={topDark} emptyLabel="Aucune pub dark sur la période." />
      <TopAdsGrid title="Top boosts" ads={topBoost} emptyLabel="Aucun boost sur la période." />
    </div>
  );
}
