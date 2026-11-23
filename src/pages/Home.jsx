import { ArrowDown, ArrowRight, ArrowUpRight, CircleDot, Fingerprint, Sparkles, Stars } from 'lucide-react'
import { Link } from 'react-router-dom'

const currentYear = new Date().getFullYear()

const steps = [
  { number: '01', title: 'Begin with you', text: 'Share the details that make your story yours. Your journey starts with a moment of intention.' },
  { number: '02', title: 'Find your frequency', text: 'Our little ritual turns your personal details into a number that belongs only to you.' },
  { number: '03', title: 'Keep it close', text: 'Return to your private space whenever you need a gentle reminder of your own potential.' },
]

export default function Home() {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-glow" />
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> A little wonder, just for you</div>
          <h1>The universe has<br />a <em>number</em> for you.</h1>
          <p className="hero-description">A quiet moment of meaning in a noisy world. Discover the number that feels like yours — and keep a little wonder close.</p>
          <div className="hero-actions">
            <Link to="/register" className="button">Discover your number <ArrowUpRight size={17} /></Link>
            <a href="#ritual" className="text-link">How it works <ArrowDown size={15} /></a>
          </div>
          <div className="hero-note"><span className="avatar-stack"><i>✦</i><i>✧</i><i>✦</i></span><span>A personal ritual, made for you</span></div>
        </div>
        <div className="hero-art" aria-label="Abstract glowing celestial illustration">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <div className="planet"><div className="planet-shine" /><span className="planet-symbol">✳</span></div>
          <span className="star star-a opacity-90" aria-hidden="true">✦</span><span className="star star-b" aria-hidden="true">✧</span>
          <span className="star star-c">·</span><span className="star star-d">✧</span>
          <div className="art-caption"><span className="caption-dot" /> YOUR OWN LITTLE COSMOS</div>
        </div>
        <div className="hero-bottom"><span>Scroll to explore</span><span className="bottom-rule" /><span>01 — 03</span></div>
      </section>

      <section className="manifesto-section" id="meaning">
        <div className="section-kicker"><span>THE BEAUTY OF A BEGINNING</span><span>✳</span></div>
        <div className="manifesto-grid">
          <h2>Not a prediction.<br /><em>A reflection.</em></h2>
          <div className="manifesto-copy">
            <p>Some things don't need to be explained to feel meaningful. Luma is a small, personal ritual — a way to turn your story into a symbol you can carry with you.</p>
            <p>Your number isn't here to tell you who to be. It's here to remind you that there is magic in being exactly who you are.</p>
            <Link to="/register" className="underlined-link">Make it yours <ArrowRight size={16} /></Link>
          </div>
        </div>
        <div className="manifesto-rule" />
        <div className="values-row">
          <div><Fingerprint size={19} /><span>Uniquely yours</span></div>
          <div><CircleDot size={19} /><span>Rooted in intention</span></div>
          <div><Sparkles size={19} /><span>A little bit of wonder</span></div>
        </div>
      </section>

      <section className="ritual-section" id="ritual">
        <div className="ritual-heading">
          <div className="section-kicker"><span>A MOMENT, JUST FOR YOU</span><span>✳</span></div>
          <h2>Your story, in<br /><em>three little steps.</em></h2>
          <p>No complicated charts. No cosmic jargon. Just a few details, a breath, and a number that is yours to keep.</p>
        </div>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <article className="step-card" key={step.number}>
              <div className="step-top"><span>{step.number}</span>{index === 1 ? <Stars size={19} /> : <Sparkles size={19} />}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <div className="step-decoration">{step.number}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="closing-section">
        <div className="closing-orb"><span>✳</span></div>
        <span className="section-kicker">YOUR NEXT CHAPTER STARTS HERE</span>
        <h2>Ready to meet<br /><em>your number?</em></h2>
        <p>Come as you are. Leave with something that feels like yours.</p>
        <Link to="/register" className="button">Begin your ritual <ArrowUpRight size={17} /></Link>
      </section>

      <footer className="site-footer">
        <Link className="brand" to="/"><span className="brand-mark"><Sparkles size={17} /></span><span>luma<span className="brand-dot">.</span></span></Link>
        <span className="footer-note">A little wonder, just for you.</span>
        <span className="copyright">© {currentYear} Luma. Made with intention.</span>
      </footer>
    </main>
  )
}
