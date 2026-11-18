import { useState } from 'react'
import { supabase } from '../lib/supabase'

type Mode = 'signup' | 'signin'

/** Email + password sign-up / sign-in. The session itself is tracked by AuthProvider. */
export function AuthForm({ initialMode = 'signin', idPrefix = 'auth' }: { initialMode?: Mode; idPrefix?: string }) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true); setError(''); setNotice('')
    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else if (!data.session) setNotice('Account created. Check your email for a confirmation link, then sign in.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }
    setBusy(false)
  }

  const pick = (m: Mode) => { setMode(m); setError(''); setNotice('') }

  return (
    <form onSubmit={submit}>
      <div className="mb-4 flex gap-2" role="group" aria-label="Sign in or create account">
        <button type="button" className="chip" aria-pressed={mode === 'signin'} onClick={() => pick('signin')}>Sign in</button>
        <button type="button" className="chip" aria-pressed={mode === 'signup'} onClick={() => pick('signup')}>Create account</button>
      </div>

      <label htmlFor={`${idPrefix}-em`} className="font-semibold">Email</label>
      <input id={`${idPrefix}-em`} type="email" required autoComplete="email" className="field mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />

      <label htmlFor={`${idPrefix}-pw`} className="font-semibold">Password</label>
      <input id={`${idPrefix}-pw`} type="password" required minLength={6} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} className="field" value={password} onChange={(e) => setPassword(e.target.value)} />
      <p className="mb-4 mt-1 text-sm text-muted">At least 6 characters.</p>

      {error && <p role="alert" className="mb-3 rounded-xl border-2 border-alert bg-alert-tint p-3 font-medium text-alert">{error}</p>}
      {notice && <p role="status" className="mb-3 rounded-xl border-2 border-olive bg-olive-tint p-3 font-medium text-olive">{notice}</p>}

      <button type="submit" className="btn-primary w-full disabled:opacity-50" disabled={busy}>
        {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in and continue'}
      </button>
    </form>
  )
}
