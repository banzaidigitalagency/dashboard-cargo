/**
 * Tuile carrée de marque : affiche le PNG du logo si dispo, sinon
 * fallback texte sur fond brand color (initiales ou nom complet).
 */
import type { Brand } from "@/lib/constants";

export function BrandTile({
  brand,
  size = 56,
  showFull = false,
}: {
  brand: Brand;
  size?: number;
  /** Si vrai et qu'il n'y a pas de PNG, affiche le nom plutôt que l'initiale. */
  showFull?: boolean;
}) {
  if (brand.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={brand.logo}
        alt={brand.name}
        width={size}
        height={size}
        className="rounded-md object-contain bg-white"
        style={{
          padding: Math.max(4, size * 0.1),
          width: size,
          height: size,
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
