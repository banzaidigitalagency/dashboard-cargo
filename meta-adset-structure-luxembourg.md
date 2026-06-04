# Structure adsets — Campagne Meta Luxembourg (Noto/Trafic)

## Contexte
- **Objectif** : Notoriété / Trafic
- **Zone géo** : Luxembourg + 35 km
- **Audience** : francophones + anglophones (zone mixte)
- **Client** : Nike

## Problématique

### 1. Risque politique langue
Le client (équipe francophone) ne doit pas tomber sur une pub en anglais et se plaindre.
→ Il faut **garantir** qu'un francophone ne voit que du FR, et inversement.

### 2. Créas mal déclinées
Deux types d'assets fournis :
- **Créas "complètes"** : master décliné proprement en 1:1 (feed) + 9:16 (stories/reels).
- **Stories orphelines** : 9:16 sans équivalent feed.

Si on met une story 9:16 orpheline dans un adset "all placements", Meta peut la diffuser en feed avec un fallback croppé/letterboxé → rendu dégueulasse.

### 3. Contrainte plateforme
Sur Meta, **les placements se contrôlent au niveau de l'adset, pas de l'ad**. L'asset customization au niveau ad ne permet PAS d'exclure un placement — elle permet seulement d'assigner une créa différente par placement (avec fallback si manquant).
→ Seul moyen propre d'empêcher une story de diffuser en feed = adset dédié Stories/Reels only.

## Structure proposée — 4 adsets

| Adset | Langue ciblée | Placements | Créas |
|---|---|---|---|
| **FR — All placements** | Français | Advantage+ / tous placements | Créas déclinées complètes (1:1 + 9:16) en FR |
| **FR — Stories/Reels only** | Français | Stories + Reels uniquement | Stories orphelines 9:16 en FR |
| **EN — All placements** | English | Advantage+ / tous placements | Créas déclinées complètes (1:1 + 9:16) en EN |
| **EN — Stories/Reels only** | English | Stories + Reels uniquement | Stories orphelines 9:16 en EN |

## Paramètres communs à tous les adsets
- **Géo** : Luxembourg + 35 km
- **Langue** : restriction stricte (FR ou EN selon l'adset) — sécurise contre les plaintes client
- **Audience** : Advantage+ (laisser Meta arbitrer dans la zone géo)
- **Budget** : à répartir selon volume de créas dispo par bucket

## Pourquoi ce setup
- ✅ Aucune story orpheline ne peut diffuser en feed
- ✅ Aucun risque qu'un francophone (client inclus) voie une créa EN
- ✅ Reporting propre par langue
- ✅ Compatible noto/trafic (pas de contrainte 50 conv/semaine → la fragmentation est indolore)

## Trade-off accepté
Fragmentation = CPM légèrement plus élevé qu'un setup mono-adset, mais sur noto/trafic à cette échelle géo, l'impact est négligeable face au gain en contrôle.
