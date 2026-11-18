import { AuthForm } from '../components/AuthForm'
import { SampleTag } from '../components/ui'

/** First screen when nobody is signed in. */
export default function Login() {
  return (
    <main id="main" className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-10">
      <div className="mb-6 text-center">
        <p className="font-display text-4xl font-bold text-terra">Safe Plate</p>
        <p className="mt-2 text-lg text-muted">Plan trips for a child with peanut and tree nut allergies, with evidence you can read, not promises.</p>
        <div className="mt-3"><SampleTag /></div>
      </div>

      <div className="card">
        <h1 className="mb-1 text-2xl font-bold">Welcome</h1>
        <p className="mb-4 text-muted">Sign in, or create an account, to continue.</p>
        <AuthForm initialMode="signin" idPrefix="login" />
      </div>

      <p className="mt-6 text-center text-sm text-muted">Only your email is stored. Your child's allergy profile stays on this device. This is a guide, not a guarantee: always confirm with staff.</p>
    </main>
  )
}
