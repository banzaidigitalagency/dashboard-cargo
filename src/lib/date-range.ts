export function defaultRange(days: number = 30): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - (days - 1));
  return { from: toISODate(from), to: toISODate(to) };
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseRange(searchParams: Record<string, string | string[] | undefined>, days = 30) {
  const from = typeof searchParams.from === "string" ? searchParams.from : undefined;
  const to = typeof searchParams.to === "string" ? searchParams.to : undefined;
  if (from && to) return { from, to };
  return defaultRange(days);
}

/** Lit la période de comparaison (B) depuis l'URL : cmp=1, cfrom, cto. */
export function parseCompare(
  searchParams: Record<string, string | string[] | undefined>
): { from: string; to: string } | null {
  const cmp = searchParams.cmp === "1";
  const cfrom = typeof searchParams.cfrom === "string" ? searchParams.cfrom : undefined;
  const cto = typeof searchParams.cto === "string" ? searchParams.cto : undefined;
  if (cmp && cfrom && cto) return { from: cfrom, to: cto };
  return null;
}
