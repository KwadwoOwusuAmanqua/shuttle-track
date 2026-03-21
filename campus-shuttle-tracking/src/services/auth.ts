import {
  createUserWithEmailAndPassword,signInWithEmailAndPassword,
  signOut as firebaseSignOut,onAuthStateChanged, type User,
  reauthenticateWithCredential, updatePassword, EmailAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { UserProfile } from "../types/shuttle";

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

export async function changePassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
}

export async function fetchUserProfile(user: User): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", user.uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserProfile(uid, updates) {
  await setDoc(doc(db, "users", uid), updates, { merge: true });
}

export { onAuthStateChanged, auth };
