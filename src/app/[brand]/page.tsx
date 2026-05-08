import Link from "next/link";
import { getBrand } from "@/lib/constants";
import { getKpiTotals } from "@/lib/queries";
import { KpiGrid } from "@/components/kpi-grid";
import { Card, CardContent } from "@/components/ui";
import { defaultRange } from "@/lib/date-range";

export const dynamic = "force-dynamic";

export default async function BrandOverview({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;
  const info = getBrand(brand)!;
  const { from, to } = defaultRange(30);
  let meta = { spend: 0, impressions: 0, clicks: 0, reach: 0, ctr: 0, cpm: 0 };
  try {
    meta = await getKpiTotals({ brandCode: brand, from, to });
  } catch {}

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{info.name}</h1>
            <p className="text-sm text-neutral-500 mt-1">30 derniers jours — toutes plateformes confondues</p>
          </div>
        </div>
        <KpiGrid totals={meta} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href={`/${brand}/meta`}>
          <Card className="h-full transition hover:border-neutral-900 hover:shadow-md cursor-pointer">
            <CardContent>
              <div className="text-xs uppercase tracking-wide text-neutral-500">Meta Ads</div>
              <div className="mt-2 text-lg font-medium">Détail dark & boost →</div>
              <p className="text-sm text-neutral-500 mt-2">KPIs, courbes, filtres et top pubs.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/${brand}/tiktok`}>
          <Card className="h-full transition hover:border-neutral-900 hover:shadow-md cursor-pointer">
            <CardContent>
              <div className="text-xs uppercase tracking-wide text-neutral-500">TikTok Ads</div>
              <div className="mt-2 text-lg font-medium">Aperçu →</div>
              <p className="text-sm text-neutral-500 mt-2">Bientôt connecté.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/${brand}/programmatic`}>
          <Card className="h-full transition hover:border-neutral-900 hover:shadow-md cursor-pointer">
            <CardContent>
              <div className="text-xs uppercase tracking-wide text-neutral-500">Programmatique</div>
              <div className="mt-2 text-lg font-medium">DV360 →</div>
              <p className="text-sm text-neutral-500 mt-2">Bientôt connecté.</p>
            </CardContent>
          </Card>
        </Link>
      </section>
    </div>
  );
}
