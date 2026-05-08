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
};

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

export async function getKpiTotals(params: {
  brandCode: string;
  from: string;
  to: string;
  campaignIds?: string[];
}): Promise<KpiTotals> {
  const supabase = getSupabase();
  const campaigns = await resolveCampaignIds(params);
  if (campaigns.length === 0) return emptyKpi();

  const adIds = await adIdsForCampaigns(campaigns);
  if (adIds.length === 0) return emptyKpi();

  const totals: KpiTotals = emptyKpi();
  // Supabase has a 1000 row limit per select; we need aggregates. Use rpc? We'll use postgres_aggregation via select with range.
  // Simpler: loop with pagination by date ranges — acceptable volume.
  const pageSize = 1000;
  let offset = 0;
  for (;;) {
    const { data, error } = await supabase
      .from("ad_insights")
      .select("impressions, clicks, spend, reach")
      .in("ad_id", adIds)
      .gte("date", params.from)
      .lte("date", params.to)
      .range(offset, offset + pageSize - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    for (const r of data) {
      totals.spend += Number(r.spend ?? 0);
      totals.impressions += Number(r.impressions ?? 0);
      totals.clicks += Number(r.clicks ?? 0);
      totals.reach += Number(r.reach ?? 0);
    }
    if (data.length < pageSize) break;
    offset += pageSize;
  }
  totals.ctr = totals.impressions ? totals.clicks / totals.impressions : 0;
  totals.cpm = totals.impressions ? (totals.spend / totals.impressions) * 1000 : 0;
  return totals;
}

export async function getDailySeries(params: {
  brandCode: string;
  from: string;
  to: string;
  campaignIds?: string[];
}): Promise<DailyPoint[]> {
  const supabase = getSupabase();
  const campaigns = await resolveCampaignIds(params);
  if (campaigns.length === 0) return [];
  const adIds = await adIdsForCampaigns(campaigns);
  if (adIds.length === 0) return [];

  const map = new Map<string, DailyPoint>();
  const pageSize = 1000;
  let offset = 0;
  for (;;) {
    const { data, error } = await supabase
      .from("ad_insights")
      .select("date, impressions, clicks, spend")
      .in("ad_id", adIds)
      .gte("date", params.from)
      .lte("date", params.to)
      .range(offset, offset + pageSize - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    for (const r of data) {
      const k = r.date as string;
      const cur = map.get(k) ?? { date: k, spend: 0, impressions: 0, clicks: 0 };
      cur.spend += Number(r.spend ?? 0);
      cur.impressions += Number(r.impressions ?? 0);
      cur.clicks += Number(r.clicks ?? 0);
      map.set(k, cur);
    }
    if (data.length < pageSize) break;
    offset += pageSize;
  }
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export async function getTopAds(params: {
  brandCode: string;
  from: string;
  to: string;
  type?: "dark" | "boost";
  limit?: number;
}): Promise<TopAd[]> {
  const supabase = getSupabase();
  const { data: campaigns, error: cerr } = await supabase
    .from("cargo_campaigns_classified")
    .select("campaign_id, campaign_name, type")
    .eq("client_code", params.brandCode)
    .eq(params.type ? "type" : "client_code", params.type ?? params.brandCode);
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
  // Ads can be many, fetch by chunks of 500 ad_group_ids
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

  // Aggregate insights
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

function emptyKpi(): KpiTotals {
  return { spend: 0, impressions: 0, clicks: 0, reach: 0, ctr: 0, cpm: 0 };
}
