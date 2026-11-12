import { Link } from '@tanstack/react-router'
import type { CSSProperties } from 'react'
import { formatVotes, timeAgo, type OptionResult } from '../lib/results'

/** Pulsing dot + LIVE label used wherever data is streaming from Convex. */
export function LiveBadge({ label = 'LIVE' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold tracking-widest text-emerald-300">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      {label}
    </span>
  )
}

export interface PollListItem {
  _id: string
  question: string
  options: { id: string; text: string }[]
  createdAt: number
  totalVotes: number
}

/** One poll in the home feed, with a staggered rise-in animation. */
export function PollCard({
  poll,
  index = 0,
}: {
  poll: PollListItem
  index?: number
}) {
  const top = [...poll.options].slice(0, 3)
  return (
    <Link
      to="/poll/$pollId"
      params={{ pollId: poll._id }}
      className="rise glass group block rounded-3xl p-5 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-cyan-300"
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` } as CSSProperties}
    >
      <p className="text-lg font-semibold leading-snug text-white">
        {poll.question}
      </p>
      <p className="mt-3 text-sm text-white/60">
        {poll.options.length} options · {formatVotes(poll.totalVotes)} ·{' '}
        {timeAgo(poll.createdAt)}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {top.map((o) => (
          <span
            key={o.id}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
          >
            {o.text}
          </span>
        ))}
        {poll.options.length > 3 && (
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
            +{poll.options.length - 3} more
          </span>
        )}
      </div>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-300 transition-transform duration-300 group-hover:translate-x-1">
        Vote live →
      </span>
    </Link>
  )
}

/**
 * Live results: one animated bar per option. Bars grow with a transform
 * (scaleX) only — never width — so the animation stays cheap at 60fps.
 */
export function ResultsBars({
  results,
  myVote,
  onVote,
  voting,
}: {
  results: OptionResult[]
  myVote: string | null
  onVote: (optionId: string) => void
  voting: boolean
}) {
  return (
    <div className="space-y-3">
      {results.map((r) => {
        const mine = myVote === r.id
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => onVote(r.id)}
            disabled={voting}
            className={`relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-cyan-300 disabled:cursor-wait ${
              mine
                ? 'border-cyan-300/50 bg-cyan-400/10'
                : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            <span
              aria-hidden
              className={`bar-fill absolute inset-y-0 left-0 ${
                r.isLeader
                  ? 'bg-gradient-to-r from-fuchsia-500/40 via-indigo-500/40 to-cyan-400/40'
                  : 'bg-white/10'
              }`}
              style={{ transform: `scaleX(${r.pct / 100})`, width: '100%' }}
            />
            <span className="relative flex items-center justify-between gap-3">
              <span className="font-medium text-white">
                {r.text}
                {mine && (
                  <span className="ml-2 rounded-full bg-cyan-400/20 px-2 py-0.5 text-xs font-semibold text-cyan-200">
                    Your vote
                  </span>
                )}
                {r.isLeader && !mine && (
                  <span className="ml-2 rounded-full bg-fuchsia-400/20 px-2 py-0.5 text-xs font-semibold text-fuchsia-200">
                    Leading
                  </span>
                )}
              </span>
              <span className="shrink-0 text-sm font-semibold text-white/90">
                {r.pct}% · {r.votes}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

/** Shown when no Convex deployment is configured yet. */
export function SetupNotice() {
  return (
    <div className="glass rise mx-auto max-w-2xl rounded-3xl p-8">
      <h2 className="text-2xl font-bold text-white">
        Connect the live backend
      </h2>
      <p className="mt-3 leading-relaxed text-white/70">
        PollPulse is ready — it just needs a free Convex deployment to stream
        votes in real time. This takes about a minute:
      </p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-white/80">
        <li>
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">
            npx convex dev
          </code>{' '}
          — creates the free project and pushes the schema + functions.
        </li>
        <li>
          Copy the deployment URL it prints into{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">
            .env
          </code>{' '}
          as <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">VITE_CONVEX_URL</code>.
        </li>
        <li>
          Restart <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">npm run dev</code>{' '}
          — polls and live results appear instantly.
        </li>
      </ol>
      <p className="mt-4 text-sm text-white/50">
        No card, no paid plan — Convex has a free tier and Netlify deploys
        this app on its free tier too.
      </p>
    </div>
  )
}
