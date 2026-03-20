import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "../../services/auth";
import { useAuth } from "../../hooks/react-hook";
import { Eye,EyeOff } from "lucide-react";

export default function SignUpPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword,setHidePassword] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo">🚌</span>
          <h1>Campus Shuttle</h1>
          <p>KNUST Shuttle Tracking System</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Create Account</h2>
          {error && <p className="auth-error">{error}</p>}


          <div>
            <label htmlFor="name">Full Name</label>
            <div className="auth-field">
            <input
              id="name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Kwame Mensah"
              required
            />
          </div>
          </div>
          
          <div>
            <label htmlFor="email">Email</label>
            <div className="auth-field">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@knust.edu.gh"
              required
            />
          </div>
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <div className="auth-field">
            <input
              id="password"
              type={hidePassword?"password":"text"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              minLength={6}
              required
            />
            <>
              {hidePassword?(<EyeOff className="password-btn" onClick={()=>setHidePassword(!hidePassword)} />):
              <Eye className="password-btn" onClick={()=>setHidePassword(!hidePassword)}/>
              }
            </>
          </div>
          </div>

          <button type="submit" className="auth-btn" disabled={submitting}>
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>

        </form>
      </div>
    </div>
  );
}
