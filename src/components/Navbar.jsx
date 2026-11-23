import { ArrowUpRight, Orbit } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [signOutError, setSignOutError] = useState('')

  async function handleSignOut() {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Unable to sign out:', error.message)
      setSignOutError('Sign out failed. Please try again.')
      return
    }
    setSignOutError('')
    navigate('/')
  }

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Main navigation">
        <Link className="brand" to="/" aria-label="Luma home">
          <span className="brand-mark"><Orbit size={19} strokeWidth={1.7} /></span>
          <span>luma<span className="brand-dot">.</span></span>
        </Link>
        <div className="nav-links">
          <a href="/#ritual">The ritual</a>
          <a href="/#meaning">Our philosophy</a>
        </div>
        <div className="nav-actions">
          {user ? (
            <>
              <NavLink className="nav-dashboard" to="/dashboard">Your space</NavLink>
              {signOutError && <span className="nav-error" role="alert">{signOutError}</span>}
              <button className="nav-logout" type="button" onClick={handleSignOut}>Sign out</button>
            </>
          ) : (
            <>
              <Link className="nav-login" to="/login">Log in</Link>
              <Link className="button button-small" to="/register">Find your number <ArrowUpRight size={15} /></Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
