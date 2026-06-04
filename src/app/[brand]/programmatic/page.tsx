import { getBrand } from "@/lib/constants";
import { KpiGrid } from "@/components/kpi-grid";
import { DailyChart } from "@/components/daily-chart";
import { Card, CardContent, Badge, SectionHeader } from "@/components/ui";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { PlatformLogo, PLATFORM_META } from "@/components/platform-logo";
import type { DailyPoint } from "@/lib/queries";
import { formatCurrency, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

function mockDaily(): DailyPoint[] {
  const out: DailyPoint[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const base = 22000 + Math.cos(i / 4) * 4000 + Math.random() * 2000;
    out.push({
      date: iso,
      impressions: Math.round(base),
      clicks: Math.round(base / 200),
      spend: Math.round(base / 400),
    });
  }
  return out;
}

const MOCK_PLACEMENTS = [
  { name: "Le Monde", impressions: 185_000, clicks: 910, spend: 420 },
  { name: "Le Figaro", impressions: 162_300, clicks: 780, spend: 370 },
  { name: "L'Équipe", impressions: 128_900, clicks: 1_150, spend: 310 },
  { name: "Marmiton", impressions: 98_700, clicks: 640, spend: 220 },
  { name: "YouTube (TrueView)", impressions: 84_400, clicks: 420, spend: 190 },
  { name: "Autres", impressions: 71_200, clicks: 315, spend: 150 },
];

export default async function ProgrammaticPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const info = getBrand(brand)!;
  const totals = {
    spend: 1660,
    impressions: 730_500,
    clicks: 4_215,
    reach: 312_000,
    ctr: 4215 / 730500,
    cpm: (1660 / 730500) * 1000,
  };
  const daily = mockDaily();

  return (
    <>
      <Hero
        eyebrow={`Programmatique · ${info.name}`}
        title="Display & vidéo via DV360."
        accent="Branchement en cours."
        from={daily[0].date}
        to={daily[daily.length - 1].date}
      />

      <section className="pb-8">
        <Card>
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <PlatformLogo platform="dv360" size={36} />
                <div>
                  <div className="font-display font-semibold text-[var(--ink)]">
                    {PLATFORM_META.dv360.name}
                  </div>
                  <div className="text-xs text-[var(--muted)]">
                    Advertiser <span className="font-mono">CARGO · 8192209878</span>
                  </div>
                </div>
              </div>
              <Badge variant="soon">Aperçu — données fictives</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3 pb-10">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
          /03 · Indicateurs DV360
        </div>
        <KpiGrid totals={totals} previous={null} daily={daily} />
      </section>

      <section className="pb-10">
        <SectionHeader
          eyebrow="Tendance"
          title="Impressions quotidiennes — maquette"
          subtitle="Forme du dashboard une fois l'ingestion DV360 activée pour Cargo."
        />
        <Card>
          <CardContent>
            <DailyChart data={daily} metric="impressions" />
          </CardContent>
        </Card>
      </section>

      <section className="pb-10">
        <SectionHeader
          eyebrow="Top emplacements"
          title="Sites & publishers — démo"
          subtitle="Classement par impressions. Restitution finale dès branchement DV360."
        />
        <Card className="overflow-hidden">
          <div className="divide-y divide-[var(--hairline)]">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
              <div className="col-span-1">Rang</div>
              <div className="col-span-5">Emplacement</div>
              <div className="col-span-2 text-right">Impressions</div>
              <div className="col-span-2 text-right">Clics</div>
              <div className="col-span-2 text-right">Dépense</div>
            </div>
            {MOCK_PLACEMENTS.map((p, i) => (
              <div key={p.name} className="grid grid-cols-12 gap-4 px-6 py-3 text-sm items-center">
                <div className="col-span-1 font-display text-sm font-semibold text-[var(--green-600)] tabular-nums">
                  /0{i + 1}
                </div>
                <div className="col-span-5 font-medium text-[var(--ink)]">{p.name}</div>
                <div className="col-span-2 text-right tabular-nums text-[var(--ink-2)]">
                  {formatNumber(p.impressions)}
                </div>
                <div className="col-span-2 text-right tabular-nums text-[var(--ink-2)]">
                  {formatNumber(p.clicks)}
                </div>
                <div className="col-span-2 text-right tabular-nums text-[var(--ink-2)]">
                  {formatCurrency(p.spend)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Footer brandName={info.name} />
    </>
  );
}
