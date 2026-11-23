import { ArrowLeft, ArrowRight, ArrowUpRight, Eye, EyeOff, Orbit } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const latestBirthDate = new Date().toISOString().slice(0, 10)

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    if (!isSupabaseConfigured) {
      setErrorMessage('Supabase is not configured yet. Add your project URL and public key to .env.local.')
      return
    }
    if (password.length < 8) {
      setErrorMessage('Choose a password with at least 8 characters.')
      return
    }

    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim(), birth_date: birthDate },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })
    setLoading(false)
    if (error) {
      setErrorMessage(error.message)
      return
    }

    if (data.session) {
      navigate('/dashboard')
    } else {
      setSuccessMessage('Check your email to confirm your address. The confirmation link will return you to your dashboard.')
    }
  }

  return (
    <main className="auth-page register-page">
      <div className="auth-aside">
        <Link to="/" className="back-link"><ArrowLeft size={15} /> Back to Luma</Link>
        <div className="auth-aside-content">
          <div className="auth-emblem"><Orbit size={29} strokeWidth={1.3} /></div>
          <span className="section-kicker">A NEW KIND OF BEGINNING</span>
          <h1>Your story has<br /><em>a frequency.</em></h1>
          <p>Start with a few details. We’ll find the number that’s yours to keep.</p>
          <div className="aside-stars">✧ <span>✦</span> · &nbsp; ✧</div>
        </div>
        <span className="aside-footnote">PRIVATE BY DESIGN. PERSONAL BY NATURE.</span>
      </div>
      <section className="auth-main">
        <div className="auth-card register-card">
          <div className="mobile-auth-brand"><span className="brand-mark"><Orbit size={19} /></span> luma<span className="brand-dot">.</span></div>
          <span className="section-kicker">BEGIN YOUR RITUAL</span>
          <h2>Make it personal.</h2>
          <p className="auth-subtitle">Your details help us create a little wonder, just for you.</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="full-name">Your name</label>
            <input id="full-name" type="text" autoComplete="name" placeholder="How should we call you?" value={fullName} onChange={(event) => setFullName(event.target.value)} maxLength={100} required />
            <label htmlFor="birth-date">Date of birth</label>
            <input id="birth-date" type="date" autoComplete="bday" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} max={latestBirthDate} required />
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <label htmlFor="password">Create a password</label>
            <div className="password-wrap">
              <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required />
              <button type="button" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
            </div>
            {errorMessage && <p className="form-message error-message" role="alert">{errorMessage}</p>}
            {successMessage && <p className="form-message success-message" role="status">{successMessage}</p>}
            <button type="submit" className="button button-full" disabled={loading}>{loading ? <><span className="button-spinner" />Creating your space...</> : <>Create my account <ArrowRight size={16} /></>}</button>
          </form>
          {!isSupabaseConfigured && <p className="setup-note">Add Supabase credentials to <code>.env.local</code> to enable account creation.</p>}
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in <ArrowUpRight size={14} /></Link></p>
          <div className="privacy-note"><span>✳</span> Your birthday stays private. Your number is created securely.</div>
        </div>
      </section>
    </main>
  )
}
