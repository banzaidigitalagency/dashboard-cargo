import Link from "next/link";
import { notFound } from "next/navigation";
import { BRANDS, getBrand } from "@/lib/constants";
import { LogoutButton } from "@/components/logout-button";
import { BrandTabs } from "@/components/brand-tabs";

export function generateStaticParams() {
  return BRANDS.filter((b) => b.available).map((b) => ({ brand: b.code }));
}

export default async function BrandLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const info = getBrand(brand);
  if (!info || !info.available) notFound();

  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-neutral-900 text-white flex items-center justify-center text-sm font-semibold">C</div>
              <div>
                <div className="text-sm font-semibold leading-none">Cargo</div>
                <div className="text-xs text-neutral-500 mt-0.5">{info.name}</div>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900">← Toutes les marques</Link>
            <LogoutButton />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6">
          <BrandTabs brand={brand} />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
