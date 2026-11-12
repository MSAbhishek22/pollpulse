import { describe, expect, test } from 'vitest'
import { validatePollInput, validateVoterId } from './validation'

describe('validatePollInput', () => {
  test('accepts and trims a valid poll', () => {
    expect(
      validatePollInput('  Best chai? ', [' Cutting ', 'Masala']),
    ).toEqual({ question: 'Best chai?', options: ['Cutting', 'Masala'] })
  })

  test('drops blank options before counting', () => {
    expect(validatePollInput('Q?', ['A', '   ', 'B'])).toEqual({
      question: 'Q?',
      options: ['A', 'B'],
    })
  })

  test('rejects an empty question', () => {
    expect(() => validatePollInput('   ', ['A', 'B'])).toThrow(
      'Question cannot be empty.',
    )
  })

  test('rejects a question over 140 characters', () => {
    expect(() => validatePollInput('x'.repeat(141), ['A', 'B'])).toThrow(
      '140 characters or fewer',
    )
  })

  test('rejects fewer than 2 options', () => {
    expect(() => validatePollInput('Q?', ['Only one'])).toThrow(
      'at least 2 options',
    )
  })

  test('rejects more than 6 options', () => {
    expect(() =>
      validatePollInput('Q?', ['A', 'B', 'C', 'D', 'E', 'F', 'G']),
    ).toThrow('At most 6 options')
  })

  test('rejects duplicate options, case-insensitive', () => {
    expect(() => validatePollInput('Q?', ['Chai', 'chai'])).toThrow(
      'must be different',
    )
  })

  test('rejects an option over 80 characters', () => {
    expect(() => validatePollInput('Q?', ['A', 'x'.repeat(81)])).toThrow(
      '80 characters or fewer',
    )
  })

  test('rejects non-string input', () => {
    expect(() => validatePollInput(42, ['A', 'B'])).toThrow(
      'Question must be text.',
    )
    expect(() => validatePollInput('Q?', 'not a list')).toThrow(
      'Options must be a list.',
    )
  })
})

describe('validateVoterId', () => {
  test('accepts and trims', () => {
    expect(validateVoterId('  v_abc  ')).toBe('v_abc')
  })

  test('rejects empty and overlong ids', () => {
    expect(() => validateVoterId('')).toThrow('A voter id is required.')
    expect(() => validateVoterId('x'.repeat(65))).toThrow('too long')
  })
})
