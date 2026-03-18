"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

/**
 * Client-side fallback for Instagram OAuth callback.
 * Used when the server-side callback can't read the Supabase session cookie.
 * Reads session from client, then calls our API to store the IG connection.
 */
function InstagramOAuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Connecting Instagram...");

  useEffect(() => {
    async function complete() {
      const ig_user_id = searchParams.get("ig_user_id");
      const username = searchParams.get("username");
      const name = searchParams.get("name");
      const access_token = searchParams.get("access_token");
      const expires_at = searchParams.get("expires_at");

      if (!ig_user_id || !access_token) {
        router.replace("/dashboard?tab=integrations&ig_error=missing_params");
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace("/dashboard?tab=integrations&ig_error=not_authenticated");
          return;
        }

        setStatus("Saving connection...");

        const res = await fetch("/api/integrations/instagram/store", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ig_user_id, username, name, access_token, expires_at }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Store failed");
        }

        router.replace("/dashboard?tab=integrations&ig_connected=success");
      } catch (err: any) {
        console.error("Instagram OAuth fallback error:", err);
        router.replace(
          `/dashboard?tab=integrations&ig_error=${encodeURIComponent(err.message || "unknown")}`
        );
      }
    }

    complete();
  }, [router, searchParams]);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      flexDirection: "column",
      gap: "16px",
      fontFamily: "sans-serif",
    }}>
      <div style={{ fontSize: "20px", fontWeight: 600 }}>{status}</div>
      <div style={{
        width: "40px", height: "40px",
        border: "4px solid #e5e7eb",
        borderTop: "4px solid #E1306C",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function InstagramOAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        flexDirection: "column",
        gap: "16px",
        fontFamily: "sans-serif",
      }}>
        <div style={{ fontSize: "20px", fontWeight: 600 }}>Connecting Instagram...</div>
        <div style={{
          width: "40px", height: "40px",
          border: "4px solid #e5e7eb",
          borderTop: "4px solid #E1306C",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <InstagramOAuthCallbackInner />
    </Suspense>
  );
}
