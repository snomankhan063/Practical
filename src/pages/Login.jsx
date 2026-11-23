import { ArrowLeft, ArrowRight, ArrowUpRight, Eye, EyeOff, Orbit } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    if (!isSupabaseConfigured) {
      setErrorMessage('Supabase is not configured yet. Add your project URL and public key to .env.local.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setLoading(false)
    if (error) {
      setErrorMessage(error.message)
      return
    }
    navigate('/dashboard')
  }

  return (
    <main className="auth-page">
      <div className="auth-aside">
        <Link to="/" className="back-link"><ArrowLeft size={15} /> Back to Luma</Link>
        <div className="auth-aside-content">
          <div className="auth-emblem"><Orbit size={29} strokeWidth={1.3} /></div>
          <span className="section-kicker">YOUR SPACE IS WAITING</span>
          <h1>Come back to<br /><em>your own orbit.</em></h1>
          <p>Your number, your story, your little corner of the universe.</p>
          <div className="aside-stars">✧ <span>✦</span> · &nbsp; ✧</div>
        </div>
        <span className="aside-footnote">A MOMENT OF MEANING, WHENEVER YOU NEED IT</span>
      </div>
      <section className="auth-main">
        <div className="auth-card">
          <div className="mobile-auth-brand"><span className="brand-mark"><Orbit size={19} /></span> luma<span className="brand-dot">.</span></div>
          <span className="section-kicker">WELCOME BACK</span>
          <h2>Step back in.</h2>
          <p className="auth-subtitle">Your personal cosmos is right where you left it.</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <div className="field-label-row"><label htmlFor="password">Password</label></div>
            <div className="password-wrap">
              <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              <button type="button" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
            </div>
            {errorMessage && <p className="form-message error-message" role="alert">{errorMessage}</p>}
            <button type="submit" className="button button-full" disabled={loading}>{loading ? <><span className="button-spinner" />Signing in...</> : <>Sign in to your space <ArrowRight size={16} /></>}</button>
          </form>
          {!isSupabaseConfigured && <p className="setup-note">Add Supabase credentials to <code>.env.local</code> to enable authentication.</p>}
          <p className="auth-switch">New to Luma? <Link to="/register">Create your account <ArrowUpRight size={14} /></Link></p>
          <div className="privacy-note"><span>✳</span> Your details are private and belong only to you.</div>
        </div>
      </section>
    </main>
  )
}
