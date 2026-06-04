import { notFound } from "next/navigation";
import { BRANDS, getBrand } from "@/lib/constants";
import { TopBar } from "@/components/top-bar";
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
    <div className="min-h-screen flex flex-col">
      <TopBar brand={info} eyebrow="Reporting média" showBrandSwitch />
      <div className="mx-auto w-full max-w-7xl px-6">
        <BrandTabs brand={brand} />
      </div>
      <main className="mx-auto w-full max-w-7xl px-6 flex-1 pb-10">{children}</main>
    </div>
  );
}
