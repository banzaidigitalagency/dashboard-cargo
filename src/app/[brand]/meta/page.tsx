import { getBrand } from "@/lib/constants";
import {
  getDashboardSnapshot,
  getFirstInsightDate,
  getTopAds,
  getTypeBreakdown,
  listCargoCampaigns,
  type DashboardSnapshot,
  type TypeBreakdown,
} from "@/lib/queries";
import { KpiGrid } from "@/components/kpi-grid";
import { DailyChart } from "@/components/daily-chart";
import { TopAdsGrid } from "@/components/top-ads";
import { TypeBreakdownTable } from "@/components/type-breakdown-table";
import { CampaignFilter } from "@/components/campaign-filter";
import { PeriodBar } from "@/components/period-bar";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { Card, CardContent, SectionHeader } from "@/components/ui";
import { PlatformLogo, PLATFORM_META } from "@/components/platform-logo";
import { parseRange, parseCompare } from "@/lib/date-range";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ brand: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const EMPTY: DashboardSnapshot = {
  current: { spend: 0, impressions: 0, clicks: 0, reach: 0, ctr: 0, cpm: 0 },
  previous: null,
  daily: [],
  lastSync: null,
};

export default async function MetaPage({ params, searchParams }: Props) {
  const { brand } = await params;
  const sp = await searchParams;
  const info = getBrand(brand)!;
  const { from, to } = parseRange(sp);
  const compareRange = parseCompare(sp);
  const selectedIds =
    typeof sp.campaigns === "string" && sp.campaigns.length ? sp.campaigns.split(",") : [];

  const campaigns = await listCargoCampaigns(brand).catch(() => []);
  const filter = selectedIds.length > 0 ? { campaignIds: selectedIds } : {};

  const emptyBreakdown: TypeBreakdown = {
    dark: EMPTY.current,
    boost: EMPTY.current,
    total: EMPTY.current,
  };

  const [snap, topDark, topBoost, earliest, breakdown, compareSnap] = await Promise.all([
    getDashboardSnapshot({ brandCode: brand, from, to, ...filter }).catch(() => EMPTY),
    getTopAds({ brandCode: brand, from, to, type: "dark", limit: 6 }).catch(() => []),
    getTopAds({ brandCode: brand, from, to, type: "boost", limit: 6 }).catch(() => []),
    getFirstInsightDate(brand).catch(() => null),
    getTypeBreakdown({ brandCode: brand, from, to }).catch(() => emptyBreakdown),
    compareRange
      ? getDashboardSnapshot({ brandCode: brand, from: compareRange.from, to: compareRange.to, ...filter }).catch(
          () => null
        )
      : Promise.resolve(null),
  ]);

  const compare =
    compareRange && compareSnap
      ? {
          totals: compareSnap.current,
          label: `${formatDate(compareRange.from)} – ${formatDate(compareRange.to)}`,
        }
      : null;

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
          <CardContent className="space-y-4">
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
              <CampaignFilter campaigns={campaigns} selected={selectedIds} />
            </div>
            <div className="border-t border-[var(--hairline)] pt-4">
              <PeriodBar
                from={from}
                to={to}
                cfrom={compareRange?.from}
                cto={compareRange?.to}
                comparing={!!compareRange}
                earliestDate={earliest ?? undefined}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3 pb-10">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
          <span className="text-[var(--green-600)] mr-1">/01</span> Indicateurs Meta
        </div>
        <KpiGrid
          totals={snap.current}
          previous={snap.previous}
          daily={snap.daily}
          compare={compare}
        />
      </section>

      <section className="pb-10">
        <SectionHeader
          eyebrow="Dark vs Boost"
          title="Répartition par type"
          subtitle="Budget et performance détaillés des campagnes dark et des boosts sur la période."
        />
        <TypeBreakdownTable data={breakdown} />
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
