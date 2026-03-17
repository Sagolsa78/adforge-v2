"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { claimBrand, generateAdVariations } from "@/api";
import {
  getPendingBrandId,
  getPendingAction,
  clearDelayedAuthState,
  saveClaimedBrandId,
} from "@/lib/delayedAuth";
import type { AuthUser } from "@/types/onboarding.types";

// ─── Context value ───────────────────────────────────────────────────

interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isClaiming: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
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
  onDelayedAuthError?: (error: { code: string; message: string }) => void;
  onClaimStart?: () => void;
  onClaimComplete?: () => void;
  redirectToDashboard?: boolean;
}

export function AuthProvider({ children, onDelayedAuthComplete, onDelayedAuthError, onClaimStart, onClaimComplete, redirectToDashboard = false }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);

  // ── Delayed-auth handler (guest → claim) ─────────────────────────
  const handleDelayedAuth = useCallback(
    async (token: string) => {
      const pendingBrandId = getPendingBrandId();

      console.log("handleDelayedAuth called, pendingBrandId:", pendingBrandId);

      if (pendingBrandId) {
        setIsClaiming(true);
        onClaimStart?.();

        try {
          // Step 1: Claim the brand
          console.log("Claiming brand:", pendingBrandId);
          await claimBrand(pendingBrandId, token);
          console.log("✓ Brand claimed successfully:", pendingBrandId);
          saveClaimedBrandId(pendingBrandId);
          onClaimComplete?.();

          // Step 2: Generate ad variations if pending action exists
          const pendingAction = getPendingAction();
          if (pendingAction?.type === "GENERATE_VARIATIONS") {
            console.log("✓ Generating ad variations for pending action");
            await generateAdVariations(
              pendingBrandId,
              pendingAction.params,
              token
            );
            console.log("✓ Ad variations generated successfully");
          }

          // Success callback
          onDelayedAuthComplete?.();
          
          // Redirect to dashboard if enabled
          if (redirectToDashboard) {
            console.log("Redirecting to dashboard...");
            router.push("/dashboard");
          }
        } catch (err) {
          const error = err as { message?: string; status?: number };

          // Determine error type
          let errorCode = "UNKNOWN_ERROR";
          let errorMessage = error.message || "Failed to complete authentication flow";

          if (error.status === 401 || error.status === 403) {
            errorCode = "AUTH_ERROR";
            errorMessage = "Authentication failed. Please sign in again.";
          } else if (error.status === 409) {
            // Brand already claimed - not a critical error
            errorCode = "BRAND_ALREADY_CLAIMED";
            errorMessage = "Brand already linked to your account.";
            console.log("ℹ️ Brand was already claimed:", pendingBrandId);
          } else if (error.status === 404) {
            errorCode = "BRAND_NOT_FOUND";
            errorMessage = "Brand not found. Starting fresh session.";
          } else if (error.status && error.status >= 500) {
            errorCode = "SERVER_ERROR";
            errorMessage = "Server error. Please try again.";
          }

          console.error("Delayed auth flow error:", {
            code: errorCode,
            message: errorMessage,
            originalError: error,
          });

          // Error callback - allows parent to show user feedback
          onDelayedAuthError?.({ code: errorCode, message: errorMessage });
        } finally {
          // Always clear pending state (success or error)
          console.log("Clearing delayed auth state");
          clearDelayedAuthState();
          setIsClaiming(false);
        }
      } else {
        console.log("No pending brand ID found, skipping claim");
        // No pending brand - just call complete callback
        onDelayedAuthComplete?.();
      }
    },
    [onDelayedAuthComplete, onDelayedAuthError, onClaimStart, onClaimComplete, redirectToDashboard, router]
  );

  // ── Bootstrap session + listen for auth changes ──────────────────
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (s?.user) {
        setUser(toAuthUser(s.user));
        setSession(s);
        
        // Check for pending brand on initial load (for page refresh after signup)
        const pendingBrandId = getPendingBrandId();
        if (pendingBrandId && s.access_token) {
          console.log("Initial session found with pending brand:", pendingBrandId);
          handleDelayedAuth(s.access_token);
        }
      }
      setIsLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, s) => {
      console.log("Auth event:", event, s?.user?.email);
      
      if (s?.user) {
        setUser(toAuthUser(s.user));
        setSession(s);

        // Trigger claim on SIGNED_IN (covers both login and signup when email confirmation is off)
        if (event === "SIGNED_IN" && s.access_token) {
          // Small delay to ensure localStorage is synced
          await new Promise(resolve => setTimeout(resolve, 100));
          const pendingBrandId = getPendingBrandId();
          console.log("SIGNED_IN event - pending brand ID:", pendingBrandId);
          
          if (pendingBrandId) {
            console.log("Starting claim flow for brand:", pendingBrandId);
            await handleDelayedAuth(s.access_token);
          } else {
            console.log("No pending brand ID found after sign-in");
          }
        }
        
        // Handle initial session (page refresh) - only if we haven't already processed it
        if (event === "INITIAL_SESSION" && s.access_token) {
          const pendingBrandId = getPendingBrandId();
          console.log("INITIAL_SESSION event - pending brand ID:", pendingBrandId);
          if (pendingBrandId) {
            handleDelayedAuth(s.access_token);
          }
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
    const redirectTo = `${window.location.origin}${window.location.pathname}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) throw { message: error.message, status: 400 };
  }, []);

  const signInWithFacebook = useCallback(async () => {
    const redirectTo = `${window.location.origin}/api/integrations/meta/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { 
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) throw { message: error.message, status: 400 };
  }, []);

  const signInWithMagicLink = useCallback(async (email: string) => {
    const redirectTo = `${window.location.origin}${window.location.pathname}`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
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
        isClaiming,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInWithFacebook,
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
