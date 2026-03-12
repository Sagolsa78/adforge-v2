"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { claimBrand, generateAdVariations } from "@/lib/api";
import {
  getPendingBrandId,
  getPendingAction,
  clearDelayedAuthState,
} from "@/lib/delayedAuth";
import type { AuthUser } from "@/types/tool";

// ─── Context value ───────────────────────────────────────────────────

interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Helper: extract AuthUser from Supabase user ─────────────────────

function toAuthUser(supaUser: { id: string; email?: string; user_metadata?: Record<string, string> }): AuthUser {
  const email = supaUser.email || "";
  const name =
    supaUser.user_metadata?.full_name ||
    supaUser.user_metadata?.name ||
    email.split("@")[0] ||
    "User";
  return { id: supaUser.id, email, name };
}

// ─── Provider ────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode;
  onDelayedAuthComplete?: () => void;
}

export function AuthProvider({ children, onDelayedAuthComplete }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Delayed-auth handler (guest → claim) ─────────────────────────
  const handleDelayedAuth = useCallback(
    async (token: string) => {
      try {
        const pendingBrandId = getPendingBrandId();
        if (pendingBrandId) {
          await claimBrand(pendingBrandId, token);

          const pendingAction = getPendingAction();
          if (pendingAction?.type === "GENERATE_VARIATIONS") {
            await generateAdVariations(
              pendingBrandId,
              pendingAction.params,
              token
            );
          }
        }
      } catch (err) {
        console.error("Delayed auth flow error:", err);
      } finally {
        clearDelayedAuthState();
        onDelayedAuthComplete?.();
      }
    },
    [onDelayedAuthComplete]
  );

  // ── Bootstrap session + listen for auth changes ──────────────────
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (s?.user) {
        setUser(toAuthUser(s.user));
        setSession(s);
      }
      setIsLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, s) => {
      if (s?.user) {
        setUser(toAuthUser(s.user));
        setSession(s);

        if (event === "SIGNED_IN" && s.access_token) {
          await handleDelayedAuth(s.access_token);
        }
      } else {
        setUser(null);
        setSession(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [handleDelayedAuth]);

  // ── Auth methods ─────────────────────────────────────────────────

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw { message: error.message, status: 401 };
  }, []);

  const signUpWithEmail = useCallback(
    async (email: string, password: string, name?: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name || email.split("@")[0] },
        },
      });
      if (error) throw { message: error.message, status: 400 };
    },
    []
  );

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/onboarding` },
    });
    if (error) throw { message: error.message, status: 400 };
  }, []);

  const signInWithMagicLink = useCallback(async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/onboarding` },
    });
    if (error) throw { message: error.message, status: 400 };
  }, []);

  const signOutFn = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw { message: error.message, status: 500 };
    setUser(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInWithMagicLink,
        signOut: signOutFn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
