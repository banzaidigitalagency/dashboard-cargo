import { getBrand } from "@/lib/constants";
import { KpiGrid } from "@/components/kpi-grid";
import { DailyChart } from "@/components/daily-chart";
import { Card, CardContent, Badge } from "@/components/ui";
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
    out.push({ date: iso, impressions: Math.round(base), clicks: Math.round(base / 200), spend: Math.round(base / 400) });
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

export default async function ProgrammaticPage({ params }: { params: Promise<{ brand: string }> }) {
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

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-2">
          <div className="text-xs uppercase tracking-wide text-neutral-500">Programmatique · DV360</div>
          <Badge variant="muted">Aperçu — données de démonstration</Badge>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">{info.name}</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Advertiser DV360 <span className="font-mono">CARGO (8192209878)</span>. Ingestion en cours côté Cargo.
        </p>
      </header>

      <KpiGrid totals={totals} />

      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold">Impressions quotidiennes (mock)</div>
          </div>
          <DailyChart data={mockDaily()} metric="impressions" />
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">Top emplacements (démo)</h2>
        <Card>
          <div className="divide-y divide-neutral-200">
            <div className="grid grid-cols-4 gap-4 px-5 py-3 text-xs uppercase tracking-wide text-neutral-500">
              <div className="col-span-1">Emplacement</div>
              <div className="text-right">Impressions</div>
              <div className="text-right">Clics</div>
              <div className="text-right">Dépense</div>
            </div>
            {MOCK_PLACEMENTS.map((p) => (
              <div key={p.name} className="grid grid-cols-4 gap-4 px-5 py-3 text-sm">
                <div className="col-span-1 font-medium">{p.name}</div>
                <div className="text-right tabular-nums">{formatNumber(p.impressions)}</div>
                <div className="text-right tabular-nums">{formatNumber(p.clicks)}</div>
                <div className="text-right tabular-nums">{formatCurrency(p.spend)}</div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
