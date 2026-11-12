import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useEffect, useState } from 'react'

import appCss from '../styles.css?url'
import { PollPulseProvider } from '../components/convex-provider'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'PollPulse — Live polls, zero login',
      },
      {
        name: 'description',
        content:
          'Create a poll, share the link, and watch results update live in every open browser. Built with TanStack Start + Convex.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function LowMotionToggle() {
  const [low, setLow] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem('pollpulse:low-motion')
    const initial =
      stored === '1' ||
      (stored === null &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    setLow(initial)
    document.documentElement.classList.toggle('low-motion', initial)
  }, [])

  function toggle() {
    const next = !low
    setLow(next)
    document.documentElement.classList.toggle('low-motion', next)
    window.localStorage.setItem('pollpulse:low-motion', next ? '1' : '0')
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={low}
      className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10"
    >
      {low ? 'Motion: Low' : 'Motion: Full'}
    </button>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0f2e]/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 items-end gap-[3px]" aria-hidden>
            <span className="w-1.5 rounded-full bg-fuchsia-400" style={{ height: '40%' }} />
            <span className="w-1.5 rounded-full bg-indigo-400" style={{ height: '100%' }} />
            <span className="w-1.5 rounded-full bg-cyan-300" style={{ height: '65%' }} />
          </span>
          <span className="text-lg font-black tracking-tight text-white">
            Poll<span className="grad-text">Pulse</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <LowMotionToggle />
          <Link
            to="/"
            hash="create"
            className="rounded-full bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-400 px-4 py-2 text-sm font-bold text-white transition-transform duration-200 hover:-translate-y-0.5"
          >
            + New poll
          </Link>
        </div>
      </div>
    </header>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <PollPulseProvider>
          <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="orb absolute -top-24 left-[8%] h-80 w-80 rounded-full bg-fuchsia-500/25 blur-3xl" />
            <div
              className="orb absolute right-[4%] top-1/3 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl"
              style={{ animationDelay: '-4s' }}
            />
            <div
              className="orb absolute bottom-[-10%] left-[35%] h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl"
              style={{ animationDelay: '-7s' }}
            />
          </div>
          <div className="relative">
            <Header />
            {children}
            <footer className="mx-auto w-full max-w-6xl px-4 pb-10 pt-4 text-center text-xs text-white/40">
              PollPulse — built fresh for the TanStack Start Hackathon ·
              TanStack Start + Convex + Netlify · Started 10 Nov 2026 · No
              login, no tracking, votes are anonymous.
            </footer>
          </div>
        </PollPulseProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
