import { createFileRoute, Link } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import { useConvexReady } from '../components/convex-provider'
import { LiveBadge, ResultsBars, SetupNotice } from '../components/poll-ui'
import { computeResults, formatVotes, timeAgo } from '../lib/results'
import { getVoterId } from '../lib/voter'

export const Route = createFileRoute('/poll/$pollId')({
  component: PollPage,
})

/** Convex ids are lowercase alphanumeric — 32 chars in this deployment (verified live 12 Nov 2026). Anything else is a bad link. */
function isPollId(value: string): boolean {
  return /^[a-z0-9]{16,40}$/.test(value)
}

function PollPage() {
  const ready = useConvexReady()
  if (!ready) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
        <SetupNotice />
      </main>
    )
  }
  return <PollLive />
}

function PollLive() {
  const { pollId } = Route.useParams()
  const valid = isPollId(pollId)
  const [voterId] = useState(() => getVoterId())
  const data = useQuery(
    api.polls.getPoll,
    valid ? { pollId: pollId as Id<'polls'> } : 'skip',
  )
  const myVote = useQuery(
    api.polls.getMyVote,
    valid ? { pollId: pollId as Id<'polls'>, voterId } : 'skip',
  )
  const vote = useMutation(api.polls.vote)
  const [voting, setVoting] = useState(false)
  const [voteError, setVoteError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function onVote(optionId: string) {
    if (voting || myVote === optionId) return
    setVoting(true)
    setVoteError(null)
    try {
      await vote({ pollId: pollId as Id<'polls'>, optionId, voterId })
    } catch (err) {
      setVoteError(
        err instanceof Error ? err.message : 'Your vote did not go through.',
      )
    } finally {
      setVoting(false)
    }
  }

  async function copyLink() {
    const url = `${window.location.origin}/poll/${pollId}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  if (!valid || data === null) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
        <div className="glass rise rounded-3xl p-8 text-center">
          <p className="text-2xl font-bold text-white">Poll not found</p>
          <p className="mt-2 text-white/60">
            This link may be mistyped, or the poll may have been removed.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-400 px-6 py-3 font-bold text-white"
          >
            ← Back to all polls
          </Link>
        </div>
      </main>
    )
  }

  if (data === undefined) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
        <div className="glass h-96 animate-pulse rounded-3xl" />
      </main>
    )
  }

  const results = computeResults(data.results)

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <Link
        to="/"
        className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
      >
        ← All polls
      </Link>

      <article className="glass rise mt-4 rounded-3xl p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-black leading-tight text-white">
            {data.poll.question}
          </h1>
          <LiveBadge />
        </div>
        <p className="mt-2 text-sm text-white/60">
          {formatVotes(data.totalVotes)} · created {timeAgo(data.poll.createdAt)}
          {myVote
            ? ' · you voted — tap another option to change it'
            : ' · tap an option to vote'}
        </p>

        <div className="mt-6">
          <ResultsBars
            results={results}
            myVote={myVote ?? null}
            onVote={onVote}
            voting={voting}
          />
        </div>

        {voteError && (
          <p
            role="alert"
            className="mt-4 rounded-2xl bg-rose-500/15 px-4 py-3 text-sm font-medium text-rose-200"
          >
            {voteError}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={copyLink}
            className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/15"
          >
            {copied ? '✓ Link copied' : 'Copy share link'}
          </button>
          <p className="text-sm text-white/50">
            Open this link in a second window — a vote there lands here live.
          </p>
        </div>
      </article>
    </main>
  )
}
