import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signIn } from "../../services/auth";
import { useAuth } from "../../hooks/react-hook";
import "../../styles/auth.css";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const profile = await signIn(email, password);
      setUser(profile);
      navigate(profile.role === "admin" ? "/admin" : "/map", { replace: true });
    } catch {
      setError("Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page login-page">
      <div className="auth-blob auth-blob--top-left" />
      <div className="auth-blob auth-blob--bottom-right" />

      <div className="auth-login-wrap">
        {/* Branding */}
        <div className="auth-brand-block">
          <div className="auth-brand-logo">
            <svg viewBox="0 0 24 24" fill="none" className="auth-brand-icon">
              <path
                d="M4 16V8a2 2 0 012-2h12a2 2 0 012 2v8m-2 0v1a1 1 0 01-1 1H9a1 1 0 01-1-1v-1m-4 0h14M7 16h10M6 11h1m10 0h1M9 11h6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="auth-brand-name">Campus Shuttle</span>
        </div>

        <h1 className="auth-headline">Welcome Back</h1>
        <p className="auth-subline">KNUST Shuttle Tracking System</p>

        {/* Card */}
        <div className="auth-card">
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <p className="auth-error">{error}</p>}

            {/* Email */}
            <div className="auth-field-group">
              <label className="auth-field-label" htmlFor="email">
                Email Address
              </label>
              <div className="auth-field-wrap">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@knust.edu.gh"
                  className="auth-input"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-field-group">
              <div className="auth-field-header">
                <label className="auth-field-label" htmlFor="password">
                  Password
                </label>
                <Link to="/forgot-password" className="auth-forgot-link">
                  Forgot password?
                </Link>
              </div>
              <div className="auth-field-wrap">
                <input
                  id="password"
                  type={hidePassword ? "password" : "text"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="auth-input auth-input--padded-right"
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setHidePassword(!hidePassword)}
                  aria-label={hidePassword ? "Show password" : "Hide password"}
                >
                  {hidePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="auth-remember-row">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="auth-checkbox"
              />
              <label htmlFor="remember" className="auth-remember-label">
                Stay signed in for 30 days
              </label>
            </div>

            {/* Submit */}
            <button type="submit" className="auth-btn" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/signup" className="auth-switch-link">
            Create account
          </Link>
        </p>
      </div>

      <footer className="auth-page-footer">
        <div className="auth-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
        <div className="auth-footer-copy">
          <span>© 2025 KNUST Campus Shuttle</span>
        </div>
      </footer>
    </div>
  );
}
