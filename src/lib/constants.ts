export type Brand = {
  code: string;
  name: string;
  /** Texte court à afficher sous le titre (signature, baseline, ville…). */
  baseline?: string;
  available: boolean;
  /** Couleur brand samplée depuis le logo. Utilisée pour la tuile, l'accent. */
  color: string;
  /** Couleur du texte sur fond `color`. */
  contrast: "white" | "navy";
  /** Chemin vers le logo PNG/SVG dans /public. Optionnel. */
  logo?: string;
};

// Pour activer les vrais logos, dépose les 4 PNG dans public/brands/{code}.png
// puis ajoute `logo: "/brands/<code>.png"` sur l'entrée correspondante.
export const BRANDS: Brand[] = [
  {
    code: "sitram",
    name: "Sitram",
    baseline: "depuis 1963",
    available: true,
    color: "#0E2A6E", // navy proche du logo Sitram
    contrast: "white",
  },
  {
    code: "cedif",
    name: "C'est deux euros",
    baseline: "Bazar discount",
    available: true,
    color: "#1FA6E0", // cyan vif Cédif
    contrast: "white",
  },
  {
    code: "ostaria",
    name: "Ostaria",
    baseline: "Home design",
    available: true,
    color: "#0F0F10", // noir profond Ostaria
    contrast: "white",
  },
  {
    code: "orok",
    name: "Orok",
    baseline: "Bricolage & déco",
    available: true,
    color: "#2B2B2B", // gris anthracite OROK
    contrast: "white",
  },
  {
    code: "promodis",
    name: "Promodis",
    baseline: "Bientôt",
    available: false,
    color: "#5b6678",
    contrast: "white",
  },
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
