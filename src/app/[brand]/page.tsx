import Link from "next/link";
import { getBrand } from "@/lib/constants";
import {
  getDashboardSnapshot,
  getFirstInsightDate,
  getBudgetStatus,
  type DashboardSnapshot,
  type BudgetStatus,
} from "@/lib/queries";
import { KpiGrid } from "@/components/kpi-grid";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { BudgetWidget } from "@/components/budget-widget";
import { Card, CardContent, SectionHeader } from "@/components/ui";
import { parseRange, parseCompare } from "@/lib/date-range";
import { PlatformLogo } from "@/components/platform-logo";
import { PeriodBar } from "@/components/period-bar";
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

export default async function BrandOverview({ params, searchParams }: Props) {
  const { brand } = await params;
  const sp = await searchParams;
  const info = getBrand(brand)!;
  const { from, to } = parseRange(sp);
  const compareRange = parseCompare(sp);

  let snap: DashboardSnapshot = EMPTY;
  let compareSnap: DashboardSnapshot | null = null;
  let earliest: string | null = null;
  let budget: BudgetStatus | null = null;
  try {
    [snap, earliest, compareSnap, budget] = await Promise.all([
      getDashboardSnapshot({ brandCode: brand, from, to }),
      getFirstInsightDate(brand),
      compareRange
        ? getDashboardSnapshot({ brandCode: brand, from: compareRange.from, to: compareRange.to })
        : Promise.resolve(null),
      getBudgetStatus(brand).catch(() => null),
    ]);
  } catch {}

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
        eyebrow="Vue d'ensemble"
        title="Performance par marque,"
        accent="toutes plateformes."
        from={from}
        to={to}
        lastSync={snap.lastSync}
      />

      <section className="pb-8">
        <Card>
          <CardContent>
            <PeriodBar
              from={from}
              to={to}
              cfrom={compareRange?.from}
              cto={compareRange?.to}
              comparing={!!compareRange}
              earliestDate={earliest ?? undefined}
            />
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3 pb-12">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
          <span className="text-[var(--green-600)] mr-1">/00</span> Indicateurs globaux
        </div>
        <KpiGrid
          totals={snap.current}
          previous={snap.previous}
          daily={snap.daily}
          compare={compare}
        />
      </section>

      {budget && (
        <section className="space-y-4 pb-12">
          <SectionHeader
            eyebrow="Budget annuel"
            title="Suivi budgétaire 2026"
            subtitle="Budget média validé vs dépensé réel, par plateforme et type. Le restant indique la marge disponible."
          />
          <BudgetWidget status={budget} />
        </section>
      )}

      <section className="space-y-4 pb-10">
        <SectionHeader
          eyebrow="Plateformes"
          title="Détail par canal"
          subtitle="Choisissez un canal pour consulter le détail des campagnes, des créas et de la performance."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PlatformCard brand={brand} platform="meta" />
          <PlatformCard brand={brand} platform="tiktok" />
          <PlatformCard brand={brand} platform="dv360" />
        </div>
      </section>

      <Footer brandName={info.name} />
    </>
  );
}

function PlatformCard({
  brand,
  platform,
}: {
  brand: string;
  platform: "meta" | "tiktok" | "dv360";
}) {
  const href = platform === "dv360" ? `/${brand}/programmatic` : `/${brand}/${platform}`;
  const label =
    platform === "meta" ? "Meta Ads" : platform === "tiktok" ? "TikTok Ads" : "Programmatique";
  const subtitle =
    platform === "meta"
      ? "Dark posts · Boosts · Créas"
      : platform === "tiktok"
      ? "Bientôt connecté"
      : "DV360 · Bientôt connecté";
  const live = platform === "meta";
  return (
    <Link href={href}>
      <Card className="h-full transition hover:border-[var(--navy)] hover:shadow-[var(--shadow-card)] cursor-pointer">
        <CardContent>
          <div className="flex items-center justify-between gap-3">
            <PlatformLogo platform={platform} size={44} />
            <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
              {live ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--green-600)]" />
                  En direct
                </span>
              ) : (
                <span className="text-[var(--muted-2)]">Aperçu</span>
              )}
            </div>
          </div>
          <div className="mt-5 font-display text-lg font-semibold text-[var(--ink)]">{label}</div>
          <div className="text-sm text-[var(--muted)] mt-1">{subtitle}</div>
          <div className="mt-4 text-xs text-[var(--navy)] font-medium">Consulter →</div>
        </CardContent>
      </Card>
    </Link>
  );
}
