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
  /**
   * Le logo a-t-il déjà son propre fond (carré coloré) ?
   * Si oui, on l'affiche tel quel sans bandeau couleur derrière.
   * Si non (logo transparent/blanc), on le pose sur un fond clair.
   */
  logoHasBackground?: boolean;
};

export const BRANDS: Brand[] = [
  {
    code: "sitram",
    name: "Sitram",
    baseline: "depuis 1963",
    available: true,
    color: "#0E2A6E", // navy proche du logo Sitram
    contrast: "white",
    logo: "/brands/sitram.png",
    logoHasBackground: false, // logo sur fond blanc/transparent
  },
  {
    code: "cedif",
    name: "C'est deux euros",
    baseline: "Bazar discount",
    available: true,
    color: "#1FA6E0", // cyan vif Cédif
    contrast: "white",
    logo: "/brands/cedif.png",
    logoHasBackground: true, // logo déjà sur carré cyan
  },
  {
    code: "ostaria",
    name: "Ostaria",
    baseline: "Home design",
    available: true,
    color: "#0F0F10", // noir profond Ostaria
    contrast: "white",
    logo: "/brands/ostaria.png",
    logoHasBackground: false, // logo noir sur fond blanc
  },
  {
    code: "orok",
    name: "Orok",
    baseline: "Bricolage & déco",
    available: true,
    color: "#2B2B2B", // gris anthracite OROK
    contrast: "white",
    logo: "/brands/orok.jpg",
    logoHasBackground: true, // logo déjà sur fond anthracite
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
