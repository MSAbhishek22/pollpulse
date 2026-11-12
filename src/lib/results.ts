/** Pure result math for the live bar chart. No Convex imports. */

export interface RawResult {
  id: string
  text: string
  votes: number
}

export interface OptionResult extends RawResult {
  pct: number
  isLeader: boolean
}

/** Adds percentages (rounded, 0 when no votes yet) and leader flags. */
export function computeResults(results: RawResult[]): OptionResult[] {
  const total = results.reduce((sum, r) => sum + r.votes, 0)
  const max = results.reduce((m, r) => Math.max(m, r.votes), 0)
  return results.map((r) => ({
    ...r,
    pct: total === 0 ? 0 : Math.round((r.votes / total) * 100),
    isLeader: r.votes > 0 && r.votes === max,
  }))
}

export function formatVotes(n: number): string {
  return n === 1 ? '1 vote' : `${n} votes`
}

export function timeAgo(ts: number): string {
  const seconds = Math.max(0, Math.floor((Date.now() - ts) / 1000))
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
