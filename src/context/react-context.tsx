import { createContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, fetchUserProfile, auth } from "../services/auth";
import type { UserProfile } from "../types/shuttle";

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  setUser: (user: UserProfile | null) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await fetchUserProfile(firebaseUser);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
