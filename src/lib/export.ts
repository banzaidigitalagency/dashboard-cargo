import type { KpiTotals, TypeBreakdown, TopAd, BudgetStatus } from "./queries";

export type ExportSnapshot = {
  brandName: string;
  /** Ex. "Vue d'ensemble" ou "Meta Ads". */
  scope: string;
  from: string;
  to: string;
  lastSync?: string | null;
  kpis: { current: KpiTotals; previous?: KpiTotals | null };
  breakdown?: TypeBreakdown | null;
  topDark?: TopAd[];
  topBoost?: TopAd[];
  budget?: BudgetStatus | null;
  /** Avertissement affiché en tête (ex. données de démonstration). */
  note?: string;
};

// ---------- formatting helpers (fr, mais sobres pour rester lisibles par un LLM) ----------

function frDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(d);
}

function eur(n: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

function num(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n));
}

function pct(fraction: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(fraction);
}

function signedPct(curr: number, prev: number | null | undefined): string {
  if (prev === null || prev === undefined || prev === 0 || !Number.isFinite(prev)) return "réf.";
  const d = (curr - prev) / Math.abs(prev);
  const p = d * 100;
  const sign = p > 0 ? "+" : "";
  return `${sign}${p.toFixed(Math.abs(p) >= 10 ? 0 : 1)} %`;
}

// ---------- Markdown ----------

export function buildMarkdown(s: ExportSnapshot): string {
  const lines: string[] = [];
  const k = s.kpis.current;
  const prev = s.kpis.previous ?? null;

  lines.push(`# Reporting média — ${s.brandName} · ${s.scope}`);
  lines.push(
    `Période : ${frDate(s.from)} → ${frDate(s.to)}${s.lastSync ? ` · données à jour au ${frDate(s.lastSync)}` : ""}`
  );
  lines.push("");
  if (s.note) {
    lines.push(`**⚠️ ${s.note}**`);
    lines.push("");
  }
  lines.push(
    `> Voici les données de performance média de **${s.brandName}** (${s.scope}) sur la période ci-dessus. ` +
      `Tu peux les analyser pour préparer une présentation client : synthèse des performances, points forts, ` +
      `et recommandations. Les budgets sont en euros, le CTR et le CPM sont des moyennes sur la période.`
  );
  lines.push("");

  // KPIs globaux
  lines.push("## Indicateurs globaux");
  lines.push("");
  lines.push("| Indicateur | Valeur | vs période précédente |");
  lines.push("|---|---|---|");
  lines.push(`| Budget dépensé | ${eur(k.spend)} | ${signedPct(k.spend, prev?.spend)} |`);
  lines.push(`| Impressions | ${num(k.impressions)} | ${signedPct(k.impressions, prev?.impressions)} |`);
  lines.push(`| Clics | ${num(k.clicks)} | ${signedPct(k.clicks, prev?.clicks)} |`);
  lines.push(`| CTR | ${pct(k.ctr)} | ${signedPct(k.ctr, prev?.ctr)} |`);
  lines.push(`| CPM | ${eur(k.cpm)} | ${signedPct(k.cpm, prev?.cpm)} |`);
  lines.push("");

  // Dark vs boost
  if (s.breakdown) {
    const b = s.breakdown;
    lines.push("## Répartition dark / boost");
    lines.push("");
    lines.push("| Type | Budget | Impressions | Clics | CTR | CPM |");
    lines.push("|---|---|---|---|---|---|");
    for (const [label, t] of [
      ["Dark", b.dark],
      ["Boost", b.boost],
      ["Total", b.total],
    ] as const) {
      lines.push(`| ${label} | ${eur(t.spend)} | ${num(t.impressions)} | ${num(t.clicks)} | ${pct(t.ctr)} | ${eur(t.cpm)} |`);
    }
    lines.push("");
  }

  // Top créas
  const renderAds = (title: string, ads?: TopAd[]) => {
    if (!ads || ads.length === 0) return;
    lines.push(`## ${title}`);
    lines.push("");
    lines.push("| # | Créa | Campagne | Impressions | Clics | CTR | CPM | Dépense |");
    lines.push("|---|---|---|---|---|---|---|---|");
    ads.forEach((a, i) => {
      lines.push(
        `| ${i + 1} | ${escapePipe(a.ad_name)} | ${escapePipe(a.campaign_name)} | ${num(a.impressions)} | ${num(a.clicks)} | ${pct(a.ctr)} | ${eur(a.cpm)} | ${eur(a.spend)} |`
      );
    });
    lines.push("");
  };
  renderAds("Top pubs dark", s.topDark);
  renderAds("Top boosts", s.topBoost);

  // Budget
  if (s.budget) {
    const PLAT: Record<string, string> = { meta: "Meta", tiktok: "TikTok", dv360: "DV360" };
    lines.push("## Budget annuel 2026");
    lines.push("");
    lines.push("| Ligne | Budget | Dépensé | Restant | Consommé |");
    lines.push("|---|---|---|---|---|");
    for (const l of s.budget.lines) {
      const name = `${PLAT[l.platform] ?? l.platform}${l.type ? ` · ${l.type === "dark" ? "Dark" : "Boost"}` : ""}`;
      const spent = l.hasActuals ? eur(l.spent) : "— (non synchronisé)";
      lines.push(`| ${name} | ${eur(l.budget)} | ${spent} | ${eur(l.remaining)} | ${pct(l.pct)} |`);
    }
    const t = s.budget.totals;
    lines.push(`| **Total** | **${eur(t.budget)}** | **${eur(t.spent)}** | **${eur(t.remaining)}** | **${pct(t.pct)}** |`);
    lines.push("");
  }

  lines.push("---");
  lines.push(`*Export généré depuis le dashboard Cargo · ${frDate(s.to)}.*`);

  return lines.join("\n");
}

function escapePipe(str: string): string {
  return (str ?? "").replace(/\|/g, "/").replace(/\n/g, " ").trim();
}

// ---------- CSV (fr / Excel : séparateur ';') ----------

export function buildCsv(s: ExportSnapshot): string {
  const sep = ";";
  const rows: string[][] = [];
  rows.push(["Type", "Campagne", "Créa", "Impressions", "Clics", "Dépense (EUR)", "CTR (%)", "CPM (EUR)"]);

  const add = (ads?: TopAd[]) => {
    for (const a of ads ?? []) {
      rows.push([
        a.type,
        a.campaign_name,
        a.ad_name,
        String(a.impressions),
        String(a.clicks),
        a.spend.toFixed(2),
        (a.ctr * 100).toFixed(2),
        a.cpm.toFixed(2),
      ]);
    }
  };
  add(s.topDark);
  add(s.topBoost);

  // BOM pour qu'Excel lise l'UTF-8 (accents)
  const bom = "﻿";
  return bom + rows.map((r) => r.map((c) => csvCell(c, sep)).join(sep)).join("\r\n");
}

function csvCell(value: string, sep: string): string {
  const v = value ?? "";
  if (v.includes(sep) || v.includes('"') || v.includes("\n")) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

export function exportFilename(s: ExportSnapshot, ext: string): string {
  const slug = s.brandName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `cargo-${slug}-${s.from}_${s.to}.${ext}`;
}
