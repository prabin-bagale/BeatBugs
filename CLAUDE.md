# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BeatBugs is Nepal's first digital beat marketplace — a Next.js 16 application for buying and selling music beats. Users can browse beats, listen to previews, purchase licenses (basic/premium/exclusive), and producers can upload and manage their beats.

## Commands

```bash
bun run dev      # Start development server on port 3000
bun run build    # Build standalone production bundle
bun run start    # Run production server from standalone build
bun run lint     # Run ESLint
bun run db:push  # Push Prisma schema to SQLite database
bun run db:generate  # Generate Prisma client
bun run db:migrate   # Run Prisma migrations
bun run db:reset     # Reset database and re-run migrations
```

## Architecture

### Single-Page View Architecture
The app uses two Zustand stores: `src/stores/app-store.ts` (navigation, auth, checkout, browse filters) and `src/stores/audio-store.ts` (audio playback state). All "pages" are components rendered in `src/app/page.tsx` via `AnimatePresence`. View types: `home`, `browse`, `beat-detail`, `producer`, `producer-dashboard`, `buyer-dashboard`, `checkout`.

### Tech Stack
- **Framework**: Next.js 16 (App Router, standalone output)
- **Database**: Prisma ORM with SQLite (`prisma/schema.prisma`)
- **UI**: shadcn/ui components + Tailwind CSS 4 + Framer Motion
- **State**: Zustand (client) + TanStack Query (server)
- **Auth**: NextAuth.js v4 (stub implementation)
- **Theme**: Dark mode with emerald primary accent

### Database & Seeding
- SQLite database at `db/custom.db` (gitignored, created on first deploy)
- Auto-seeding on first API call via `src/lib/seed.ts` — creates 7 users, 18 beats, 2 orders if empty
- Audio files stored as base64 data URIs in SQLite (not external storage)
- Relative DATABASE_URL (`file:./db/custom.db`) for portability

### API Routes
All routes auto-call `ensureSeeded()` before processing:
- `GET/POST /api/beats` — list/create beats with filtering (genre, mood, BPM, sort)
- `GET /api/beats/[id]` — single beat with plays increment
- `POST /api/upload` — upload new beat (base64 audio/cover, max 10MB)
- `GET/POST /api/orders` — list/create orders
- `GET /api/auth` — auth handler
- `GET /api/dashboard` — producer/buyer stats

### Mini Services
WebSocket/Socket.io services go in `mini-services/` folder. Each must be an independent Bun project with its own port, entry point at `index.ts`, and started with `bun run dev` in background.

### Gateway & Port Limitations
- Caddy gateway handles routing — only one port externally accessible
- Cross-service API requests require `XTransformPort` query param: `/api/test?XTransformPort=3030`
- All API URLs must use **relative paths only** (no `localhost:3000`)
- WebSocket: always use `io("/?XTransformPort={Port}")` — never direct port connections

### Component Organization
- `src/components/ui/` — shadcn/ui component library (do not modify directly)
- `src/components/shared/` — shared components (navigation, footer, audio player bar, beat card)
- `src/components/features/` — feature-specific components (home, beats, producers, orders, checkout, auth)
- `src/stores/` — Zustand stores: `app-store.ts` (navigation/auth), `audio-store.ts` (playback), `types.ts` (shared types)
- `src/lib/utils.ts` — cn() utility
- `src/hooks/` — custom React hooks

## UI Rules

- Dark mode only (dark theme is the default)
- Mobile-first responsive design
- Footer must stick to bottom with `mt-auto` when content is shorter than viewport
- No indigo/blue colors — use emerald accent from theme
- Use existing shadcn/ui components before custom implementations
