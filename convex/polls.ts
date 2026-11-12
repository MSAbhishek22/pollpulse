import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { validatePollInput, validateVoterId } from './lib/validation'

/** Create a poll. No login required — the creator is an anonymous id. */
export const createPoll = mutation({
  args: {
    question: v.string(),
    options: v.array(v.string()),
    creatorId: v.string(),
  },
  handler: async (ctx, args) => {
    const clean = validatePollInput(args.question, args.options)
    const creatorId = validateVoterId(args.creatorId)
    const options = clean.options.map((text) => ({
      id: `opt_${crypto.randomUUID().slice(0, 8)}`,
      text,
    }))
    return await ctx.db.insert('polls', {
      question: clean.question,
      options,
      createdAt: Date.now(),
      creatorId,
    })
  },
})

/**
 * Cast a vote, or change an existing one. One vote per (poll, voter);
 * re-voting updates the row instead of adding another.
 */
export const vote = mutation({
  args: {
    pollId: v.id('polls'),
    optionId: v.string(),
    voterId: v.string(),
  },
  handler: async (ctx, args) => {
    const voterId = validateVoterId(args.voterId)
    const poll = await ctx.db.get(args.pollId)
    if (!poll) {
      throw new Error('Poll not found.')
    }
    if (!poll.options.some((o) => o.id === args.optionId)) {
      throw new Error('That option is not part of this poll.')
    }
    const existing = await ctx.db
      .query('votes')
      .withIndex('by_poll_voter', (q) =>
        q.eq('pollId', args.pollId).eq('voterId', voterId),
      )
      .unique()
    if (existing) {
      await ctx.db.patch(existing._id, {
        optionId: args.optionId,
        votedAt: Date.now(),
      })
      return 'changed' as const
    }
    await ctx.db.insert('votes', {
      pollId: args.pollId,
      voterId,
      optionId: args.optionId,
      votedAt: Date.now(),
    })
    return 'created' as const
  },
})

/** Newest polls first, with a live total-vote count each. */
export const listPolls = query({
  args: {},
  handler: async (ctx) => {
    const polls = await ctx.db
      .query('polls')
      .withIndex('by_created')
      .order('desc')
      .take(50)
    return Promise.all(
      polls.map(async (poll) => {
        const votes = await ctx.db
          .query('votes')
          .withIndex('by_poll', (q) => q.eq('pollId', poll._id))
          .collect()
        return {
          _id: poll._id,
          question: poll.question,
          options: poll.options,
          createdAt: poll.createdAt,
          totalVotes: votes.length,
        }
      }),
    )
  },
})

/** One poll with per-option vote counts. Subscribed live by the client. */
export const getPoll = query({
  args: { pollId: v.id('polls') },
  handler: async (ctx, args) => {
    const poll = await ctx.db.get(args.pollId)
    if (!poll) {
      return null
    }
    const votes = await ctx.db
      .query('votes')
      .withIndex('by_poll', (q) => q.eq('pollId', args.pollId))
      .collect()
    const counts = new Map<string, number>(
      poll.options.map((o) => [o.id, 0]),
    )
    for (const vote of votes) {
      counts.set(vote.optionId, (counts.get(vote.optionId) ?? 0) + 1)
    }
    return {
      poll,
      results: poll.options.map((o) => ({
        id: o.id,
        text: o.text,
        votes: counts.get(o.id) ?? 0,
      })),
      totalVotes: votes.length,
    }
  },
})

/** The option this voter picked on this poll, or null. */
export const getMyVote = query({
  args: { pollId: v.id('polls'), voterId: v.string() },
  handler: async (ctx, args) => {
    const vote = await ctx.db
      .query('votes')
      .withIndex('by_poll_voter', (q) =>
        q.eq('pollId', args.pollId).eq('voterId', args.voterId),
      )
      .unique()
    return vote ? vote.optionId : null
  },
})
