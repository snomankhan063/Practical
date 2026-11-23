import { ArrowUpRight, CalendarDays, CircleUserRound, LogOut, Orbit, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { quoteOfTheDay } from '../lib/dailyQuote'
import { supabase } from '../lib/supabase'

function formatBirthDate(value) {
  if (!value) return 'Not provided'
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`))
}

export default function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    async function loadProfile() {
      const { data, error } = await supabase
        .rpc('get_or_create_my_profile')
        .single()

      if (!active) return
      if (error) {
        console.error('Unable to load your profile:', error.message)
        setErrorMessage('Your lucky number is not set up yet. Run supabase/migrations/202611230001_create_profiles.sql in the Supabase SQL Editor, then refresh.')
      } else {
        setProfile(data)
      }
      setLoading(false)
    }
    loadProfile()
    return () => { active = false }
  }, [user.id])

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Unable to sign out:', error.message)
      setErrorMessage('Unable to sign out right now. Please try again.')
      return
    }
    navigate('/')
  }

  const displayName = profile?.full_name || user.user_metadata?.full_name || 'friend'

  return (
    <main className="dashboard-page">
      <div className="dashboard-top">
        <div className="dashboard-welcome">
          <span className="section-kicker">YOUR PERSONAL SPACE</span>
          <h1>Welcome to your orbit,<br /><em>{displayName}.</em></h1>
          <p>A little reminder of the wonder that is already yours.</p>
        </div>
        <button type="button" className="outline-button" onClick={handleSignOut}><LogOut size={15} /> Sign out</button>
      </div>

      {loading ? (
        <div className="dashboard-loading"><span className="loader" />Finding your number...</div>
      ) : errorMessage ? (
        <div className="dashboard-error" role="alert">{errorMessage}</div>
      ) : (
        <>
          <section className="number-card">
            <div className="number-card-stars">✧ <span>·</span> ✦ <span>·</span> ✧</div>
            <span className="section-kicker">YOUR LUMA NUMBER</span>
            <div className="lucky-number">{profile.lucky_number}</div>
            <p className="number-caption">A little symbol of your own.</p>
            <div className="number-card-bottom"><span><Sparkles size={14} /> CREATED JUST FOR YOU</span><span>✳</span></div>
          </section>

          <div className="dashboard-grid">
            <section className="profile-card">
              <div className="profile-card-heading"><div><span className="section-kicker">THE PERSON BEHIND THE NUMBER</span><h2>Your profile</h2></div><CircleUserRound size={21} /></div>
              <div className="profile-detail"><span>Full name</span><strong>{profile.full_name}</strong></div>
              <div className="profile-detail"><span>Email address</span><strong>{user.email}</strong></div>
              <div className="profile-detail"><span>Date of birth</span><strong><CalendarDays size={15} /> {formatBirthDate(profile.birth_date)}</strong></div>
            </section>
            <section className="reflection-card">
              <span className="reflection-icon"><Orbit size={19} /></span>
              <span className="section-kicker">QUOTE OF THE DAY</span>
              <p>“{quoteOfTheDay}”</p>
              <span className="reflection-signoff">A LITTLE REMINDER FOR TODAY <span>✳</span></span>
            </section>
          </div>
          <div className="dashboard-footer"><Link to="/" className="underlined-link">Back to the beginning <ArrowUpRight size={15} /></Link><span><Sparkles size={14} /> Your space is private and personal.</span></div>
        </>
      )}
    </main>
  )
}
