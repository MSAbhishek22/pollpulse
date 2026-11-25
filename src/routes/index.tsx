import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useConvexReady } from '../components/convex-provider'
import { CreatePollForm } from '../components/CreatePollForm'
import { ThreeHero } from '../components/ThreeHero'
import { LiveBadge, PollCard, SetupNotice } from '../components/poll-ui'
import { formatVotes } from '../lib/results'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const ready = useConvexReady()
  if (!ready) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
        <HeroHeader />
        <div className="mt-10">
          <SetupNotice />
        </div>
      </main>
    )
  }
  return <HomeLive />
}

function HeroHeader({
  totalPolls,
  totalVotes,
}: {
  totalPolls?: number
  totalVotes?: number
}) {
  return (
    <header className="rise text-center">
      <div className="flex justify-center">
        <LiveBadge label="REAL-TIME · POWERED BY CONVEX" />
      </div>
      <h1 className="mt-5 text-5xl font-black tracking-tight text-white sm:text-7xl">
        Ask. Vote.{' '}
        <span className="grad-text">Watch it move.</span>
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
        PollPulse is a live polling room. Create a question, share the link,
        and watch results update in every open browser the moment someone
        votes — no login, no refresh.
      </p>
      <ThreeHero />
      {typeof totalPolls === 'number' && (
        <p className="mt-4 text-sm font-semibold text-white/60">
          {totalPolls} {totalPolls === 1 ? 'poll' : 'polls'} live ·{' '}
          {formatVotes(totalVotes ?? 0)} cast
        </p>
      )}
    </header>
  )
}

function HomeLive() {
  const polls = useQuery(api.polls.listPolls)
  const totalVotes = (polls ?? []).reduce((sum, p) => sum + p.totalVotes, 0)

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <HeroHeader totalPolls={polls?.length} totalVotes={totalVotes} />
      <div className="mt-10 grid items-start gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <CreatePollForm />
        </div>
        <section className="lg:col-span-3" aria-label="Live polls">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Live polls</h2>
            <LiveBadge />
          </div>
          {polls === undefined && (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="glass h-32 animate-pulse rounded-3xl"
                />
              ))}
            </div>
          )}
          {polls !== undefined && polls.length === 0 && (
            <div className="glass rise rounded-3xl p-8 text-center">
              <p className="text-lg font-semibold text-white">
                No polls yet — yours could be the first.
              </p>
              <p className="mt-2 text-sm text-white/60">
                Ask something on the left and share the link with the room.
              </p>
            </div>
          )}
          {polls !== undefined && polls.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {polls.map((poll, i) => (
                <PollCard key={poll._id} poll={poll} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
