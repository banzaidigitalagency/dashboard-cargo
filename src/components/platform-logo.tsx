/**
 * Logo plateforme monochrome (style "tuile") — utilisé en header de section.
 * Pas de couleurs marque externes : tout vit dans la charte navy/green.
 */
import { cn } from "@/lib/utils";

type Platform = "meta" | "tiktok" | "dv360";

export function PlatformLogo({
  platform,
  size = 40,
  className,
}: {
  platform: Platform;
  size?: number;
  className?: string;
}) {
  const common = "rounded-md flex items-center justify-center text-white";
  if (platform === "meta") {
    return (
      <div
        className={cn(common, "bg-[var(--navy)]", className)}
        style={{ width: size, height: size }}
        aria-label="Meta"
      >
        <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="currentColor" aria-hidden>
          <path d="M3 6.6c.7-1.3 1.9-2 3.3-2 1.6 0 3 1 4.1 2.5L12 9l1.7-2c1-1.5 2.4-2.5 4-2.5 2.6 0 4.7 2.1 4.7 5 0 2.8-2.1 5.9-4.8 9.4-1.2 1.6-2.3 1.6-3.5 0L12 15.5l-2.1 3.5c-1.2 1.5-2.4 1.5-3.6-.1C3.6 15.5 1.5 12.4 1.5 9.7c0-1.2.4-2.3 1-3.1zM12 13l1.5-2.1c.9-1.3 1.9-2.6 3.1-2.6 1.2 0 2 1 2 2.4 0 1.9-1.4 4.4-3.3 7-.6.8-1 .8-1.5 0L12 13zm-2 0L8 18.6c-.5.8-1 .8-1.5 0-1.9-2.6-3.3-5-3.3-7C3.2 10.2 4 9.2 5.2 9.2c1.2 0 2.2 1.3 3.1 2.7L10 13z" />
        </svg>
      </div>
    );
  }
  if (platform === "tiktok") {
    return (
      <div
        className={cn(common, "bg-[var(--navy)]", className)}
        style={{ width: size, height: size }}
        aria-label="TikTok"
      >
        <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="currentColor" aria-hidden>
          <path d="M16.6 3h-3v12.1a2.7 2.7 0 1 1-2.7-2.7c.3 0 .6 0 .9.1V9.4c-.3 0-.6-.1-.9-.1A5.7 5.7 0 1 0 16.6 15V9.7a8 8 0 0 0 4.2 1.2V7.8a4.6 4.6 0 0 1-4.2-4.8z" />
        </svg>
      </div>
    );
  }
  return (
    <div
      className={cn(common, "bg-[var(--navy)]", className)}
      style={{ width: size, height: size }}
      aria-label="DV360"
    >
      <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="3.5" ry="9" />
        <line x1="3" y1="12" x2="21" y2="12" />
      </svg>
    </div>
  );
}

export const PLATFORM_META: Record<Platform, { name: string; subtitle: string }> = {
  meta: { name: "Meta Ads", subtitle: "Facebook · Instagram — Dark posts & boosts" },
  tiktok: { name: "TikTok Ads", subtitle: "Inflow brand & creators" },
  dv360: { name: "Programmatique", subtitle: "Display & vidéo via DV360" },
};
