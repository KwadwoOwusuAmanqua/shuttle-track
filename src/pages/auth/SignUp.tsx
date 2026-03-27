import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "../../services/auth";
import { useAuth } from "../../hooks/react-hook";
import { Eye, EyeOff } from "lucide-react";
import "../../styles/auth.css";

export default function SignUpPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const passwordsMatch = confirmPassword === "" || password === confirmPassword;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const profile = await signUp(email, password, displayName);
      setUser(profile);
      navigate("/map", { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed.";
      setError(
        msg.includes("email-already-in-use") ? "Email already in use." : msg,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page signup-page">
      {/* Left panel — hero */}
      <aside className="signup-hero">
        <div className="signup-hero-overlay" />
        <div className="signup-hero-content">
          <div className="signup-hero-top">
            <h1 className="signup-hero-title">Campus Shuttle</h1>
            <p className="signup-hero-subtitle">KNUST Tracking System</p>
          </div>
          <div className="signup-hero-body">
            <h2 className="signup-hero-headline">
              Your campus commute begins here.
            </h2>
            <p className="signup-hero-desc">
              Real-time arrival intelligence for every student and staff member.
            </p>
          </div>
          <div className="signup-hero-social-proof">
            <div className="signup-hero-avatars">
              {/* Placeholder avatar circles */}
              <div className="signup-avatar signup-avatar--1" />
              <div className="signup-avatar signup-avatar--2" />
              <div className="signup-avatar signup-avatar--3" />
            </div>
            <span className="signup-hero-joined">Joined by 2.4k+ commuters today</span>
          </div>
        </div>
      </aside>

      {/* Right panel — form */}
      <main className="signup-form-panel">
        {/* Mobile brand */}
        <div className="signup-mobile-brand">
          <span className="auth-brand-name">Campus Shuttle</span>
        </div>

        <div className="signup-form-inner">
          <div className="signup-form-header">
            <h2 className="signup-form-title">Create Account</h2>
            <p className="signup-form-sub">
              Join the KNUST shuttle network for seamless transportation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form signup-form">
            {error && <p className="auth-error">{error}</p>}

            {/* Full Name */}
            <div className="auth-field-group">
              <label className="auth-field-label" htmlFor="name">
                Full Name
              </label>
              <div className="auth-field-wrap auth-field-wrap--icon">
                <span className="auth-input-icon auth-input-icon--left">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                  </svg>
                </span>
                <input
                  id="name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Kwame Mensah"
                  className="auth-input auth-input--has-left-icon"
                  required
                />
              </div>
            </div>

            {/* Email */}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@knust.edu.gh"
                  className="auth-input auth-input--has-left-icon"
                  required
                />
              </div>
            </div>

            {/* Password row */}
            <div className="signup-password-row">
              <div className="auth-field-group">
                <label className="auth-field-label" htmlFor="password">
                  Password
                </label>
                <div className="auth-field-wrap auth-field-wrap--icon">
                  <span className="auth-input-icon auth-input-icon--left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={hidePassword ? "password" : "text"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="auth-input auth-input--has-left-icon auth-input--padded-right"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setHidePassword(!hidePassword)}
                    aria-label={hidePassword ? "Show password" : "Hide password"}
                  >
                    {hidePassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="auth-field-group">
                <label className="auth-field-label" htmlFor="confirm-password">
                  Confirm
                </label>
                <div className="auth-field-wrap auth-field-wrap--icon">
                  <span className="auth-input-icon auth-input-icon--left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </span>
                  <input
                    id="confirm-password"
                    type={hideConfirm ? "password" : "text"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`auth-input auth-input--has-left-icon auth-input--padded-right${
                      confirmPassword && !passwordsMatch ? " auth-input--error" : ""
                    }${
                      confirmPassword && passwordsMatch ? " auth-input--success" : ""
                    }`}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setHideConfirm(!hideConfirm)}
                    aria-label={hideConfirm ? "Show confirm" : "Hide confirm"}
                  >
                    {hideConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className={`auth-terms-row${!agreedToTerms && error?.includes("Terms") ? " auth-terms-row--error" : ""}`}>
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (e.target.checked && error?.includes("Terms")) setError(null);
                }}
                className="auth-checkbox"
              />
              <label htmlFor="terms" className="auth-terms-label">
                I agree to the{" "}
                <a href="#" className="auth-terms-link">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="auth-terms-link">Privacy Policy</a>.
              </label>
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={submitting || !passwordsMatch}
            >
              {submitting ? "Creating account…" : "Sign Up"}
            </button>

            <div className="auth-switch signup-switch">
              <span>Already have an account?</span>{" "}
              <Link to="/login" className="auth-switch-link">
                Sign In
              </Link>
            </div>
          </form>

          <div className="signup-form-footer">
            <span>English (US)</span>
            <div className="signup-form-footer-links">
              <a href="#">Help</a>
              <a href="#">Status</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
