import { useNavigate } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import { api } from '../../convex/_generated/api'
import { validatePollInput } from '../../convex/lib/validation'
import { getVoterId } from '../lib/voter'

const MAX_OPTIONS = 6

/** Create-a-poll form: question + 2–6 options, validated client-side first. */
export function CreatePollForm() {
  const navigate = useNavigate()
  const createPoll = useMutation(api.polls.createPoll)
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState<string[]>(['', ''])
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function setOption(i: number, value: string) {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? value : o)))
  }

  function addOption() {
    if (options.length < MAX_OPTIONS) {
      setOptions((prev) => [...prev, ''])
    }
  }

  function removeOption(i: number) {
    if (options.length > 2) {
      setOptions((prev) => prev.filter((_, idx) => idx !== i))
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      validatePollInput(question, options)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Check your poll.')
      return
    }
    setSaving(true)
    try {
      const pollId = await createPoll({
        question: question.trim(),
        options: options.map((o) => o.trim()),
        creatorId: getVoterId(),
      })
      await navigate({ to: '/poll/$pollId', params: { pollId } })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not create the poll.',
      )
      setSaving(false)
    }
  }

  return (
    <form
      id="create"
      onSubmit={onSubmit}
      className="glass rise rounded-3xl p-6 sm:p-8"
    >
      <h2 className="text-2xl font-bold text-white">Ask the room</h2>
      <p className="mt-1 text-sm text-white/60">
        No login. Share the link — votes land live in every open browser.
      </p>

      <label className="mt-6 block text-sm font-semibold text-white/80">
        Your question
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={140}
          placeholder="e.g. Best chai — cutting or masala?"
          className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 focus:border-cyan-300 focus:outline-none"
        />
      </label>
      <p className="mt-1 text-right text-xs text-white/40">
        {question.length}/140
      </p>

      <fieldset className="mt-2">
        <legend className="text-sm font-semibold text-white/80">
          Options (2–6)
        </legend>
        <div className="mt-2 space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={opt}
                onChange={(e) => setOption(i, e.target.value)}
                maxLength={80}
                placeholder={`Option ${i + 1}`}
                aria-label={`Option ${i + 1}`}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 focus:border-cyan-300 focus:outline-none"
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  aria-label={`Remove option ${i + 1}`}
                  className="shrink-0 rounded-2xl border border-white/15 bg-white/5 px-3 text-white/70 transition-colors hover:bg-white/10"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        {options.length < MAX_OPTIONS && (
          <button
            type="button"
            onClick={addOption}
            className="mt-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
          >
            + Add option
          </button>
        )}
      </fieldset>

      {error && (
        <p role="alert" className="mt-4 rounded-2xl bg-rose-500/15 px-4 py-3 text-sm font-medium text-rose-200">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="mt-6 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-400 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-900/50 transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
      >
        {saving ? 'Creating…' : 'Create live poll →'}
      </button>
    </form>
  )
}
