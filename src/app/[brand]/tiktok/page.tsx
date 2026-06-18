import { getBrand } from "@/lib/constants";
import { KpiGrid } from "@/components/kpi-grid";
import { DailyChart } from "@/components/daily-chart";
import { TopAdsGrid } from "@/components/top-ads";
import { Card, CardContent, Badge, SectionHeader } from "@/components/ui";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { PlatformLogo, PLATFORM_META } from "@/components/platform-logo";
import { ExportMenu } from "@/components/export-menu";
import type { DailyPoint, TopAd } from "@/lib/queries";
import type { ExportSnapshot } from "@/lib/export";

export const dynamic = "force-dynamic";

function mockDaily(): DailyPoint[] {
  const out: DailyPoint[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const base = 6000 + Math.sin(i / 3) * 1500 + Math.random() * 1200;
    out.push({
      date: iso,
      impressions: Math.round(base),
      clicks: Math.round(base / 90),
      spend: Math.round(base / 180),
    });
  }
  return out;
}

function mockTop(type: "dark" | "boost", n = 6): TopAd[] {
  return Array.from({ length: n }).map((_, i) => ({
    ad_id: `mock-${type}-${i}`,
    ad_name: `${type === "boost" ? "Boost" : "Dark"} #${i + 1} — Vidéo 15s`,
    preview_url: null,
    format: "VIDEO",
    campaign_name: `${type === "boost" ? "TK - BOOSTS 2026" : "TK - FIL ROUGE DARK"}`,
    type,
    impressions: 120000 - i * 12000,
    clicks: 2400 - i * 220,
    spend: 180 - i * 15,
    ctr: (2400 - i * 220) / (120000 - i * 12000),
    cpm: ((180 - i * 15) / (120000 - i * 12000)) * 1000,
  }));
}

export default async function TikTokPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;
  const info = getBrand(brand)!;
  const totals = {
    spend: 920,
    impressions: 185_200,
    clicks: 3_210,
    reach: 112_000,
    ctr: 3210 / 185200,
    cpm: (920 / 185200) * 1000,
  };
  const daily = mockDaily();

  const exportSnapshot: ExportSnapshot = {
    brandName: info.name,
    scope: "TikTok Ads",
    from: daily[0].date,
    to: daily[daily.length - 1].date,
    kpis: { current: totals },
    topDark: mockTop("dark"),
    topBoost: mockTop("boost"),
    note: "Données de démonstration — TikTok n'est pas encore connecté. Ne pas présenter ces chiffres.",
  };

  return (
    <>
      <Hero
        eyebrow={`TikTok Ads · ${info.name}`}
        title="Aperçu visuel."
        accent="Branchement en cours."
        from={daily[0].date}
        to={daily[daily.length - 1].date}
      />

      <section className="pb-8">
        <Card>
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <PlatformLogo platform="tiktok" size={36} />
                <div>
                  <div className="font-display font-semibold text-[var(--ink)]">
                    {PLATFORM_META.tiktok.name}
                  </div>
                  <div className="text-xs text-[var(--muted)]">
                    {PLATFORM_META.tiktok.subtitle}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="soon">Aperçu — données fictives</Badge>
                <ExportMenu snapshot={exportSnapshot} />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3 pb-10">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
          /02 · Indicateurs TikTok
        </div>
        <KpiGrid totals={totals} previous={null} daily={daily} />
      </section>

      <section className="pb-10">
        <SectionHeader
          eyebrow="Tendance"
          title="Impressions quotidiennes — maquette"
          subtitle="Forme du dashboard une fois l'ingestion TikTok activée."
        />
        <Card>
          <CardContent>
            <DailyChart data={daily} metric="impressions" />
          </CardContent>
        </Card>
      </section>

      <section className="pb-10">
        <SectionHeader
          eyebrow="Top créas"
          title="Pubs dark — démo"
          subtitle="Affichage final une fois les ads en base."
        />
        <TopAdsGrid ads={mockTop("dark")} emptyLabel="—" />
      </section>

      <section className="pb-10">
        <SectionHeader
          eyebrow="Boosts"
          title="Top boosts — démo"
          subtitle="Affichage final une fois les ads en base."
        />
        <TopAdsGrid ads={mockTop("boost")} emptyLabel="—" />
      </section>

      <Footer brandName={info.name} />
    </>
  );
}
