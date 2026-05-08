import Link from "next/link";
import { BRANDS } from "@/lib/constants";
import { Badge } from "@/components/ui";
import { LogoutButton } from "@/components/logout-button";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-neutral-900 text-white flex items-center justify-center text-sm font-semibold">C</div>
            <div>
              <div className="text-base font-semibold leading-none">Cargo</div>
              <div className="text-xs text-neutral-500 mt-0.5">Dashboard client</div>
            </div>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Sélectionnez une marque</h1>
          <p className="text-sm text-neutral-500 mt-1">Consultez les performances Meta, TikTok et Programmatique.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BRANDS.map((b) => {
            const disabled = !b.available;
            const content = (
              <div className={`group h-full rounded-xl border bg-white p-6 transition ${disabled ? "border-neutral-200 opacity-50" : "border-neutral-200 hover:border-neutral-900 hover:shadow-md"}`}>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-medium">{b.name}</div>
                  {disabled ? <Badge variant="muted">Bientôt</Badge> : <Badge variant="dark">Actif</Badge>}
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs text-neutral-500">
                  <span>Meta</span>
                  <span>·</span>
                  <span>TikTok</span>
                  <span>·</span>
                  <span>DV360</span>
                </div>
              </div>
            );
            return disabled ? (
              <div key={b.code}>{content}</div>
            ) : (
              <Link key={b.code} href={`/${b.code}`}>{content}</Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
