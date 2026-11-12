import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

/**
 * PollPulse data model.
 *
 * polls: one row per poll. Options are embedded (2-6 per poll) so a poll
 * renders in a single read; votes are a separate table so they can stream
 * in live via Convex subscriptions.
 * votes: one row per (poll, anonymous voter). A voter may change their vote;
 * the (pollId, voterId) index enforces at most one row per voter per poll.
 */
export default defineSchema({
  polls: defineTable({
    question: v.string(),
    options: v.array(
      v.object({
        id: v.string(),
        text: v.string(),
      }),
    ),
    createdAt: v.number(),
    creatorId: v.string(),
  }).index('by_created', ['createdAt']),

  votes: defineTable({
    pollId: v.id('polls'),
    voterId: v.string(),
    optionId: v.string(),
    votedAt: v.number(),
  })
    .index('by_poll_voter', ['pollId', 'voterId'])
    .index('by_poll', ['pollId']),
})
