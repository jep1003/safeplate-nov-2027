import { supabase } from '../lib/supabase'
import { useAuth } from '../state/Auth'
import { PageTitle } from '../components/ui'
import { AuthForm } from '../components/AuthForm'

export default function Account() {
  const { session, loading, configured } = useAuth()

  if (!configured) {
    return (
      <div className="max-w-xl">
        <PageTitle eyebrow="Account">Not connected</PageTitle>
        <p className="card">The app has no Supabase settings, so accounts are unavailable. Add them to <code>.env.local</code> and restart.</p>
      </div>
    )
  }

  if (loading) return <p role="status">Checking your account…</p>

  if (session) {
    const u = session.user
    return (
      <div className="max-w-xl">
        <PageTitle eyebrow="Account">You are signed in</PageTitle>
        <dl className="card space-y-3">
          <div><dt className="text-sm font-semibold text-muted">Email</dt><dd className="text-lg font-semibold">{u.email}</dd></div>
          <div><dt className="text-sm font-semibold text-muted">Account ID (from Supabase)</dt><dd className="break-all font-mono text-sm">{u.id}</dd></div>
          <div><dt className="text-sm font-semibold text-muted">Created</dt><dd>{new Date(u.created_at).toLocaleString()}</dd></div>
        </dl>
        <p role="status" className="mt-4 rounded-xl border-2 border-olive bg-olive-tint p-3 font-semibold text-olive">
          Connected: this account is stored in your Supabase project. You can now share reports.
        </p>
        <p className="mt-3 text-sm text-muted">Your child's allergy profile and trips still stay on this device. Only your email and sign-in are kept by Supabase.</p>
        <button className="btn-ghost mt-4" onClick={() => supabase?.auth.signOut()}>Sign out</button>
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <PageTitle eyebrow="Account">Sign in</PageTitle>
      <p className="mb-4 text-muted">You need an account to use the app. Your child's allergy profile never leaves this device.</p>
      <AuthForm initialMode="signup" idPrefix="acct" />
    </div>
  )
}
