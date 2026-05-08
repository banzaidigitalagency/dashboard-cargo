import { getBrand } from "@/lib/constants";
import { KpiGrid } from "@/components/kpi-grid";
import { DailyChart } from "@/components/daily-chart";
import { TopAdsGrid } from "@/components/top-ads";
import { Card, CardContent, Badge } from "@/components/ui";
import type { DailyPoint, TopAd } from "@/lib/queries";

export const dynamic = "force-dynamic";

function mockDaily(): DailyPoint[] {
  const out: DailyPoint[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const base = 6000 + Math.sin(i / 3) * 1500 + Math.random() * 1200;
    out.push({ date: iso, impressions: Math.round(base), clicks: Math.round(base / 90), spend: Math.round(base / 180) });
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
  return (
    <div className="space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-xs uppercase tracking-wide text-neutral-500">TikTok Ads</div>
            <Badge variant="muted">Aperçu — données de démonstration</Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">{info.name}</h1>
          <p className="text-sm text-neutral-500 mt-1">Le branchement TikTok est en cours. Ces chiffres sont fictifs.</p>
        </div>
      </header>

      <KpiGrid totals={totals} />

      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold">Impressions quotidiennes (mock)</div>
          </div>
          <DailyChart data={daily} metric="impressions" />
        </CardContent>
      </Card>

      <TopAdsGrid title="Top pubs (dark) — démo" ads={mockTop("dark")} emptyLabel="—" />
      <TopAdsGrid title="Top boosts — démo" ads={mockTop("boost")} emptyLabel="—" />
    </div>
  );
}
