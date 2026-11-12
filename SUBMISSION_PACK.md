# PollPulse — Submission Pack (TanStack Start Hackathon)

**Status: IN_PROGRESS — submission-ready except the items in §6. Nothing has
been submitted. Last updated 12 Nov 2026 ~09:55 IST (Linux sandbox) —
tests/typecheck/build/SSR smoke re-run fresh this session; Convex auth
re-checked (still missing); GitHub repo existence re-checked (still 404).**

## 1. Project

- **Name:** PollPulse — Live polls, zero login
- **Tagline:** Create a poll, share the link, watch results update live in
  every open browser the moment someone votes — no login, no refresh.
- **Built by:** M S Abhishek (solo) — GitHub `MSAbhishek22`,
  msabhishekbdps@gmail.com, Shobhit University, Meerut, BTech CSE 7th sem.
- **Started:** 10 Nov 2026 — fully fresh, after the 29 Oct 2026 eligibility
  cut-off. No reused code, repo, or asset from any earlier project.
- **Stack:** TanStack Start (React 19 + Vite 8 + SSR, TypeScript) · Convex
  (real-time queries/mutations) · Tailwind CSS v4 (Glassmorphism) · Netlify
  (deploy target, `@netlify/vite-plugin-tanstack-start`).

## 2. What it does

- Create a poll: question + 2–6 options, client + server validation.
- Anonymous voting: random voter id in `localStorage`, no accounts anywhere.
- Live results: Convex subscriptions stream vote counts to every open browser
  instantly; animated result bars (transform scaleX only).
- Change your vote: re-voting updates the same row (one vote per
  poll × voter, enforced by the `by_poll_voter` index) instead of adding one.
- Share link per poll (`/poll/<id>`), live poll list newest-first, low-motion
  toggle + `prefers-reduced-motion` support, empty / loading / error /
  not-found states throughout.

## 3. Links

| Item | Value |
|---|---|
| GitHub repo | **NOT CREATED YET** — confirmed 12 Nov ~09:55 IST via GitHub API (`GET /repos/MSAbhishek22/pollpulse` → 404). Manifest prepared, see §5. Target: `MSAbhishek22/pollpulse` (public) |
| Live URL | **NONE YET** — Netlify deploy pending (needs Convex functions deployed first, §6.1, then Netlify login + `VITE_CONVEX_URL` env var). A frontend-only deploy is NOT valid: the app is TanStack Start SSR + Convex — without the Convex functions pushed, create/vote would fail live. Do not deploy the shell alone and call it live. |
| Convex deployment | https://youthful-flamingo-904.convex.cloud (project `pollpulse`, team "MS Abhishek's team") |
| Convex HTTP actions | https://youthful-flamingo-904.convex.site |
| Demo video | **NOT RECORDED** — must be recorded from the live URL after deploy |
| vibeapps.dev submission | **NOT SUBMITTED** — submit at https://vibeapps.dev with tag `tanstackstart` |

## 4. vibeapps.dev answers (draft — paste when submitting)

- **App name:** PollPulse
- **Tag:** `tanstackstart`
- **Description:** PollPulse is a real-time polling app built fresh for the
  TanStack Start Hackathon. Create a poll in seconds, share the link, and
  watch results update live in every open browser the moment someone votes —
  no login, no refresh, no tracking. Anonymous voters can change their vote
  any time; the backend enforces exactly one vote per person per poll.
  Built with TanStack Start (full SSR + file routing), Convex (live
  queries/mutations — no polling, no websockets to manage), and Netlify.
- **Live app URL:** _(fill in after Netlify deploy — no localhost
  submissions accepted)_
- **GitHub repo:** _(fill in after push — public repo required; if private,
  invite wayne@convex.dev)_
- **Video demo URL:** _(fill in after recording from the live URL; judging
  wants "less talk, more demo")_
- **How TanStack Start + Convex + partners are used:** TanStack Start for
  SSR, file-based routing and server functions; Convex `polls` + `votes`
  tables with `createPoll` / `vote` / `listPolls` / `getPoll` / `getMyVote`
  and live subscriptions; Netlify for hosting (SSR via the Netlify
  TanStack Start adapter).
- **Prior-work disclosure:** Fully fresh app, started 10 Nov 2026 (after the
  29 Oct cut-off). Nothing reused.

## 5. Repo push — manifest ready

- Manifest: `~/workspace/hackathons/pollpulse-paths` (NUL-delimited, ends in
  NUL; 32 files, ~478 KB, all UTF-8, no symlinks, no binaries).
- Excluded: `node_modules/`, `dist/`, `.netlify/`, `.tanstack/`, `.env`
  (gitignored), `.cta.json`, `.vscode/`, `__pycache__` / `*.pyc` /
  `.pytest_cache`, sync-json records.
- Included: `README.md`, `SUBMISSION_PACK.md`, `netlify.toml`,
  `package.json`, `package-lock.json`, `tsconfig.json`, `tsr.config.json`,
  `vite.config.ts`, `.env.example`, `.gitignore`, all of `convex/` (incl.
  hand-written `_generated/` stand-ins — see §6.1) and all of `src/`.
- **Repo NOT created and nothing pushed** (re-confirmed 12 Nov ~09:55 IST,
  GitHub API 404; local dir is not a git repository). Repo creation must go
  through the browser route — the GitHub connector's `create_repository`
  fails with 403 "Resource not accessible by integration" (known, verified
  on other projects). Next step (parent, browser): create the public repo
  `MSAbhishek22/pollpulse`, then run the snapshot push with this manifest
  per `/opt/hatch/connectors/github/references/snapshot-push.md`.
  `.env` is intentionally NOT in the manifest — set `VITE_CONVEX_URL` in
  Netlify instead.

## 6. What is still needed (blockers, in order)

### 6.1 Convex CLI login — BLOCKS function deploy + codegen
- **Re-checked 12 Nov ~09:55 IST:** no valid local Convex auth exists —
  there is no `~/.convex/` directory, no auth token file, and no
  `CONVEX_*` env var. `npx convex --version` → `1.49.0`. Bare
  `npx convex codegen` → `No CONVEX_DEPLOYMENT set`; with
  `CONVEX_DEPLOYMENT=dev:youthful-flamingo-904` → `401 Unauthorized:
  MissingAccessToken`. **Deploy was NOT attempted** — there is nothing to
  deploy with until a fresh browser authorize happens. Do not invent
  credentials.
- `npx convex dev` needs an interactive login. Captured 12 Nov ~00:35 IST:
  login URL **https://auth.convex.dev/device?user_code=MNBP-XTBD**, code
  `MNBP-XTBD` (5-minute expiry — **already expired by the time this pack was
  written**; re-run `npx convex dev` to get a fresh code).
- Exact command to re-run (from the project dir):
  `CONVEX_DEPLOYMENT=dev:youthful-flamingo-904 npx convex dev --once`
  (it prompts for a device name, then prints a fresh login URL).
- After login it will: regenerate `convex/_generated/` (replacing the
  hand-written stand-ins), push `schema.ts` + `polls.ts` functions to the
  `youthful-flamingo-904` deployment, and print the deployment URL.
- The stand-ins currently in `convex/_generated/` match the convex 1.49
  codegen shape, so tests/typecheck/build all pass with them — but they are
  NOT real codegen output. Do not claim otherwise.
- Local `.env` already has
  `VITE_CONVEX_URL=https://youthful-flamingo-904.convex.cloud` (the client
  is wired; `src/components/convex-provider.tsx` reads it). `.env` is
  gitignored and NOT in the push manifest.

### 6.2 Netlify deploy — BLOCKS live URL
- `netlify.toml` is ready: build `vite build`, publish `dist/client`; the
  SSR server is emitted as a Netlify function
  (`.netlify/v1/functions/server.mjs`, verified in the 12 Nov build).
- Needs: Netlify login (dashboard or `netlify login`), then either connect
  the repo (auto-deploy from `main`) or `npx netlify deploy --prod --dir
  dist/client`, with env var `VITE_CONVEX_URL` set to the Convex URL above.
- Free tier only; no card.

### 6.3 Live verification — BLOCKS demo video
- After deploy: open the live URL fresh, create a poll, open the share link
  in a second window, vote there, confirm the first window updates live,
  change the vote, confirm totals move. Check console for errors + mobile
  layout.

### 6.4 Demo video — BLOCKS submission
- Record ≤3 min from the LIVE URL (never localhost): problem, create poll,
  live two-window voting, change-vote, closing. Publish (YouTube) and verify
  the URL by reading it back.

### 6.5 Submit — final step
- vibeapps.dev, tag `tanstackstart`, with live URL + public repo + video.
  **Deadline: Mon 17 Nov 2026 12:00 PT = Wed 18 Nov 2026 01:30 IST.**
  Winners announced Mon 24 Nov 2026.

## 7. Verification receipts (12 Nov 2026, Linux sandbox — re-run ~09:55 IST)

| Check | Result |
|---|---|
| `npm test` | **23/23 PASS** (6 results + 11 validation + 6 convex-test backend) — fresh run 12 Nov |
| `npm run typecheck` (`tsc --noEmit`) | **clean, exit 0** — fresh run 12 Nov |
| `npm run build` | **PASS** — client + SSR bundles, Netlify function emitted (`.netlify/v1/functions/server.mjs`) — fresh run 12 Nov |
| SSR smoke (`vite preview`, with real `VITE_CONVEX_URL`) | home **200**, poll page **200**, unknown route **404** — fresh run 12 Nov |
| GitHub repo check | `GET https://api.github.com/repos/MSAbhishek22/pollpulse` → **404** — repo does NOT exist yet (12 Nov) |
| Convex auth check | **NO AUTH** — no `~/.convex/`, no token file; `npx convex --version` → `1.49.0` |
| `npx convex codegen` | **FAILS without login**: bare run → `No CONVEX_DEPLOYMENT set`; with `CONVEX_DEPLOYMENT=dev:youthful-flamingo-904` → `401 Unauthorized: MissingAccessToken` — needs the §6.1 login |
| `npx convex dev` / deploy | **NOT ATTEMPTED this session** (no auth to deploy with) — earlier finding stands: **BLOCKED on login** — non-interactive run fails at the device-name prompt (`Cannot prompt for input in non-interactive terminals`); PTY run printed the login URL above, then the code expired |
| Dead-control scan | `href="#"` → **none** in `src/`/`convex/`; no TODO/FIXME handlers (only legitimate input `placeholder=` attributes) |
| Rulebook gate files | `design/`, `qa/`, `deployment/`, `submission/` directories **do not exist** — Gate A/C/E/F gaps in §9 stand as written |

## 8. Hackathon facts (re-verified 12 Nov 2026)

- Official page: https://www.convex.dev/hackathons/tanstack (crawled 11 Nov
  19:04 UTC) — starts 29 Oct, submissions due **17 Nov 12 PM PT**,
  winners 24 Nov; prize pool $640k cash/prizes/credits; **Overall winner
  $5,000 cash** (+ $250k Netlify credits, $100k Cloudflare credits, 6 mo
  Convex Pro, etc.); 2nd $3,000, 3rd $2,000.
- Rules: solo allowed ("unlimited number of individuals and teams", teams
  ≤ 4); only one team member needs to register; fresh apps only (started on
  or after 29 Oct 11 AM PT); 18+; must include TanStack Start + Convex and
  use partner integrations; submit with video demo to vibeapps.dev, tag
  `tanstackstart`; no localhost submissions; public GitHub repo (or invite
  wayne@convex.dev if private).
- Excluded countries: Quebec, Russia, Crimea, Cuba, Iran, North Korea,
  Syria + OFAC-designated — **India is NOT excluded**.
- ⚠️ **Luma registration caveat — CONFIRMED STILL OPEN:** the Luma page
  https://luma.com/tanstackstarthackathonv1 (crawled 11 Nov 19:04 UTC)
  shows **"General Admission: 0 usd (sold out)"** — registration appears
  closed/sold out. The submission itself happens on vibeapps.dev, not Luma,
  and the official Convex page still says "Register at Luma, then submit".
  Whether a Luma registration is strictly required for eligibility is
  **unverified** — do not claim the user is registered. (Note: Luma's
  metadata dates display as 2025; the live Convex page and the 2026
  crawl treat this as the current edition — the year display on Luma is
  an anomaly, flagged not resolved.)
- $10,000 figure: the "$10,000" in earlier notes = 1st+2nd+3rd cash
  ($5,000 + $3,000 + $2,000). Total pool is $640k incl. credits.

## 9. Rulebook gate status (ABHI_22 v1.0)

- GATE A (research/design): PARTIAL — Glassmorphism constitution in README;
  no standalone `design/DESIGN_CONSTITUTION.md`, no 5-reference research
  file, no design-registry comparison on file. 3D: **no 3D/spatial element
  exists** in PollPulse (bars are 2D transforms) — rulebook §3 unmet, no
  exception approved.
- GATE B (functional product): PASS on code — all visible controls wired;
  no interaction inventory file (`qa/INTERACTION_INVENTORY.md`) on file.
- GATE C (3D/visual): FAIL — no 3D experience (see above).
- GATE D (QA): PASS — 23/23 tests, typecheck, build, SSR smoke.
- GATE E (GitHub/deploy): FAIL — no repo, no live deploy, no commit match.
- GATE F (demo video): FAIL — no video.
- GATE G (handoff): IN_PROGRESS — this pack; README + runbook exist.
- **OVERALL_RELEASE: IN_PROGRESS.** NOT submission-ready until §6.1–6.5
  are done. The 3D gap (Gate C) is a rulebook gap to disclose, not a
  hackathon-rule gap — the hackathon does not require 3D.
