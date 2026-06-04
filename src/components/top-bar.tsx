import Link from "next/link";
import type { Brand } from "@/lib/constants";
import { BrandTile } from "@/components/brand-tile";

type Props = {
  /** Marque courante (sous-titre dans la top bar). */
  brand?: Brand;
  /** Indicateur "à propos de" — ex. "Reporting média · Meta Ads". */
  eyebrow?: string;
  /** Action de droite (date picker, presets, etc.). */
  right?: React.ReactNode;
  /** Affiche le lien retour vers la sélection des marques. */
  showBrandSwitch?: boolean;
};

export function TopBar({ brand, eyebrow, right, showBrandSwitch }: Props) {
  return (
    <header
      className="relative bg-[var(--navy)] text-white no-print"
      style={{
        width: "100vw",
        left: "50%",
        marginLeft: "-50vw",
      }}
    >
      <div className="mx-auto max-w-7xl flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            {brand ? (
              <BrandTile brand={brand} size={40} />
            ) : (
              <div
                className="h-10 w-10 rounded-md bg-white text-[var(--navy)] flex items-center justify-center font-display font-bold text-xl"
                aria-label="Cargo"
              >
                C
              </div>
            )}
            <div className="leading-tight">
              {eyebrow && (
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/60">
                  {eyebrow}
                </div>
              )}
              <div className="font-display text-base font-semibold flex items-center gap-2">
                <span>Cargo</span>
                {brand && (
                  <>
                    <span className="text-white/40">·</span>
                    <span className="text-white/85 font-normal">{brand.name}</span>
                  </>
                )}
              </div>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {right}
          {showBrandSwitch && (
            <Link
              href="/"
              className="text-xs uppercase tracking-wider text-white/70 hover:text-white transition"
            >
              ← Toutes les marques
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
