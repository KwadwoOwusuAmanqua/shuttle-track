import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
  sendPasswordResetEmail, // Added for the reset logic
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { UserProfile } from "../types/shuttle";
// Updated to match the Vite-safe service name
import { handleForgotPassword } from "../lib/email-service"; 

/**
 * Creates a new user in Firebase Auth and a corresponding profile in Firestore.
 */
export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<UserProfile> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const profile: UserProfile = {
    uid: credential.user.uid,
    email,
    displayName,
    role: "student",
  };
  await setDoc(doc(db, "users", credential.user.uid), profile);
  return profile;
}

/**
 * Signs in a user and fetches their custom profile from Firestore.
 */
export async function signIn(
  email: string,
  password: string
): Promise<UserProfile> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, "users", credential.user.uid));
  if (!snap.exists()) throw new Error("User profile not found");
  return snap.data() as UserProfile;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Handles the password reset by combining Firebase logic and Resend branding.
 */
export async function sendPasswordReset(email: string) {
  // 1. Tell Firebase to handle the internal reset logic (invalidates old tokens)
  await sendPasswordResetEmail(auth, email);

  // 2. Trigger your custom Resend email for the "Campus Shuttle" branding
  const result = await handleForgotPassword(email);

  if (!result.success) {
    throw new Error("Could not send custom branded email.");
  }
  
  return true;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No authenticated user");
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
}

export async function fetchUserProfile(user: User): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", user.uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  await setDoc(doc(db, "users", uid), updates, { merge: true });
}

export { onAuthStateChanged, auth };