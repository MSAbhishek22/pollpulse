/**
 * Anonymous voter identity. PollPulse has no login: every browser gets a
 * random voter id stored in localStorage, and the backend enforces one vote
 * per (poll, voter id). Clearing site data = a fresh identity.
 */

const KEY = 'pollpulse:voter-id'

export function getVoterId(): string {
  if (typeof window === 'undefined') {
    return 'server'
  }
  let id = window.localStorage.getItem(KEY)
  if (!id) {
    id = `v_${crypto.randomUUID().slice(0, 12)}`
    window.localStorage.setItem(KEY, id)
  }
  return id
}
