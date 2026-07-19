import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CloudCog,
  Database,
  FileAudio,
  FileText,
  Layers3,
  LockKeyhole,
  Mic2,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const features = [
  {
    icon: FileAudio,
    title: 'Audio transcription',
    text: 'Upload MP3, WAV, M4A, or FLAC recordings and convert dealership calls into readable text.',
  },
  {
    icon: Users,
    title: 'Speaker separation',
    text: 'Separate customer and sales executive sections so managers can review conversations faster.',
  },
  {
    icon: Sparkles,
    title: 'AI summaries',
    text: 'Capture the main discussion points, objections, and next steps without reading the full call.',
  },
  {
    icon: Search,
    title: 'Searchable records',
    text: 'Find conversations by keyword, status, customer interest, or transcript content.',
  },
  {
    icon: BarChart3,
    title: 'Sentiment insights',
    text: 'Understand conversation tone and spot customers who need better follow-up.',
  },
  {
    icon: FileText,
    title: 'PDF reporting',
    text: 'Export professional reports with transcript, summary, entities, sentiment, and dates.',
  },
]

const workflow = [
  'Upload the dealership recording',
  'Let the AI pipeline process it',
  'Review transcript and insights',
  'Export the report and follow up',
]

const safety = [
  {
    icon: ShieldCheck,
    title: 'Protected routes',
    text: 'Dashboard, upload, transcript, export, and user-management pages stay behind login.',
  },
  {
    icon: LockKeyhole,
    title: 'Role-based access',
    text: 'Managers can manage users while sales executives stay focused on conversation workflows.',
  },
  {
    icon: Users,
    title: 'Controlled user management',
    text: 'Manager-only tools help activate, deactivate, reset, and maintain staff accounts.',
  },
]

const scalability = [
  {
    icon: Layers3,
    title: 'Modular AI pipeline',
    text: 'Transcription, diarization, entities, summaries, and sentiment are separated into services.',
  },
  {
    icon: Database,
    title: 'Structured data model',
    text: 'Audio files, transcripts, segments, summaries, entities, and sentiment are stored cleanly.',
  },
  {
    icon: CloudCog,
    title: 'Growth-ready path',
    text: 'The app can later move from local SQLite to cloud storage and larger production databases.',
  },
]

export default function Landing() {
  const { isAuthenticated } = useAuth()
  const primaryTarget = isAuthenticated ? '/dashboard' : '/register'
  const primaryText = isAuthenticated ? 'Go to Dashboard' : 'Get Started'

  return (
    <main className="landing-page" id="landing-main">
      <a className="skip-link" href="#landing-content">Skip to main content</a>

      <header className="landing-header">
        <Link className="landing-brand" to="/" aria-label="VoiceScribe NG home">
          <span className="landing-brand-mark">
            <Mic2 size={22} aria-hidden="true" />
          </span>
          <span>
            <strong>VoiceScribe NG</strong>
            <small>Nigerian dealership speech intelligence</small>
          </span>
        </Link>

        <nav className="landing-nav" aria-label="Landing page navigation">
          <a href="#features">Features</a>
          <a href="#safety">Safety</a>
          <a href="#scale">Scalability</a>
          {isAuthenticated ? (
            <Link className="landing-nav-cta" to="/dashboard">Dashboard</Link>
          ) : (
            <Link className="landing-nav-cta" to="/login">Sign In</Link>
          )}
        </nav>
      </header>

      <section className="landing-hero" id="landing-content" aria-labelledby="landing-title">
        <div className="landing-hero-copy">
          <span className="landing-eyebrow">
            <Sparkles size={16} aria-hidden="true" />
            Built for dealership call follow-up
          </span>
          <h1 id="landing-title">Make every car sales conversation easier to manage.</h1>
          <p>
            VoiceScribe NG turns dealership recordings into transcripts, summaries, customer insights, and exportable
            reports so managers and sales executives can follow up with confidence.
          </p>
          <div className="landing-actions">
            <Link className="primary-button landing-action" to={primaryTarget}>
              {primaryText}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            {!isAuthenticated && (
              <Link className="secondary-button landing-action" to="/login">
                Sign In
              </Link>
            )}
          </div>
          <div className="landing-proof" aria-label="Key platform assurances">
            <span><CheckCircle2 size={16} aria-hidden="true" /> Secure login</span>
            <span><CheckCircle2 size={16} aria-hidden="true" /> Manager controls</span>
            <span><CheckCircle2 size={16} aria-hidden="true" /> PDF exports</span>
          </div>
        </div>

        <div className="landing-preview" role="img" aria-label="Product preview showing transcript, sentiment, entities, and report status">
          <div className="landing-preview-card">
            <div className="landing-preview-top" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="landing-preview-heading">
              <div>
                <small>Call insight</small>
                <strong>Toyota Camry enquiry</strong>
              </div>
              <span className="sentiment sentiment-positive">Positive</span>
            </div>
            <div className="landing-wave" aria-hidden="true">
              {Array.from({ length: 24 }).map((_, index) => (
                <i key={index} style={{ height: `${18 + ((index * 9) % 52)}px` }} />
              ))}
            </div>
            <div className="landing-message sales">
              <MessageSquareText size={18} aria-hidden="true" />
              <p><strong>Sales Executive</strong> We have a clean Tokunbo Camry available for inspection.</p>
            </div>
            <div className="landing-message customer">
              <MessageSquareText size={18} aria-hidden="true" />
              <p><strong>Customer</strong> Send the final price and payment plan today.</p>
            </div>
            <div className="landing-preview-stats">
              <span><strong>4</strong> Entities</span>
              <span><strong>2</strong> Speakers</span>
              <span><strong>PDF</strong> Ready</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section" id="features" aria-labelledby="features-title">
        <div className="landing-section-heading">
          <span className="landing-eyebrow">Effective workflow</span>
          <h2 id="features-title">Everything your dealership needs after a call.</h2>
          <p>Simple tools for turning customer conversations into useful business records.</p>
        </div>
        <div className="landing-card-grid">
          {features.map(({ icon: Icon, title, text }) => (
            <article className="landing-card" key={title}>
              <span className="landing-card-icon"><Icon size={22} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section landing-muted-section" aria-labelledby="workflow-title">
        <div className="landing-section-heading">
          <span className="landing-eyebrow">How it works</span>
          <h2 id="workflow-title">From recording to follow-up in four steps.</h2>
        </div>
        <ol className="landing-workflow">
          {workflow.map((step, index) => (
            <li key={step}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
      </section>

      <section className="landing-section" id="safety" aria-labelledby="safety-title">
        <div className="landing-section-heading">
          <span className="landing-eyebrow">Safety and access</span>
          <h2 id="safety-title">Designed for controlled dealership records.</h2>
          <p>Use clear roles and protected screens to reduce accidental access to sensitive call information.</p>
        </div>
        <div className="landing-trust-grid">
          {safety.map(({ icon: Icon, title, text }) => (
            <article className="landing-trust-card" key={title}>
              <span className="landing-card-icon"><Icon size={22} aria-hidden="true" /></span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section" id="scale" aria-labelledby="scale-title">
        <div className="landing-section-heading">
          <span className="landing-eyebrow">Scalable foundation</span>
          <h2 id="scale-title">Ready to grow beyond one dealership desk.</h2>
          <p>The structure supports more users, more records, and future production upgrades.</p>
        </div>
        <div className="landing-trust-grid">
          {scalability.map(({ icon: Icon, title, text }) => (
            <article className="landing-trust-card" key={title}>
              <span className="landing-card-icon"><Icon size={22} aria-hidden="true" /></span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-cta" aria-labelledby="cta-title">
        <div>
          <span className="landing-eyebrow">Start clearly</span>
          <h2 id="cta-title">Give your sales conversations a proper memory.</h2>
          <p>Upload recordings, review insights, and turn customer calls into dealership action.</p>
        </div>
        <Link className="primary-button landing-action" to={primaryTarget}>
          {primaryText}
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </main>
  )
}
