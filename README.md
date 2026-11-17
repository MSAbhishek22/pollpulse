# PollPulse — Live polls, zero login

A fresh real-time polling app built for the **TanStack Start Hackathon**
(Convex × TanStack, $10,000 cash). Create a poll, share the link, and watch
results update live in every open browser the moment someone votes — no
login, no refresh.

**Live demo:** https://pollpulse-app.netlify.app — create a poll, share the link, and watch votes land live. No login needed.

> **Update (17 Nov 2026):** PollPulse is live at the demo link above and was submitted to the TanStack Start Hackathon. The dated status note below is the original 12 Nov snapshot, kept for the record.

**Status (12 Nov 2026 ~09:55 IST, Linux sandbox): IN_PROGRESS — app code
complete, tests green, production build green, SSR smoke-tested with the
real Convex URL wired. Still open: Convex CLI login (blocks function deploy
+ codegen — re-verified 12 Nov: no local Convex auth token exists, codegen
returns `401 Unauthorized: MissingAccessToken`), repo push (repo
`MSAbhishek22/pollpulse` confirmed NOT created — GitHub API 404 on
12 Nov), live Netlify deploy, demo video, hackathon submission. See
`SUBMISSION_PACK.md` for the full pack + blockers.**

## Demo in 30 seconds

1. Open the home page and create a poll ("Best chai — cutting or masala?").
2. Copy the share link and open it in a second browser window.
3. Vote in window 2 — the bar chart in window 1 moves live. Tap another
   option to change your vote; the totals update everywhere instantly.

## Stack

- **TanStack Start** (React 19 + Vite 8 + SSR, TypeScript, file-based routing)
- **Convex** — `polls` + `votes` tables, queries/mutations, real-time
  subscriptions (`useQuery` streams updates; no polling, no websockets to
  manage)
- **Tailwind CSS v4** — Glassmorphism theme (see `src/styles.css`)
- **Netlify** — deploy target (hackathon partner integration); Vercel as
  fallback
- **Vitest + convex-test** — 23 tests, all passing (see Testing)

## Quickstart (local)

```bash
npm install
npx convex dev          # creates the FREE Convex project, pushes schema + functions
cp .env.example .env    # put the printed deployment URL in VITE_CONVEX_URL
npm run dev             # http://localhost:3000
```

Without `VITE_CONVEX_URL` the app still builds and renders — pages show a
"Connect the live backend" panel with the same three steps instead of
crashing.

## Deploy

### Netlify (preferred — hackathon partner)

```bash
npm run build
npx netlify deploy --prod --dir dist/client
# or connect the repo in the Netlify dashboard (build: `vite build`,
# publish: `dist/client`) and set env var VITE_CONVEX_URL.
```

The scaffold already includes `@netlify/vite-plugin-tanstack-start` and
`netlify.toml` (build `vite build`, publish `dist/client`). The SSR server
is emitted as a Netlify function (`.netlify/v1/functions/server.mjs`).

### Vercel (fallback)

```bash
npm run build
npx vercel --prod
# set env var VITE_CONVEX_URL in the Vercel dashboard; framework preset: Vite.
```

## Architecture

```
convex/
  schema.ts            polls (question + embedded options) · votes (one row per poll×voter)
  polls.ts             createPoll · vote (upsert, change allowed) · listPolls · getPoll · getMyVote
  lib/validation.ts    pure input validation, shared by backend + client
  _generated/          api.js / api.d.ts / dataModel.d.ts / server.js / server.d.ts
                       HAND-WRITTEN stand-ins for `npx convex dev` codegen
                       (convex 1.49 shape). Run `npx convex dev` once a Convex
                       project exists and let it regenerate this directory.
src/
  routes/
    __root.tsx         shell, header (logo + low-motion toggle + New poll), footer, orbs
    index.tsx          hero + create form + live poll list
    poll.$pollId.tsx   vote + live results + share link + not-found state
  components/
    convex-provider.tsx  ConvexReactClient when VITE_CONVEX_URL exists; else setup mode
    poll-ui.tsx          LiveBadge · PollCard · ResultsBars (scaleX bars) · SetupNotice
    CreatePollForm.tsx   question + 2–6 options, client-side validation
  lib/
    results.ts         computeResults (pct + leader) · formatVotes · timeAgo
    voter.ts           anonymous voter id in localStorage (no login anywhere)
  styles.css           Glassmorphism theme, keyframes, low-motion support
```

**Voting model:** no accounts. Each browser gets a random voter id in
`localStorage`; the backend enforces one vote per (poll, voter) via the
`by_poll_voter` index, and re-voting updates the row instead of adding one.

## Design

Style: **Glassmorphism / Liquid Glass** — deep indigo gradient, frosted
glass cards, fuchsia → indigo → cyan accents. Animation techniques mixed:
(1) staggered fade-up entrance on poll cards, (2) result bars that grow by
`transform: scaleX` (never width), (3) slow ambient float on three blurred
background orbs. Performance rules held: transform + opacity only, three
orbs total (no particle systems), one real-time subscription per page.
Low-motion: a header toggle (`Motion: Low/Full`, persisted in
`localStorage`) plus `prefers-reduced-motion` support — both kill all
animations and transitions.

## Testing

```bash
npm test        # vitest run — 23 tests, all passing (Linux sandbox, re-verified 12 Nov 2026)
npm run typecheck  # tsc --noEmit — clean
```

- `src/lib/results.test.ts` — result math: 0-vote state, percentages, ties,
  single vote, vote labels, time-ago labels (6 tests).
- `convex/lib/validation.test.ts` — trimming, blank options, <2 / >6
  options, duplicates, length limits, voter ids (11 tests).
- `convex/polls.test.ts` — real backend behaviour via `convex-test`
  (in-memory, no account): create → vote → change vote → live counts,
  newest-first list, bad-input rejection, bad-option rejection, missing-poll
  handling (6 tests).

Production build (`npm run build`) passes — client + SSR server bundles,
Netlify function emitted. SSR smoke-tested with `vite preview`:
home `HTTP 200` (hero + setup panel), poll page `HTTP 200`, unknown route
`HTTP 404`. Live Convex streaming is **not** verified here — it needs a
real deployment (`npx convex dev`), which requires a Convex account.

## Prior-work disclosure

PollPulse is **fully fresh**: started 10 Nov 2026 for this hackathon, after
the 29 Oct 2026 eligibility cut-off. No code, repo, or asset is reused from
any earlier project. It uses TanStack Start + Convex + Netlify exactly as
the hackathon requires.

## Submission checklist

- [x] Fresh app (started 10 Nov 2026), TanStack Start + Convex + Netlify
- [x] Tests 23/23 green, typecheck clean, production build green
      (re-verified 12 Nov 2026 ~09:55 IST)
- [x] `VITE_CONVEX_URL` wired — `.env` set to the real deployment
      https://youthful-flamingo-904.convex.cloud (project `pollpulse`)
- [ ] Convex CLI login → `npx convex dev` (deploy functions + regenerate
      `convex/_generated/`). Login URL captured 12 Nov ~00:35 IST, code
      expired — re-run for a fresh code. See `SUBMISSION_PACK.md` §6.1.
- [ ] Push to a public GitHub repo (manifest ready:
      `~/workspace/hackathons/pollpulse-paths`, 32 files)
- [ ] Deploy live (Netlify) and verify two-window live voting on the live URL
- [ ] Record the demo video from the live URL (≤3 min) and submit to
      vibeapps.dev tagged `tanstackstart` by **Wed 18 Nov 2026 01:30 IST**
- [ ] Re-check Luma registration — it showed "Registration Closed" on 10 Nov
      and **still shows "General Admission: 0 usd (sold out)"** on 12 Nov
      (crawled 11 Nov 19:04 UTC). Submission itself is via vibeapps.dev;
      whether Luma registration is strictly required is unverified.
