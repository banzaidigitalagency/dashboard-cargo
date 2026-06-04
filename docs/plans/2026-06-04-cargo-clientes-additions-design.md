# Dashboard Cargo — Ajouts demandés par les clientes (design)

Date : 2026-06-04
Statut : Phase 1 + 2 validées pour build. Phase 3 en attente des exports plans 2026.

## Demandes

1. ✅ Plage de dates partout (déjà livré : overview + Meta).
2. Comparateur de 2 périodes au choix (période A vs période B). → **Phase 2**
3. Budgets dark vs boost distincts dans un tableau. → **Phase 1**
4. Budget annuel / restant (marque × plateforme × dark/boost × opé). → **Phase 3 (bloqué data)**
5. CPM sur les créas. → **Phase 1**

## Phase 1 — Quick wins (données déjà en base)

### 1A. CPM sur les créas
- `TopAd` gagne un champ `cpm` (= spend/impressions × 1000).
- Carte top pub : passe de 3 à 4 stats (Impressions · CTR · CPM · Dépense), grille 2×2 sur mobile.

### 1B. Tableau dark vs boost (sur page Meta)
- Nouvelle requête `getTypeBreakdown({brandCode, from, to, campaignIds?})` → `{ dark, boost, total }` (chaque = KpiTotals).
- Réutilise les helpers existants (résolution campagnes par `type` via `cargo_campaigns_classified`).
- Composant `TypeBreakdownTable` : 3 lignes (Dark / Boost / Total), colonnes Budget · Impressions · Clics · CTR · CPM.
- Placé sur la page Meta, après les KPI globaux.

## Phase 2 — Comparateur de 2 périodes

### UX
- Composant `PeriodBar` (remplace l'usage direct de `DateRangeForm` sur overview + Meta) :
  - Sélecteur période A (presets 7/30/90j + Depuis le début + dates libres).
  - Bouton toggle « Comparer » → révèle un 2ᵉ sélecteur (période B).
- Params URL : `from`, `to`, `cfrom`, `cto`, `cmp=1`.

### Rendu
- Quand `cmp` actif : `KpiGrid` reçoit `compare = { totals, label }`.
  - Affiche valeur période A (grand) + « vs <valeur B> » (atténué) + delta % (vert/gris charte).
  - Le delta vs-période-précédente automatique est masqué en mode comparé (on compare à B explicitement).
- Pages concernées : overview `/[brand]` et `/[brand]/meta`. TikTok/DV360 (maquettes) non concernées.

### Data
- Pas de nouvelle donnée : on appelle `getDashboardSnapshot` une 2ᵉ fois avec `from=cfrom, to=cto` et on passe `.current` comme période B.

## Phase 3 — Budget annuel/restant (à concevoir avec les exports)

Hiérarchie 4 niveaux : marque × plateforme × dark/boost × opé (fil rouge, temps fort…).
- Table `cargo_budget_plans` (client_code, platform, type, operation, budget_annuel, période).
- Mapping spend→opé : via nom de campagne (FIL ROUGE / TEMPS FORT vus dans les noms SMD) ou via l'export.
- Widget « Budget » : barre dépensé/budget + montant restant, déclinable par niveau.
- Design figé à réception des exports.
