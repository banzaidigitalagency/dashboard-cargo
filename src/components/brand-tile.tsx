/**
 * Tuile carrée de marque : affiche le logo si dispo, sinon fallback texte
 * sur fond brand color. Gère deux cas :
 *  - logoHasBackground=true  → le logo a déjà son fond (carré coloré), on le pose plein cadre
 *  - logoHasBackground=false → logo transparent/blanc, on le pose sur fond blanc avec marge
 */
import type { Brand } from "@/lib/constants";

export function BrandTile({
  brand,
  size = 56,
  showFull = false,
}: {
  brand: Brand;
  size?: number;
  /** Si vrai et qu'il n'y a pas de logo, affiche le nom plutôt que l'initiale. */
  showFull?: boolean;
}) {
  if (brand.logo) {
    const hasBg = brand.logoHasBackground;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={brand.logo}
        alt={brand.name}
        width={size}
        height={size}
        className="rounded-md"
        style={{
          width: size,
          height: size,
          objectFit: hasBg ? "cover" : "contain",
          background: hasBg ? "transparent" : "#ffffff",
          padding: hasBg ? 0 : Math.max(4, size * 0.12),
        }}
      />
    );
  }
  return (
    <div
      className="rounded-md flex items-center justify-center font-display font-bold"
      style={{
        width: size,
        height: size,
        background: brand.color,
        color: brand.contrast === "white" ? "#fff" : "var(--navy)",
        fontSize: showFull ? Math.max(10, size * 0.18) : Math.max(14, size * 0.42),
        letterSpacing: showFull ? "0.04em" : "-0.02em",
        textTransform: showFull ? "uppercase" : "none",
        textAlign: "center",
        padding: showFull ? 6 : 0,
        lineHeight: showFull ? 1.1 : 1,
      }}
    >
      {showFull ? brand.name : brand.name[0]}
    </div>
  );
}
