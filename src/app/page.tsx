import Link from "next/link";
import { BRANDS } from "@/lib/constants";
import { TopBar } from "@/components/top-bar";
import { Badge } from "@/components/ui";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar eyebrow="Reporting média" />
      <main className="mx-auto w-full max-w-7xl px-6 flex-1">
        <section className="py-10 md:py-14">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] mb-3">
            /00 · Marques
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-light leading-tight text-[var(--ink)] max-w-3xl">
            Sélectionnez une marque
            <br />
            <span className="font-semibold text-[var(--green-600)]">à consulter.</span>
          </h1>
          <p className="text-sm text-[var(--muted)] mt-4 max-w-xl">
            Vue détaillée des performances Meta, TikTok et Programmatique pour chaque marque du
            portefeuille Cargo.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
          {BRANDS.map((b) => {
            const disabled = !b.available;
            const inner = (
              <div
                className={`group h-full rounded-xl border bg-white p-6 transition ${
                  disabled
                    ? "border-[var(--hairline)] opacity-60"
                    : "border-[var(--hairline)] hover:border-[var(--navy)] hover:shadow-[var(--shadow-card)]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-md flex items-center justify-center font-display font-bold text-base"
                      style={{
                        background: disabled ? "var(--bg-2)" : "var(--navy)",
                        color: disabled ? "var(--muted)" : "white",
                      }}
                    >
                      {b.name[0]}
                    </div>
                    <div>
                      <div className="font-display text-lg font-semibold text-[var(--ink)]">
                        {b.name}
                      </div>
                      <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mt-0.5">
                        Marque
                      </div>
                    </div>
                  </div>
                  {disabled ? <Badge variant="soon">Bientôt</Badge> : <Badge variant="live">Actif</Badge>}
                </div>
                <div className="mt-6 flex items-center gap-3 text-[11px] text-[var(--muted)] uppercase tracking-wider">
                  <span>Meta</span>
                  <span className="text-[var(--muted-2)]">·</span>
                  <span>TikTok</span>
                  <span className="text-[var(--muted-2)]">·</span>
                  <span>DV360</span>
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
        </section>

        <Footer />
      </main>
    </div>
  );
}
