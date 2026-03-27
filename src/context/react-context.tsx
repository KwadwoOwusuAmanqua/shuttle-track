import { createContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, fetchUserProfile, auth } from "../services/auth";
import type { UserProfile } from "../types/shuttle";

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  setUser: (user: UserProfile | null) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const PROFILE_KEY = "campus_transit_profile";

function readCache(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

function writeCache(profile: UserProfile | null) {
  if (!profile) return;
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch { /* noop */ }
}

function clearCache() {
  try { localStorage.removeItem(PROFILE_KEY); } catch { /* noop */ }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Seed state from cache — returning users get their profile synchronously,
  // so loading can resolve without waiting for Firestore.
  const [user, setUser] = useState<UserProfile | null>(readCache);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const cached = readCache();
        if (cached && cached.uid === firebaseUser.uid) {
          // Already have a valid profile — unblock rendering immediately.
          setUser(cached);
          setLoading(false);
          // Refresh in the background in case role/name changed.
          fetchUserProfile(firebaseUser).then((fresh) => {
            setUser(fresh);
            writeCache(fresh);
          });
        } else {
          // First login or different account — must wait for Firestore.
          const profile = await fetchUserProfile(firebaseUser);
          writeCache(profile);
          setUser(profile);
          setLoading(false);
        }
      } else {
        clearCache();
        setUser(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
