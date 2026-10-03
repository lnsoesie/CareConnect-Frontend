import { useState, type FormEvent } from "react"
import { Brand } from "../components/AppComponents"
import type { Screen } from "../types"

export function Login({
  onNavigate,
}: {
  onNavigate: (screen: Screen) => void
}) {
  const [showPassword, setShowPassword] = useState(false)
  const submit = (event: FormEvent) => {
    event.preventDefault()
    onNavigate("dashboard")
  }

  return (
    <main className="auth auth-login">
      <div className="login-stack">
        <Brand compact variant="login" />
        <form className="login-card" onSubmit={submit}>
          <header>
            <h1>Welcome</h1>
            <p>Sign in to your CareConnect account</p>
          </header>
          <label>
            Email address
            <input type="email" placeholder="name@example.com" required />
          </label>
          <label>
            <span className="label-row">
              Password
              <button
                type="button"
                className="text-link"
                onClick={() => onNavigate("recovery")}
              >
                Forgot password?
              </button>
            </span>
            <span className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="visibility"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                ◉
              </button>
            </span>
          </label>
          <button className="primary auth-submit" type="submit">
            Sign in
          </button>
          <div className="auth-rule" />
          <p className="access">
            Need access to CareConnect?{" "}
            <button type="button" className="inline-link">
              Contact your care coordinator
            </button>
          </p>
          <p className="secure-line">
            ♢&nbsp; HIPAA-compliant · 256-bit TLS encryption
          </p>
        </form>
        <p className="auth-copyright">
          © 2026 CareConnect Health Systems. <u>Privacy Policy</u> ·{" "}
          <u>Terms of Service</u>
        </p>
      </div>
    </main>
  )
}
export function Recovery({
  onNavigate,
}: {
  onNavigate: (screen: Screen) => void
}) {
  const [sent, setSent] = useState(false)
  return (
    <main className="recovery">
      <header className="recovery-header">
        <Brand />
        <span className="connection">
          <i /> Secure Connection
        </span>
      </header>
      <section className="recovery-content">
        <aside className="recovery-copy">
          <span className="accent-line" />
          <h1>
            Account <strong>Recovery</strong>
          </h1>
          <p>
            We'll send secure, time-limited reset instructions to your
            registered email address.
          </p>
          <ul>
            <li>
              🔒 <span>End-to-end encrypted reset link</span>
            </li>
            <li>
              ⏱ <span>Link expires in 30 minutes</span>
            </li>
            <li>
              📋 <span>HIPAA-compliant authentication</span>
            </li>
          </ul>
        </aside>
        <form
          className="recovery-card"
          onSubmit={(event) => {
            event.preventDefault()
            setSent(true)
          }}
        >
          <header>
            <h2>
              <span className="recovery-symbol">◉</span> Reset Password
            </h2>
            <p>
              Enter your email address and we'll send you instructions to reset
              your password.
            </p>
          </header>
          <label>
            Email Address <b>*</b>
            <input type="email" placeholder="name@organization.com" required />
          </label>
          <button className="primary" type="submit">
            ↗ &nbsp; Send Reset Link
          </button>
          {sent && (
            <p className="success" role="status">
              Reset instructions have been sent.
            </p>
          )}
          <div className="or">
            <span />
            or
            <span />
          </div>
          <button
            type="button"
            className="back-link"
            onClick={() => onNavigate("login")}
          >
            ‹ &nbsp; Back to Login
          </button>
        </form>
      </section>
      <p className="recovery-tip">
        Tip: use @unknown.com email to preview the error state
      </p>
      <footer className="recovery-footer">
        Privacy Policy <i>·</i> Terms of Use <i>·</i> HIPAA Notice <i>·</i>{" "}
        Support <i>·</i>© 2026 CareConnect Health Platform
      </footer>
    </main>
  )
}
