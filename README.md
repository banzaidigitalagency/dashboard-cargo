# Dashboard Cargo

Dashboard client multi-marques Cargo (Next.js App Router + Supabase).

## Marques (phase 1)

Sitram · C'est deux euros (Cédif) · Ostaria · Orok — Meta Ads, DV360 (TikTok à venir).

## Stack

- Next.js 16 (App Router) · TypeScript · Tailwind v4
- Supabase (lecture seule sur le projet **DASHBOARD MATTHIEU**)
- Recharts
- Déploiement Vercel

## Variables d'environnement

Copie `.env.example` en `.env.local` et renseigne :

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publishable Supabase |
| `DASHBOARD_PASSWORD` | Mot de passe global d'accès |
| `AUTH_COOKIE_SECRET` | Secret ≥ 16 chars pour signer le cookie |

## Développement

```bash
npm install
npm run dev
```

## Architecture

- `/login` — page protégée par mot de passe global (cookie signé HMAC)
- `/` — sélecteur de marque
- `/[brand]` — vue d'ensemble
- `/[brand]/meta` — KPIs + graphiques + top pubs/boosts (données réelles via Supabase)
- `/[brand]/tiktok` — maquette
- `/[brand]/programmatic` — maquette DV360

## Classification dark/boost

Vue SQL `cargo_campaigns_classified` dans Supabase :
- Sitram / Cédif / Ostaria : filtre `campaign.name ILIKE '%smd%'`
- Orok : aucun filtre (toutes les campagnes sont Cargo)
- `type = 'boost'` si le nom contient `boost`, sinon `'dark'` par défaut
