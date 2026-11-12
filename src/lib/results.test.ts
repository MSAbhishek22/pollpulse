import { describe, expect, test } from 'vitest'
import { computeResults, formatVotes, timeAgo } from './results'

describe('computeResults', () => {
  test('zero votes → all 0% and no leader', () => {
    const out = computeResults([
      { id: 'a', text: 'A', votes: 0 },
      { id: 'b', text: 'B', votes: 0 },
    ])
    expect(out).toEqual([
      { id: 'a', text: 'A', votes: 0, pct: 0, isLeader: false },
      { id: 'b', text: 'B', votes: 0, pct: 0, isLeader: false },
    ])
  })

  test('percentages and single leader', () => {
    const out = computeResults([
      { id: 'a', text: 'A', votes: 3 },
      { id: 'b', text: 'B', votes: 1 },
      { id: 'c', text: 'C', votes: 0 },
    ])
    expect(out).toEqual([
      { id: 'a', text: 'A', votes: 3, pct: 75, isLeader: true },
      { id: 'b', text: 'B', votes: 1, pct: 25, isLeader: false },
      { id: 'c', text: 'C', votes: 0, pct: 0, isLeader: false },
    ])
  })

  test('a tie makes both options leaders', () => {
    const out = computeResults([
      { id: 'a', text: 'A', votes: 2 },
      { id: 'b', text: 'B', votes: 2 },
    ])
    expect(out.map((o) => o.isLeader)).toEqual([true, true])
    expect(out.map((o) => o.pct)).toEqual([50, 50])
  })

  test('a single vote is 100%', () => {
    const out = computeResults([{ id: 'a', text: 'A', votes: 1 }])
    expect(out[0]).toEqual({
      id: 'a',
      text: 'A',
      votes: 1,
      pct: 100,
      isLeader: true,
    })
  })
})

describe('formatVotes', () => {
  test('singular and plural', () => {
    expect(formatVotes(0)).toBe('0 votes')
    expect(formatVotes(1)).toBe('1 vote')
    expect(formatVotes(42)).toBe('42 votes')
  })
})

describe('timeAgo', () => {
  test('human labels', () => {
    const now = Date.now()
    expect(timeAgo(now)).toBe('just now')
    expect(timeAgo(now - 5 * 60 * 1000)).toBe('5m ago')
    expect(timeAgo(now - 2 * 60 * 60 * 1000)).toBe('2h ago')
    expect(timeAgo(now - 3 * 24 * 60 * 60 * 1000)).toBe('3d ago')
  })
})
