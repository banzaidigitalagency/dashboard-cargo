import { getSupabase } from "./supabase";

export type KpiTotals = {
  spend: number;
  impressions: number;
  clicks: number;
  reach: number;
  ctr: number;
  cpm: number;
};

export type CampaignRow = {
  campaign_id: string;
  campaign_name: string;
  type: "dark" | "boost";
  status: string;
  objective: string | null;
};

export type DailyPoint = {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
};

export type TopAd = {
  ad_id: string;
  ad_name: string;
  preview_url: string | null;
  format: string | null;
  campaign_name: string;
  type: "dark" | "boost";
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
  cpm: number;
};

export type DashboardSnapshot = {
  current: KpiTotals;
  /** Même longueur de fenêtre juste avant `from`. `null` si pas de données comparables. */
  previous: KpiTotals | null;
  daily: DailyPoint[];
  /** Date max d'insight sur la marque (toutes plateformes confondues). */
  lastSync: string | null;
};

/** Récupère la 1re date d'insight disponible pour une marque (toutes campagnes). */
export async function getFirstInsightDate(brandCode: string): Promise<string | null> {
  const campaignIds = await resolveCampaignIds({ brandCode });
  if (campaignIds.length === 0) return null;
  const adIds = await adIdsForCampaigns(campaignIds);
  if (adIds.length === 0) return null;
  const supabase = getSupabase();
  let earliest: string | null = null;
  for (let i = 0; i < adIds.length; i += 500) {
    const chunk = adIds.slice(i, i + 500);
    const { data, error } = await supabase
      .from("ad_insights")
      .select("date")
      .in("ad_id", chunk)
      .order("date", { ascending: true })
      .limit(1);
    if (error) throw error;
    const d = data?.[0]?.date as string | undefined;
    if (d && (!earliest || d < earliest)) earliest = d;
  }
  return earliest;
}

export async function listCargoCampaigns(brandCode: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("cargo_campaigns_classified")
    .select("campaign_id, campaign_name, type, status, objective")
    .eq("client_code", brandCode)
    .order("campaign_name");
  if (error) throw error;
  return (data ?? []) as CampaignRow[];
}

export async function getDashboardSnapshot(params: {
  brandCode: string;
  from: string;
  to: string;
  campaignIds?: string[];
}): Promise<DashboardSnapshot> {
  const campaigns = await resolveCampaignIds(params);
  if (campaigns.length === 0) {
    return { current: emptyKpi(), previous: null, daily: [], lastSync: null };
  }
  const adIds = await adIdsForCampaigns(campaigns);
  if (adIds.length === 0) {
    return { current: emptyKpi(), previous: null, daily: [], lastSync: null };
  }

  const dayMs = 24 * 60 * 60 * 1000;
  const fromDate = new Date(params.from);
  const toDate = new Date(params.to);
  const span = Math.max(1, Math.round((toDate.getTime() - fromDate.getTime()) / dayMs) + 1);
  const prevTo = new Date(fromDate.getTime() - dayMs);
  const prevFrom = new Date(prevTo.getTime() - (span - 1) * dayMs);

  const [currentRows, previousRows] = await Promise.all([
    fetchInsightsByDate(adIds, params.from, params.to),
    fetchInsightsByDate(adIds, toISO(prevFrom), toISO(prevTo)),
  ]);

  const current = aggregate(currentRows);
  const previous = aggregate(previousRows);
  const hasPrev = previousRows.length > 0;

  // Zero-fill daily series across the requested range
  const dailyMap = new Map<string, DailyPoint>();
  for (let i = 0; i < span; i++) {
    const d = new Date(fromDate.getTime() + i * dayMs);
    const k = toISO(d);
    dailyMap.set(k, { date: k, impressions: 0, clicks: 0, spend: 0 });
  }
  for (const r of currentRows) {
    const k = r.date;
    const cur = dailyMap.get(k);
    if (!cur) continue;
    cur.impressions += Number(r.impressions ?? 0);
    cur.clicks += Number(r.clicks ?? 0);
    cur.spend += Number(r.spend ?? 0);
  }
  const daily = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  const lastSync = currentRows.reduce<string | null>((acc, r) => {
    return acc && acc > r.date ? acc : r.date;
  }, null);

  return {
    current,
    previous: hasPrev ? previous : null,
    daily,
    lastSync,
  };
}

export type TypeBreakdown = {
  dark: KpiTotals;
  boost: KpiTotals;
  total: KpiTotals;
};

/** Agrège les KPI séparément pour les campagnes dark et boost d'une marque. */
export async function getTypeBreakdown(params: {
  brandCode: string;
  from: string;
  to: string;
}): Promise<TypeBreakdown> {
  const supabase = getSupabase();
  const { data: campaigns, error } = await supabase
    .from("cargo_campaigns_classified")
    .select("campaign_id, type")
    .eq("client_code", params.brandCode);
  if (error) throw error;

  const byType: Record<"dark" | "boost", string[]> = { dark: [], boost: [] };
  for (const c of campaigns ?? []) {
    const t = c.type as "dark" | "boost";
    if (t === "dark" || t === "boost") byType[t].push(c.campaign_id as string);
  }

  const [dark, boost] = await Promise.all([
    aggregateForCampaigns(byType.dark, params.from, params.to),
    aggregateForCampaigns(byType.boost, params.from, params.to),
  ]);

  const total: KpiTotals = {
    spend: dark.spend + boost.spend,
    impressions: dark.impressions + boost.impressions,
    clicks: dark.clicks + boost.clicks,
    reach: dark.reach + boost.reach,
    ctr: 0,
    cpm: 0,
  };
  total.ctr = total.impressions ? total.clicks / total.impressions : 0;
  total.cpm = total.impressions ? (total.spend / total.impressions) * 1000 : 0;

  return { dark, boost, total };
}

async function aggregateForCampaigns(
  campaignIds: string[],
  from: string,
  to: string
): Promise<KpiTotals> {
  if (campaignIds.length === 0) return emptyKpi();
  const adIds = await adIdsForCampaigns(campaignIds);
  if (adIds.length === 0) return emptyKpi();
  const rows = await fetchInsightsByDate(adIds, from, to);
  return aggregate(rows);
}

export type BudgetLine = {
  platform: "meta" | "tiktok" | "dv360";
  type: "dark" | "boost" | null;
  label: string;
  periodStart: string;
  periodEnd: string;
  budget: number;
  spent: number;
  remaining: number;
  pct: number; // 0..1+ (peut dépasser 1 si surconsommé)
  hasActuals: boolean; // false si la plateforme n'est pas encore synchronisée
};

export type BudgetStatus = {
  lines: BudgetLine[];
  totals: { budget: number; spent: number; remaining: number; pct: number };
  asOf: string; // date jusqu'à laquelle on a compté le dépensé
};

/**
 * Statut budgétaire d'une marque : budgets du plan validé vs dépensé réel.
 * Le dépensé Meta (dark/boost) est calculé sur la période du plan jusqu'à aujourd'hui.
 * Les plateformes non synchronisées (TikTok, DV360) affichent un dépensé à 0.
 */
export async function getBudgetStatus(brandCode: string): Promise<BudgetStatus | null> {
  const supabase = getSupabase();
  const { data: rows, error } = await supabase
    .from("cargo_budgets")
    .select("platform, type, label, period_start, period_end, budget_media")
    .eq("client_code", brandCode);
  if (error) throw error;
  if (!rows || rows.length === 0) return null;

  const today = todayISO();

  // Fenêtre de comptage du dépensé Meta = du plus tôt period_start au plus tard min(period_end, today)
  const metaStart = rows
    .map((r) => r.period_start as string)
    .reduce((a, b) => (a < b ? a : b));
  const metaEndCap = rows
    .map((r) => r.period_end as string)
    .reduce((a, b) => (a > b ? a : b));
  const metaEnd = metaEndCap < today ? metaEndCap : today;

  let metaBreakdown: TypeBreakdown | null = null;
  const needsMeta = rows.some((r) => r.platform === "meta");
  if (needsMeta) {
    metaBreakdown = await getTypeBreakdown({ brandCode, from: metaStart, to: metaEnd }).catch(
      () => null
    );
  }

  const lines: BudgetLine[] = rows.map((r) => {
    const platform = r.platform as "meta" | "tiktok" | "dv360";
    const type = (r.type as "dark" | "boost" | null) ?? null;
    const budget = Number(r.budget_media ?? 0);
    let spent = 0;
    let hasActuals = false;
    if (platform === "meta" && metaBreakdown) {
      hasActuals = true;
      if (type === "dark") spent = metaBreakdown.dark.spend;
      else if (type === "boost") spent = metaBreakdown.boost.spend;
      else spent = metaBreakdown.total.spend;
    }
    const remaining = budget - spent;
    const pct = budget > 0 ? spent / budget : 0;
    return {
      platform,
      type,
      label: (r.label as string) ?? "",
      periodStart: r.period_start as string,
      periodEnd: r.period_end as string,
      budget,
      spent,
      remaining,
      pct,
      hasActuals,
    };
  });

  const totBudget = lines.reduce((s, l) => s + l.budget, 0);
  const totSpent = lines.reduce((s, l) => s + l.spent, 0);
  return {
    lines,
    totals: {
      budget: totBudget,
      spent: totSpent,
      remaining: totBudget - totSpent,
      pct: totBudget > 0 ? totSpent / totBudget : 0,
    },
    asOf: metaEnd,
  };
}

export async function getTopAds(params: {
  brandCode: string;
  from: string;
  to: string;
  type?: "dark" | "boost";
  limit?: number;
}): Promise<TopAd[]> {
  const supabase = getSupabase();
  let cq = supabase
    .from("cargo_campaigns_classified")
    .select("campaign_id, campaign_name, type")
    .eq("client_code", params.brandCode);
  if (params.type) cq = cq.eq("type", params.type);
  const { data: campaigns, error: cerr } = await cq;
  if (cerr) throw cerr;
  if (!campaigns || campaigns.length === 0) return [];
  const campaignMap = new Map(campaigns.map((c) => [c.campaign_id as string, c]));

  const { data: adGroups, error: agErr } = await supabase
    .from("ad_groups")
    .select("id, campaign_id")
    .in("campaign_id", campaigns.map((c) => c.campaign_id));
  if (agErr) throw agErr;
  const adGroupToCampaign = new Map((adGroups ?? []).map((g) => [g.id as string, g.campaign_id as string]));
  if (adGroupToCampaign.size === 0) return [];

  const adGroupIds = Array.from(adGroupToCampaign.keys());
  const ads: { id: string; name: string | null; preview_url: string | null; format: string | null; ad_group_id: string }[] = [];
  for (let i = 0; i < adGroupIds.length; i += 500) {
    const chunk = adGroupIds.slice(i, i + 500);
    const { data, error } = await supabase
      .from("ads")
      .select("id, name, preview_url, format, ad_group_id")
      .in("ad_group_id", chunk);
    if (error) throw error;
    ads.push(...(data ?? []));
  }
  if (ads.length === 0) return [];
  const adMap = new Map(ads.map((a) => [a.id, a]));

  const adIds = ads.map((a) => a.id);
  const agg = new Map<string, { impressions: number; clicks: number; spend: number }>();
  for (let i = 0; i < adIds.length; i += 500) {
    const chunk = adIds.slice(i, i + 500);
    const pageSize = 1000;
    let offset = 0;
    for (;;) {
      const { data, error } = await supabase
        .from("ad_insights")
        .select("ad_id, impressions, clicks, spend")
        .in("ad_id", chunk)
        .gte("date", params.from)
        .lte("date", params.to)
        .range(offset, offset + pageSize - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      for (const r of data) {
        const cur = agg.get(r.ad_id as string) ?? { impressions: 0, clicks: 0, spend: 0 };
        cur.impressions += Number(r.impressions ?? 0);
        cur.clicks += Number(r.clicks ?? 0);
        cur.spend += Number(r.spend ?? 0);
        agg.set(r.ad_id as string, cur);
      }
      if (data.length < pageSize) break;
      offset += pageSize;
    }
  }

  const rows: TopAd[] = [];
  for (const [adId, stats] of agg.entries()) {
    const ad = adMap.get(adId);
    if (!ad) continue;
    const campaignId = adGroupToCampaign.get(ad.ad_group_id);
    if (!campaignId) continue;
    const camp = campaignMap.get(campaignId);
    if (!camp) continue;
    rows.push({
      ad_id: adId,
      ad_name: ad.name ?? "(sans titre)",
      preview_url: ad.preview_url,
      format: ad.format,
      campaign_name: camp.campaign_name as string,
      type: camp.type as "dark" | "boost",
      impressions: stats.impressions,
      clicks: stats.clicks,
      spend: stats.spend,
      ctr: stats.impressions ? stats.clicks / stats.impressions : 0,
      cpm: stats.impressions ? (stats.spend / stats.impressions) * 1000 : 0,
    });
  }
  rows.sort((a, b) => b.impressions - a.impressions);
  return rows.slice(0, params.limit ?? 6);
}

async function resolveCampaignIds(params: { brandCode: string; campaignIds?: string[] }): Promise<string[]> {
  if (params.campaignIds && params.campaignIds.length > 0) return params.campaignIds;
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("cargo_campaigns_classified")
    .select("campaign_id")
    .eq("client_code", params.brandCode);
  if (error) throw error;
  return (data ?? []).map((r) => r.campaign_id as string);
}

async function adIdsForCampaigns(campaignIds: string[]): Promise<string[]> {
  if (campaignIds.length === 0) return [];
  const supabase = getSupabase();
  const result: string[] = [];
  for (let i = 0; i < campaignIds.length; i += 500) {
    const chunk = campaignIds.slice(i, i + 500);
    const { data: adGroups, error: agErr } = await supabase
      .from("ad_groups")
      .select("id")
      .in("campaign_id", chunk);
    if (agErr) throw agErr;
    const adGroupIds = (adGroups ?? []).map((g) => g.id as string);
    for (let j = 0; j < adGroupIds.length; j += 500) {
      const agChunk = adGroupIds.slice(j, j + 500);
      const { data: ads, error } = await supabase
        .from("ads")
        .select("id")
        .in("ad_group_id", agChunk);
      if (error) throw error;
      result.push(...(ads ?? []).map((a) => a.id as string));
    }
  }
  return result;
}

async function fetchInsightsByDate(adIds: string[], from: string, to: string) {
  const supabase = getSupabase();
  const rows: { date: string; impressions: number | null; clicks: number | null; spend: number | null }[] = [];
  for (let i = 0; i < adIds.length; i += 500) {
    const chunk = adIds.slice(i, i + 500);
    const pageSize = 1000;
    let offset = 0;
    for (;;) {
      const { data, error } = await supabase
        .from("ad_insights")
        .select("date, impressions, clicks, spend")
        .in("ad_id", chunk)
        .gte("date", from)
        .lte("date", to)
        .range(offset, offset + pageSize - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      rows.push(...data);
      if (data.length < pageSize) break;
      offset += pageSize;
    }
  }
  return rows;
}

function aggregate(rows: { impressions: number | null; clicks: number | null; spend: number | null }[]): KpiTotals {
  const t: KpiTotals = emptyKpi();
  for (const r of rows) {
    t.impressions += Number(r.impressions ?? 0);
    t.clicks += Number(r.clicks ?? 0);
    t.spend += Number(r.spend ?? 0);
  }
  t.ctr = t.impressions ? t.clicks / t.impressions : 0;
  t.cpm = t.impressions ? (t.spend / t.impressions) * 1000 : 0;
  return t;
}

function emptyKpi(): KpiTotals {
  return { spend: 0, impressions: 0, clicks: 0, reach: 0, ctr: 0, cpm: 0 };
}

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayISO(): string {
  return toISO(new Date());
}
