# Dashboard Cargo — Fonction d'export (design)

Date : 2026-06-05
Statut : validé pour build.

## Objectif
Permettre aux clientes d'extraire les données d'une marque pour les coller dans Claude
(analyse → présentations) ou les manipuler dans un tableur.

## Décisions
- Format : **les deux** — « Copier pour Claude » (Markdown) + téléchargement CSV.
- Périmètre : **snapshot complet de la marque** sur la période sélectionnée.

## Architecture
- `lib/export.ts` (fonctions pures) :
  - `buildMarkdown(snapshot)` → rapport Markdown structuré, auto-explicatif, avec 1 ligne
    de contexte pour orienter Claude + tableaux labellisés (KPIs, dark/boost, top créas, budget).
  - `buildCsv(snapshot)` → CSV (séparateur `;`, fr/Excel), 1 ligne par créa (dark + boost),
    colonnes : type, campagne, créa, impressions, clics, dépense, CTR %, CPM.
- `components/export-menu.tsx` (client) : 2 boutons.
  - « Copier pour Claude » → `navigator.clipboard.writeText(markdown)` + feedback « Copié ✓ ».
  - « CSV » → Blob download `cargo-<brand>-<from>_<to>.csv`.
- Chaque page assemble un objet `ExportSnapshot` (données déjà chargées, zéro requête en plus)
  et le passe au composant. Respecte période + filtres campagnes.

## ExportSnapshot
```
{ brandName, scope, from, to, lastSync?,
  kpis: { current: KpiTotals, previous?: KpiTotals|null },
  breakdown?: TypeBreakdown|null,
  topDark?: TopAd[], topBoost?: TopAd[],
  budget?: BudgetStatus|null }
```

## Placement
- Vue d'ensemble marque `/[brand]` : KPIs + budget.
- Page Meta `/[brand]/meta` : KPIs + dark/boost + top créas + budget.
- TikTok/DV360 (maquettes) : pas d'export (pas de vraie data).
