import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordReset } from "../../services/auth";
import "../../styles/auth.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? "";
      if (code === "auth/user-not-found") {
        setError("No account found with that email address.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many requests. Please wait a moment and try again.");
      } else {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg || "Could not send reset link. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page forgot-page">
      {/* Left hero panel */}
      <aside className="forgot-hero">
        <div className="forgot-hero-overlay" />
        <div className="forgot-hero-content">
          <h1 className="forgot-hero-title">Campus Shuttle</h1>
          <p className="forgot-hero-desc">
            Precision timing for your daily transit. Log in to access the
            campus tracking system and track your arrival with intelligence.
          </p>
          <div className="forgot-hero-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28" className="forgot-hero-badge-icon">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <div>
              <p className="forgot-badge-title">Verified Routes</p>
              <p className="forgot-badge-sub">Real-time GPS updates</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="forgot-form-panel">
        <div className="forgot-form-inner">
          {/* Mobile brand */}
          <div className="forgot-mobile-brand">
            <h1 className="auth-brand-name">Campus Shuttle</h1>
          </div>

          {/* Back link */}
          <Link to="/login" className="forgot-back-link">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>Back to login</span>
          </Link>

          <h2 className="forgot-headline">Reset your password</h2>
          <p className="forgot-sub">
            Enter the email address associated with your account and we'll
            send you a secure link to reset your credentials.
          </p>

          {sent ? (
            <div className="forgot-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" className="forgot-success-icon">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <div>
                <p className="forgot-success-title">Reset link sent!</p>
                <p className="forgot-success-desc">
                  Check your inbox at <strong>{email}</strong> for the
                  password reset link.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form forgot-form">
              {error && <p className="auth-error">{error}</p>}

              <div className="auth-field-group">
                <label className="auth-field-label" htmlFor="email">
                  Email Address
                </label>
                <div className="auth-field-wrap auth-field-wrap--icon">
                  <span className="auth-input-icon auth-input-icon--left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@knust.edu.gh"
                    className="auth-input auth-input--has-left-icon"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-btn" disabled={submitting}>
                {submitting ? "Sending…" : "Send Reset Link"}
                {!submitting && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" className="auth-btn-arrow">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                )}
              </button>
            </form>
          )}

          {/* Help card */}
          <div className="forgot-help-card">
            <div className="forgot-help-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
              </svg>
            </div>
            <div>
              <h4 className="forgot-help-title">Need immediate assistance?</h4>
              <p className="forgot-help-desc">
                If you're having trouble receiving the email, please check your
                spam folder or contact our support desk at{" "}
                <span className="forgot-help-email">
                  shuttle@knust.edu.gh
                </span>
                .
              </p>
            </div>
          </div>

          <footer className="forgot-footer">
            <p>© 2024 KNUST Campus Shuttle</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
