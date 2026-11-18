import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useApp } from './state/AppState'
import { useAuth } from './state/Auth'
import Login from './screens/Login'
import { SampleTag } from './components/ui'
import Onboarding from './screens/Onboarding'
import Explorer from './screens/Explorer'
import DestinationDetail from './screens/DestinationDetail'
import VenueDetail from './screens/VenueDetail'
import Recovery from './screens/Recovery'
import TripPlanner from './screens/TripPlanner'
import Kit from './screens/Kit'
import Account from './screens/Account'

const NAV = [
  { to: '/', label: 'Explore', icon: '◎', end: true },
  { to: '/trips', label: 'Trips', icon: '✎', end: false },
  { to: '/kit', label: 'Table kit', icon: '▤', end: false },
  { to: '/profile', label: 'Profile', icon: '☺', end: false },
  { to: '/account', label: 'Account', icon: '✉', end: false },
]

export default function App() {
  const { profile } = useApp()
  const { session, loading, configured } = useAuth()
  const loc = useLocation()
  const needsProfile = !profile && loc.pathname !== '/profile' && loc.pathname !== '/account'

  // First screen: when accounts are available and nobody is signed in, show the login screen.
  if (configured && loading) return <p role="status" className="p-8 text-center text-muted">Loading…</p>
  if (configured && !session) return <Login />

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col md:flex-row">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-ink focus:p-3 focus:text-paper">Skip to content</a>
      <header className="flex items-center justify-between border-b border-line px-4 py-3 md:hidden">
        <p className="font-display text-xl font-bold text-terra">Safe Plate</p>
        <SampleTag />
      </header>
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-card md:static md:inset-auto md:block md:w-52 md:shrink-0 md:border-r md:border-t-0 md:bg-transparent md:px-3 md:py-6">
        <p className="mb-6 hidden px-3 font-display text-2xl font-bold text-terra md:block">Safe Plate</p>
        <div className="hidden px-3 pb-4 md:block"><SampleTag /></div>
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end}
            className={({ isActive }) => `flex min-h-[60px] flex-col items-center justify-center gap-0.5 text-sm font-semibold md:min-h-[48px] md:flex-row md:justify-start md:gap-3 md:rounded-xl md:px-3 md:text-base ${isActive ? 'text-terra md:bg-terra-tint' : 'text-muted'}`}>
            <span aria-hidden="true" className="text-xl">{n.icon}</span>{n.label}
          </NavLink>
        ))}
      </nav>
      <main id="main" className="w-full flex-1 px-4 pb-28 pt-5 md:px-8 md:pb-12">
        <Routes>
          <Route path="/profile" element={<Onboarding />} />
          <Route path="/account" element={<Account />} />
          {needsProfile ? (
            <Route path="*" element={<Navigate to="/profile" replace />} />
          ) : (
            <>
              <Route path="/" element={<Explorer />} />
              <Route path="/destination/:id" element={<DestinationDetail />} />
              <Route path="/venue/:id" element={<VenueDetail />} />
              <Route path="/venue/:id/recovery" element={<Recovery />} />
              <Route path="/trips" element={<TripPlanner />} />
              <Route path="/kit" element={<Kit />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  )
}
