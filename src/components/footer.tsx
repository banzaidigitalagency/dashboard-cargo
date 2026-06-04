import { formatDate } from "@/lib/utils";

export function Footer({ brandName }: { brandName?: string }) {
  const now = new Date();
  return (
    <footer className="border-t border-[var(--hairline)] mt-16 pt-6 pb-10 text-xs text-[var(--muted)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          Dashboard créé par <span className="font-medium text-[var(--ink-2)]">Banzai</span> pour{" "}
          <span className="font-medium text-[var(--ink-2)]">Cargo{brandName ? ` — ${brandName}` : ""}</span>.
        </div>
        <div>
          Reporting généré le {formatDate(now)} · Source : entrepôt média
        </div>
      </div>
    </footer>
  );
}
