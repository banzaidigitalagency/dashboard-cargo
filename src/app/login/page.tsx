type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next = "/", error } = await searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-[var(--navy)] text-white font-display font-bold text-2xl mb-4">
            C
          </div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
            Reporting média
          </div>
          <div className="font-display text-2xl font-semibold text-[var(--ink)] mt-1">
            Cargo
          </div>
        </div>
        <div
          className="rounded-xl border border-[var(--hairline)] bg-white p-8"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <h1 className="font-display text-lg font-semibold text-[var(--ink)] mb-4">
            Accès au dashboard
          </h1>
          <form action="/api/login" method="post" className="space-y-4">
            <input type="hidden" name="next" value={next} />
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider font-medium text-[var(--muted)]">
                Mot de passe
              </span>
              <input
                type="password"
                name="password"
                autoFocus
                required
                className="mt-2 w-full rounded-md border border-[var(--hairline-strong)] px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] focus:ring-2 focus:ring-[color:var(--green)]/40 transition"
              />
            </label>
            {error && (
              <p className="text-sm text-[var(--neg)] bg-[var(--bg-2)] rounded-md px-3 py-2">
                Mot de passe incorrect.
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-md bg-[var(--navy)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--navy-700)] transition"
            >
              Se connecter
            </button>
          </form>
        </div>
        <p className="text-center text-[10px] uppercase tracking-wider text-[var(--muted-2)] mt-6">
          Préparé par Banzai pour Cargo
        </p>
      </div>
    </div>
  );
}
