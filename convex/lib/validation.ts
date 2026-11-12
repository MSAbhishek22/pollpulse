/**
 * Pure validation shared by the Convex backend (convex/polls.ts) and the
 * React client (src/routes). No Convex imports here on purpose, so the
 * client bundle and convex-test can both use it unchanged.
 */

export interface CleanPollInput {
  question: string
  options: string[]
}

export const MAX_QUESTION_LENGTH = 140
export const MAX_OPTION_LENGTH = 80
export const MIN_OPTIONS = 2
export const MAX_OPTIONS = 6

export function validatePollInput(
  question: unknown,
  options: unknown,
): CleanPollInput {
  if (typeof question !== 'string') {
    throw new Error('Question must be text.')
  }
  const q = question.trim()
  if (q.length === 0) {
    throw new Error('Question cannot be empty.')
  }
  if (q.length > MAX_QUESTION_LENGTH) {
    throw new Error(
      `Question must be ${MAX_QUESTION_LENGTH} characters or fewer.`,
    )
  }
  if (!Array.isArray(options)) {
    throw new Error('Options must be a list.')
  }
  const cleaned = options
    .map((o) => {
      if (typeof o !== 'string') {
        throw new Error('Each option must be text.')
      }
      return o.trim()
    })
    .filter((o) => o.length > 0)
  if (cleaned.length < MIN_OPTIONS) {
    throw new Error(`Add at least ${MIN_OPTIONS} options.`)
  }
  if (cleaned.length > MAX_OPTIONS) {
    throw new Error(`At most ${MAX_OPTIONS} options allowed.`)
  }
  if (cleaned.some((o) => o.length > MAX_OPTION_LENGTH)) {
    throw new Error(
      `Each option must be ${MAX_OPTION_LENGTH} characters or fewer.`,
    )
  }
  const seen = new Set<string>()
  for (const o of cleaned) {
    const key = o.toLowerCase()
    if (seen.has(key)) {
      throw new Error('Options must be different from each other.')
    }
    seen.add(key)
  }
  return { question: q, options: cleaned }
}

export function validateVoterId(voterId: unknown): string {
  if (typeof voterId !== 'string' || voterId.trim().length === 0) {
    throw new Error('A voter id is required.')
  }
  const id = voterId.trim()
  if (id.length > 64) {
    throw new Error('Voter id is too long.')
  }
  return id
}
