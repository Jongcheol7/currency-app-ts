# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev` (Next.js dev, port 3000)
- **Build:** `npm run build` (runs `prisma generate && next build`)
- **Lint:** `npm run lint` (next lint with ESLint flat config)
- **Prisma generate:** `npx prisma generate`
- **Prisma migrate:** `npx prisma migrate dev`

## Architecture

This is a **Next.js 15 (App Router)** currency exchange rate app using TypeScript, Tailwind CSS v4, and shadcn/ui (new-york style, Radix primitives).

### Data Flow

- **External API:** ExchangeRate-API (`v6.exchangerate-api.com`) provides KRW-based exchange rates
- **Database:** PostgreSQL via Prisma (Supabase in production). Two models: `CurrentRate` (latest rates) and `ExchangeRate` (historical)
- **Scheduled updates:** GitHub Actions workflow (`.github/workflows/exchange-rate.yml`) POSTs to `/api/current-rates` every hour to refresh rates
- **Client fetching:** React Query (`@tanstack/react-query`) via `useExchangeRates` hook calls `GET /api/current-rates`

### Route Groups

- `app/(currency)/currency/` — Main currency conversion page (default home)
- `app/(map)/map/` — Google Maps integration page
- `app/api/current-rates/route.ts` — GET returns rates filtered by `CountryInfo`; POST fetches from external API and upserts to DB

### Key Modules

- `modules/currency/` — Currency page components (CurrencyCard, NumberPad, LanguagePopup, etc.)
- `modules/map/` — Map page components
- `modules/common/Header.tsx` — Shared header/navigation

### State Management

- **Zustand** stores in `lib/store/`:
  - `useBaseCurrencyStore` — selected base currency
  - `useLangueStore` — UI language (ko/en/ja/zh/es)

### Multi-language

The app supports 5 languages (ko, en, ja, zh, es). Country names and currency units are defined in `lib/countryInfo.ts` with per-language translations. The UI language is controlled by `useLangueStore`.

### Path Aliases

`@/*` maps to project root (configured in `tsconfig.json`). shadcn/ui components live in `components/ui/`, custom shared components in `components/common/`.

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (pooled for Supabase)
- `DIRECT_URL` — Direct PostgreSQL connection (for migrations)
- `EXCHANGE_RATE_API_KEY` — ExchangeRate-API key (server-side only)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — Google Maps API key (client-side)

## Notes

- Country flag SVGs are stored in `public/flags/` (ISO country codes)
- Prisma client is generated to `lib/generated/prisma` (gitignored)
- The app is deployed on Vercel
- Comments and UI strings are primarily in Korean
