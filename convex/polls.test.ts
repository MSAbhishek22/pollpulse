import { describe, expect, test } from 'vitest'
import { convexTest } from 'convex-test'
import schema from './schema'
import { api } from './_generated/api'

// convex-test's default module loader uses import.meta.glob inside its own
// bundle, which vitest externalizes (native ESM has no import.meta.glob).
// Pass the glob from this test file instead — vite transforms it here.
const modules = import.meta.glob('./**/*.*s')

describe('polls backend (convex-test, in-memory, no account)', () => {
  test('create → vote → change vote → live counts', async () => {
    const t = convexTest(schema, modules)
    const pollId = await t.mutation(api.polls.createPoll, {
      question: 'Best chai?',
      options: ['Cutting', 'Masala'],
      creatorId: 'v_test1',
    })

    const created = await t.query(api.polls.getPoll, { pollId })
    expect(created?.totalVotes).toBe(0)
    expect(created?.results.map((r) => r.votes)).toEqual([0, 0])
    const optA = created!.results[0].id
    const optB = created!.results[1].id
    expect(optA).not.toBe(optB)

    expect(
      await t.mutation(api.polls.vote, {
        pollId,
        optionId: optA,
        voterId: 'v_a',
      }),
    ).toBe('created')
    expect(
      await t.mutation(api.polls.vote, {
        pollId,
        optionId: optB,
        voterId: 'v_b',
      }),
    ).toBe('created')
    // v_a changes their mind — the row updates, no new vote is added.
    expect(
      await t.mutation(api.polls.vote, {
        pollId,
        optionId: optB,
        voterId: 'v_a',
      }),
    ).toBe('changed')

    const after = await t.query(api.polls.getPoll, { pollId })
    expect(after?.totalVotes).toBe(2)
    expect(after?.results.find((r) => r.id === optA)?.votes).toBe(0)
    expect(after?.results.find((r) => r.id === optB)?.votes).toBe(2)
    expect(
      await t.query(api.polls.getMyVote, { pollId, voterId: 'v_a' }),
    ).toBe(optB)
    expect(
      await t.query(api.polls.getMyVote, { pollId, voterId: 'v_nobody' }),
    ).toBeNull()

    const list = await t.query(api.polls.listPolls, {})
    expect(list).toHaveLength(1)
    expect(list[0].totalVotes).toBe(2)
    expect(list[0].question).toBe('Best chai?')
  })

  test('listPolls is newest first', async () => {
    const t = convexTest(schema, modules)
    const first = await t.mutation(api.polls.createPoll, {
      question: 'First?',
      options: ['A', 'B'],
      creatorId: 'v_x',
    })
    const second = await t.mutation(api.polls.createPoll, {
      question: 'Second?',
      options: ['A', 'B'],
      creatorId: 'v_x',
    })
    const list = await t.query(api.polls.listPolls, {})
    expect(list.map((p) => p._id)).toEqual([second, first])
  })

  test('createPoll rejects bad input', async () => {
    const t = convexTest(schema, modules)
    await expect(
      t.mutation(api.polls.createPoll, {
        question: '  ',
        options: ['A', 'B'],
        creatorId: 'v_x',
      }),
    ).rejects.toThrow()
    await expect(
      t.mutation(api.polls.createPoll, {
        question: 'Q?',
        options: ['Only one'],
        creatorId: 'v_x',
      }),
    ).rejects.toThrow()
    await expect(
      t.mutation(api.polls.createPoll, {
        question: 'Q?',
        options: ['A', 'a'],
        creatorId: 'v_x',
      }),
    ).rejects.toThrow()
  })

  test('vote rejects a bad option on a real poll', async () => {
    const t = convexTest(schema, modules)
    const pollId = await t.mutation(api.polls.createPoll, {
      question: 'Q?',
      options: ['A', 'B'],
      creatorId: 'v_x',
    })
    await expect(
      t.mutation(api.polls.vote, {
        pollId,
        optionId: 'opt_nope',
        voterId: 'v_y',
      }),
    ).rejects.toThrow('not part of this poll')
  })

  test('vote and getPoll on a poll that does not exist', async () => {
    // An id minted in one backend is well-formed but unknown in another.
    const t1 = convexTest(schema, modules)
    const pollId = await t1.mutation(api.polls.createPoll, {
      question: 'Q?',
      options: ['A', 'B'],
      creatorId: 'v_x',
    })
    const t2 = convexTest(schema, modules)
    await expect(
      t2.mutation(api.polls.vote, {
        pollId,
        optionId: 'opt_x',
        voterId: 'v_y',
      }),
    ).rejects.toThrow('Poll not found.')
    expect(await t2.query(api.polls.getPoll, { pollId })).toBeNull()
  })

  test('getPoll returns null only for missing polls, not empty ones', async () => {
    const t = convexTest(schema, modules)
    const pollId = await t.mutation(api.polls.createPoll, {
      question: 'Q?',
      options: ['A', 'B'],
      creatorId: 'v_x',
    })
    const found = await t.query(api.polls.getPoll, { pollId })
    expect(found).not.toBeNull()
    expect(found?.results).toHaveLength(2)
  })
})
