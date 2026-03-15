import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "../../services/auth";
import { useAuth } from "../../hooks/react-hook";

<<<<<<< HEAD
export const SignUp = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    if (
      email === "" ||
      studentId === "" ||
      password.password === "" ||
      password.confirmPassword === ""
    )
      return "Fill the entire form";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Please enter a valid email address.";

    if (studentId.length !== 8) return "Enter a valid student ID";

    if (password.password.length < 6)
      return "Password must be at least 6 characters.";

    if (password.password !== password.confirmPassword)
      return "Passwords do not match";

    return null;
  };

  const handleSignUp = (e: any) => {
    e.preventDefault();
    setError("");

    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    navigate("/map");
  };

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <div className={styles.navBrand}>
          <span className={styles.navIcon}>
            <GraduationCap size={18} strokeWidth={2} />
          </span>
          <span className={styles.navTitle}>campus transit</span>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.card}>
          {error && (
            <div style={{ color: "red", display: "flex", alignSelf: "center" }}>
              <AlertCircle /> {error}
            </div>
          )}

          <div className={styles.logoWrap}>
            <GraduationCap size={36} strokeWidth={1.8} color="#fff" />
          </div>

          <h1 className={styles.appName}>campus transit{" - "} sign up</h1>

          <form className={styles.form} onSubmit={handleSignUp}>
            <div className={styles.inputGroup}>
              <input
                className={styles.input}
                type="email"
                placeholder="Student email e.g yourusername@st.knust.edu.gh"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <input
                className={styles.input}
                type="text"
                placeholder="Student ID e.g 21014016"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <span>
                <input
                  className={styles.input}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password.password}
                  onChange={(e) =>
                    setPassword((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                />
                <button
                  style={{ borderRadius: "1vh", border: "0", color: "green" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              </span>
            </div>

            <div className={styles.inputGroup}>
              <span>
                <input
                  className={styles.input}
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={password.confirmPassword}
                  onChange={(e) =>
                    setPassword((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                />
                <button
                  style={{ borderRadius: "1vh", border: "0", color: "green" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              </span>
            </div>

            <div className={styles.btnRow}>
              <button
                className={styles.loginBtn}
                type="submit"
                onClick={handleSignUp}
              >
                SIGN UP
                <LogIn size={20} strokeWidth={2} />
              </button>
            </div>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              Do you have an account?{" "}
              <a
                className={styles.footerLink}
                onClick={() => navigate("/login")}
              >
                SIGN IN
              </a>
            </p>

            <p className={styles.footerText}>
              BY SIGNING UP, YOU HAVE AGREED TO OUR T&Cs
            </p>
=======
export default function SignUpPage() {
  const [displayName, setDisplayName] = useState("");
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
      const profile = await signUp(email, password, displayName);
      setUser(profile);
      navigate("/map", { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed.";
      setError(msg.includes("email-already-in-use") ? "Email already in use." : msg);
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
          <div className="auth-field">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Kwame Mensah"
              required
            />
          </div>
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
>>>>>>> 5e2459cbe2a482f98fe1006fc594c8f61ece430d
          </div>
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              minLength={6}
              required
            />
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
<<<<<<< HEAD
};
=======
}
>>>>>>> 5e2459cbe2a482f98fe1006fc594c8f61ece430d
