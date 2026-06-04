import { getBrand } from "@/lib/constants";
import {
  getDashboardSnapshot,
  getTopAds,
  listCargoCampaigns,
} from "@/lib/queries";
import { KpiGrid } from "@/components/kpi-grid";
import { DailyChart } from "@/components/daily-chart";
import { TopAdsGrid } from "@/components/top-ads";
import { CampaignFilter } from "@/components/campaign-filter";
import { DateRangeForm } from "@/components/date-range-form";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { Card, CardContent, SectionHeader } from "@/components/ui";
import { PlatformLogo, PLATFORM_META } from "@/components/platform-logo";
import { parseRange } from "@/lib/date-range";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ brand: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MetaPage({ params, searchParams }: Props) {
  const { brand } = await params;
  const sp = await searchParams;
  const info = getBrand(brand)!;
  const { from, to } = parseRange(sp);
  const selectedIds =
    typeof sp.campaigns === "string" && sp.campaigns.length ? sp.campaigns.split(",") : [];

  const campaigns = await listCargoCampaigns(brand).catch(() => []);
  const filter = selectedIds.length > 0 ? { campaignIds: selectedIds } : {};

  const [snap, topDark, topBoost] = await Promise.all([
    getDashboardSnapshot({ brandCode: brand, from, to, ...filter }).catch(() => ({
      current: { spend: 0, impressions: 0, clicks: 0, reach: 0, ctr: 0, cpm: 0 },
      previous: null,
      daily: [],
      lastSync: null,
    })),
    getTopAds({ brandCode: brand, from, to, type: "dark", limit: 6 }).catch(() => []),
    getTopAds({ brandCode: brand, from, to, type: "boost", limit: 6 }).catch(() => []),
  ]);

  return (
    <>
      <Hero
        eyebrow={`Meta Ads · ${info.name}`}
        title="Dark posts & boosts."
        accent="Lecture détaillée par campagne."
        from={from}
        to={to}
        lastSync={snap.lastSync}
      />

      <section className="pb-8">
        <Card>
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <PlatformLogo platform="meta" size={36} />
                <div>
                  <div className="font-display font-semibold text-[var(--ink)]">
                    {PLATFORM_META.meta.name}
                  </div>
                  <div className="text-xs text-[var(--muted)]">{PLATFORM_META.meta.subtitle}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <CampaignFilter campaigns={campaigns} selected={selectedIds} />
                <DateRangeForm from={from} to={to} variant="light" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3 pb-10">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
          /01 · Indicateurs Meta
        </div>
        <KpiGrid totals={snap.current} previous={snap.previous} daily={snap.daily} />
      </section>

      <section className="pb-10">
        <SectionHeader
          eyebrow="Tendance"
          title="Impressions quotidiennes"
          subtitle="Évolution sur la période sélectionnée, toutes campagnes confondues."
        />
        <Card>
          <CardContent>
            {snap.daily.length === 0 ? (
              <div className="h-72 flex items-center justify-center text-sm text-[var(--muted)]">
                Pas de données sur la période sélectionnée.
              </div>
            ) : (
              <DailyChart data={snap.daily} metric="impressions" />
            )}
          </CardContent>
        </Card>
      </section>

      <section className="pb-10">
        <SectionHeader
          eyebrow="Top créas"
          title="Pubs dark — les plus vues"
          subtitle="Classées par impressions sur la période."
        />
        <TopAdsGrid ads={topDark} emptyLabel="Aucune pub dark sur la période." />
      </section>

      <section className="pb-10">
        <SectionHeader
          eyebrow="Boosts"
          title="Top boosts — les plus vus"
          subtitle="Classés par impressions sur la période."
        />
        <TopAdsGrid ads={topBoost} emptyLabel="Aucun boost sur la période." />
      </section>

      <Footer brandName={info.name} />
    </>
  );
}
