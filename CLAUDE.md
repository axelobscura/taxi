# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

TAXI-MEX: a taxi-booking site for Mexico City. Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, MySQL via `mysql2`. The README is in Spanish and has detailed rationale (map provider choice, fare formula, deployment notes); keep it in sync when structure or behaviour changes.

## Commands

```bash
npm run dev     # Turbopack dev server, http://localhost:3000
npm run build   # next build --webpack (see below)
npm run lint    # eslint
```

There is no test suite.

- `build` deliberately uses `--webpack`: Turbopack's PostCSS worker crashed on the production host. Dev still uses Turbopack. Don't remove the flag.
- Fonts are self-hosted via `next/font/local` (`src/fonts/`) because `next/font/google` failed on the host. Don't switch back.
- DB access needs `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` in `.env.local` (remote Hostinger MySQL, IP allowlisted). Optional: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID`, `GOOGLE_SITE_VERIFICATION`, `ADMIN_EMAILS`.

## Architecture

### Two root layouts
- `src/app/[lang]/` — the public, bilingual site (es, en). Its `layout.tsx` is a root layout.
- `src/app/(ops)/` — the operator panel (`/entrar` login, `/flota` fleet, `/flota/usuarios` admin-only accounts). Spanish only, `noindex`. Pages share `OpsHeader`.
- Both render `<html>/<body>` through `src/components/RootShell.tsx` (fonts, GA, global CSS).

### i18n routing
- Spanish is the default and has **no URL prefix** (`/tarifas`); English lives under `/en/...`.
- `src/proxy.ts` (Next 16's replacement for middleware) rewrites unprefixed paths to `/es/...` internally and 308-redirects visible `/es/...` back to unprefixed. Its matcher excludes `api`, `entrar`, `flota`, metadata routes and files with extensions — update it when adding routes outside `[lang]`.
- `src/i18n/config.ts`: `localePath(lang, path)` builds public links; `stripLang`/`langOf` normalize pathnames. Always build internal links with `localePath`.
- Server Components get the language with `getLang()`/`getI18n()` from `src/i18n/server.ts` (uses `next/root-params`, no prop drilling). Client Components use `useI18n()` from `src/i18n/client.tsx`.
- Shared UI strings live in `src/i18n/dictionaries.ts` (must stay plain serializable data; `{name}` placeholders filled with `fmt`). Page-specific copy lives next to the page (e.g. `app/[lang]/taxi/copy.ts`) as `{ es, en }` objects. City SEO content is in `src/lib/cities.ts` with English overrides in `cities.en.ts`, merged by `localizeCity`.

### Booking flow
- Home (`app/[lang]/page.tsx` → `RideBooker.tsx`) is a client state machine: `search` → `confirm` → `riding`.
- Fares and distances come from `src/lib/data.ts` (`fareFor`, `distanceKm`: haversine × 1.35 detour factor, 18 km/h average). `/servicios`, `/tarifas` and the SEO pages reuse these functions so prices never drift from the app.
- On confirm, `POST /api/assign` picks the nearest `available` driver of the chosen tier from the DB.
- `CityMap.tsx` uses Leaflet with Esri Dark Gray tiles (no API key); it touches `window` at import, so it's loaded with `next/dynamic` + `ssr: false`. The route line is a Bézier arc, not real street routing.

### SEO landing pages
`app/[lang]/taxi/[ciudad]/[zona]` are statically generated from `CITIES` with `dynamicParams = false`. Metadata goes through `pageMetadata()` in `src/lib/site.ts` (canonical + hreflang); JSON-LD helpers are in `src/components/Landing.tsx`. `sitemap.ts`/`robots.ts` live in `src/app/`.

### Backend
- `src/lib/db/index.ts`: lazy `mysql2` pool cached on `globalThis` (so `next build` never needs the DB and HMR doesn't leak connections). `connectionLimit: 5` because shared hosting caps connections. Sessions forced to UTC and strict SQL mode.
- `schema.sql` is applied automatically (`CREATE TABLE IF NOT EXISTS`) on first query per process, followed by a bootstrap that promotes the oldest user if no admin exists. Bump `SCHEMA_VERSION` in `src/lib/db/index.ts` whenever `schema.sql` or that bootstrap changes, so a warm dev process reapplies it. The file is read at runtime via `process.cwd()`, so it's listed in `outputFileTracingIncludes` in `next.config.ts` — keep that if the file moves.
- Tables: `users`, `sessions`, `drivers`. Auth (`src/lib/auth.ts`) is hand-rolled: scrypt with per-password salt, session row + `httpOnly` cookie (`taximex_session`, 30 days). `currentUser()` is wrapped in React `cache()`, so call it freely within a request. Driver CRUD + validation (Zod) in `src/lib/drivers.ts`; mutations in `/api/drivers*` and `(ops)/flota/actions.ts` require a session.
- Roles are `operator` (fleet) and `admin` (fleet plus accounts). Unknown values in the DB are treated as `operator` (`asRole`). Emails in the `ADMIN_EMAILS` env var (comma-separated) are promoted on login or when an admin creates them, and never demoted.
- Account management lives in `src/lib/users.ts`. Every function there calls `assertAdmin()` itself and throws `UserAdminError` carrying an HTTP status. Both `/api/users*` and the server actions in `(ops)/flota/usuarios/actions.ts` map that error to a response, so keep the admin check in the lib rather than in callers. Invariants enforced there: at least one admin always remains, and nobody can delete their own account.
- Self-registration is closed. `/entrar` offers sign-up only while the `users` table is empty, and `createFirstAdmin()` in `auth.ts` makes that first account an admin. The emptiness check is inside the `INSERT ... WHERE NOT EXISTS`, so concurrent sign-ups can't both succeed. Every later account is created by an admin through `src/lib/users.ts`. Don't reopen sign-up without that check. `execute()` in `src/lib/db` returns `affectedRows` for this kind of conditional write.
- The contact form (`app/[lang]/contacto/actions.ts`) validates with Zod but only logs to the server console; no email provider is wired up.

### Styling
Tailwind v4 with tokens in the `@theme` block of `src/app/globals.css`: dark `ink` surfaces, `taxi` yellow brand. `.theme-light` re-points the same CSS variables, so `bg-ink-*`, `text-cream`, `text-muted` and `text-accent` flip automatically inside light sections. Use the tokens rather than hard-coded colours so both themes keep working.
