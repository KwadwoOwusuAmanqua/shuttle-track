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
  const [user, setUser] = useState<UserProfile | null>(readCache);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let resolved = false;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      resolved = true;
      if (firebaseUser) {
        const cached = readCache();
        if (cached && cached.uid === firebaseUser.uid) {
          setUser(cached);
          setLoading(false);
          fetchUserProfile(firebaseUser).then((fresh) => {
            setUser(fresh);
            writeCache(fresh);
          });
        } else {
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

    const timeout = setTimeout(() => {
      if (!resolved) {
        setUser(null);
        setLoading(false);
      }
    }, 3000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
