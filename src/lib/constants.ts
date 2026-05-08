export type Brand = {
  code: string;
  name: string;
  available: boolean;
};

export const BRANDS: Brand[] = [
  { code: "sitram", name: "Sitram", available: true },
  { code: "cedif", name: "C'est deux euros", available: true },
  { code: "ostaria", name: "Ostaria", available: true },
  { code: "orok", name: "Orok", available: true },
  { code: "promodis", name: "Promodis", available: false },
];

export function getBrand(code: string): Brand | undefined {
  return BRANDS.find((b) => b.code === code);
}

export type Platform = "meta" | "tiktok" | "programmatic";

export const PLATFORM_LABELS: Record<Platform, string> = {
  meta: "Meta Ads",
  tiktok: "TikTok Ads",
  programmatic: "Programmatique (DV360)",
};
