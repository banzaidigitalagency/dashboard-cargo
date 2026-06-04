import { formatDate, relativeFromNow } from "@/lib/utils";

type Props = {
  /** Texte au-dessus du titre (eyebrow), ex. "Reporting média · Meta Ads". */
  eyebrow?: string;
  /** Première ligne du titre. */
  title: string;
  /** Deuxième ligne du titre (sera affichée en vert). */
  accent?: string;
  /** Période analysée — from/to en ISO. */
  from?: string;
  to?: string;
  /** Date de la donnée la plus récente (sync). */
  lastSync?: string | null;
};

export function Hero({ eyebrow, title, accent, from, to, lastSync }: Props) {
  return (
    <section className="py-10 md:py-12">
      <div className="flex items-center gap-2 mb-4">
        {lastSync && (
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--green-600)]" />
            Données mises à jour {relativeFromNow(lastSync)}
          </span>
        )}
        {eyebrow && (
          <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted-2)] before:content-['·'] before:mx-2">
            {eyebrow}
          </span>
        )}
      </div>
      <h1 className="font-display text-4xl md:text-5xl font-light leading-[1.05] text-[var(--ink)] max-w-3xl">
        {title}
        {accent && (
          <>
            <br />
            <span className="font-semibold text-[var(--green-600)]">{accent}</span>
          </>
        )}
      </h1>
      {from && to && (
        <p className="mt-5 text-sm text-[var(--muted)]">
          Période analysée :{" "}
          <span className="text-[var(--ink-2)] font-medium">
            {formatDate(from)} → {formatDate(to)}
          </span>
        </p>
      )}
    </section>
  );
}
