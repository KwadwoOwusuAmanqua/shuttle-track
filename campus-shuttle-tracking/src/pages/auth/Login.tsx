import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signIn } from "../../services/auth";
import { useAuth } from "../../hooks/react-hook";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
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
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo">🚌</span>
          <h1>Campus Shuttle</h1>
          <p>KNUST Shuttle Tracking System</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Sign In</h2>
          {error && <p className="auth-error">{error}</p>}
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@knust.edu.gh"
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="auth-btn" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign In"}
          </button>
          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
