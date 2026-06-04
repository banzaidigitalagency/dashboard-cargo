import Link from "next/link";
import { BRANDS } from "@/lib/constants";
import { TopBar } from "@/components/top-bar";
import { Badge } from "@/components/ui";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar eyebrow="Reporting média · Cargo" />
      <main className="mx-auto w-full max-w-7xl px-6 flex-1">
        <section className="py-14 md:py-20 border-b border-[var(--hairline)]">
          <div className="flex items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--green-600)]" />
              Dashboard client
            </span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted-2)] before:content-['·'] before:mx-2">
              4 marques actives
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-[1.02] text-[var(--ink)] max-w-4xl">
            La performance média
            <br />
            <span className="font-semibold text-[var(--green-600)]">en un coup d&apos;œil.</span>
          </h1>
          <p className="text-base text-[var(--muted)] mt-6 max-w-xl leading-relaxed">
            Vue détaillée des performances Meta, TikTok et Programmatique pour chaque marque du
            portefeuille Cargo. Choisissez une marque pour entrer dans le détail.
          </p>
        </section>

        <section className="py-10">
          <div className="flex items-baseline justify-between mb-6">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
              <span className="text-[var(--green-600)] mr-1">/00</span>
              Marques
            </div>
            <div className="text-[11px] uppercase tracking-wider text-[var(--muted-2)]">
              {BRANDS.filter((b) => b.available).length} actives sur {BRANDS.length}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BRANDS.map((b) => {
              const disabled = !b.available;
              const inner = (
                <div
                  className={`group h-full rounded-2xl overflow-hidden bg-white border transition ${
                    disabled
                      ? "border-[var(--hairline)] opacity-60"
                      : "border-[var(--hairline)] hover:border-[var(--navy)] hover:shadow-[var(--shadow-card)]"
                  }`}
                >
                  <div
                    className="relative h-32 flex items-center justify-center overflow-hidden bg-white"
                  >
                    {/* Liseré vert au scalpel */}
                    {!disabled && (
                      <div
                        className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--green)] z-10"
                        aria-hidden
                      />
                    )}
                    {b.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={b.logo}
                        alt={b.name}
                        className="max-h-[56px] max-w-[60%] object-contain"
                      />
                    ) : (
                      <div
                        className="font-display font-semibold tracking-tight"
                        style={{
                          fontSize: 26,
                          color: "var(--muted-2)",
                          letterSpacing: "-0.025em",
                        }}
                      >
                        {b.name}
                      </div>
                    )}
                  </div>
                  <div className="p-5 border-t border-[var(--hairline)]">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-display text-lg font-semibold text-[var(--ink)] truncate">
                          {b.name}
                        </div>
                      </div>
                      {disabled ? (
                        <Badge variant="soon">Bientôt</Badge>
                      ) : (
                        <Badge variant="live">Actif</Badge>
                      )}
                    </div>
                    <div className="mt-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                      <span>Meta</span>
                      <span className="text-[var(--muted-2)]">·</span>
                      <span>TikTok</span>
                      <span className="text-[var(--muted-2)]">·</span>
                      <span>DV360</span>
                      <span className="ml-auto text-[var(--navy)] font-medium normal-case tracking-normal">
                        {disabled ? "—" : "Consulter →"}
                      </span>
                    </div>
                  </div>
                </div>
              );
              return disabled ? (
                <div key={b.code}>{inner}</div>
              ) : (
                <Link key={b.code} href={`/${b.code}`}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
