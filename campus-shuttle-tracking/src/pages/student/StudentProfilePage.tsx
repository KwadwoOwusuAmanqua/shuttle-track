import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/react-hook";
import { updateUserProfile, signOut, changePassword } from "../../services/auth";
import {
  User, Mail, Pencil, Check, X,
  LogOut, Shield, Lock, Eye, EyeOff,
} from "lucide-react";
import styles from "../../styles/StudentProfilePage.module.css";

/* ── Password field with show/hide toggle ── */
function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.passwordWrap}>
      <input
        className={styles.fieldInput}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <button
        type="button"
        className={styles.eyeBtn}
        onClick={() => setShow((s) => !s)}
      >
        {show ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
      </button>
    </div>
  );
}

export default function StudentProfilePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  /* ── Profile edit state ── */
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saving, setSaving] = useState(false);
  const [profileError, setProfileError] = useState(null);

  /* ── Password sheet state ── */
  const [pwSheetOpen, setPwSheetOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  /* ── Sign out ── */
  const [signingOut, setSigningOut] = useState(false);

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  /* ── Profile handlers ── */
  const handleEdit = () => {
    setDisplayName(user?.displayName ?? "");
    setEmail(user?.email ?? "");
    setProfileError(null);
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setProfileError(null);
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      setProfileError("Display name cannot be empty.");
      return;
    }
    setSaving(true);
    setProfileError(null);
    try {
      await updateUserProfile(user.uid, {
        displayName: displayName.trim(),
        email: email.trim(),
      });
      setUser({ ...user, displayName: displayName.trim(), email: email.trim() });
      setEditMode(false);
    } catch {
      setProfileError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Password handlers ── */
  const openPwSheet = () => {
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setPwError(null);
    setPwSuccess(false);
    setPwSheetOpen(true);
  };

  const closePwSheet = () => {
    setPwSheetOpen(false);
    setPwError(null);
    setPwSuccess(false);
  };

  const handlePasswordChange = async () => {
    if (!currentPw) { setPwError("Enter your current password."); return; }
    if (newPw.length < 6) { setPwError("New password must be at least 6 characters."); return; }
    if (newPw !== confirmPw) { setPwError("Passwords do not match."); return; }

    setPwSaving(true);
    setPwError(null);
    try {
      await changePassword(currentPw, newPw);
      setPwSuccess(true);
      setTimeout(closePwSheet, 1500); // close after showing success
    } catch (err) {
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setPwError("Current password is incorrect.");
      } else if (err.code === "auth/weak-password") {
        setPwError("New password is too weak.");
      } else {
        setPwError("Something went wrong. Please try again.");
      }
    } finally {
      setPwSaving(false);
    }
  };

  /* ── Sign out handler ── */
  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      setUser(null);
      navigate("/login", { replace: true });
    } catch {
      setSigningOut(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Profile</h1>
      </header>

      <div className={styles.scroll}>
        {/* ── Avatar banner ── */}
        <div className={styles.banner}>
          <div className={styles.avatarRing}>
            <div className={styles.avatar}>{initials}</div>
          </div>
          <h2 className={styles.bannerName}>{user?.displayName ?? "—"}</h2>
          <span className={styles.roleBadge}>
            <Shield size={11} strokeWidth={2.5} />
            {user?.role ?? "student"}
          </span>
        </div>

        {/* ── Account details card ── */}
        <div className={styles.card}>
          <div className={styles.cardTopRow}>
            <span className={styles.cardTitle}>Account Details</span>
            {!editMode && (
              <button className={styles.editBtn} onClick={handleEdit}>
                <Pencil size={14} strokeWidth={2.5} />
                Edit
              </button>
            )}
          </div>

          {/* Display Name */}
          <div className={styles.field}>
            <span className={styles.fieldIcon}>
              <User size={15} strokeWidth={2} />
            </span>
            <div className={styles.fieldBody}>
              <span className={styles.fieldLabel}>Display Name</span>
              {editMode ? (
                <input
                  className={styles.fieldInput}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  autoFocus
                />
              ) : (
                <span className={styles.fieldValue}>{user?.displayName ?? "—"}</span>
              )}
            </div>
          </div>

          <div className={styles.divider} />

          {/* Email */}
          <div className={styles.field}>
            <span className={styles.fieldIcon}>
              <Mail size={15} strokeWidth={2} />
            </span>
            <div className={styles.fieldBody}>
              <span className={styles.fieldLabel}>Email</span>
              {editMode ? (
                <input
                  className={styles.fieldInput}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              ) : (
                <span className={styles.fieldValue}>{user?.email ?? "—"}</span>
              )}
            </div>
          </div>

          {profileError && <p className={styles.errorMsg}>{profileError}</p>}

          {editMode && (
            <div className={styles.actionRow}>
              <button className={styles.cancelBtn} onClick={handleCancel} disabled={saving}>
                <X size={15} strokeWidth={2.5} /> Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                <Check size={15} strokeWidth={2.5} />
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          )}
        </div>

        {/* ── Security card ── */}
        <div className={styles.card}>
          <span className={styles.cardTitle} style={{ marginBottom: 12, display: "block" }}>
            Security
          </span>
          <button className={styles.securityRow} onClick={openPwSheet}>
            <span className={styles.fieldIcon}>
              <Lock size={15} strokeWidth={2} />
            </span>
            <span className={styles.fieldBody}>
              <span className={styles.fieldLabel}>Password</span>
              <span className={styles.fieldValue}>••••••••</span>
            </span>
            <Pencil size={14} strokeWidth={2} color="#9499b5" />
          </button>
        </div>

        {/* ── Sign out ── */}
        <button
          className={styles.signOutBtn}
          onClick={handleSignOut}
          disabled={signingOut}
        >
          <LogOut size={18} strokeWidth={2} />
          {signingOut ? "Signing out…" : "Sign Out"}
        </button>
      </div>

      {/* ── Password sheet backdrop ── */}
      {pwSheetOpen && <div className={styles.backdrop} onClick={closePwSheet} />}

      {/* ── Password bottom sheet ── */}
      <div className={`${styles.pwSheet} ${pwSheetOpen ? styles.pwSheetOpen : ""}`}>
        <div className={styles.sheetHandle} />

        {/* Sheet header */}
        <div className={styles.sheetHeader}>
          <div className={styles.sheetHeaderText}>
            <h3 className={styles.sheetTitle}>Change Password</h3>
            <p className={styles.sheetSub}>Enter your current password to continue</p>
          </div>
          <button className={styles.sheetClose} onClick={closePwSheet}>
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className={styles.sheetBody}>
          {/* Current password */}
          <div className={styles.sheetField}>
            <label className={styles.sheetLabel}>Current Password</label>
            <PasswordInput
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="Enter current password"
            />
          </div>

          {/* New password */}
          <div className={styles.sheetField}>
            <label className={styles.sheetLabel}>New Password</label>
            <PasswordInput
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="Min. 6 characters"
            />
          </div>

          {/* Confirm password */}
          <div className={styles.sheetField}>
            <label className={styles.sheetLabel}>Confirm New Password</label>
            <PasswordInput
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Repeat new password"
            />
          </div>

          {/* Error / success */}
          {pwError && <p className={styles.errorMsg}>{pwError}</p>}
          {pwSuccess && (
            <p className={styles.successMsg}>
              <Check size={13} strokeWidth={2.5} /> Password updated successfully!
            </p>
          )}

          <button
            className={styles.saveBtn}
            style={{ width: "100%", marginTop: 4 }}
            onClick={handlePasswordChange}
            disabled={pwSaving || pwSuccess}
          >
            <Lock size={15} strokeWidth={2.5} />
            {pwSaving ? "Updating…" : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}