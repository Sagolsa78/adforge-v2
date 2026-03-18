// ─────────────────────────────────────────────────────────────────────────────
// OLD: Facebook OAuth callback page — replaced by Instagram Login
// New Instagram callback: /api/integrations/instagram/callback (server-side)
// Client fallback: /oauth-callback/instagram/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { toaster } from "@/components/ui/toaster";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    async function handleOAuthCallback() {
      try {
        // Get the hash from URL
        const hash = window.location.hash;
        console.log("OAuth Callback Page - Hash:", hash);

        if (!hash) {
          console.error("No hash found in URL");
          toaster.create({
            title: "OAuth Error",
            description: "No authentication data received.",
            type: "error",
            duration: 5000,
          });
          router.push("/dashboard?tab=integrations&error=no_auth_data");
          return;
        }

        // Parse hash parameters
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const providerToken = params.get("provider_token");
        const expiresIn = params.get("expires_in");
        const tokenType = params.get("token_type");

        console.log("Parsed OAuth params:", {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasProviderToken: !!providerToken,
          expiresIn,
          tokenType,
        });

        if (!accessToken) {
          console.error("No access_token in hash");
          toaster.create({
            title: "OAuth Error",
            description: "No access token received.",
            type: "error",
            duration: 5000,
          });
          router.push("/dashboard?tab=integrations&error=no_token");
          return;
        }

        // Create Supabase client and set the session
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Extract session info from hash
        const sessionData = {
          access_token: accessToken,
          refresh_token: refreshToken || "",
          expires_in: expiresIn ? parseInt(expiresIn) : 3600,
          token_type: tokenType || "bearer",
          provider_token: providerToken || accessToken,
          provider_refresh_token: refreshToken || "",
        };

        console.log("Setting Supabase session:", sessionData);

        // Set the session in Supabase
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        });

        if (sessionError) {
          console.error("Error setting session:", sessionError);
          throw sessionError;
        }

        console.log("Session set successfully");
        
        // Wait a moment for the session cookie to be available
        await new Promise(resolve => setTimeout(resolve, 100));

        // Get fresh session to confirm it's set
        const { data: { session: confirmedSession } } = await supabase.auth.getSession();
        console.log("Session confirmed:", !!confirmedSession);

        if (!confirmedSession) {
          console.error("Session not available after setSession");
          throw new Error("Session not persisted");
        }

        // Now call our API to process the connection
        console.log("Calling API to process OAuth...");
        
        // First, get user profile from Facebook
        let facebookUserId = null;
        let facebookName = null;
        let pagesData = [];
        
        try {
          const userResponse = await fetch(
            `https://graph.facebook.com/v18.0/me?fields=id,name&access_token=${providerToken || accessToken}`
          );
          const userData = await userResponse.json();
          facebookUserId = userData.id;
          facebookName = userData.name;
          
          const pagesResponse = await fetch(
            `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,name}&access_token=${providerToken || accessToken}`
          );
          const pagesDataResponse = await pagesResponse.json();
          if (pagesDataResponse.data) {
            pagesData = pagesDataResponse.data.map((page: any) => ({
              id: page.id,
              name: page.name,
              access_token: page.access_token,
              instagram_id: page.instagram_business_account?.id,
              instagram_name: page.instagram_business_account?.name,
            }));
          }
        } catch (graphError) {
          console.error("Error fetching Facebook data:", graphError);
        }
        
        // Call backend API to store connection
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://content.bhuexpert/api/v1/data'}/integrations/meta/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`, // Pass token for auth
          },
          body: JSON.stringify({
            access_token: providerToken || accessToken,
            refresh_token: refreshToken,
            expires_in: expiresIn,
            facebook_user_id: facebookUserId,
            facebook_name: facebookName,
            pages: pagesData,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API error:", errorData);
          throw new Error(errorData.error || "Failed to process OAuth");
        }

        console.log("OAuth processed successfully");

        // Force refresh the session by calling refreshSession
        // This ensures we get the latest user_metadata after the update
        console.log("Force refreshing session...");
        const { data: { session: newSession }, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error("Error refreshing session:", refreshError);
        } else {
          console.log("Session refreshed, metadata:", newSession?.user?.user_metadata);
        }

        // Redirect to integrations with success
        toaster.create({
          title: "Facebook Connected",
          description: "Your Facebook account has been connected.",
          type: "success",
          duration: 5000,
        });

        router.push("/dashboard?tab=integrations&connected=success");
      } catch (error: any) {
        console.error("OAuth callback error:", error);
        toaster.create({
          title: "Connection Failed",
          description: error.message || "Failed to connect Facebook.",
          type: "error",
          duration: 5000,
        });
        router.push("/dashboard?tab=integrations&error=callback_error");
      } finally {
        setIsProcessing(false);
      }
    }

    handleOAuthCallback();
  }, [router]);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      flexDirection: "column",
      gap: "16px",
    }}>
      <div style={{ fontSize: "20px", fontWeight: "600" }}>
        {isProcessing ? "Connecting Facebook..." : "Processing..."}
      </div>
      {isProcessing && (
        <div style={{
          width: "40px",
          height: "40px",
          border: "4px solid #e5e7eb",
          borderTop: "4px solid #4F46E5",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }} />
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
